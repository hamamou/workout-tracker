import {api} from '@lib/api';
import {type insertWorkoutLogs} from '@server/types/workoutLog';
import {useMutation} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';

export const useCreateWorkoutLog = () => {
    const navigate = useNavigate();
    const createWorkoutLog = async (workoutLog: insertWorkoutLogs) => {
        const response = await api.workoutLogs.$post({json: workoutLog});

        return await response.json();
    };

    return useMutation({
        mutationKey: ['createWorkoutLog'],
        mutationFn: (workoutLog: insertWorkoutLogs) => createWorkoutLog(workoutLog),
        onSuccess: () => {
            navigate({to: '/'});
        },
    });
};
