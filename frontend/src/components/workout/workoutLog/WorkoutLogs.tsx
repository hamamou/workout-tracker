import {Button, Checkbox, Group, NumberInput, Stack, Table, Text} from '@mantine/core';
import {useForm} from '@mantine/form';
import {FaRegSave} from 'react-icons/fa';
import {useCreateWorkoutLog} from '../../../hooks/workoutLog/useCreateWorkoutLog';
import {ExerciseLog, Workout} from '../../../utils/types';

type WorkoutLog = {
    workoutId: string | undefined;
    exerciseLogs: {
        exerciseId: string | undefined;
        setLogs: {
            repetition: number;
            weight: number;
            completed: boolean;
        }[];
    }[];
};

export const WorkoutLogs = ({workout}: {workout: Workout}) => {
    const mutation = useCreateWorkoutLog();
    const form = useForm<WorkoutLog>({
        initialValues: {
            workoutId: workout.id,
            exerciseLogs: workout.exerciseSets.map((exerciseSet) => ({
                exerciseId: exerciseSet.exercise?.id,
                setLogs: exerciseSet.sets.map((set) => ({
                    repetition: set.repetition,
                    weight: set.weight,
                    completed: false,
                })),
            })),
        },
    });

    const removeEmptyExerciseLogs = (values: WorkoutLog) => {
        return values.exerciseLogs
            .map((exerciseLog) => {
                const sets = exerciseLog.setLogs.filter((setLog) => setLog.completed);
                return {
                    ...exerciseLog,
                    setLogs: sets.map((setLog) => ({repetition: setLog.repetition, weight: setLog.weight})),
                };
            })
            .filter((exerciseLog) => exerciseLog.setLogs.length > 0);
    };

    const rows = (field: ExerciseLog, index: number) => {
        return field.setLogs.map((_set, setIndex) => (
            <Table.Tr key={setIndex}>
                <Table.Td>
                    <Text>{setIndex + 1}</Text>
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        maw={100}
                        size="sm"
                        {...form.getInputProps(`exerciseLogs.${index}.setLogs.${setIndex}.repetition`)}
                    />
                </Table.Td>
                <Table.Td>
                    <NumberInput
                        maw={100}
                        size="sm"
                        {...form.getInputProps(`exerciseLogs.${index}.setLogs.${setIndex}.weight`)}
                    />
                </Table.Td>
                <Table.Td>
                    <Checkbox
                        onChange={(event) => {
                            const exerciseLogs = form.values.exerciseLogs;
                            exerciseLogs[index].setLogs[setIndex].completed = event.currentTarget.checked;
                            form.setValues({exerciseLogs: exerciseLogs});
                        }}
                    />
                </Table.Td>
            </Table.Tr>
        ));
    };

    return (
        <form
            onSubmit={form.onSubmit((values) => {
                const exerciseLogs = removeEmptyExerciseLogs(values);
                mutation.mutate({workoutId: values.workoutId || '', exerciseLogs, loggedAt: new Date().toISOString()});
            })}>
            <Stack>
                <Group justify="space-between">
                    <h2>{workout.name}</h2>

                    <Button type="submit" loading={mutation.isPending}>
                        <Group gap="xs">
                            <FaRegSave />
                            Finish
                        </Group>
                    </Button>
                </Group>
                {form.values.exerciseLogs.map((exerciseSet, index) => (
                    <Stack key={index}>
                        <Text fw="bold">{workout.exerciseSets[index].exercise?.name}</Text>

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
                                    <Table.Th />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows(exerciseSet, index)}</Table.Tbody>
                        </Table>
                    </Stack>
                ))}
            </Stack>
        </form>
    );
};
