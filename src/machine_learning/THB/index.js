const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node')
const csvtojson = require('csvtojson');
const DATASET_TRAINING_SIZE = 0.7;
const DATASET_VALIDATION_SIZE = 0.3;
// const DATASET_TEST
const SERIES_SIZE = 4;
const LEARNING_RATE = 0.01;
const BATCH_SIZE = 4;
const EPOCHS = 100;
const SHUFFLE = true;
const VALIDATION_SPLIT = 0;
const readCsv = async () => {
    let data = await csvtojson().fromFile(__dirname + '/THB.csv');
    let trainData = data.slice(0, Math.ceil(data.length * DATASET_TRAINING_SIZE));
    let validateData = data.slice(Math.floor(data.length * DATASET_TRAINING_SIZE))

    return {
        training: {
            date: trainData.map(row => row.date),
            value: trainData.map(row => Number(row.value))
        },
        validation: {
            date: validateData.map(row => row.date),
            value: validateData.map(row => Number(row.value))
        }
    }
};
const preprocess = async () => {
    var data = await readCsv();
    var trainingData = data.training.value;
    var validationData = data.validation.value;
    const decode = (baths) => {
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
    }
    return {
        training: decode(trainingData),
        validation: decode(validationData)
    };

};

const createModel = () => {
    let model = tf.sequential();

    model.add(tf.layers.lstm({
        units: 8,
        inputShape: [SERIES_SIZE, 1],
    }));

    model.add(tf.layers.dense({
        units: 1,
        kernelInitializer: 'VarianceScaling',
        activation: 'relu'
    }));

    model.compile({
        optimizer: tf.train.adam(LEARNING_RATE),
        // optimizer:tf.train.rmsprop(0.11),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
    });

    return model;
};

const trainModel = async (model, xs, ys) => {
    return await model.fit(xs, ys, {
        batchSize: BATCH_SIZE,
        epochs: EPOCHS,
        shuffle: SHUFFLE,
        validationSplit: VALIDATION_SPLIT
    })
};
const main = async () => {


    var datasets = await preprocess();
    console.log(datasets)
    const model = createModel();
    model.summary();
    await trainModel(model, datasets.training.xs, datasets.training.ys);


};

main();