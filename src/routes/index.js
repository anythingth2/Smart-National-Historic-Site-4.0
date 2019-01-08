import { Router } from 'express'
import Sensor from './sensor'
import Line from './line'

const router = Router()

router.use('/sensor', Sensor)
router.use('/line', Line)

export default router