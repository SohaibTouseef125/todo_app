import { Request } from 'express'
import { ETodoStatus } from '../../../../constant/todoStatus'

export interface ITodo {
    title: string
    description: string
    status: ETodoStatus
    user: string
}

export interface ITodoWithId extends ITodo {
    _id: string
}

export interface ICreateTodoRequest {
    title: string
    description: string
}

export interface IUpdateTodoRequest {
    title?: string
    description?: string
    status?: ETodoStatus
}

export interface ICreateTodo extends Request {
    body: ICreateTodoRequest
}

export interface IUpdateTodo extends Request {
    body: IUpdateTodoRequest
    params: {
        id: string
    }
}

export interface ITodoParams extends Request {
    params: {
        id: string
    }
}
