import {useMutation, useQueryClient} from '@tanstack/react-query';
import {CreateWorkout} from '../../../../server/routes/workouts';
import {api} from '../../lib/api';

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
