const Hapi = require("@hapi/hapi")
const Path = require("path")
const db = require("./db")
const jwt = require("jsonwebtoken")

const {v4: uuidv4} = require("uuid")

require("dotenv").config()

// importing models
const Task = require("./models/tasks.js")


// init() -> server initialize and start
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    })
    
    // Register -> Plugins to be used
    await server.register(require("@hapi/inert"))

    // Register plugin, Vision to render views
    await server.register(require('@hapi/vision'))
    
    // Plugin for basic authentication
    await server.register(require("@hapi/basic"))

    // attaching handlebars the template engine
    // will render the views/templates
    server.views({
        engines: { html: require("handlebars") },
        path: Path.join(__dirname, 'views')
    })

    // ROUTES
    server.route({
        path : "/",
        method: "GET",
        handler: (request, h) => {
            return h.response("Welcome")
        }
    })

    server.route({
        path : "/api/data/{id}",
        method: "GET",
        handler: (request, h) => {
            const id = request.params.id
            const data = {
                id: id,
                name: "Qazi"}
            return data
        }
    })
    
    server.route({
        method: "GET",
        path: "/getdata",
        handler: (request,h) => {

            return h.file("./public/data.json") 
        }
    })

    server.route({
        method: "GET",
        path: "/api/tasks",
        handler:  async (request, h)=>{
            try {
                const data = await Task.find().exec()
                return h.response(data).code(200)
                
            } catch (error) {
                console.log(error)
                return h.response(error).code(404)
            }
        }
    
    })
  
    server.route({
        method: "POST",
        path: "/api/tasks",
        handler: async (request, h) => {
            try {
                const task = new Task(request.payload)
                const res = await task.save()
                return h.response(res)

            } catch (error) {
                return h.response(error)
            }
        }
    })

    // JWT Practice
    server.route({
        method: "POST",
        path: "/login",
        handler: (request, h) => {
            const {username} = request.payload
            console.log(username)
            const access_token = jwt.sign({
                id: uuidv4(),
                username: username
            }, process.env.ACCESS_KEY)
            
                console.log(jwt.JsonWebTokenError)
            
            return h.response({token : access_token})
        }
    })

    server.route({
        path: "/users/data",
        method: "GET",
        handler: (request, h) => {
            return request.auth
        }
    })
    await server.start();
    console.log(server.info.uri)
 
}

init()
