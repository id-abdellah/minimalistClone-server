export interface UsersModel {
    user_id: string
    username: string
    email: string
    password_hash: string
    avatar: string | null
}

export type UsersModelWithOptionalPassword = Omit<UsersModel, "password_hash"> & { password_hash?: string }
