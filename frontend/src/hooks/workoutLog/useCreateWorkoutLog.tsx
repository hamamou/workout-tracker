import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from '@tanstack/react-router';
import {getToken} from '../../utils/token';
import {WorkoutLog} from '../../utils/types';

export const useCreateWorkoutLog = () => {
    const navigate = useNavigate();
    const createWorkoutLog = async (workoutLog: WorkoutLog) => {
        const response = await fetch('/api/workoutLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getToken(),
            },
            body: JSON.stringify({...workoutLog}),
        });

        return await response.json();
    };
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['createWorkoutLog'],
        mutationFn: (workoutLog: WorkoutLog) => createWorkoutLog(workoutLog),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['workouts']});
            navigate({to: '/'});
        },
    });
};
