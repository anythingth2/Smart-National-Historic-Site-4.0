const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node')
const csvtojson = require('csvtojson');
const DATASET_TRAINING_SIZE = 0.7;
const DATASET_VALIDATION_SIZE = 0.3;
const SERIES_SIZE = 4;
const LEARNING_RATE = 0.005;
const BATCH_SIZE = 16;
const EPOCHS = 200;
const SHUFFLE = false;
const VALIDATION_SPLIT = 0.2;

const WEIGHT_PATH = 'weight';
const readCsv = async () => {
    let data = await csvtojson().fromFile(__dirname + '/THB.csv');
    let values = data.map(v => Number(v.value));
    console.log(values)
    let max = Math.max(...values);
    let min = Math.min(...values);
    console.log(`${max} ${min}`)
    data = data.map(v => {
        v.value = (v.value - min) / (max - min);
        return v;
    });
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
    console.log(data)
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
const compile = (model) => {
    model.compile({
        optimizer: tf.train.adam(LEARNING_RATE),
        // optimizer: tf.train.rmsprop(0.01),
        loss: 'meanSquaredError',
        metrics: ['accuracy', 'mse']
    });
};
const createModel = () => {
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
        units: 1,
        // kernelInitializer: 'VarianceScaling',
        activation: 'sigmoid'
    }));

    compile(model);

    return model;
};
const saveModel = async (model) => {
    return await model.save(`file://./${WEIGHT_PATH}`);
};
const loadModel = async () => {
    var model = await tf.loadModel(`file://./${WEIGHT_PATH}/model.json`);
    compile(model);
    return model;
}
const trainModel = async (model, xs, ys) => {
    await model.fit(xs, ys, {
        batchSize: BATCH_SIZE,
        epochs: EPOCHS,
        shuffle: SHUFFLE,
        validationSplit: VALIDATION_SPLIT,
        callbacks: {
            onEpochEnd: (epoch, log) => {
            
                saveModel(model);
            }
        }
    });
};
const predictMoney = (model, data) => {
    return model.predict(data);
};

const main = async () => {
    var datasets = await preprocess();
    const model = createModel();
    model.summary();
    await trainModel(model, datasets.training.xs, datasets.training.ys);
    console.log('model predict');

    console.log('save model')
    await saveModel(model);
    // const trainedModel = await loadModel();


    // // const yTrainedPred = trainedModel.predict(datasets.validation.xs);
    // // yTrainedPred.print();
    // // var testset = [datasets.validation.xs[0]];
    // var testset = tf.tensor2d([[30.72, 30.715, 30.78, 30.81, 30.79, 30.73]]).reshape([-1, SERIES_SIZE, 1])
    // // console.log(testset)
    // // testset.print();

    // console.log('predicted');
    // predictMoney(trainedModel, testset).print();
};

main();