Usage Guidelines:

    - Run the following commands:
        ?> npm init
        ?> nodemon server.js
    - Use Postman to check api

    - To get JWT Token, 
        - create a .env file and add ACCESS_KEY in it
        - POST request to this path -> '/login'
        - And get token in response
    
    - To check JWT Authorization,
        - GET request "/api/authorize-check"
        - Add set the following headers as :
            - Authorization: <token>
        - Check the response'

    - Other Routes are there, such as:
        - "/api/tasks" POST and GET to create and GET all tasks
    