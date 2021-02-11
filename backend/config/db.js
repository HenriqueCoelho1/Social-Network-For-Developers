const mongoose = require('mongoose')
require('dotenv').config()
const secret = process.env.MONGO_URI
const db = secret



const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected')

    } catch (err) {
        console.log(err.message)
        //exit process with faile
        process.exit(1)

    }
}

module.exports = connectDB