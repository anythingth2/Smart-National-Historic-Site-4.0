const tf = require('@tensorflow/tfjs');
require('./decode')('Vancouver').then(humidity => {
    // console.log(JSON.stringify(humidity.slice(0, 10),'  ','\n'))
});


