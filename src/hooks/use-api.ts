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

export function useAuthApiGet<T>(
  queryKey: string[],
  endpoint: string,
  token: string,
  options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error, T>({
    queryKey,
    queryFn: () => apiService.withAuth(token).get<T>(endpoint),
    enabled: !!token,
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

export function useAuthApiPost<TData, TVariables extends Record<string, any> | any[] = Record<string, any>>(
  endpoint: string,
  token: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation({
    mutationFn: (variables: TVariables) => apiService.withAuth(token).post<TData>(endpoint, variables),
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

export function useAuthApiPut<TData, TVariables extends Record<string, any> | any[] = Record<string, any>>(
  endpoint: string,
  token: string,
  options?: UseMutationOptions<TData, Error, TVariables>,
) {
  return useMutation({
    mutationFn: (variables: TVariables) => apiService.withAuth(token).put<TData>(endpoint, variables),
    ...options,
  });
}

export function useApiDelete<TData>(endpoint: string, options?: UseMutationOptions<TData, Error, string>) {
  return useMutation({
    mutationFn: (id: string) => apiService.delete<TData>(`${endpoint}/${id}`),
    ...options,
  });
}

export function useAuthApiDelete<TData>(
  endpoint: string,
  token: string,
  options?: UseMutationOptions<TData, Error, string>,
) {
  return useMutation({
    mutationFn: (id: string) => apiService.withAuth(token).delete<TData>(`${endpoint}/${id}`),
    ...options,
  });
}
