import {Center, Loader} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {createFileRoute} from '@tanstack/react-router';
import {WorkoutHomePage} from '../../components/workout/WorkoutHomePage';
import {userQueryOptions} from '../../lib/api';

export const Route = createFileRoute('/_authenticated/')({
    component: Workouts,
});

function Workouts() {
    const {isPending, data, error} = useQuery(userQueryOptions);

    if (isPending)
        return (
            <Center>
                <Loader />
            </Center>
        );
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="p-2">
            <h3>Welcome Home! {data.user.given_name}</h3>

            <WorkoutHomePage />
        </div>
    );
}
