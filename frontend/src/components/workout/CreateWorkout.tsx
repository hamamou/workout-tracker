import {Button, Divider, Group, Modal, Stack, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import {MdOutlineCreate} from 'react-icons/md';
import {CreateWorkout} from '../../../../server/routes/workouts';
import {useCreateWorkout} from '../../hooks/workout/useCreateWorkout';
import {CreateWorkoutExercise} from './CreateWorkoutExercise';

export const CreateWorkoutModal = ({opened, close}: {opened: boolean; close: () => void}) => {
    const createWorkoutMutation = useCreateWorkout();
    const form = useForm<CreateWorkout>({
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
    });

    return (
        <Modal size="md" opened={opened} onClose={close} title="Create workout" mih={96}>
            <form
                onSubmit={form.onSubmit(async (values) => {
                    await createWorkoutMutation.mutateAsync(values);
                    close();
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
