import {AppShell, Burger, Group, Loader, Stack, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Outlet, useNavigate} from '@tanstack/react-router';
import {Suspense} from 'react';
import {cookieName} from '../utils/constants';

export const Layout = () => {
    const [opened, {toggle}] = useDisclosure();
    const navigate = useNavigate();

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
                            {localStorage.getItem(cookieName) ? (
                                <Group gap={20}>
                                    <UnstyledButton onClick={() => navigate({to: '/'})}>Home</UnstyledButton>
                                    <UnstyledButton onClick={() => navigate({to: '/about'})}>About</UnstyledButton>
                                    <UnstyledButton
                                        onClick={() => {
                                            localStorage.removeItem(cookieName);
                                            navigate({to: '/login'});
                                        }}>
                                        Logout
                                    </UnstyledButton>
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
