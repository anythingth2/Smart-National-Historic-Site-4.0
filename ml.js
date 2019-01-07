const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const csv = require('csv');
const fs = require('fs');
const iris = require('./iris');
const filePath = './iris.csv';
const petalLabelMap = {
    setosa: [1, 0, 0],
    versicolor: [0, 1, 0],
    virginica: [0, 0, 1]
}
const readFromCsv = (filePath) => {
    var dataIris = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return new Promise((resolve, reject) => {
        csv.parse(dataIris, {}, (err, iris) => {
            iris.slice(1);
            resolve(iris);
        });
    });
};

const preprocessIris = (iris) => {
    let x = iris.map((row) => {
        var data = row.slice(0, 4);
        return data.map((value) => { return Number(value) });
    });
    let y = iris.map((row) => { return petalLabelMap[row[4]] })
    return {
        x: tf.tensor2d(x),
        y: tf.tensor2d(y)
    };
}

var x = tf.tensor2d(iris.map(petal => [petal.sepalLength, petal.sepalWidth, petal.petalLength, petal.petalWidth]));
var y = tf.tensor2d(iris.map(petal => petalLabelMap[petal.species]));

var model = tf.sequential();
model.add(tf.layers.dense({ inputShape: 4, units: 4, activation: 'relu' }));
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: 'sgd',
    metrics: ['accuracy']
});
model.fit(x, y, {
    epochs: 50,
    shuffle: true,
    batchSize: 16
})
model.save('file://weight');
