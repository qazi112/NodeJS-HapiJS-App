require("dotenv").config()
require("./db")

// Package imports
const Hapi = require("@hapi/hapi")
const Path = require("path")
const jwt = require("jsonwebtoken")
const {v4: uuidv4} = require("uuid")

// Custom Auth scheme import
const {scheme} = require("./auth_scheme")

// Custom plugin import
const {plugin} = require("./plugin")

// Importing Mongoose Model 
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
    
    await server.register(plugin)

    // Plugin for basic authentication
    await server.register(require("@hapi/basic"))

    // adding custom authentication scheme to server
    server.auth.scheme("jwt-scheme", scheme)
    server.auth.strategy("my-jwt-auth", "jwt-scheme")

    // attaching handlebars the template engine
    // will render the views/templates
    server.views({
        engines: { html: require("handlebars") },
        path: Path.join(__dirname, 'views')
    })

    // ROUTES

    // Example of using custom plugin
    // @GET /api/example/plugin/{name?} 
    server.route({
        method: "GET",
        path: "/api/example/plugin/{name?} ",
        handler: (request,h) => {
            h.registerUser(request, h)
            return h.file("./public/data.json") 
        }
    })
    // Find all tasks
    // @GET "/api/tasks"
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
  
    // Create a task
    // @POST "/api/tasks" 
    // {title: "taskname", description: "newt task ..."}
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

    // Get the JWT Token returned
    // @POST "/login"
    // {username: "name", password: "abcxyz123"}
    // Returns {token: JWT Token signed }
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
    // Check authorized user
    // @GET "/api/authorize-check"
    // Used Custom Auth Scheme
    // Check "./auth_scheme.js" file for schema
    // And server.auth.scheme() and server.auth.strategy()
    server.route([
        {
            method: "GET",
            path: "/api/authorize-check",
            handler: async (request, h) => {
                const res = await request.auth.
                console.log(res)
                const response = h.response({data:request.auth.credentials})
                    .header("Content-Type", "application/json")
                    .code(200)
                return response
            },
            options: {
                // Auth strategy used for this route
                // It has authenticate method to check the headers
                auth: "my-jwt-auth"
            }
        },
    ])
    // Start the server
    await server.start();
    console.log(server.info.uri)
  
}

init()
