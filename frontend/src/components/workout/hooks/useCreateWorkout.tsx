import {api} from '@lib/api';
import {insertWorkout} from '@server/types/workout';
import {useMutation} from '@tanstack/react-query';

export const useCreateWorkout = () => {
    return useMutation(createWorkoutMutationOptions);
};

export const createWorkout = async (workout: insertWorkout) => {
    const response = await api.workouts.$post({json: workout});
    if (!response.ok) {
        throw new Error('Failed to create workout');
    }
    return await response.json();
};

export const createWorkoutMutationOptions = {
    mutationKey: ['createWorkout'],
    mutationFn: (workout: insertWorkout) => createWorkout(workout),
    onSuccess: () => {},
};
