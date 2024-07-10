import {Button, Center, Divider, Group, Loader, NumberInput, Select, Stack, Table, Text} from '@mantine/core';
import {UseFormReturnType} from '@mantine/form';
import {type Exercise} from '@server/routes/exercise';
import {type CreateWorkout, type ExerciseSet} from '@server/routes/workouts/types';
import {BiPlus} from 'react-icons/bi';
import {useGetExercises} from '../exercise/hook/useGetExercises';

export const CreateWorkoutExercise = ({
    form,
}: {
    form: UseFormReturnType<CreateWorkout, (values: CreateWorkout) => CreateWorkout>;
}) => {
    const {data, error, isLoading} = useGetExercises();

    if (error) {
        return <div>{error.message}</div>;
    }

    const updateExerciseId = (value: string, index: number) => {
        if (value && data) {
            const exerciseId = data.find((exercise: Exercise) => exercise.name === value)?.id;
            if (!exerciseId) {
                return;
            }
            const exerciseSets = form.values.exerciseSets;
            exerciseSets[index].exerciseId = exerciseId;

            form.setValues({exerciseSets: exerciseSets});
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

    if (isLoading) {
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
                                    data={data?.map((exercise: Exercise) => exercise.name)}
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
