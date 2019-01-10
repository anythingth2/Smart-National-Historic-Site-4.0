import { Router } from 'express'
import Beacon from '../controllers/beacon'

const router = Router()

router.post('/addEntry', Beacon.addEntry)

export default router