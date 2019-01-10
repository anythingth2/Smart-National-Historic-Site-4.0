const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const csvtojson = require('csvtojson');

const SERIES_SIZE = 12;


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
    async preprocess() {
        let data = await this.readCsv();
        let freqPeoples = data.reduce((acc, current) => acc.concat(current.values), []);
        var xs = [];
        var ys = [];
        for (var i = 0; i < freqPeoples.length - SERIES_SIZE; i++) {
            xs.push(freqPeoples.slice(i, i + SERIES_SIZE));
            ys.push(freqPeoples[i + SERIES_SIZE]);
        }
        return {
            xs: tf.tensor2d(xs).reshape([-1, SERIES_SIZE, 1]),
            ys: tf.tensor1d(ys)
        };
    }

    compile() {
        this.model.compile({
            optimizer: tf.train.adam(LEARNING_RATE),
            // optimizer: tf.train.rmsprop(0.01),
            loss: 'meanSquaredError',
            metrics: ['accuracy', 'mse']
        });
    }
    constructor() {
        this.CSV_PATH = `${__dirname}/sanam.csv`;
        this.preprocess().then((data) => {

        });
    }
}
module.exports = Model;