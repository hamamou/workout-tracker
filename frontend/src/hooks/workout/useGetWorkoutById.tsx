import {useQuery} from '@tanstack/react-query';
import {getToken} from '../../utils/token';
import {Workout} from '../../utils/types';

export const useGetWorkoutById = (workoutId: string) => {
    const getWorkoutById = async () => {
        const response = await fetch(`/api/workouts/${workoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
        });

        return await response.json();
    };
    const {data, error, isLoading, isError, isSuccess} = useQuery<Workout>({
        queryKey: ['workout', workoutId],
        queryFn: getWorkoutById,
    });

    return {data, error, isLoading, isError, isSuccess};
};
