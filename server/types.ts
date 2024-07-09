export type User = {
    username: string;
    password: string;
};

export type ExerciseSet = {
    exerciseId?: number;
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
    id: number;
};

export type Workout = {
    id?: number;
    name: string;
    description: string;
    createdAt?: string;
    exerciseSets: ExerciseSet[];
};

export type WorkoutLog = {
    id?: number;
    exerciseLogs: ExerciseLog[];
    loggedAt?: string;
    workoutId: number;
};

export type ExerciseLog = {
    exerciseId?: number;
    setLogs: SetLog[];
    exercise?: Exercise;
};

export type SetLog = {
    weight: number;
    repetition: number;
};
