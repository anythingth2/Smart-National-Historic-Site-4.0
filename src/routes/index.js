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
var model = new TouristModel(process.env.isTrain);
router.use('/predict', (req, res) => {


    axois.get(`http://localhost:8080/api/beacon/getSanam?hours=${model.SERIES_SIZE}`).then(async _res => {

        let numberTourist = _res.data.number_of_tourist;
        console.log(`${numberTourist}:length ${numberTourist.length}`)
        numberTourist = numberTourist.map(v => Number(v));

        var predictedNumberTourist = await model.predict(numberTourist);
        predictedNumberTourist = predictedNumberTourist.map(v => String(v));
        res.status(200).json({
            number_of_tourist: predictedNumberTourist
        });
    });


});

export default router