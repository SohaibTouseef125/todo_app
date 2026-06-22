import { CustomError } from '../../utils/errors'
import responseMessage from '../../constant/responseMessage'
import { ICreateTodoRequest, IUpdateTodoRequest } from './_shared/types/todo.interface'
import todoRepository from './_shared/repo/todo.repository'
import { ETodoStatus } from '../../constant/todoStatus'

export const createTodoService = async (userId: string, payload: ICreateTodoRequest) => {
    const todo = await todoRepository.create({
        title: payload.title,
        description: payload.description || '',
        status: ETodoStatus.PENDING,
        user: userId
    })

    return {
        success: true,
        todo
    }
}

export const getAllTodosService = async (userId: string) => {
    const todos = await todoRepository.findAllByUser(userId)

    return {
        success: true,
        count: todos.length,
        todos
    }
}

export const getTodoService = async (userId: string, todoId: string) => {
    const todo = await todoRepository.findByIdAndUser(todoId, userId)
    if (!todo) {
        throw new CustomError(responseMessage.NOT_FOUND('Todo'), 404)
    }

    return {
        success: true,
        todo
    }
}

export const updateTodoService = async (userId: string, todoId: string, payload: IUpdateTodoRequest) => {
    const todo = await todoRepository.findByIdAndUser(todoId, userId)
    if (!todo) {
        throw new CustomError(responseMessage.NOT_FOUND('Todo'), 404)
    }

    const updatedTodo = await todoRepository.update(todoId, userId, payload)

    return {
        success: true,
        todo: updatedTodo
    }
}

export const deleteTodoService = async (userId: string, todoId: string) => {
    const todo = await todoRepository.findByIdAndUser(todoId, userId)
    if (!todo) {
        throw new CustomError(responseMessage.NOT_FOUND('Todo'), 404)
    }

    await todoRepository.delete(todoId, userId)

    return {
        success: true,
        message: 'Todo deleted successfully'
    }
}
