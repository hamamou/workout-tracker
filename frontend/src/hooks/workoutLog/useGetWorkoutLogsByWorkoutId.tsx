import {useQuery} from '@tanstack/react-query';
import {api} from '../../lib/api';

export const useGetWorkoutLogsByWorkoutId = (workoutId: number) => {
    const getWorkoutLogsByWorkoutId = async () => {
        const response = await api.workoutLogs.$get();

        return await response.json();
    };

    const {data, error, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['getWorkoutLogsByWorkoutId', workoutId],
        queryFn: getWorkoutLogsByWorkoutId,
        enabled: !!workoutId,
    });

    return {data, error, isLoading, isError, isSuccess};
};
