import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getToken} from '../../utils/token';
import {Workout} from '../../utils/types';

export const useCreateWorkouts = () => {
    const createWorkout = async (workout: Workout) => {
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
            body: JSON.stringify({...workout}),
        });

        return await response.json();
    };
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createWorkout'],
        mutationFn: (workout: Workout) => createWorkout(workout),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
        },
    });
};
