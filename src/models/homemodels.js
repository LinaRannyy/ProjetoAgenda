const mongoose = require('mongoose')
const { use } = require('../../routes')

const homeSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: String
})

mongoose.model( 'User', homeSchema)

class Home {
}
module.exports = Home