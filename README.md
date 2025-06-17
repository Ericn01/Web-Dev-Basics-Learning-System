# Project Description
This project aims to develop a learning system that effectively teaches key concepts covered in the COMP 2511 class. The system will serve as an interactive educational tool designed to enhance students' learning of the basics of client side web development, including semantic HTML, building HTML forms and tables, HTTP methods (‘GET’ and POST’), along with modern CSS techniques. The platform will include engaging learning modules, quizzes, and a progress tracker to help students reinforce their learning through practical exercises.

# API Documentation

This document provides comprehensive documentation for all API endpoints in the web application. 

Base URL:

```javascript
const BASE_URL = '/webdev-learning/api';
const SERVER_EXTERNAL_IP = 34.41.137.211;
const SERVER_PORT = 8000 ;

// Sample call (via Postman): GET 34.41.137.211:8000/webdev-learning/api/user/profiles OR GET `${SERVER_EXTERNAL_IP}:${SERVER_PORT}/${BASE_URL}/user/profiles
```

## Table of Contents
- [Project Description](#project-description)
- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [HTTP Demo Endpoints](#http-demo-endpoints)
    - [GET /http-demo](#get-http-demo)
      - [Request](#request)
      - [Response](#response)
    - [POST /http-demo](#post-http-demo)
      - [Request](#request-1)
      - [Response](#response-1)
  - [Error Handling](#error-handling)
  - [Quiz Endpoints](#quiz-endpoints)
    - [GET /quizzes](#get-quizzes)
      - [Request](#request-2)
      - [Response](#response-2)
    - [GET /quizzes/:id](#get-quizzesid)
      - [Request](#request-3)
      - [Response](#response-3)
    - [POST /quizzes](#post-quizzes)
      - [Request](#request-4)
      - [Response](#response-4)
    - [POST /quizzes/:id/submit](#post-quizzesidsubmit)
      - [Request](#request-5)
      - [Response](#response-5)
    - [POST /quizzes/:id/add](#post-quizzesidadd)
      - [Request](#request-6)
      - [Response](#response-6)
  - [Error Handling](#error-handling-1)
  - [User Profile Endpoints](#user-profile-endpoints)
    - [GET /user/profile](#get-userprofile)
      - [Request](#request-7)
      - [Response](#response-7)
    - [PUT /user/profile](#put-userprofile)
      - [Request](#request-8)
      - [Response](#response-8)
    - [GET /user/profiles](#get-userprofiles)
      - [Request](#request-9)
      - [Response](#response-9)
  - [Module Endpoints](#module-endpoints)
    - [GET /modules](#get-modules)
      - [Request](#request-10)
      - [Response](#response-10)
    - [GET /modules/:id](#get-modulesid)
      - [Request](#request-11)
      - [Response](#response-11)
    - [POST /modules](#post-modules)
      - [Request](#request-12)
      - [Response](#response-12)
    - [PUT /modules/:id](#put-modulesid)
      - [Request](#request-13)
      - [Response](#response-13)
  - [Authentication Endpoints](#authentication-endpoints)
    - [POST /register](#post-register)
      - [Request](#request-14)
      - [Response](#response-14)
    - [POST /login](#post-login)
      - [Request](#request-15)
      - [Response](#response-15)
    - [POST /logout](#post-logout)
      - [Request](#request-16)
      - [Response](#response-16)
    - [POST /admin/promote](#post-adminpromote)
      - [Request](#request-17)
      - [Response](#response-17)
    - [Authentication Notes](#authentication-notes)
  - [FAQ and Feedback Endpoints](#faq-and-feedback-endpoints)
    - [GET /faqs](#get-faqs)
      - [Request](#request-18)
      - [Response](#response-18)
    - [POST /feedback](#post-feedback)
      - [Request](#request-19)
      - [Response](#response-19)
  - [Progress Endpoints](#progress-endpoints)
    - [GET /progress](#get-progress)
      - [Request](#request-20)
      - [Response](#response-20)
    - [POST /progress/module](#post-progressmodule)
      - [Request](#request-21)
      - [Response](#response-21)
    - [POST /progress/quiz](#post-progressquiz)
      - [Request](#request-22)
      - [Response](#response-22)
    - [Progress Notes](#progress-notes)
 
## HTTP Demo Endpoints

### GET /http-demo

Educational endpoint that demonstrates the characteristics and proper usage of GET requests.

#### Request
- Method: `GET`
- URL: `/http-demo`
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "This is a response from a GET request",
  "request": {
    "method": "GET",
    "headers": "<request headers>",
    "url": "/http-demo",
    "timestamp": "<ISO timestamp>"
  },
  "explanation": {
    "purpose": "GET requests are used to retrieve data from a server",
    "characteristics": [
      "Data is sent through URL parameters",
      "Requests can be cached",
      "Should not modify server data",
      "Idempotent (same request always returns same result)"
    ]
  }
}
```

