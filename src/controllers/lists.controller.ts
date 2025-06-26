import { Response, Request } from "express";
import Jsend from "../utils/jsend";
import { genID } from "../utils/utils";
import { DB } from "../config/db";
import type { ListCreationBodyType, ListNameUpdateBodyType } from "../middlewares/lists.middleware";
import type { UsersModelWithOptionalPassword } from "../models/users.model";
import { ListsModel } from "../models/lists.model";


export async function createList(req: Request<{}, {}, ListCreationBodyType>, res: Response) {
    const user_id = req.user?.user_id;
    const { list_name } = req.body;
    if (!user_id) {
        res.status(401).json(Jsend.fail("no user with given user_id"));
        return;
    };
    const list_id = genID("list_");

    await DB.query(
        "INSERT INTO lists (user_id, list_id, list_name) VALUES (?, ?, ?)",
        [user_id, list_id, list_name]
    );

    res.status(201).json(Jsend.success("list created"))
}

export async function getAllLists(req: Request, res: Response) {
    const user_id = req.user?.user_id;
    const [rows] = await DB.query("SELECT * FROM lists WHERE lists.user_id = ?", [user_id]);
    const lists = rows as ListsModel[];

    const [urows] = await DB.query(`SELECT * FROM users WHERE users.user_id = ?`, [user_id]);
    const user = (urows as UsersModelWithOptionalPassword[])[0];
    delete user.password_hash;

    res.status(200).json(Jsend.success({ lists, user }));
}

export async function getSingleList(req: Request<{ listId: string }>, res: Response) {
    const user_id = req.user?.user_id;
    const listId = req.params.listId;

    const [listRow] = await DB.query("SELECT * FROM lists WHERE lists.list_id = ? AND lists.user_id = ?", [listId, user_id]);
    const list = (listRow as ListsModel[])[0];
    if (!list) {
        res.status(404).json(Jsend.fail("list not found"))
        return;
    }
    res.status(200).json(Jsend.success(list))
}

export async function renameList(req: Request<{ listId: string }, {}, ListNameUpdateBodyType>, res: Response) {
    const user_id = req.user?.user_id;
    const list_id = req.params.listId;
    const newListName = req.body.newName;

    // check for list existence;
    const [rows] = await DB.query("SELECT * FROM lists WHERE lists.list_id = ? AND lists.user_id = ?", [list_id, user_id]);
    if ((rows as any[]).length === 0) {
        res.status(404).json(Jsend.success("list not found"))
        return;
    }

    await DB.query(
        "UPDATE lists SET list_name = ? WHERE lists.list_id = ? AND lists.user_id = ?",
        [newListName, list_id, user_id]
    )

    res.status(201).json(Jsend.success("list name updated!"))
}

export async function removeList(req: Request<{ listId: string }>, res: Response) {
    const user_id = req.user?.user_id;
    const list_id = req.params.listId;

    // check for list existence;
    const [rows] = await DB.query("SELECT * FROM lists WHERE lists.list_id = ? AND lists.user_id = ?", [list_id, user_id]);
    if ((rows as any[]).length === 0) {
        res.status(404).json(Jsend.success("list not found"))
        return;
    }

    await DB.query(
        "DELETE FROM lists WHERE lists.list_id = ? AND lists.user_id = ?",
        [list_id, user_id]
    );

    res.status(200).json(Jsend.success("list successfuly deleted"))
}