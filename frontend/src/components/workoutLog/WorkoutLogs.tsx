import {Button, Checkbox, Group, NumberInput, Stack, Table, Text} from '@mantine/core';
import {useForm} from '@mantine/form';
import {type ExerciseLog} from '@server/routes/workoutLogs';
import {type Workout} from '@server/routes/workouts';
import {FaRegSave} from 'react-icons/fa';
import {z} from 'zod';
import {useCreateWorkoutLog} from './hooks/useCreateWorkoutLog';

const exerciseLogSchema = z.object({
    exerciseId: z.number(),
    setLogs: z.array(
        z.object({
            weight: z.number(),
            repetition: z.number(),
            completed: z.boolean(),
        }),
    ),
});

const WorkoutLogsWithCompletedSchema = z.object({
    workoutId: z.number().int().positive().min(1),
    loggedAt: z.date(),
    exerciseLogs: z.array(exerciseLogSchema),
});

type WorkoutLogsWithCompleted = z.infer<typeof WorkoutLogsWithCompletedSchema>;

export const WorkoutLogs = ({workout}: {workout: Workout}) => {
    const mutation = useCreateWorkoutLog();
    const form = useForm<WorkoutLogsWithCompleted>({
        initialValues: {
            workoutId: workout.id,
            loggedAt: new Date(),
            exerciseLogs: workout.exerciseSets.map((exerciseSet) => ({
                exerciseId: exerciseSet.exercise?.id || 0,
                setLogs: exerciseSet.sets.map((set) => ({
                    repetition: set.repetition,
                    weight: set.weight,
                    completed: false,
                })),
            })),
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
                mutation.mutate({workoutId: values.workoutId || 0, exerciseLogs, loggedAt: new Date()});
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
