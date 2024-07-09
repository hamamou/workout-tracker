import {useQuery} from '@tanstack/react-query';
import {getToken} from '../../utils/token';
import {WorkoutLog} from '../../utils/types';

export const useGetWorkoutLogsByWorkoutId = (workoutId: string) => {
    const getWorkoutLogsByWorkoutId = async () => {
        const response = await fetch(`/api/workoutLog/byWorkoutLogsByWorkoutId/${workoutId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
        });

        return await response.json();
    };

    return useQuery<WorkoutLog[]>({
        queryKey: ['getWorkoutLogsByWorkoutId', workoutId],
        queryFn: getWorkoutLogsByWorkoutId,
        enabled: !!workoutId,
    });
};
