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



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//our routes:
app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (request, response)=> {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/info', (request, response)=> {
    const now = new Date().toString()
    Person.estimatedDocumentCount({})
        .then(count => {            
            response.send(`<p>Phonebook has info for ${count} people</p>
                    <p>${now}</p>`)  
        })         
})

app.get('/api/persons/:id', (request, response)=> {
    Person.findById(request.params.id)
        .then(note => {
            response.json(note)
        })
})

app.delete('/api/persons/:id', (request, response)=> {    
    // response.status(204).end()
    Person.findByIdAndDelete(request.params.id)
        .then(person => {            
            response.json(person)
        })
})

app.post('/api/persons', (request, response)=> {
    const body = request.body
    if(!body.name) {
        return response.status(400).json ({
            error: 'name missing'
        })
    }
     if(!body.number) {
        return response.status(400).json ({
            error: 'number missing'
        })
     }
     //check for duplicates
    //  const nameExists = persons.find(person => person.name === body.name)
    //  if (nameExists) {
    //     return response.status(409).json ({
    //         error: 'Conflict: name must be unique'
    //     })
    //  }

     const newPerson = new Person({
        name: body.name,
        number: body.number
     })

     newPerson.save().then(savedPerson => {
        response.json(savedPerson)
     })
})


//middleware to use if no route is found
//simply returns a 404 message
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

