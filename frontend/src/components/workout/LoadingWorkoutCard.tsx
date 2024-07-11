import {Card, Group, Loader, Stack, Text} from '@mantine/core';

export const LoadingWorkoutCard = ({name, description}: {name: string; description?: string | null}) => {
    return (
        <Card shadow="sm" radius="md" withBorder>
            <Stack h="100%" justify="space-between" gap={0}>
                <Group justify="space-between" mb="xs">
                    <Text fw={500}>{name}</Text>
                </Group>
                <Text size="sm" c="dimmed" truncate="end" mb="sm">
                    {description}
                </Text>

                <Group className="w-full justify-center">
                    <Loader />
                </Group>
            </Stack>
        </Card>
    );
};
