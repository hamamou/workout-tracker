import {queryOptions} from '@tanstack/react-query';
import {hc} from 'hono/client';
import {ApiRoutes} from '../../../server/app';

const client = hc<ApiRoutes>('/');

export const api = client.api;

export const getCurrentUser = async () => {
    try {
        const response = await api.me.$get();
        if (!response.ok) {
            throw new Error('Unauthorized');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Server Error');
    }
};

export const userQueryOptions = queryOptions({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
});
