const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const csvtojson = require('csvtojson');
const fs = require('fs');
const axois = require('axios');

const SERIES_SIZE = 12;
const PREDICTED_SERIES_SIZE = 3;
const LEARNING_RATE = 0.0025;
const BATCH_SIZE = 16;
const EPOCHS = 50;
const SHUFFLE = false;
const VALIDATION_SPLIT = 0.2;

const WEIGHT_PATH = 'tourist_trend_weight';

class Model {
    async readCsv() {
        const removeExtendedField = (row) => {
            let keys = Object.keys(row);
            let values = [row.values];
            let date = row.day;
            keys.forEach(key => {
                if (key.match(/field/))
                    values.push(row[key]);
            });
            values = values.map(v => Number(v));
            return {
                date: date,
                values: values
            };
        };
        var data = (await csvtojson({
            delimiter: ';'
        }).fromFile(this.CSV_PATH));

        return data.map(row => {
            let newRow = removeExtendedField(row);
            return newRow;
        });
    }

    readCsvFromAPI() {
        const LENGTH = 8000;
        return axois.get(`http://localhost:8080/api/beacon/getSanam?hours=${LENGTH}`).then(async _res => {
            let numberTourist = _res.data.number_of_tourist;
            numberTourist = numberTourist.map(v => Number(v));
            return numberTourist;
        });
    }

    preprocess(data) {
        // let data = await this.readCsv();
        // this.freqPeoples = data.reduce((acc, current) => acc.concat(current.values), []);
        let max = Math.max(...(data));
        let min = Math.min(...(data));

        data = data.map(v => v / max);
        let xs = [];
        let ys = [];
        for (var i = 0; i < data.length - SERIES_SIZE - PREDICTED_SERIES_SIZE + 1; i++) {
            xs.push(data.slice(i, i + SERIES_SIZE));
            ys.push(data.slice(i + SERIES_SIZE, i + SERIES_SIZE + PREDICTED_SERIES_SIZE));
        }
        xs = tf.tensor2d(xs).reshape([-1, SERIES_SIZE, 1]);
        ys = tf.tensor2d(ys);

        return {
            xs: xs,
            ys: ys,
            max: max,
            min: min
        }
    }
    async _preprocess() {
        this.freqPeoples = await this.readCsvFromAPI();
     
        let tmp = this.preprocess(this.freqPeoples);
        this.xs = tmp.xs;
        this.ys = tmp.ys;
        this.max = tmp.max;
        this.min = tmp.min;


    }

    compile() {
        this.model.compile({
            optimizer: tf.train.adam(LEARNING_RATE),
            // optimizer: tf.train.rmsprop(0.01),
            loss: 'meanSquaredError',
            metrics: ['accuracy', 'mse']
        });
        this.model.summary();
    }

    createModel() {

        let model = tf.sequential();

        model.add(tf.layers.lstm({
            units: Math.pow(SERIES_SIZE, 2),
            inputShape: [SERIES_SIZE, 1],
            returnSequences: true
        }));


        model.add(tf.layers.dense({
            units: 3,
            // kernelInitializer: 'VarianceScaling',
            activation: 'sigmoid'
        }));
        this.model = model;
        this.compile();

        return this.model;
    }

    async trainModel() {
        await this.model.fit(this.xs, this.ys, {
            batchSize: BATCH_SIZE,
            epochs: EPOCHS,
            shuffle: SHUFFLE,
            validationSplit: VALIDATION_SPLIT
        });
    }

    async saveModel() {
        return await this.model.save(`file://./${WEIGHT_PATH}`);
    }

    async loadModel(isTrain) {

        await this._preprocess();
        if (fs.existsSync(`./${WEIGHT_PATH}/`)) {
            this.model = await tf.loadModel(`file://./${WEIGHT_PATH}/model.json`);
            this.compile();
        } else {
            this.createModel();
            await this.trainModel();
            await this.saveModel();
        }
        this.model.summary();
        if (isTrain)
            await this.trainModel();

        return this.model;
    }
    async predict(input) {
        if (input.length != SERIES_SIZE) {
            throw Error(`Input has number size ${input.length} but SERIES_SIZE ${SERIES_SIZE} `);
        }
        let dataset = tf.tensor2d([input]).reshape([-1, SERIES_SIZE, 1]);
        let result = await this.model.predict(dataset);
        result = Array.from(result.dataSync());
        // console.log(this.max)
        result = result.map(v => Math.floor(v * this.max));
        return result;
    }

    writeJson(isReverse) {
        let data = this.freqPeoples;
        console.log(`writeJson ${data}`)
        if (isReverse) {
            data = data.reverse();
        }
        fs.writeFileSync('./sanam.json', JSON.stringify({ data: data }), { encoding: 'utf-8', })
    }
    constructor(isTrain) {
        this.CSV_PATH = `${__dirname}/sanam.csv`;
        this.SERIES_SIZE = SERIES_SIZE;
        this.loadModel(isTrain).then(async () => {
       });

   

    }
}
module.exports = Model;