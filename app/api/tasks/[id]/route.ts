import { NextResponse } from 'next/server';
import { tasks } from '@/lib/store';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const index = tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        tasks.splice(index, 1);
        return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();
    const task = tasks.find(t => t.id === id);

    if (task) {
        task.completed = body.completed;
        return NextResponse.json(task);
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}