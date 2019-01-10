import { Router } from 'express'
import Sensor from './sensor'
import Line from './line'
import Beacon from './beacon'
import axois from 'axios';
import { TouristModel } from './../machine_learning'
const router = Router()

router.use('/sensor', Sensor)
router.use('/beacon', Beacon)
router.use('/line', Line)
router.use('/predict', async (req, res) => {

    // axois.get(`http://localhost:8080/beacon/getSanam?hours=`)
});

export default router