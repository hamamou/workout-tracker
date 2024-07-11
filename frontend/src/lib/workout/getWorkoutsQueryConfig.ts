import {api} from '@lib/api';
import {queryOptions} from '@tanstack/react-query';

const getWorkouts = async () => {
    const response = await api.workouts.$get();
    const data = await response.json();
    return data;
};

export const getWorkoutsQueryConfig = {
    queryKey: ['workouts'],
    queryFn: getWorkouts,
};

export const loadingCreateWorkoutQueryConfig = queryOptions<{
    workout?: {name: string; description?: string | null};
}>({
    queryKey: ['loading-create-workout'],
    queryFn: async () => {
        return {};
    },
    staleTime: Infinity,
});
