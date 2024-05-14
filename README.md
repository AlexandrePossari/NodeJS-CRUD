# NodeJS-RestAPI

API created using Node.js, Express.js and MongoDB with learning purposes.

Simple CRUD of books using JWT authentication.

Future improvements and current pendencies listed in [issues](https://github.com/AlexandrePossari/NodeJS-RestAPI/issues).

### Techs used
- Node.js 21.6.1;
- Express.js 4.19.2;
- Mongoose 8.2.3;
- Mocha 10.4.0;
- Chai 4.4.1;

## Requirements

In order to run this project you have to install:

- [Postman](https://www.postman.com/downloads/);
- [Docker](https://docs.docker.com/get-docker/);

## How to run 

```bash
git clone https://github.com/AlexandrePossari/NodeJS-RestAPI.git
docker-compose up --build
```

## API Documentation
After running the project, visit http://localhost:8080/docs in your browser to access the API documentation

You can also run the collection `NodeJS RestAPI.postman_collection` located in folder `postman`. Just import it into Postman and run.

## Project Folder Structure
```
.
├── postman                               
└── src                                  
    ├── controllers                       
    ├── middleware                        
    ├── models                            
    ├── routes                            
    └── test                             
```

The `postman` folder holds the Postman collection.

The `src` folder contains the source code. 

The `controllers` folder has the controlllers that process incoming requests and return appropriate responses.

The `middleware` folder has function that stands between the HTTP request and the response, making tasks like authentication.

The `models` folder contains data models that define the structure of the data(schemas) to interact with the database.

The `routes` folder contains the route handlers for the endpoints.

The `test` folder should contain tests for the application.