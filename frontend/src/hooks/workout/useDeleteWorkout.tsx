import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getToken} from '../../utils/token';

export const useDeleteWorkout = (workoutId: string) => {
    const deleteWorkout = async () => {

        await fetch(`/api/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' +  getToken(),
            },
        });
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
