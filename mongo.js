const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log("Did you forget to give password as a parameter?")
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.fbs6utd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema ({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person ({
    name: name,
    number: number
})

if (process.argv.length === 5){
    // we can save, no null values
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3){
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person =>{
            console.log(person.name,' ',person.number)
        })
        mongoose.connection.close()
    })
}


