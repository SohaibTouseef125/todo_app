import mongoose from 'mongoose'
import { ITodo } from '../types/todo.interface'
import { ETodoStatus } from '../../../../constant/todoStatus'

const todoSchema = new mongoose.Schema<ITodo>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 200
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: ''
        },
        status: {
            type: String,
            enum: ETodoStatus,
            default: ETodoStatus.PENDING,
            required: true
        },
        user: {
            type: String,
            required: true,
            index: true
        }
    },
    { timestamps: true }
)

export default mongoose.model<ITodo>('Todo', todoSchema)
