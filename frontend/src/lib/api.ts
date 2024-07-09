import {queryOptions} from '@tanstack/react-query';
import {getToken} from '../utils/token';

export const getCurrentUser = async () => {
    try {
        const response = await fetch('/api/account/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
        });
        return await response.json();
    } catch (error) {
        throw new Error('Server Error');
    }
};

export const userQueryOptions = queryOptions<{userName: string}>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
});
