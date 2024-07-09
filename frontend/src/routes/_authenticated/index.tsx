import {Center, Loader} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {createFileRoute} from '@tanstack/react-router';
import {WorkoutHomePage} from '../../components/workout/WorkoutHomePage';
import {userQueryOptions} from '../../lib/api';

export const Route = createFileRoute('/_authenticated/')({
    component: Workouts,
});

function Workouts() {
    const {isPending: isUserPending, data, error: userQueryError} = useQuery(userQueryOptions);

    if (isUserPending)
        return (
            <Center>
                <Loader />
            </Center>
        );
    if (userQueryError) return <div>Error: {userQueryError.message}</div>;

    return (
        <div className="p-2">
            <h3>Welcome Home! {data.userName}</h3>

            <WorkoutHomePage />
        </div>
    );
}
