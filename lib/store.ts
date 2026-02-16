export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

// This array acts as our temporary database
export let tasks: Task[] = [
    { id: 1, title: "Learn Next.js", completed: false },
];