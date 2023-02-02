const express = require('express')
const morgan = require('morgan')
const app = express()

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`)
})

app.use(express.json())

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
    response.json(persons)
})

app.get('/info', (request, response)=> {
    const now = new Date().toString()
    const numPersons = persons.length
    response.send(`<p>Phonebook has info for ${numPersons} people</p>
                    <p>${now}</p>`)    
})

app.get('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id)
    console.log("person is:",person)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end() 
    }
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

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
     const nameExists = persons.find(person => person.name === body.name)
     if (nameExists) {
        return response.status(409).json ({
            error: 'Conflict: name must be unique'
        })
     }

     const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number,
     }   

     persons = persons.concat(newPerson)
     response.json(newPerson)
})


const generateId = () => {
    return Math.floor(Math.random() * 99999)
}


//middleware to use if no route is found
//simply returns a 404 message
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

