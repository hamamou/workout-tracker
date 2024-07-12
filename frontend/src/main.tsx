import {MantineProvider} from '@mantine/core';
import '@mantine/core/styles.css';
import {Notifications} from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {createRouter, RouterProvider} from '@tanstack/react-router';
import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import {routeTree} from './routeTree.gen';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 5,
        },
    },
});

const router = createRouter({routeTree, context: {queryClient}});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            {/* //TODO: Have a better error fallback   */}
            <MantineProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
                <Notifications />
            </MantineProvider>
        </ErrorBoundary>
    </StrictMode>,
);
