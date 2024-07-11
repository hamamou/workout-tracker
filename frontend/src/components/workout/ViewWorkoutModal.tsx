import {Group, Loader, Modal, Stack, Table, Text} from '@mantine/core';
import {insertExerciseSetCustom} from '@server/types/workout';
import {useGetWorkoutById} from './hooks/useGetWorkoutById';

export const ViewWorkoutModal = ({
    workoutId,
    opened,
    close,
}: {
    workoutId: number;
    opened: boolean;
    close: () => void;
}) => {
    const {data, isLoading} = useGetWorkoutById(workoutId.toString());
    const rows = (field: insertExerciseSetCustom) => {
        return field.sets.map((set, setIndex) => (
            <Table.Tr key={setIndex}>
                <Table.Td>
                    <Text>{setIndex + 1}</Text>
                </Table.Td>
                <Table.Td>
                    <Text maw={100} size="sm">
                        {set.repetition}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Text maw={100} size="sm">
                        {set.weight}
                    </Text>
                </Table.Td>
            </Table.Tr>
        ));
    };

    if (!data) return null;
    return (
        <Modal
            opened={opened}
            onClose={close}
            title={
                <Group>
                    <Text>{data.workout.name}</Text>
                    <Text mt={2} size="xs">
                        {data.workout.description}
                    </Text>
                </Group>
            }>
            <Modal.Body>
                <Stack>
                    {isLoading && <Loader />}

                    {data.workout.exerciseSets?.map((exerciseSet, index) => (
                        <Stack key={index}>
                            <Text fw="bold">{exerciseSet.name}</Text>
                            <Table horizontalSpacing="lg" mx="lg">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th />
                                        <Table.Th>
                                            <Text size="sm">Reps</Text>
                                        </Table.Th>
                                        <Table.Th>
                                            <Text size="sm">Weight</Text>
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows(exerciseSet)}</Table.Tbody>
                            </Table>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>
        </Modal>
    );
};
