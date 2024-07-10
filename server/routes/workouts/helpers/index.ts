import {Workout} from '../types';

export type dataType = {
    workouts: {
        id: number;
        name: string;
        description: string | null;
        lastLoggedAt: string | null;
        userId: string;
    };
    exercises_sets: {
        id: number;
        exerciseId: number;
        workoutId: number;
    };
    sets: {
        id: number;
        weight: number;
        repetition: number;
    };
    exercises: {
        id: number;
        name: string;
    };
};
export const groupedByWorkoutId = (data: dataType[]): Workout[] => {
    return data.reduce((acc: Workout[], current: dataType) => {
        const {exercises_sets, workouts, sets, exercises} = current;
        const {workoutId, exerciseId} = exercises_sets;
        const {weight, repetition} = sets;
        const {id, name, description, lastLoggedAt, userId} = workouts;

        let workout = acc.find((w) => w.id === workoutId);

        if (!workout) {
            workout = {
                id: workoutId,
                name: name,
                description: description,
                lastLoggedAt: lastLoggedAt,
                userId: userId,
                exerciseSets: [],
            };
            acc.push(workout);
        }

        let exerciseSet = workout.exerciseSets?.find((es) => es.exerciseId === exerciseId);

        if (!exerciseSet) {
            exerciseSet = {
                exerciseId: exerciseId,
                sets: [{weight, repetition}],
                name: exercises.name,
            };
            workout.exerciseSets?.push(exerciseSet);
        } else {
            exerciseSet.sets.push({weight, repetition});
        }

        return acc;
    }, []);
};
