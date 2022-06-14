const jwt = require("jsonwebtoken")


// This is the authorization scheme
// Checks that eah API has Access to the resource or not
// authenticate method is must

const scheme = function (server, option){

    return {
        authenticate: function(request, h){
            const authHeader = request.headers.authorization
            const token = authHeader.split(" ")[1]

            const data = jwt.verify(token, process.env.ACCESS_KEY)

            return h.authenticated({credentials: data})
        },
        test: (request, h) => {
            console.log("asdasdas")
            return {a: 1}
        }
    }
}

module.exports = {scheme}