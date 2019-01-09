const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node')
const csvtojson = require('csvtojson');
const SERIES_SIZE = 16;
const LEARNING_RATE = 0.05;
const readCsv = async () => {
    let data = await csvtojson().fromFile(__dirname + '/THB.csv')
    return {
        date: data.map(row => row.date),
        value: data.map(row => Number(row.value))
    }
};
const preprocess = (baths) => {
    var xs = [];
    var ys = [];
    for (var i = 0; i < baths.length - SERIES_SIZE; i++) {
        xs.push(baths.slice(i, i + SERIES_SIZE));
        ys.push(baths[i + SERIES_SIZE]);
    }
    return {
        xs: tf.tensor2d(xs).reshape([-1, SERIES_SIZE, 1]),
        ys: tf.tensor1d(ys)
    };
};

const createModel = () => {
    let model = tf.sequential();

    model.add(tf.layers.lstm({
        units: Math.pow(SERIES_SIZE, 2),
        inputShape: [SERIES_SIZE, 1],
    }));

    model.add(tf.layers.dense({
        units: 1,
        kernelInitializer: 'VarianceScaling',
        activation: 'relu'
    }));

    model.compile({
        optimizer: tf.train.adam(LEARNING_RATE),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
    });

    return model;
};
const main = async () => {
    var data = await readCsv();
    var baths = data.value;

    var trainingset = preprocess(baths);
    var xs = trainingset.xs;
    var ys = trainingset.ys;

    console.log(trainingset);

    const model = createModel();
    model.summary();
    

};

main();