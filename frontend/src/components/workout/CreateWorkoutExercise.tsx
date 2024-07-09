import {Button, Center, Divider, Group, Loader, NumberInput, Select, Stack, Table, Text} from '@mantine/core';
import {UseFormReturnType} from '@mantine/form';
import {BiPlus} from 'react-icons/bi';
import {useExercises} from '../../hooks/exercise/useExercises';
import {Exercise, ExerciseSet, Workout} from '../../utils/types';

export const CreateWorkoutExercise = ({form}: {form: UseFormReturnType<Workout, (values: Workout) => Workout>}) => {
    const exercisesQuery = useExercises();

    const updateExerciseId = (value: string, index: number) => {
        if (value) {
            const exerciseId = exercisesQuery.data.find((exercise: Exercise) => exercise.name === value)?.id;
            const exerciseSets = form.values.exerciseSets;
            exerciseSets[index].exerciseId = exerciseId;

            form.setValues({exerciseSets: exerciseSets});

            console.log(form.values.exerciseSets[index]);
        }
    };

    const rows = (field: ExerciseSet, index: number) => {
        return field.sets.map((_set, setIndex) => (
            <Table.Tr key={setIndex}>
                <Table.Td>
                    <Text>{setIndex + 1}</Text>
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        maw={100}
                        size="sm"
                        {...form.getInputProps(`exerciseSets.${index}.sets.${setIndex}.repetition`)}
                    />
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        maw={100}
                        size="sm"
                        {...form.getInputProps(`exerciseSets.${index}.sets.${setIndex}.weight`)}
                    />
                </Table.Td>
            </Table.Tr>
        ));
    };

    if (exercisesQuery.isLoading) {
        return (
            <Center>
                <Loader />
            </Center>
        );
    }

    const header = (
        <Table.Tr>
            <Table.Th>
                <Center>
                    <Text size="sm">Set</Text>
                </Center>
            </Table.Th>
            <Table.Th>
                <Center>
                    <Text size="sm">Reps</Text>
                </Center>
            </Table.Th>
            <Table.Th>
                <Center>
                    <Text size="sm">Weight</Text>
                </Center>
            </Table.Th>
        </Table.Tr>
    );
    return (
        <>
            <Text>Exercises</Text>
            <Stack>
                {form.values.exerciseSets.map((field, index) => (
                    <Stack key={index}>
                        <Center>
                            <Stack>
                                <Select
                                    placeholder="Choose exercise"
                                    data={exercisesQuery.data.map((exercise: Exercise) => exercise.name)}
                                    onChange={(value) => {
                                        if (value) {
                                            updateExerciseId(value, index);
                                        }
                                    }}
                                />

                                <Table withRowBorders={false}>
                                    <Table.Thead>{header}</Table.Thead>
                                    <Table.Tbody>{rows(field, index)}</Table.Tbody>
                                </Table>
                                <Button
                                    color="gray"
                                    onClick={() =>
                                        form.insertListItem(`exerciseSets.${index}.sets`, {
                                            weight: 0,
                                            repetition: 0,
                                        })
                                    }>
                                    <Group gap={4}>
                                        <BiPlus size={16} />
                                        Add set
                                    </Group>
                                </Button>
                            </Stack>
                        </Center>
                        <Divider />
                    </Stack>
                ))}
            </Stack>

            <Button
                onClick={() =>
                    form.insertListItem('exerciseSets', {
                        name: '',
                        sets: [{weight: 0, repetition: 0}],
                    })
                }>
                <Group gap={4}>
                    <BiPlus size={16} />
                    Add exercise
                </Group>
            </Button>
        </>
    );
};
