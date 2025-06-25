export interface TasksModel {
    list_id: string
    todo_id: string
    content: string
    completed: 0 | 1
    created_at: string
    deadline: string | null
}