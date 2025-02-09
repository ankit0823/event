# User Registration Endpoint

## POST /users/register

### Description

This endpoint is used to register a new user. It requires the user's first name, last name, email, and password.

### Request Body

The request body should be a JSON object with the following fields:

- `fullname`: An object containing:
  - `firstname` (string, required): The user's first name. Must be at least 3 characters long.
  - `lastname` (string, optional): The user's last name. Must be at least 3 characters long if provided.
- `email` (string, required): The user's email address. Must be a valid email format.
- `password` (string, required): The user's password. Must be at least 6 characters long.

### Example Request

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success

- **Status Code**: 201 Created
- **Response Body**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "First name must be at least 3 character long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 character long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

# User Login Endpoint

## POST /users/login

### Description

This endpoint is used to log in an existing user. It requires the user's email and password.

### Request Body

The request body should be a JSON object with the following fields:

- `email` (string, required): The user's email address. Must be a valid email format.
- `password` (string, required): The user's password. Must be at least 6 characters long.

### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id_here",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "Password must be at least 6 character long",
        "param": "password",
        "location": "body"
      }
    ]
  }
  ```

#### Authentication Errors

- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "email or password is incorrect"
  }
  ```

# User Profile Endpoint

## GET /users/profile

### Description

This endpoint is used to retrieve the profile of the authenticated user.

### Headers

- `Authorization` (string, required): The JWT token of the authenticated user.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "_id": "user_id_here",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
  ```

#### Authentication Errors

- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Authentication required"
  }
  ```

# User Logout Endpoint

## GET /users/logout

### Description

This endpoint is used to log out the authenticated user.

### Headers

- `Authorization` (string, required): The JWT token of the authenticated user.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Logout successfully"
  }
  ```

#### Authentication Errors

- **Status Code**: 401 Unauthorized
- **Response Body**:
  ```json
  {
    "message": "Authentication required"
  }
  ```

# Guest Login Endpoint

## POST /users/guest-login

### Description

This endpoint is used to log in as a guest user.

### Example Request

```json
{}
```

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "Guest login successful",
    "user": {
      "id": "guest_1633024800000",
      "name": "Guest User",
      "email": "guest@example.com",
      "role": "guest"
    },
    "token": "jwt_token_here"
  }
  ```

#### Server Errors

- **Status Code**: 500 Internal Server Error
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

# Join Event Endpoint

## POST /users/join-event/:eventId

### Description

This endpoint is used to join an event for the authenticated user.

### Headers

- `Authorization` (string, required): The JWT token of the authenticated user.

### Parameters

- `eventId` (string, required): The ID of the event to join.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Successfully joined event",
    "event": {
      "_id": "event_id_here",
      // ...other event details...
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "error": "Invalid event ID format"
  }
  ```

#### Not Found Errors

- **Status Code**: 404 Not Found
- **Response Body**:
  ```json
  {
    "error": "User not found"
  }
  ```
  or
  ```json
  {
    "error": "Event not found"
  }
  ```

# Cancel Event Participation Endpoint

## POST /users/cancel-event/:eventId

### Description

This endpoint is used to cancel participation in an event for the authenticated user.

### Headers

- `Authorization` (string, required): The JWT token of the authenticated user.

### Parameters

- `eventId` (string, required): The ID of the event to cancel participation.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Successfully canceled event participation",
    "event": {
      "_id": "event_id_here",
      // ...other event details...
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "error": "Invalid event ID format"
  }
  ```

#### Not Found Errors

- **Status Code**: 404 Not Found
- **Response Body**:
  ```json
  {
    "error": "User not found"
  }
  ```
  or
  ```json
  {
    "error": "Event not found"
  }
  ```

# Create Event Endpoint

## POST /create

### Description

This endpoint is used to create a new event.

### Request Body

The request body should be a JSON object with the following fields:

- `title` (string, required): The title of the event.
- `description` (string, required): The description of the event.
- `date` (string, required): The date of the event in ISO8601 format.
- `category` (string, required): The category of the event.

### Example Request

```json
{
  "title": "Sample Event",
  "description": "This is a sample event.",
  "date": "2023-10-10T10:00:00Z",
  "category": "Sample Category"
}
```

