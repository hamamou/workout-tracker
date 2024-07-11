import {selectExercise} from '../../../types/exercise';
import {
    ExerciseWithNames,
    selectExerciseSet,
    selectSet,
    selectWorkout,
    WorkoutWithExerciseNames,
} from '../../../types/workout';

export type dataType = {
    workouts: Omit<selectWorkout, 'exerciseSets'>;
    exercises_sets: selectExerciseSet;
    sets: Omit<selectSet, 'exerciseSetId'>;
    exercises: selectExercise;
};

export const groupedByWorkoutId = (data: dataType[]): WorkoutWithExerciseNames => {
    const {exercises_sets, workouts} = data[0];
    const {workoutId} = exercises_sets;
    const {name, description, lastLoggedAt, createdAt} = workouts;

    return data.reduce<WorkoutWithExerciseNames>(
        (acc: WorkoutWithExerciseNames, current: dataType) => {
            const {exercises_sets, sets, exercises} = current;
            const {exerciseId} = exercises_sets;
            const {weight, repetition, id: setId} = sets;

            let exerciseSet = acc.exerciseSets?.find((es) => es.exerciseId === exerciseId) as ExerciseWithNames;

            if (!exerciseSet) {
                exerciseSet = {
                    exerciseId: exerciseId,
                    sets: [{weight, repetition, id: setId}],
                    name: exercises.name,
                };
                acc.exerciseSets?.push(exerciseSet);
            } else {
                exerciseSet.sets.push({weight, repetition, id: setId});
            }

            return acc;
        },
        {id: workoutId, name, description, lastLoggedAt, createdAt, exerciseSets: []},
    );
};
