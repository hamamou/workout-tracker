import {api} from '@lib/api';
import {useQuery} from '@tanstack/react-query';

export const useGetExercises = () => {
    const getExercises = async () => {
        const response = await api.exercises.$get();

        return await response.json();
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['exercises'],
        queryFn: getExercises,
        staleTime: 1000 * 60 * 5,
    });

    return {data, error, isLoading, isError, isSuccess};
};
