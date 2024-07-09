import {api} from '@lib/api';
import {type createWorkoutLog} from '@server/routes/workoutLogs';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';

export const useCreateWorkoutLog = () => {
    const navigate = useNavigate();
    const createWorkoutLog = async (workoutLog: createWorkoutLog) => {
        const response = await api.workoutLogs.$post({json: workoutLog});

        return await response.json();
    };
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createWorkoutLog'],
        mutationFn: (workoutLog: createWorkoutLog) => createWorkoutLog(workoutLog),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
            navigate({to: '/'});
        },
    });
};
