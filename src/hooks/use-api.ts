import { useMutation, useQuery, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

export function useApiGet<T>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error, T>({
    queryKey,
    queryFn: () => apiService.get<T>(endpoint),
    ...options,
  });
}

export function useApiPost<TData, TVariables extends Record<string, any> | any[] = Record<string, any>>(
  endpoint: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation({
    mutationFn: (variables: TVariables) => apiService.post<TData>(endpoint, variables),
    ...options,
  });
}

export function useApiPut<TData, TVariables extends Record<string, any> | any[] = Record<string, any>>(
  endpoint: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation({
    mutationFn: (variables: TVariables) => apiService.put<TData>(endpoint, variables),
    ...options,
  });
}

export function useApiDelete<TData>(endpoint: string, options?: UseMutationOptions<TData, Error, string>) {
  return useMutation({
    mutationFn: (id: string) => apiService.delete<TData>(`${endpoint}/${id}`),
    ...options,
  });
}
