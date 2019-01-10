const csvtojson = require('csvtojson');

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
        }).fromFile(this.CSV_PATH))

        return data.map(row => {
            let newRow = removeExtendedField(row);
            return newRow;
        });
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