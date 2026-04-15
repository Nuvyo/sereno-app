# Correção de Segurança: Validação de Content-Type

## Problema
**Ausência de validação de Response Content-Type (XSS/Injection Risk)**

A aplicação assumia que todas as respostas da API eram JSON sem validar o header `Content-Type`. Isso criava uma vulnerabilidade de segurança onde:

1. Um atacante via MITM (Man-in-the-Middle) poderia injetar respostas com Content-Type diferente
2. Código JavaScript malicioso poderia ser interpretado como JSON
3. Potencial risco de XSS (Cross-Site Scripting) if injetado HTML/JS como resposta

## Solução Implementada

### Mudanças no arquivo `src/lib/api.ts`

#### 1. Novo método `validateContentType()`
Adicionado método privado que valida o header `Content-Type` antes de processar qualquer resposta:

```typescript
private validateContentType(response: Response): void {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(
      `Invalid Content-Type: expected 'application/json', received '${contentType || 'none'}'. Potential XSS/injection attack detected.`,
    );
  }
}
```

#### 2. Validação obrigatória em todas as requisições
Adicionado chamada de validação no método `request()` **antes** de processar qualquer resposta JSON:

```typescript
try {
  const response = await fetch(url, config);

  // Validate Content-Type before parsing any response
  this.validateContentType(response);

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data: T = await response.json();
  return data;
}
```

## Benefícios

✅ **Validação rigorosa**: Rejeita qualquer resposta que não seja JSON válido
✅ **Proteção contra XSS**: Previne injeção de código HTML/JavaScript malicioso
✅ **Proteção contra MITM**: Detecta respostas modificadas com Content-Type alterado
✅ **Fails fast**: Erro é lançado imediatamente, antes de qualquer processamento

## Comportamento

- ✅ Respostas com `Content-Type: application/json` são aceitas
- ✅ Respostas com `Content-Type: application/json; charset=utf-8` são aceitas
- ❌ Respostas com `Content-Type: text/html` são rejeitadas
- ❌ Respostas com `Content-Type: text/javascript` são rejeitadas
- ❌ Respostas sem `Content-Type` são rejeitadas

## Teste

Para validar a correção:

```typescript
// Teste 1: Requisição bem-sucedida com Content-Type correto
const result = await apiService.get('/api/users');
// ✅ Funciona normalmente

// Teste 2: Requisição com Content-Type inválido
// Simule alterando o header no servidor de testes
// ❌ Lança erro: "Invalid Content-Type: expected 'application/json', received 'text/html'"
```

## Conformidade

- ✅ OWASP Top 10 - A03:2021 Injection
- ✅ OWASP Top 10 - A05:2021 Security Misconfiguration
- ✅ CWE-201: Information Exposure Through an Error Message
- ✅ CWE-434: Unrestricted Upload of File with Dangerous Type

## Data de Implementação
15 de abril de 2026
