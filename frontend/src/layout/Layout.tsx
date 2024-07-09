import {AppShell, Burger, Group, Loader, Stack, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useQuery} from '@tanstack/react-query';
import {Outlet, useNavigate} from '@tanstack/react-router';
import {Suspense} from 'react';
import {userQueryOptions} from '../lib/api';

export const Layout = () => {
    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();

    const {data, isLoading, error} = useQuery(userQueryOptions);
    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) return null;

    return (
        <AppShell
            header={{height: 40}}
            navbar={{
                width: 80,
                breakpoint: 'sm',
                collapsed: {desktop: true, mobile: !opened},
            }}
            padding="md">
            <AppShell.Header className="bg-[#f4f4f4]">
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{flex: 1}}>
                        <img src="logo.jpg" alt="logo" width={40} height={40} />
                        <Group ml="xl" gap={0} visibleFrom="sm" p={4}>
                            {data?.user ? (
                                <Group gap={20}>
                                    <UnstyledButton onClick={() => navigate({to: '/'})}>Home</UnstyledButton>
                                    <UnstyledButton onClick={() => navigate({to: '/about'})}>About</UnstyledButton>
                                    <a href="/api/logout" className="text-inherit no-underline">
                                        Logout
                                    </a>
                                </Group>
                            ) : null}
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar py="md" px={4}>
                <Stack className="h-full justify-between" p={20}>
                    <UnstyledButton>Home</UnstyledButton>
                    <UnstyledButton>Logout</UnstyledButton>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>
                <Suspense fallback={<Loader />}>
                    <Outlet />
                </Suspense>
            </AppShell.Main>
        </AppShell>
    );
};
