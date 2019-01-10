const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const csvtojson = require('csvtojson');

const SERIES_SIZE = 12;
const LEARNING_RATE = 0.005;
const BATCH_SIZE = 16;
const EPOCHS = 200;
const SHUFFLE = false;
const VALIDATION_SPLIT = 0.2;

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
        this.freqPeoples = data.reduce((acc, current) => acc.concat(current.values), []);
        this.max = Math.max(...(this.freqPeoples));
        this.min = Math.min(...(this.freqPeoples));


        this.freqPeoples = this.freqPeoples.map(v => v / this.max);

        console.log(this.freqPeoples.slice(0, 10));

        this.xs = [];
        this.ys = [];
        for (var i = 0; i < this.freqPeoples.length - SERIES_SIZE; i++) {
            this.xs.push(this.freqPeoples.slice(i, i + SERIES_SIZE));
            this.ys.push(this.freqPeoples[i + SERIES_SIZE]);
        }

        this.xs = tf.tensor2d(this.xs).reshape([-1, SERIES_SIZE, 1]);
        this.ys = tf.tensor1d(this.ys);
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
            units: SERIES_SIZE,
            inputShape: [SERIES_SIZE, 1],
            returnSequences: true
        }));

        model.add(tf.layers.gru({
            units: SERIES_SIZE
        }));

        // model.add(tf.layers.lstm({
        //     units: SERIES_SIZE
        // }));
        // model.add(tf.layers.lstm({
        //     units: SERIES_SIZE
        // }));

        // model.add(tf.layers.dense({
        //     units: 16,
        //     activation: 'relu'
        // }));
        // // model.add(tf.layers.dropout(0.1));

        // model.add(tf.layers.dense({
        //     units: 8,
        //     activation: 'relu'
        // }));
        // // model.add(tf.layers.dropout(0.1));

        // model.add(tf.layers.dense({
        //     units: 4,
        //     activation: 'relu'
        // }));
        // // model.add(tf.layers.dropout(0.1));

        // model.add(tf.layers.dense({
        //     units: 2,
        //     activation: 'relu'
        // }));
        // model.add(tf.layers.dropout(0.1));

        model.add(tf.layers.dense({
            units: 3,
            // kernelInitializer: 'VarianceScaling',
            activation: 'sigmoid'
        }));
        this.model = model;
        this.compile();
        return this.model;
    }



    constructor() {
        this.CSV_PATH = `${__dirname}/sanam.csv`;
        this.preprocess().then(() => {
            this.createModel();
        });
    }
}
module.exports = Model;