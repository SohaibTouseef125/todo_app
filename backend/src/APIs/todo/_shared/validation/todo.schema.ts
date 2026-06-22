import joi from 'joi'
import { ETodoStatus } from '../../../../constant/todoStatus'
import { ICreateTodoRequest, IUpdateTodoRequest } from '../types/todo.interface'

export const createTodoSchema = joi.object<ICreateTodoRequest, true>({
    title: joi.string().min(2).max(200).trim().required(),
    description: joi.string().max(2000).trim().allow('').optional()
})

export const updateTodoSchema = joi.object<IUpdateTodoRequest, true>({
    title: joi.string().min(2).max(200).trim().optional(),
    description: joi.string().max(2000).trim().allow('').optional(),
    status: joi
        .string()
        .valid(...Object.values(ETodoStatus))
        .optional()
})
