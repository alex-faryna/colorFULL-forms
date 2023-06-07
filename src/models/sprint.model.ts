
export interface TaskInEpic {
    id: number;
    // status: number;
    title: string;
    // code
    // tags?: Tag[]; // mb not here but in FullTask
    // content
    // priority
    // assignee
}

// status -> tasks
export type TasksInEpic = Record<number, TaskInEpic[]>;

// need id because of dates etc
// mb tasks will not go here and will have it's own many url's: .../sprint/{id}/tasks    .../user/{id}/tasks etc
// or mb as it is but will have the upp url's too for other apges where we need to load other tasks independly, beause a sprint without tasks cannot
// exist sho it should have them tasks inside it
export interface Sprint {
    id: number;
    // dates
    // description
    // statuses to omit mb
    tasks: Record<number, TasksInEpic>;
}
