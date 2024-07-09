import {Center, Group, Loader, Modal, Stack} from '@mantine/core';
import {useMemo} from 'react';
import {useGetWorkoutLogsByWorkoutId} from '../../hooks/workoutLog/useGetWorkoutLogsByWorkoutId';

export const WorkoutLogByWorkoutIdModal = ({
    workoutId,
    opened,
    close,
}: {
    workoutId: string;
    opened: boolean;
    close: () => void;
}) => {
    const workoutLogsByWorkoutIdQuery = useGetWorkoutLogsByWorkoutId(workoutId);

    const logs = useMemo(() => {
        if (!workoutLogsByWorkoutIdQuery?.data) {
            return [];
        }
        return workoutLogsByWorkoutIdQuery?.data?.sort((a, b) => {
            return new Date(b.loggedAt!).getTime() - new Date(a.loggedAt!).getTime();
        });
    }, [workoutLogsByWorkoutIdQuery.data]);

    return (
        <Modal opened={opened} onClose={close} title="Logs">
            <Modal.Body>
                <Center>
                    {workoutLogsByWorkoutIdQuery.isLoading ? (
                        <Loader />
                    ) : logs.length == 0 ? (
                        <Center>No logs</Center>
                    ) : (
                        <Stack>
                            {logs.map((log) => {
                                const date = new Date(log.loggedAt!);
                                const formattedDate = date.toDateString().slice(0, -4);
                                const hours = String(date.getHours()).padStart(2, '0');
                                const minutes = String(date.getMinutes()).padStart(2, '0');
                                const formattedTime = `${hours}:${minutes}`;

                                return (
                                    <Stack key={log.id} gap="md">
                                        <Group gap={4}>
                                            <div>{formattedDate}</div>
                                            at
                                            <div>{formattedTime}</div>
                                        </Group>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    )}
                </Center>
            </Modal.Body>
        </Modal>
    );
};
