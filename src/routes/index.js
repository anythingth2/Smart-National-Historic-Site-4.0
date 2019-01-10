import { Router } from 'express'
import Sensor from './sensor'
import Line from './line'
import Beacon from './beacon'

const router = Router()

router.use('/sensor', Sensor)
router.use('/beacon', Beacon)
router.use('/line', Line)

export default router