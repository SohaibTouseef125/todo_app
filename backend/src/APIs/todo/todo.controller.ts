import { NextFunction, Request, Response } from 'express'
import httpResponse from '../../handlers/httpResponse'
import responseMessage from '../../constant/responseMessage'
import httpError from '../../handlers/errorHandler/httpError'
import { CustomError } from '../../utils/errors'
import asyncHandler from '../../handlers/async'
import { IAuthenticateRequest } from '../../types/types'
import { validateSchema } from '../../utils/joi-validate'
import { createTodoSchema, updateTodoSchema } from './_shared/validation/todo.schema'
import { ICreateTodoRequest, ICreateTodo, IUpdateTodo, IUpdateTodoRequest, ITodoParams } from './_shared/types/todo.interface'
import { createTodoService, getAllTodosService, getTodoService, updateTodoService, deleteTodoService } from './todo.service'

export default {
    create: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { body, authenticatedUser } = request as ICreateTodo & IAuthenticateRequest

            const { error, payload } = validateSchema<ICreateTodoRequest>(createTodoSchema, body)
            if (error) {
                return httpError(next, error, request, 422)
            }

            const result = await createTodoService(String(authenticatedUser._id), payload)
            httpResponse(response, request, 201, responseMessage.todo.CREATED, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    getAll: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = request as IAuthenticateRequest

            const result = await getAllTodosService(String(authenticatedUser._id))
            httpResponse(response, request, 200, responseMessage.SUCCESS, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    getById: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { params, authenticatedUser } = request as ITodoParams & IAuthenticateRequest
            const { id } = params

            const result = await getTodoService(String(authenticatedUser._id), id)
            httpResponse(response, request, 200, responseMessage.SUCCESS, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    update: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { body, params, authenticatedUser } = request as IUpdateTodo & IAuthenticateRequest
            const { id } = params

            const { error, payload } = validateSchema<IUpdateTodoRequest>(updateTodoSchema, body)
            if (error) {
                return httpError(next, error, request, 422)
            }

            const result = await updateTodoService(String(authenticatedUser._id), id, payload)
            httpResponse(response, request, 200, responseMessage.todo.UPDATED, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    }),

    delete: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { params, authenticatedUser } = request as ITodoParams & IAuthenticateRequest
            const { id } = params

            const result = await deleteTodoService(String(authenticatedUser._id), id)
            httpResponse(response, request, 200, responseMessage.todo.DELETED, result)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    })
}
