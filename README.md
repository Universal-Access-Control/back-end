# Access Control API Service

Before start working on this project, make sure you installed [Nodejs](https://nodejs.org/en/) and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) in your machine and `MQTT Broker` service are available.

This project used `Apollo Graphql` to create a api server. For more information, check this [link](https://www.apollographql.com/docs/apollo-server/).

## Run Project

For running this project, follow the steps below:

- _Clone repository_

  - git clone https://github.com/Universal-Access-Control/back-end.git

- _Go to project directory_
  - cd back-end
- _Set Environment Variables_
  - Create `.env` file
  - Copy content of `.env.example` file to `.env` file
  - Set variables ( Default values are in `.env.default` ).<br/>
- _Install Dependencies_
  - npm install
- _Start Server_
  - npm start

\* `MongoDB` and `MQTT Broker` are required. Make sure this services are available.

## Available Scripts

In the project directory, you can run:

### `npm install`

Install dependencies of the project. <br/>
After you clone the repository, you have to install dependencies by running this command.

### `npm start`

Runs the app in the development mode.<br />
The server will start at [http://localhost:4000](http://localhost:4000).

Open [http://localhost:4000/graphql](http://localhost:4000/graphql) to view `Graphql Playground` in your browser.<br/>

The server will reload automatically if you make edits.
