import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../lib/api';

export const useDeleteWorkout = (workoutId: string) => {
    const deleteWorkout = async () => {
        const response = await api.workouts[':id{[0-9]+}'].$delete({param: {id: workoutId}});
        return await response.json();
    };

    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['deleteWorkout'],
        mutationFn: () => deleteWorkout(),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
        },
    });
};
