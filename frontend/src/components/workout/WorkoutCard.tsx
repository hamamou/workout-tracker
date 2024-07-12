import {Button, Card, Group, Loader, Menu, Stack, Text, rem} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {selectWorkout} from '@server/types/workout';
import {Link} from '@tanstack/react-router';
import {FaMagnifyingGlass} from 'react-icons/fa6';
import {HiOutlineDotsVertical} from 'react-icons/hi';
import {RxCross2} from 'react-icons/rx';
import {ViewWorkoutLogByWorkoutIdModal} from '../workoutLog/ViewWorkoutLogByWorkoutIdModal';
import {useDeleteWorkout} from './hooks/useDeleteWorkout';
import {ViewWorkoutModal} from './ViewWorkoutModal';

type WorkoutCardProps = Omit<
    selectWorkout,
    | {
          [K in keyof selectWorkout]: selectWorkout[K] extends Date | null ? K : never;
      }[keyof selectWorkout]
    | 'exerciseSets'
> & {
    [K in keyof selectWorkout as selectWorkout[K] extends Date | null ? K : never]: selectWorkout[K] extends Date | null
        ? string | null
        : selectWorkout[K];
};

export const WorkoutCard = ({workout}: {workout: WorkoutCardProps}) => {
    const [openedViewLogs, {close: closeViewLogs, open: openViewLogs}] = useDisclosure(false);
    const [openedWorkout, {close: closeWorkout, open: openWorkout}] = useDisclosure(false);
    const {mutateAsync: deleteMutation, isPending} = useDeleteWorkout(workout.id);

    return (
        <Card shadow="sm" radius="md" withBorder>
            <Stack h="100%" justify="space-between" gap={0}>
                <Group justify="space-between" mb="xs">
                    <Text fw={500}>{workout.name}</Text>
                    {!isPending ? (
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <div>
                                    <HiOutlineDotsVertical size={15} className="cursor-pointer" />
                                </div>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Application</Menu.Label>
                                <Menu.Item
                                    leftSection={<FaMagnifyingGlass style={{width: rem(14), height: rem(14)}} />}
                                    onClick={openWorkout}>
                                    View workout
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<FaMagnifyingGlass style={{width: rem(14), height: rem(14)}} />}
                                    onClick={openViewLogs}>
                                    View logs
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    color="red"
                                    leftSection={<RxCross2 style={{width: rem(14), height: rem(14)}} />}
                                    onClick={async () => {
                                        await deleteMutation();
                                    }}>
                                    Remove workout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    ) : (
                        <Loader size={24} />
                    )}
                </Group>
                <Text size="sm" c="dimmed" truncate="end" mb="sm">
                    {workout.description}
                </Text>

                <Link to={`/workout-logs/${workout.id}`} className="items-end text-inherit no-underline">
                    <Button color="blue" fullWidth mt="md" radius="md" className="mt-0">
                        Start workout
                    </Button>
                </Link>
            </Stack>

            {workout && openedWorkout && (
                <ViewWorkoutModal opened={openedWorkout} workoutId={workout.id} close={closeWorkout} />
            )}

            {workout.id && openedViewLogs && (
                <ViewWorkoutLogByWorkoutIdModal
                    opened={openedViewLogs}
                    workoutId={workout.id}
                    workoutName={workout.name}
                    close={closeViewLogs}
                />
            )}
        </Card>
    );
};
