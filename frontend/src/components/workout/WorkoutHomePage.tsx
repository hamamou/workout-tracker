import {Button, Center, Container, Group, Stack, Tooltip} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {BiPlus} from 'react-icons/bi';
import {MdOutlineEventNote} from 'react-icons/md';
import {CreateWorkoutModal} from './CreateWorkout';
import {WorkoutTable} from './WorkoutTable';

export const WorkoutHomePage = () => {
    const [opened, {open, close}] = useDisclosure(false);

    return (
        <>
            {opened && <CreateWorkoutModal opened={opened} close={close} />}
            <Container size="xl">
                <Stack>
                    <Group align="center" mt="lg" grow>
                        <Button color="blue" radius="sm" onClick={open}>
                            <Group gap={4}>
                                <BiPlus size={20} /> New workout
                            </Group>
                        </Button>
                        <Tooltip label="Available in the PRO version">
                            <Button color="teal" radius="sm" disabled>
                                <Group gap={4}>
                                    <MdOutlineEventNote size={20} />
                                    Start empty workout
                                </Group>
                            </Button>
                        </Tooltip>
                    </Group>
                    <Center>
                        <WorkoutTable />
                    </Center>
                </Stack>
            </Container>
        </>
    );
};
