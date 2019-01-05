import { Router } from 'express'
import Sensor from '../controllers/sensor'

const router = Router()

router.post('/add', Sensor.addEntry)
router.post('/addentry', Sensor._addEntry)
router.get('/getentry', Sensor.getEntry)

export default router