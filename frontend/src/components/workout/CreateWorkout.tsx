import {Button, Divider, Group, Modal, Stack, TextInput} from '@mantine/core';
import {useForm, zodResolver} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {insertWorkout, insertWorkoutSchema} from '@server/types/workout';
import {useQueryClient} from '@tanstack/react-query';
import {MdOutlineCreate} from 'react-icons/md';
import {getWorkoutsQueryConfig, loadingCreateWorkoutQueryConfig} from '../../lib/workout/getWorkoutsQueryConfig';
import classes from './CreateWorkout.module.css';
import {CreateWorkoutExercise} from './CreateWorkoutExercise';
import {createWorkout, useCreateWorkout} from './hooks/useCreateWorkout';

export const CreateWorkoutModal = ({opened, close}: {opened: boolean; close: () => void}) => {
    const createWorkoutMutation = useCreateWorkout();
    const queryClient = useQueryClient();
    const form = useForm<insertWorkout>({
        initialValues: {
            name: '',
            description: '',
            exerciseSets: [
                {
                    sets: [{weight: 0, repetition: 0}],
                    exerciseId: 0,
                },
            ],
        },

        validate: zodResolver(insertWorkoutSchema),
    });

    return (
        <Modal size="md" opened={opened} onClose={close} title="Create workout" mih={96}>
            <form
                onSubmit={form.onSubmit(async (values) => {
                    const existingWorkouts = await queryClient.ensureQueryData(getWorkoutsQueryConfig);

                    close();

                    queryClient.setQueryData(loadingCreateWorkoutQueryConfig.queryKey, {
                        workout: {name: values.name, description: values.description},
                    });

                    try {
                        const newWorkout = await createWorkout(values);
                        queryClient.setQueryData(getWorkoutsQueryConfig.queryKey, () => ({
                            workouts: [newWorkout, ...existingWorkouts.workouts],
                        }));
                        notifications.show({
                            title: `Workout ${newWorkout.name} created`,
                            message: '',
                        });
                    } catch (error) {
                        notifications.show({
                            title: 'Error',
                            message: 'Failed to create new workout',
                            color: 'red',
                            classNames: classes,
                        });
                    } finally {
                        queryClient.setQueryData(loadingCreateWorkoutQueryConfig.queryKey, {});
                    }
                })}>
                <Stack mih={540}>
                    <TextInput
                        mx={16}
                        label="Name"
                        placeholder="New workout"
                        required
                        {...form.getInputProps('name')}
                    />
                    <TextInput mx={16} label="Description" {...form.getInputProps('description')} />
                    <CreateWorkoutExercise form={form} />
                </Stack>

                <Divider />
                <div className="sticky bottom-0 z-30 flex justify-center border-t-2 bg-white py-2">
                    <Button type="submit" loading={createWorkoutMutation.isPending}>
                        <Group gap={4}>
                            <MdOutlineCreate />
                            Create
                        </Group>
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
