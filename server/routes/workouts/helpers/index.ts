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
export const groupedByWorkoutId = (data: dataType[]): Workout => {
    const {exercises_sets, workouts} = data[0];
    const {workoutId} = exercises_sets;
    const {name, description, lastLoggedAt, userId} = workouts;

    return data.reduce(
        (acc: Workout, current: dataType) => {
            const {exercises_sets, sets, exercises} = current;
            const {exerciseId} = exercises_sets;
            const {weight, repetition} = sets;

            let exerciseSet = acc.exerciseSets?.find((es) => es.exerciseId === exerciseId);

            if (!exerciseSet) {
                exerciseSet = {
                    exerciseId: exerciseId,
                    sets: [{weight, repetition}],
                    name: exercises.name,
                };
                acc.exerciseSets?.push(exerciseSet);
            } else {
                exerciseSet.sets.push({weight, repetition});
            }

            return acc;
        },
        {id: workoutId, name, description, lastLoggedAt, userId, exerciseSets: []},
    );
};
