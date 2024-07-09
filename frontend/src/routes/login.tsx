import {Anchor, Button, Center, Group, Paper, PasswordInput, Stack, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import {upperFirst, useToggle} from '@mantine/hooks';
import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useLogin} from '../hooks/auth/useLogin';
import {useRegister} from '../hooks/auth/useRegister';
import {getToken} from '../utils/token';
import {User} from '../utils/types';

export const Route = createFileRoute('/login')({
    beforeLoad: () => {
        if (getToken()) {
            return {redirect: '/'};
        }
    },
    component: () => <Login />,
});

const Login = () => {
    console.log('Login');
    const navigate = useNavigate();

    const [type, toggle] = useToggle(['login', 'register']);
    const login = useLogin();
    const register = useRegister();
    const form = useForm<User>({
        initialValues: {
            username: '',
            password: '',
        },
        validate: (values) => {
            const errors: Record<string, string> = {};

            if (values.password.length < 3) {
                errors.password = 'Password should include at least 3 characters';
            }

            return errors;
        },
    });

    return (
        <Center>
            <Paper radius="md" p="xl" withBorder className="min-w-96">
                <form
                    onSubmit={form.onSubmit(async () => {
                        if (type === 'register') {
                            await register.mutateAsync(form.values);
                            if (register.isSuccess) {
                                navigate({to: '/'});
                            }
                        } else if (type === 'login') {
                            await login.mutateAsync(form.values);
                            if (login.isSuccess) {
                                navigate({to: '/'});
                            }
                        }
                    })}>
                    <Stack>
                        <TextInput
                            required
                            placeholder="Username"
                            value={form.values.username}
                            {...form.getInputProps('username')}
                            radius="md"
                        />

                        <PasswordInput
                            required
                            placeholder="Your password"
                            value={form.values.password}
                            {...form.getInputProps('password')}
                            radius="md"
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                            {type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </Anchor>
                        <Button type="submit" radius="xl" loading={login.isPending || register.isPending}>
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Center>
    );
};
