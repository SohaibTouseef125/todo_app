import { Router } from 'express'
import todoController from './todo.controller'
import authenticate from '../../middlewares/authenticate'

const router = Router()

router.route('/').post(authenticate, todoController.create)
router.route('/').get(authenticate, todoController.getAll)
router.route('/:id').get(authenticate, todoController.getById)
router.route('/:id').put(authenticate, todoController.update)
router.route('/:id').delete(authenticate, todoController.delete)

export default router
