import {useQuery} from '@tanstack/react-query';
import {getToken} from '../../utils/token';
import {Workout} from '../../utils/types';

export const useWorkouts = () => {
    const getWorkouts = async () => {
        const response = await fetch('/api/workouts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
        });

        return await response.json();
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery<Workout[]>({
        queryKey: ['workouts'],
        queryFn: getWorkouts,
    });

    return {data, error, isLoading, isError, isSuccess};
};
