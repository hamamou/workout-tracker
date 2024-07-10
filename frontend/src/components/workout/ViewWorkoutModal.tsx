import {Modal, Stack, Table, Text} from '@mantine/core';
import {type ExerciseSet} from '@server/routes/workouts/types';
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
    const {data, isLoading, error, isError} = useGetWorkoutById(workoutId.toString());
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
    if (isLoading)
        return (
            <Modal opened={opened} onClose={close} title="Loading...">
                Loading...
            </Modal>
        );
    if (error)
        return (
            <Modal opened={opened} onClose={close} title="Error">
                {error.message}
            </Modal>
        );

    if (!data) return null;
    return (
        <Modal opened={opened} onClose={close} title={data.workout.name}>
            <Modal.Body>
                <Stack>
                    {data.workout.exerciseSets?.map((field, index) => (
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
