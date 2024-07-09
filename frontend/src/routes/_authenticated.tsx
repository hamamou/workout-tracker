import {createFileRoute, Outlet} from '@tanstack/react-router';
import {userQueryOptions} from '../lib/api';

const Component = () => {
    const {user} = Route.useRouteContext();

    if (!user) {
        return (
            <div>
                You have to <a href="/api/login"> Login</a>
            </div>
        );
    }

    return <Outlet />;
};

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({context}) => {
        try {
            const queryClient = context.queryClient;
            const user = await queryClient.fetchQuery(userQueryOptions);

            return {user};
        } catch (error) {
            return {user: null};
        }
    },
    component: Component,
});
