import todoModel from '../models/todo.model'
import { ITodo } from '../types/todo.interface'

export default {
    create: (payload: ITodo) => {
        return todoModel.create(payload)
    },
    findAllByUser: (userId: string) => {
        return todoModel.find({ user: userId }).sort({ createdAt: -1 })
    },
    findById: (id: string) => {
        return todoModel.findById(id)
    },
    findByIdAndUser: (id: string, userId: string) => {
        return todoModel.findOne({ _id: id, user: userId })
    },
    update: (id: string, userId: string, payload: Partial<ITodo>) => {
        return todoModel.findOneAndUpdate({ _id: id, user: userId }, payload, { new: true, runValidators: true })
    },
    delete: (id: string, userId: string) => {
        return todoModel.findOneAndDelete({ _id: id, user: userId })
    }
}