**Error Response (500)**
```json
{
  "success": false,
  "message": "An error occurred processing the GET request",
  "error": "<error message>"
}
```

### POST /http-demo

Educational endpoint that demonstrates the characteristics and proper usage of POST requests.

#### Request
- Method: `POST`
- URL: `/http-demo`
- Authentication: None required
- Body:
  ```json
  {
    "data": "<any data>"
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "This is a response from a POST request",
  "request": {
    "method": "POST",
    "headers": "<request headers>",
    "body": "<received data>",
    "url": "/http-demo",
    "timestamp": "<ISO timestamp>"
  },
  "receivedData": {
    "content": "<received data>",
    "length": "<data length>",
    "type": "<data type>"
  },
  "explanation": {
    "purpose": "POST requests are used to send data to a server",
    "characteristics": [
      "Data is sent in the request body",
      "Requests are not cached by default",
      "Can modify server data",
      "Not idempotent (same request might give different results)"
    ]
  }
}
```

**Error Response (500)**
```json
{
  "success": false,
  "message": "An error occurred processing the POST request",
  "error": "<error message>"
}
```

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "<error description>",
  "error": "<detailed error message>"
}
```

---

## Quiz Endpoints

### GET /quizzes

Retrieves all quizzes with their associated questions and options.

#### Request
- Method: `GET`
- URL: `/quizzes`
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "Quizzes fetched successfully",
  "data": [
    {
      "quiz_id": "<quiz_id>",
      "title": "<quiz_title>",
      "questions": [
        {
          "question_id": "<question_id>",
          "question_text": "<question_text>",
          "correct_answer": "<correct_answer>",
          "options": [
            {
              "option_id": "<option_id>",
              "option_text": "<option_text>"
            }
          ]
        }
      ]
    }
  ]
}
```

**Error Response (404)**
```json
{
  "success": false,
  "message": "No quizzes have been found"
}
```

### GET /quizzes/:id

Retrieves a specific quiz by ID with its questions and options.

#### Request
- Method: `GET`
- URL: `/quizzes/:id`
- URL Parameters:
  - `id`: Quiz ID (required)
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "We found quiz with quiz ID {id}",
  "data": {
    "quiz_id": "<quiz_id>",
    "title": "<quiz_title>",
    "questions": [
      {
        "question_id": "<question_id>",
        "question_text": "<question_text>",
        "correct_answer": "<correct_answer>",
        "options": [
          {
            "option_id": "<option_id>",
            "option_text": "<option_text>"
          }
        ]
      }
    ]
  }
}
```

**Error Response (404)**
```json
{
  "message": "Quiz not found with the specified ID"
}
```

### POST /quizzes

Creates a new quiz with questions and options.

#### Request
- Method: `POST`
- URL: `/quizzes`
- Authentication: None required
- Body:
  ```json
  {
    "title": "<quiz_title>",
    "questions": [
      {
        "question_text": "<question_text>",
        "correct_answer": "<correct_answer>",
        "options": ["<option1>", "<option2>", ...]
      }
    ]
  }
  ```

#### Response

**Success Response (201)**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "quiz_id": "<quiz_id>"
  }
}
```

### POST /quizzes/:id/submit

Submits answers for a quiz and returns the score.

#### Request
- Method: `POST`
- URL: `/quizzes/:id/submit`
- URL Parameters:
  - `id`: Quiz ID (required)
- Authentication: None required
- Body:
  ```json
  {
    "user_id": "<user_id>",
    "answers": [
      {
        "question_id": "<question_id>",
        "answer": "<answer>"
      }
    ]
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "Quiz submitted successfully.",
  "data": {
    "score": "<percentage_score>",
    "totalQuestions": "<total_questions>",
    "correctAnswers": "<correct_answers>"
  }
}
```

**Error Responses**
- 400: Invalid input format
- 404: Quiz not found
- 404: No questions found

### POST /quizzes/:id/add

Adds new questions to an existing quiz.

