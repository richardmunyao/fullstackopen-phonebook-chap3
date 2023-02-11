const express = require('express') //server
const morgan = require('morgan') //logging middleware
const cors = require('cors') //allow cross origin resource sharing
const app = express()

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})

const Person = require('./models/phonebook') //mongoDB model in separate module

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

//morgan middleware
//define token to show content of body
morgan.token('body-content', (request, response)=> {
    if(request.method === 'POST'){
        return JSON.stringify(request.body)
    }
    return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content'))

//our routes:
app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (request, response, next)=> {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response)=> {
    const now = new Date().toString()
    Person.estimatedDocumentCount({})
        .then(count => {            
            response.send(`<p>Phonebook has info for ${count} people</p>
                    <p>${now}</p>`)  
        })
        .catch(error => next(error))         
})

app.get('/api/persons/:id', (request, response, next)=> {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next)=> { 
    console.log("Want to delete ID:",request.params.id)  
    Person.findByIdAndDelete(request.params.id)
        .then(result => {            
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next)=> {
    const {name, number} = request.body 
     const newPerson = new Person({
        name: name,
        number: number
     })
     //check if Person already exists before saving
     Person.findOne({name: name}).exec()
        .then(result => {            
            if (!result){
                newPerson.save().then(savedPerson => {
                    response.json(savedPerson)
                 })
                 .catch(error => next(error))
            }
            else {
                console.log("Hey, that person already exists!")
                return response.status(400).send({error: `${name} already exists`})
            }
        })
        .catch(error => {
            console.log("find error is: ",error)
        })    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const personObj = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, personObj, {new:true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


//middleware to use if no route is found
//simply returns a 404 message
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

//errorHanlding middleware - should be the last to be called
//uses 4 params
const errorHanlder = (error, request, response, next) => {
    console.error(error.message)
    
    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error:error.message})
    }
    next(error)
}

app.use(errorHanlder)

