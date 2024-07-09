import {Modal, Stack, Table, Text} from '@mantine/core';
import {ExerciseSet, Workout} from '../../utils/types';

export const ViewWorkoutModal = ({workout, opened, close}: {workout: Workout; opened: boolean; close: () => void}) => {
    const rows = (field: ExerciseSet) => {
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

    return (
        <Modal opened={opened} onClose={close} title={workout.name}>
            <Modal.Body>
                <Stack>
                    {workout.exerciseSets.map((field, index) => (
                        <Stack key={index}>
                            <Text fw="bold">{field.exercise?.name}</Text>
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
                                <Table.Tbody>{rows(field)}</Table.Tbody>
                            </Table>
                        </Stack>
                    ))}
                </Stack>
            </Modal.Body>
        </Modal>
    );
};
