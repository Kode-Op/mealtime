This is MealTime, a project for CS 4800.

To run the frontend:

## Resolve dependencies

1. Open the command prompt
2. Navigate to project directory
3. Run the following command:

`npm i antd aws-sdk axios bcrypt bootstrap busboy busboy-body-parser connect-busboy cors create-react-app express lodash mongoose nodemon nyc react react-bootstrap react-dom react-router-dom react-scripts chai chai-http mocha`

## Run the virtual web server and connect to MongoDB Atlas

- In the command prompt, run the following command:

`nodemon server`

- In a second command prompt window, navigate to the project directory and run the following commands:

`cd client`
`npm run start`

- To perform testing, navigate to the project directory and run the following command:

`npm test`
