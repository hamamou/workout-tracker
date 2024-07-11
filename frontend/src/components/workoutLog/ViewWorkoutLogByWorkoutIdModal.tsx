import {Center, Group, Loader, Modal, Stack} from '@mantine/core';
import {useMemo} from 'react';
import {useGetWorkoutLogsByWorkoutId} from './hooks/useGetWorkoutLogsByWorkoutId';

export const ViewWorkoutLogByWorkoutIdModal = ({
    workoutId,
    opened,
    close,
}: {
    workoutId: number;
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

                                return (
                                    <Stack key={log.id} gap="md">
                                        <Group gap={4}>
                                            <div>{formattedDate}</div>
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
