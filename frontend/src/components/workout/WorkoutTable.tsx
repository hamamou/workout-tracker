import {Group, Loader, SimpleGrid} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {getWorkoutsQueryConfig, loadingCreateWorkoutQueryConfig} from '../../lib/workout/getWorkoutsQueryConfig';
import {LoadingWorkoutCard} from './LoadingWorkoutCard';
import {WorkoutCard} from './WorkoutCard';

export const WorkoutTable = () => {
    const {data, error, isLoading} = useQuery(getWorkoutsQueryConfig);
    const {data: loadingWorkout} = useQuery(loadingCreateWorkoutQueryConfig);
    if (isLoading) return <Loader />;
    if (error) return <div>{error?.message}</div>;

    return (
        <Group className="w-full" grow>
            <SimpleGrid cols={{base: 1, sm: 2, lg: 3}}>
                {loadingWorkout?.workout && (
                    <LoadingWorkoutCard
                        name={loadingWorkout.workout.name}
                        description={loadingWorkout.workout.description}
                    />
                )}
                {data?.workouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)}
            </SimpleGrid>
        </Group>
    );
};
