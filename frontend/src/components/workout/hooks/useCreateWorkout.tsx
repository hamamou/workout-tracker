import {api} from '@lib/api';
import {type CreateWorkout} from '@server/routes/workouts';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useCreateWorkout = () => {
    const createWorkout = async (workout: CreateWorkout) => {
        const response = await api.workouts.$post({json: workout});

        return await response.json();
    };

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createWorkout'],
        mutationFn: (workout: CreateWorkout) => createWorkout(workout),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
        },
    });
};
