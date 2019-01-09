const tf = require('@tensorflow/tfjs');
const csvtojson = require('csvtojson');

const preprocess = async () => {
    let data = await csvtojson().fromFile(__dirname + '/THB.csv')

    return {
        date: data.map(row => row.date),
        value: data.map(row => Number(row.value))
    }
};

const main = async () => {
    var data = await preprocess();
    console.log(data);
};

main();