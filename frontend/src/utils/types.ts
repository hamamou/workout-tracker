export type User = {
    username: string;
    password: string;
};

export type ExerciseSet = {
    exerciseId?: string;
    name?: string;
    sets: Set[];
    exercise?: Exercise;
};

export type Set = {
    weight: number;
    repetition: number;
};

export type Exercise = {
    name: string;
    id: string;
};

export type Workout = {
    id?: string;
    name: string;
    description: string;
    createdAt?: string;
    exerciseSets: ExerciseSet[];
};

export type WorkoutLog = {
    id?: string;
    exerciseLogs: ExerciseLog[];
    loggedAt?: string;
    workoutId: string;
};

export type ExerciseLog = {
    exerciseId?: string;
    setLogs: SetLog[];
    exercise?: Exercise;
};

export type SetLog = {
    weight: number;
    repetition: number;
};
