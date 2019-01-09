const csvtojson = require('csvtojson');
const onehot = require('@tensorflow/tfjs').oneHot;
const decode = async (province) => {
    const datasetsPackage = '/datasets';
    let filePath = __dirname + datasetsPackage + '/humidity.csv';
    let labelPath = __dirname + datasetsPackage + '/weather_description.csv';
    let humidity = await csvtojson().fromFile(filePath);
    let weatherDescription = await csvtojson().fromFile(labelPath);

    let datasets = [];
    var labels = [
        'mist',
        'broken clouds',
        'sky is clear',
        'light rain',
        'few clouds',
        'fog',
        'overcast clouds',
        'light intensity shower rain',
        'moderate rain',
        'light intensity drizzle',
        'scattered clouds',
        'proximity shower rain',
        'heavy intensity rain',
        'heavy snow',
        'shower rain',
        'snow',
        'heavy shower snow',
        'light intensity drizzle rain',
        'light snow',
        'very heavy rain',
        'smoke',
        'thunderstorm with heavy rain',
        'light shower snow',
        'thunderstorm',
        'thunderstorm with light rain',
        'haze',
        'dust',
        'volcanic ash',
        'heavy intensity shower rain',
        'thunderstorm with rain',
        'sleet',
        'light rain and snow',
        'drizzle',
        'shower snow',
        'light shower sleet',
        'proximity thunderstorm',
        'ragged thunderstorm'];
    weatherDescription.forEach((weather, index) => {
        let humidValue = humidity[index][province];
        let weatherValue = weather[province];
        if (humidValue && weatherValue)
            datasets.push({
                humid: Number(humidValue),
                description: onehot(labels.indexOf(weatherValue), labels.length)
            });
    });
    console.log(labels)
    return datasets;

}
module.exports = decode; 