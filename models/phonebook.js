//extracting mongoose specific code to its own module
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to:',url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error)=> {
        console.log('error connecting to MongoDB: ',error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        minLength: [8,"should be at least 8 numbers long"],
        //custom validator
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d{5,}/.test(v);
            },
            message: props=> `${props.value} is not a valid phone number`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)