### Responses

#### Success

- **Status Code**: 201 Created
- **Response Body**:
  ```json
  {
    "event": {
      "_id": "event_id_here",
      "title": "Sample Event",
      "description": "This is a sample event.",
      "date": "2023-10-10T10:00:00Z",
      "category": "Sample Category"
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Title is required",
        "param": "title",
        "location": "body"
      },
      {
        "msg": "Description is required",
        "param": "description",
        "location": "body"
      },
      {
        "msg": "Invalid date format",
        "param": "date",
        "location": "body"
      },
      {
        "msg": "Category is required",
        "param": "category",
        "location": "body"
      }
    ]
  }
  ```

# Get All Events Endpoint

## GET /allEvents

### Description

This endpoint is used to fetch all events.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "events": [
      {
        "_id": "event_id_here",
        "title": "Sample Event",
        "description": "This is a sample event.",
        "date": "2023-10-10T10:00:00Z",
        "category": "Sample Category"
      },
      // ...other events...
    ]
  }
  ```

#### Server Errors

- **Status Code**: 500 Internal Server Error
- **Response Body**:
  ```json
  {
    "error": "Failed to fetch events"
  }
  ```

# Update Event Endpoint

## PUT /update/:id

### Description

This endpoint is used to update an event by ID.

### Request Body

The request body should be a JSON object with the following fields (all optional):

- `title` (string, optional): The title of the event.
- `description` (string, optional): The description of the event.
- `date` (string, optional): The date of the event in ISO8601 format.
- `category` (string, optional): The category of the event.

### Example Request

```json
{
  "title": "Updated Event Title",
  "description": "Updated event description.",
  "date": "2023-11-11T11:00:00Z",
  "category": "Updated Category"
}
```

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Event updated successfully",
    "updatedEvent": {
      "_id": "event_id_here",
      "title": "Updated Event Title",
      "description": "Updated event description.",
      "date": "2023-11-11T11:00:00Z",
      "category": "Updated Category"
    }
  }
  ```

#### Validation Errors

- **Status Code**: 400 Bad Request
- **Response Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Title cannot be empty",
        "param": "title",
        "location": "body"
      },
      {
        "msg": "Description cannot be empty",
        "param": "description",
        "location": "body"
      },
      {
        "msg": "Invalid date format",
        "param": "date",
        "location": "body"
      },
      {
        "msg": "Category cannot be empty",
        "param": "category",
        "location": "body"
      }
    ]
  }
  ```

#### Not Found Errors

- **Status Code**: 404 Not Found
- **Response Body**:
  ```json
  {
    "error": "Event not found"
  }
  ```

# Delete Event Endpoint

## DELETE /delete/:eventId

### Description

This endpoint is used to delete an event by ID.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "message": "Event deleted successfully",
    "deletedEvent": {
      "_id": "event_id_here",
      "title": "Sample Event",
      "description": "This is a sample event.",
      "date": "2023-10-10T10:00:00Z",
      "category": "Sample Category"
    }
  }
  ```

#### Not Found Errors

- **Status Code**: 404 Not Found
- **Response Body**:
  ```json
  {
    "error": "Event not found"
  }
  ```

#### Server Errors

- **Status Code**: 500 Internal Server Error
- **Response Body**:
  ```json
  {
    "error": "Failed to delete event"
  }
  ```

# Get Event Attendees Endpoint

## GET /event/:eventId/attendees

### Description

This endpoint is used to get the attendees of an event by event ID.

### Responses

#### Success

- **Status Code**: 200 OK
- **Response Body**:
  ```json
  {
    "attendees": [
      {
        "_id": "user_id_here",
        "fullname": "John Doe",
        "email": "john.doe@example.com"
      },
      // ...other attendees...
    ]
  }
  ```

#### Not Found Errors

- **Status Code**: 404 Not Found
- **Response Body**:
  ```json
  {
    "error": "Event not found"
  }
  ```

#### Server Errors

- **Status Code**: 500 Internal Server Error
- **Response Body**:
  ```json
  {
    "error": "Failed to fetch attendees"
  }
  ```