#### Request
- Method: `POST`
- URL: `/quizzes/:id/add`
- URL Parameters:
  - `id`: Quiz ID (required)
- Authentication: None required
- Body:
  ```json
  {
    "questions": [
      {
        "question_text": "<question_text>",
        "correct_answer": "<correct_answer>",
        "options": ["<option1>", "<option2>", ...]
      }
    ]
  }
  ```

#### Response

**Success Response (201)**
```json
{
  "success": true,
  "message": "Questions added successfully."
}
```

**Error Responses**
- 400: Invalid questions format
- 404: Quiz does not exist

## Error Handling

All endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "<error description>",
  "error": "<detailed error message>"
}
```

## User Profile Endpoints

### GET /user/profile

Retrieves the authenticated user's profile information including their progress data.

#### Request
- Method: `GET`
- URL: `/user/profile`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```

#### Response

**Success Response (200)**
```json
{
  "username": "<username>",
  "email": "<email>",
  "progress": [
    {
      "quiz_id": "<quiz_id>",
      "score": "<score>",
      "completed_at": "<timestamp>"
    }
  ]
}
```

**Error Responses**
- 401: Unauthorized (missing or invalid token)
- 404: User not found
```json
{
  "message": "User not found"
}
```
- 500: Server error
```json
{
  "message": "Error retrieving profile",
  "err": "<error details>"
}
```

### PUT /user/profile

Updates the authenticated user's profile information.

#### Request
- Method: `PUT`
- URL: `/user/profile`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Body:
  ```json
  {
    "username": "<new_username>",  // optional
    "email": "<new_email>"         // optional
  }
  ```
  Note: At least one field must be provided

#### Response

**Success Response (200)**
```json
{
  "message": "Profile updated successfully"
}
```

**Error Responses**
- 400: No update data provided
```json
{
  "message": "No update data provided"
}
```
- 401: Unauthorized (missing or invalid token)
- 500: Server error
```json
{
  "message": "Error updating profile",
  "err": "<error details>"
}
```

### GET /user/profiles

Testing route that retrieves all user profiles with their progress information.

#### Request
- Method: `GET`
- URL: `/user/profiles`
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "profileData": {
    "userProfiles": [
      {
        "user_id": "<user_id>",
        "username": "<username>",
        "email": "<email>",
        "quiz_id": "<quiz_id>",
        "score": "<score>"
      }
    ]
  }
}
```

**Error Response (500)**
```json
{
  "message": "Error retrieving profile",
  "err": "<error details>"
}
```

Note: This is a testing route and should not be used in production environments as it exposes all user data.

## Module Endpoints

### GET /modules

Retrieves all available modules.

#### Request
- Method: `GET`
- URL: `/modules`
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "Modules retrieved successfully",
  "data": [
    {
      "module_id": "<module_id>",
      "title": "<title>",
      "module_description": "<description>",
      "content": "<content>",
      "banner_image_path": "<image_path>"
    }
  ]
}
```

**Error Responses**
- 404: No modules found
```json
{
  "message": "No modules found"
}
```
- 500: Server error
```json
{
  "message": "A server error occurred"
}
```

### GET /modules/:id

Retrieves a specific module by ID.

#### Request
- Method: `GET`
- URL: `/modules/:id`
- URL Parameters:
  - `id`: Module ID (required)
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "We found the following module with module ID {id}",
  "data": {
    "module_id": "<module_id>",
    "title": "<title>",
    "module_description": "<description>",
    "content": "<content>",
    "banner_image_path": "<image_path>"
  }
}
```

**Error Responses**
- 404: Module not found
```json
{
  "message": "Module not found"
}
```
- 500: Server error
```json
{
  "message": "A server error occurred..."
}
```

### POST /modules

Creates a new module.

#### Request
- Method: `POST`
- URL: `/modules`
- Authentication: None required
- Body:
  ```json
  {
    "title": "<title>",              // required, max 50 characters
    "module_description": "<desc>",   // required, max 255 characters
    "content": "<content>",          // required
    "banner_image_path": "<path>"    // optional
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "The module has been added successfully.",
  "data": {
    "module_id": "<module_id>",
    "title": "<title>",
    "module_description": "<description>",
    "content": "<content>",
    "banner_image_path": "<image_path>"
  }
}
```

**Error Responses**
- 400: Missing required fields
```json
{
  "success": false,
  "message": "Please fill out all required fields: title, description, and content"
}
```
- 400: Length validation errors
```json
{
  "success": false,
  "message": "Title or description exceeds maximum length"
}
```
- 500: Server error
```json
{
  "success": false,
  "message": "An error occurred while creating the module"
}
```

### PUT /modules/:id

Updates an existing module.

#### Request
- Method: `PUT`
- URL: `/modules/:id`
- URL Parameters:
  - `id`: Module ID (required)
- Authentication: None required
- Body:
  ```json
  {
    "title": "<title>",              // optional, max 50 characters
    "module_description": "<desc>",   // optional, max 255 characters
    "content": "<content>",          // optional
    "banner_image_path": "<path>"    // optional
  }
  ```
  Note: At least one field must be provided

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "Module updated successfully",
  "data": {
    "module_id": "<module_id>",
    "title": "<title>",
    "module_description": "<description>",
    "content": "<content>",
    "banner_image_path": "<image_path>"
  }
}
```

