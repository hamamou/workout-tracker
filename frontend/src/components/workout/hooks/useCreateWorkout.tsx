import {api} from '@lib/api';
import {insertWorkout} from '@server/types/workout';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useCreateWorkout = () => {
    const createWorkout = async (workout: insertWorkout) => {
        const response = await api.workouts.$post({json: workout});

        return await response.json();
    };

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createWorkout'],
        mutationFn: (workout: insertWorkout) => createWorkout(workout),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
        },
    });
};
