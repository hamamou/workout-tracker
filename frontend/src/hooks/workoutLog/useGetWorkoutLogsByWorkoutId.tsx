import {useQuery} from '@tanstack/react-query';
import {api} from '../../lib/api';

export const useGetWorkoutLogsByWorkoutId = (workoutId: string) => {
    const getWorkoutLogsByWorkoutId = async () => {
        const response = await api.workoutLogs.$get();

        return await response.json();
    };

    return useQuery({
        queryKey: ['getWorkoutLogsByWorkoutId', workoutId],
        queryFn: getWorkoutLogsByWorkoutId,
        enabled: !!workoutId,
    });
};
