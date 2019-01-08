

import { Router } from 'express'
import Line from '../controllers/line'

const router = Router()

router.get('/boardcast/:msg', Line.boardCast)

export default router