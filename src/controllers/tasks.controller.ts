import { Request, Response } from "express";
import { CreateTaskBodyType } from "../middlewares/tasks.middleware";
import { DB } from "../config/db";
import Jsend from "../utils/jsend";
import { genID } from "../utils/utils";
import { TasksModel } from "../models/tasks.model";


export async function createTask(req: Request<{}, {}, CreateTaskBodyType>, res: Response) {
    const user_id = req.user?.user_id;
    const list_id = req.body.list_id;
    const taskContent = req.body.content;

    // check for list existence;
    const [rows] = await DB.query("SELECT * FROM lists WHERE lists.list_id = ? AND lists.user_id = ?", [list_id, user_id]);
    if ((rows as any[]).length === 0) {
        res.status(404).json(Jsend.success("list not found"))
        return;
    }

    const task_id = genID("task_");

    await DB.query(
        "INSERT INTO tasks (list_id, todo_id, content) values (?, ?, ?)",
        [list_id, task_id, taskContent]
    )

    res.status(201).json(Jsend.success("task created successfully"))
}

export async function getAllTasks(req: Request<{ listId: string }>, res: Response) {
    const user_id = req.user?.user_id;
    const list_id = req.params.listId;

    // check for list existence;
    const [rows] = await DB.query("SELECT * FROM lists WHERE lists.list_id = ? AND lists.user_id = ?", [list_id, user_id]);
    const list = (rows as any[])[0];
    if (!list) {
        res.status(404).json(Jsend.success("list not found"))
        return;
    };

    const [tasksRows] = await DB.query(
        "SELECT * from tasks WHERE tasks.list_id = ?",
        [list_id]
    );

    const tasks = (tasksRows as TasksModel[]).sort((a, b) => a.completed - b.completed);

    res.status(200).json(Jsend.success({ tasks, list }))
}

export async function updateTaskContent(req: Request<{ taskId: string }>, res: Response) {
    const task_id = req.params.taskId;
    const newTaskContent = req.body?.content;
    const list_id = req.body?.list_id

    if (!newTaskContent) {
        res.status(400).json(Jsend.fail("the 'content' key not provided in request body or it may be empty"))
        return;
    };
    if (!list_id) {
        res.status(400).json(Jsend.fail("the 'list_id' key not provided in request body or it may be empty"))
        return;
    }


    // check task existency
    const [taskRow] = await DB.query(
        "SELECT * FROM tasks WHERE list_id = ? AND todo_id = ?",
        [list_id, task_id]
    );
    const task = (taskRow as TasksModel[])[0];
    if (!task) {
        res.status(401).json(Jsend.fail("task with given id not found"))
        return;
    }

    await DB.query(
        "UPDATE tasks SET content = ? WHERE todo_id = ? AND list_id = ?",
        [newTaskContent, task_id, list_id]
    )

    res.status(201).json(Jsend.success("content updated successfuly"))
}

export async function deleteTask(req: Request<{ taskId: string }>, res: Response) {
    const task_id = req.params.taskId;
    const list_id = req.body?.list_id;

    if (!list_id) {
        res.status(400).json(Jsend.fail("the 'list_id' key not provided in request body or it may be empty"))
        return;
    };

    await DB.query("DELETE FROM tasks WHERE tasks.list_id = ? AND tasks.todo_id = ?", [list_id, task_id]);
    res.status(201).json(Jsend.success("task successfuly deleted!"));
}

export async function toggleTaskCompletion(req: Request<{ taskId: string }>, res: Response) {
    const task_id = req.params.taskId;
    await DB.query("UPDATE tasks SET tasks.completed = 1 - tasks.completed WHERE tasks.todo_id = ?", [task_id]);
    res.status(201).json(Jsend.success("toggled with success!"))
}