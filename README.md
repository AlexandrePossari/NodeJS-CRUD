# NodeJS-RestAPI

API created using Node.js, Express.js and MongoDB with learning purposes.

Simple CRUD of books using JWT authentication.

Future improvements and current pendencies listed in [issues](https://github.com/AlexandrePossari/NodeJS-RestAPI/issues).

### Techs used
- Node.js 21.6.1;
- Express.js 4.18.3;
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
### Entities
* User:
```
{
  "email": "ac.possari@gmail.com",
  "password": "XXXX",
  "name": "Alexandre Possari",
  "status": "active",
  "books": ["bookId1", "bookId2"]
}
```

| Field | Value | Description |
|--|--|--|
| email | String, not null, real email | |
| password | String with 5 characters minimum, not null | |
| name | String, not null | |
| status | String `New User`/`Active`/`Inactive` | |
| books | String array | Should contains ids from books created by the user |

* Book:
```
{
    "name": "The Little Prince",
    "author": "Antoine de Saint-Exupéry",
    "creator": "userId1"
}
```

| Field | Value | Description |
|--|--|--|
| name | String with 5 characters minimum, not null | |
| author | String with 5 characters minimum, not null | |
| creator | String, not null | Id of the user who created the book in the API|

Note: You can also run the collection `NodeJS RestAPI.postman_collection` located in folder `postman`. Just import it into Postman and run.

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