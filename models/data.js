const mongoose = require('mongoose');

const readJsonFileSync = require('../config').readJsonFileSync;
const config = readJsonFileSync('configs/server.json');

const Schema = mongoose.Schema;
const dataSchema = new Schema({
    table: String,
    row: String,
    column: String,
    data: String
});

module.exports = mongoose.model('data', dataSchema, config['mongo2']['dbname']);
