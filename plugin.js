const plugin = {
    name: "registerUser",
    pkg: require('./package.json'),
    register: async function (server, options) {

       const registerUser = async function (request, h) {
            console.log(request.params)
        } 
        server.decorate('toolkit', 'registerUser', registerUser);
    }
};

module.exports = {plugin}

