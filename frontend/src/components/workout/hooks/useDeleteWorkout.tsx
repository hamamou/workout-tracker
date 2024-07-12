import {api} from '@lib/api';
import {notifications} from '@mantine/notifications';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getWorkoutsQueryConfig} from '../../../lib/workout/getWorkoutsQueryConfig';

export const useDeleteWorkout = (workoutId: number) => {
    const deleteWorkout = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await api.workouts[':id{[0-9]+}'].$delete({param: {id: workoutId.toString()}});
        return await response.json();
    };

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteWorkout'],
        mutationFn: () => deleteWorkout(),
        onSuccess: async () => {
            const existingWorkouts = await queryClient.ensureQueryData(getWorkoutsQueryConfig);

            queryClient.setQueryData(getWorkoutsQueryConfig.queryKey, () => ({
                workouts: [...existingWorkouts.workouts.filter((workout) => workout.id !== workoutId)],
            }));
            notifications.show({
                title: `Workout deleted`,
                message: '',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete workout',
                color: 'red',
            });
        },
    });
};
