import {Button, Checkbox, Group, NumberInput, Stack, Table, Text} from '@mantine/core';
import {useForm} from '@mantine/form';
import {WorkoutWithExerciseNames} from '@server/types/workout';
import {insertExerciseLogsCustom, insertWorkoutLogsSchema} from '@server/types/workoutLog';
import {FaRegSave} from 'react-icons/fa';
import {z} from 'zod';
import {useCreateWorkoutLog} from './hooks/useCreateWorkoutLog';

const WorkoutLogsWithCompletedSchema = insertWorkoutLogsSchema.extend({
    exerciseLogs: z.array(
        z.object({
            exerciseId: z.number(),
            setLogs: z.array(
                z.object({
                    completed: z.boolean(),
                    weight: z.number(),
                    repetition: z.number(),
                }),
            ),
        }),
    ),
});

type WorkoutLogsWithCompleted = z.infer<typeof WorkoutLogsWithCompletedSchema>;

export const WorkoutLogs = ({workout}: {workout: WorkoutWithExerciseNames}) => {
    const mutation = useCreateWorkoutLog();
    const form = useForm<WorkoutLogsWithCompleted>({
        initialValues: {
            workoutId: workout.id,
            name: '',
            exerciseLogs:
                workout.exerciseSets?.map((exerciseSet) => ({
                    exerciseId: exerciseSet.exerciseId,
                    setLogs: exerciseSet.sets.map((set) => ({
                        repetition: set.repetition,
                        weight: set.weight,
                        completed: false,
                    })),
                })) || [],
        },
    });

    const removeEmptyExerciseLogs = (values: WorkoutLogsWithCompleted) => {
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

    const rows = (field: insertExerciseLogsCustom, index: number) => {
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

                mutation.mutate({...values, exerciseLogs: exerciseLogs, name: values.name || workout.name});
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
                {form.values.exerciseLogs.map((exerciseSet, index) => {
                    return (
                        <Stack key={index}>
                            <Text fw="bold">{workout.exerciseSets![index].name}</Text>

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
                    );
                })}
            </Stack>
        </form>
    );
};
