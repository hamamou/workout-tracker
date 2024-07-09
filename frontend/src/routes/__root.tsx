import {type QueryClient} from '@tanstack/react-query';
import {createRootRouteWithContext} from '@tanstack/react-router';
import {Layout} from '../layout/Layout';

type RouterContext = {
    queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <Layout />,
});
