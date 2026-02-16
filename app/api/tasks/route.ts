import { NextResponse } from 'next/server';
import { tasks, Task } from '@/lib/store';

export async function GET() {
    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newTask: Task = {
        id: Date.now(), // Unique ID
        title: body.title,
        completed: false,
    };
    tasks.push(newTask);
    return NextResponse.json(newTask);
}