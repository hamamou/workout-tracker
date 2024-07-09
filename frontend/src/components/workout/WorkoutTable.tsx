import {Group, Loader, SimpleGrid} from '@mantine/core';
import {useWorkouts} from '../../hooks/workout/useGetWorkouts';
import {WorkoutCard} from './WorkoutCard';

export const WorkoutTable = () => {
    const {data: workouts, error, isError, isLoading} = useWorkouts();
    if (isLoading || !workouts) return <Loader />;
    if (isError) return <div>{error?.message}</div>;

    return (
        <Group className="w-full" grow>
            <SimpleGrid cols={{base: 1, sm: 2, lg: 3}}>
                {workouts.map((workout) => (
                    <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </SimpleGrid>
        </Group>
    );
};
