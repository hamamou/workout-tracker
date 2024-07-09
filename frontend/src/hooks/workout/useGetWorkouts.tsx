import {useQuery} from '@tanstack/react-query';
import {api} from '../../lib/api';

export const useWorkouts = () => {
    const getWorkouts = async () => {
        const response = await api.workouts.$get();
        const data = await response.json();
        return data;
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['workouts'],
        queryFn: getWorkouts,
    });

    return {data, error, isLoading, isError, isSuccess};
};
