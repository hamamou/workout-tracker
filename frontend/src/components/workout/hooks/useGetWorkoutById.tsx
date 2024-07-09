import {api} from '@lib/api';
import {useQuery} from '@tanstack/react-query';

export const useGetWorkoutById = (workoutId: string) => {
    const getWorkoutById = async () => {
        const response = await api.workouts[':id{[0-9]+}'].$get({param: {id: workoutId}});

        return await response.json();
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['workout', workoutId],
        queryFn: getWorkoutById,
    });

    return {data, error, isLoading, isError, isSuccess};
};