**Error Responses**
- 400: No fields to update
```json
{
  "success": false,
  "message": "Please provide at least one field to update"
}
```
- 400: Length validation errors
```json
{
  "success": false,
  "message": "Title exceeds maximum length of 50 characters"
}
```
or
```json
{
  "success": false,
  "message": "Description exceeds maximum length of 255 characters"
}
```
- 404: Module not found
```json
{
  "success": false,
  "message": "Module not found"
}
```
- 500: Server error
```json
{
  "success": false,
  "message": "An error occurred while updating the module"
}
```

## Authentication Endpoints

### POST /register

Registers a new user account.

#### Request
- Method: `POST`
- URL: `/register`
- Authentication: None required
- Body:
  ```json
  {
    "username": "<username>",         // required
    "email": "<email>",              // required, valid email format
    "password": "<password>"         // required, minimum 5 characters
  }
  ```

#### Response

**Success Response (201)**
```json
{
  "message": "User created successfully",
  "token": "<jwt_token>",
  "role": "user"
}
```

**Error Responses**
- 400: Missing required fields
```json
{
  "message": "All fields are required"
}
```
- 400: Invalid email format
```json
{
  "message": "Invalid email format"
}
```
- 400: Password too short
```json
{
  "message": "Password must be at least 5 characters"
}
```
- 400: User already exists
```json
{
  "message": "Username or email already exists"
}
```
- 500: Server error
```json
{
  "message": "Server error"
}
```

### POST /login

Authenticates a user and provides a JWT token.

#### Request
- Method: `POST`
- URL: `/login`
- Authentication: None required
- Body:
  ```json
  {
    "email": "<email>",        // required
    "password": "<password>"   // required
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "token": "<jwt_token>",
  "role": "<user_role>"
}
```

**Error Responses**
- 400: Missing fields
```json
{
  "message": "All fields are required"
}
```
- 401: User not found
```json
{
  "message": "There are no registered users with the specified email"
}
```
- 401: Invalid credentials
```json
{
  "message": "Invalid credentials"
}
```
- 500: Server error
```json
{
  "message": "Server error"
}
```

### POST /logout

Invalidates the current JWT token.

