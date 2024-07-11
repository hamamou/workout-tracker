import {Center, Loader} from '@mantine/core';
import {createFileRoute} from '@tanstack/react-router';
import {useGetWorkoutById} from '../../components/workout/hooks/useGetWorkoutById';
import {WorkoutLogs} from '../../components/workoutLog/WorkoutLogs';

const Component = () => {
    const {workoutId} = Route.useParams();
    const {data, isLoading, error} = useGetWorkoutById(workoutId);

    if (error) return <div>{error.message}</div>;
    if (!data) return null;
    return (
        <Center>
            {isLoading ? <Loader /> : null}
            <WorkoutLogs
                workout={{
                    id: data.workout.id,
                    description: data.workout.description,
                    name: data.workout.name,
                    exerciseSets: data.workout.exerciseSets,
                    lastLoggedAt: data.workout.lastLoggedAt ? new Date(data.workout.lastLoggedAt) : new Date(),
                    createdAt: new Date(data.workout.createdAt),
                }}
            />
        </Center>
    );
};

export const Route = createFileRoute('/_authenticated/workout-logs/$workoutId')({
    component: Component,
});
