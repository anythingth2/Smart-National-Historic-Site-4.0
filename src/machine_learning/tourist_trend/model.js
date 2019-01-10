const csvtojson = require('csvtojson');

class Model {

    async readCsv() {
        return await csvtojson({
            delimiter: ';'
        }).fromFile(this.CSV_PATH);
    }
    async preprocess() {
        console.log(await this.readCsv());
    }
    constructor() {
        this.CSV_PATH = `${__dirname}/sanam.csv`;
        this.preprocess().then((data) => {
            // console.log()
        });
    }
}
module.exports = Model;