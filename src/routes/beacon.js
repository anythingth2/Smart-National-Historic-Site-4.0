import { Router } from 'express'
import Beacon from '../controllers/beacon'

const router = Router()

router.post('/putSanam', Beacon.addEntry)
router.get('/getSanam', Beacon.getLog)

export default router