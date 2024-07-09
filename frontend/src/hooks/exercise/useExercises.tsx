import {useQuery} from '@tanstack/react-query';

export const useExercises = () => {
    const getExercises = async () => {
        const response = await fetch('/api/exercise/exercises', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['exercises'],
        queryFn: getExercises,
        staleTime: 1000 * 60 * 5,
    });

    return {data, error, isLoading, isError, isSuccess};
};
