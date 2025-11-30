import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ptbr: {
    translation: {
      home: 'Início',
      toggleTheme: 'Alternar tema',
      toggleLanguage: 'Alternar idioma',
      signUp: 'Cadastre-se',
      redirectToSignIn: 'Já possui uma conta?',
      userRegisteredSuccessfully: 'Usuário cadastrado com sucesso!',
      serverError: 'Erro no servidor! Tente novamente mais tarde ou contate o suporte.',
      field: {
        name: 'Nome',
        email: 'Email',
        password: 'Senha',
        confirmPassword: 'Confirmar senha',
      },
      form: {
        nameRequired: 'O nome é obrigatório',
        emailRequired: 'O email é obrigatório',
        invalidEmail: 'Email inválido',
        passwordTooShort: 'A senha deve ter pelo menos 8 caracteres',
        passwordsDoNotMatch: 'As senhas não coincidem',
      },
      error: {
        passwordsDoNotMatch: 'As senhas não coincidem',
      },
    },
  },
  en: {
    translation: {
      home: 'Home',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      signUp: 'Sign Up',
      field: {
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
      },
      error: {
        passwordsDoNotMatch: 'Passwords do not match',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ptbr',
  fallbackLng: 'ptbr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
