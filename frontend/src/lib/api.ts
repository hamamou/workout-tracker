import {ApiRoutes} from '@server/app';
import {queryOptions} from '@tanstack/react-query';
import {hc} from 'hono/client';

const client = hc<ApiRoutes>('/');

export const api = client.api;

export const getCurrentUser = async () => {
    const response = await api.me.$get();
    if (!response.ok) {
        return null;
    }

    return await response.json();
};

export const userQueryOptions = queryOptions({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
});
