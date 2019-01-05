import { Router } from 'express'
import Sensor from './sensor'

const router = Router()

router.use('/sensor', Sensor)

export default router