#### Request
- Method: `POST`
- URL: `/logout`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```

#### Response

**Success Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**
- 401: Unauthorized (missing or invalid token)
- 500: Server error
```json
{
  "message": "Server error"
}
```

### POST /admin/promote

Promotes a user to admin role. Only accessible by existing admins.

#### Request
- Method: `POST`
- URL: `/admin/promote`
- Authentication: Required (JWT Bearer Token with Admin role)
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Body:
  ```json
  {
    "user_id": "<user_id>"    // required
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "message": "User promoted to admin successfully"
}
```

**Error Responses**
- 400: Missing user ID
```json
{
  "message": "User ID is required"
}
```
- 401: Unauthorized (missing or invalid token)
- 403: Insufficient permissions
```json
{
  "message": "Insufficient permissions"
}
```
- 500: Permission check error
```json
{
  "message": "Error checking permissions"
}
```
- 500: Promotion error
```json
{
  "message": "Failed to promote user"
}
```

### Authentication Notes

1. JWT Token Format:
   - Tokens are valid for 24 hours
   - Token must be included in the Authorization header as a Bearer token
   - Format: `Authorization: Bearer <token>`

2. Role System:
   - Default role for new users is "user"
   - Admin role required for certain operations
   - Roles cannot be self-assigned

3. Password Requirements:
   - Minimum 5 characters
   - Stored using bcrypt hashing
   - Cannot be retrieved once set

4. Email Requirements:
   - Must be unique in the system
   - Must follow standard email format (example@domain.com)

## FAQ and Feedback Endpoints

### GET /faqs

Retrieves all frequently asked questions and their answers.

#### Request
- Method: `GET`
- URL: `/faqs`
- Authentication: None required

#### Response

**Success Response (200)**
```json
{
  "success": true,
  "message": "Showing all items from the table",
  "data": [
    {
      "question": "<question_text>",
      "answer": "<answer_text>"
    }
  ]
}
```

**Error Responses**
- 404: No FAQs found
```json
{
  "success": false,
  "message": "No items have been found"
}
```
- 500: Server error
```json
{
  "success": false,
  "message": "A server error occurred..."
}
```

### POST /feedback

Submits new user feedback.

#### Request
- Method: `POST`
- URL: `/feedback`
- Authentication: None required
- Body:
  ```json
  {
    "user_id": "<user_id>",        // required, positive integer
    "feedback_text": "<feedback>"   // required
  }
  ```

#### Response

**Success Response (201)**
```json
{
  "success": true,
  "message": "Feedback added successfully.",
  "data": {
    "user_id": "<user_id>",
    "feedback_text": "<feedback_text>"
  }
}
```

**Error Responses**
- 400: Missing required fields
```json
{
  "success": false,
  "message": "Your POST request is missing a required field. The user ID or feedback text is empty."
}
```
- 400: Invalid user ID
```json
{
  "success": false,
  "message": "User ID must be a positive number."
}
```
- 500: Server error
```json
{
  "success": false,
  "message": "A server error occurred while adding feedback."
}
```
## Progress Endpoints

### GET /progress

Retrieves the complete learning progress history for the authenticated user.

#### Request
- Method: `GET`
- URL: `/progress`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```

#### Response

**Success Response (200)**
```json
{
  "progress": {
    "modules_completed": [1, 2, 3],
    "quizzes_completed": [1, 2, 4],
    "scores": {
      "quiz_id_1": 85,
      "quiz_id_2": 90,
      "quiz_id_4": 95
    },
    "recent_activity": [
      {
        "type": "quiz",
        "id": 4,
        "score": 95,
        "completed_at": "2024-12-09T10:30:00Z"
      }
    ]
  }
}
```

**Error Responses**
- 401: Unauthorized (missing or invalid token)
- 500: Server error
```json
{
  "message": "Error retrieving progress",
  "error": "<error details>"
}
```

### POST /progress/module

Marks a specific module as completed for the authenticated user.

#### Request
- Method: `POST`
- URL: `/progress/module`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Body:
  ```json
  {
    "module_id": "<module_id>"    // required, integer
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "message": "Module progress updated successfully"
}
```

**Error Responses**
- 400: Missing module ID
```json
{
  "message": "Module ID is required"
}
```
- 401: Unauthorized (missing or invalid token)
- 500: Server error
```json
{
  "message": "Error updating module progress",
  "error": "<error details>"
}
```

### POST /progress/quiz

Records a quiz completion with its score for the authenticated user.

#### Request
- Method: `POST`
- URL: `/progress/quiz`
- Authentication: Required (JWT Bearer Token)
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Body:
  ```json
  {
    "module_id": "<module_id>",    // required, integer
    "quiz_id": "<quiz_id>",        // required, integer
    "score": "<score>"             // required, integer between 0 and 100
  }
  ```

#### Response

**Success Response (200)**
```json
{
  "message": "Quiz progress updated successfully"
}
```

**Error Responses**
- 400: Missing required fields
```json
{
  "message": "Module ID, Quiz ID, and score are required"
}
```
- 400: Invalid score
```json
{
  "message": "Score must be between 0 and 100"
}
```
- 401: Unauthorized (missing or invalid token)
- 500: Server error
```json
{
  "message": "Error updating quiz progress",
  "error": "<error details>"
}
```

### Progress Notes

1. Data Format:
   - All timestamps are in ISO 8601 format (e.g., "2024-12-09T10:30:00Z")
   - Scores must be integers between 0 and 100
   - Module and Quiz IDs must be positive integers

2. Progress Tracking:
   - Progress entries are unique per user, module, and quiz combination
   - Submitting progress for an existing entry will update it with:
     - New completion time
     - New score (for quizzes)
   - Recent activity is ordered by completion date, most recent first

3. Authentication:
   - All progress endpoints require a valid JWT token
   - Token must be included in Authorization header as Bearer token

