import {cookieName} from './constants';

export const getToken = () => {
    const token = localStorage.getItem(cookieName);
    if (!token) {
        throw new Error('No token found');
    }

    return token;
};
