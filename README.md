### SBA 14: Secure Web Portal

#### Overview

A secure Express.js backend service that provides authentication and private data management for Innovate Inc.'s user portal. This application serves as a single point of entry for user identity management, supporting multiple authentication methods and secure access to personal bookmarks.

---

#### Key Features

1.  Dual Authentication System

- Traditional email/password registration and login
- GitHub OAuth 2.0 integration for third-party authentication
- Secure password hashing using bcrypt

2. User Management

- Unique username and email validation
- Conditional password requirements (only for local authentication)
- Secure session management

3. Bookmark Management

- Private collection of personal bookmarks
- User-specific data isolation
- CRUD operations for bookmark management

4. Security Measures

- Password hashing with salt rounds
- Protected routes requiring authentication
- MongoDB with proper schema validation
- Timestamp tracking for all records

---

#### Technology Stack

- Backend Framework: Express.js
- Database: MongoDB with Mongoose ODM
- Authentication:
- [x] bcrypt for password hashing
- [x] Passport.js for authentication strategies
- [x] GitHub OAuth 2.0 implementation

- Security: Environment variables for sensitive data

---

#### Project Structure

```bash
secure-web-portal/
.
├─ config/
│  ├─ connection.js
│  └─ passport.js
├─ models/
│  ├─ User.js
│  └─ Bookmark.js
├─ routes/
│  ├─ users.js         // local register/login
│  ├─ oauth.js         // GitHub OAuth
│  └─ bookmarks.js     // secure CRUD
├─ utils/
│  └─ auth.js          // signToken + authMiddleware
├─ .env
├─ .gitignore
└─ server.js
                   # Environment variables

```

---

#### Getting Started

- Clone the repository
  `git clone https://github.com/urmee04/secure-web-portal.git`
  `cd secure-web-portal`
- Install dependencies: npm install
- Set up environment variables:

- [x] MONGODB_URI: MongoDB connection string
- [x] JWT_SECRET: super-secret-jwt-key-here
- [x] GITHUB_CLIENT_ID: GitHub OAuth App Client ID
- [x] GITHUB_CLIENT_SECRET: GitHub OAuth App Client Secret
- [x] GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

- Start the server: npm start

---

#### Security Considerations

- Passwords are never stored in plain text
- Authentication required for all data access operations
- User data isolation at the database level
- Secure session management
- Input validation and sanitization

---

#### How to test in Postman

1. Start OAuth login:

- Open in browser as Postman won’t follow redirects for OAuth login easily:
  `http://localhost:3000/auth/github`
- Login with GitHub: GitHub will redirect to /auth/github/callback.
- Receive JWT:
  Browser will show JSON like:

```bash
{
"message": "GitHub login successful",
"token": `<JWT-TOKEN>`,
"user": {
"_id": "",
"username": "",
"email": "",
"githubId": "",
"createdAt": "",
"updatedAt": "",
"__v": 0
 }
}
```

- Use JWT for protected routes: In Postman, add header
- [x] Authorization: Bearer `<JWT_TOKEN_HERE>`

- Then call /api/notes routes or any route protected with authMiddleware.

**Register a user (if don’t have one):**

```bash
Method: POST

URL: http://localhost:3000/api/users/register

Body: JSON (raw)

{
"username": "testuser",
"email": "test@example.com",
"password": "password123"
}

Response: You’ll get { token, user }.
```

**Login a user (to get JWT if already registered):**

```bash
Method: POST
URL: http://localhost:3000/api/users/login
Body: JSON (raw)

{
"email": "test@example.com",
"password": "password123"
}

Response: { token, user }
Copy the token value.
```

2. Set Authorization Header in Postman

- For all bookmark routes, add a header:
- Key Value: Authorization Bearer YOUR_JWT_TOKEN
- Replace YOUR_JWT_TOKEN with the token you got from login/register.

3. Test Bookmark Routes

**Create a Bookmark**

```bash
Method: POST
URL: http://localhost:3000/api/bookmarks
Body: JSON (raw)

{
"title": "Google",
"url": "https://www.google.com"
}
Expected: 201 Created, returns the created bookmark including user field.
```

**Get All Bookmarks**

```bash
Method: GET
URL: http://localhost:3000/api/bookmarks
Expected: 200 OK, returns array of bookmarks for logged-in user.
```

**Get Single Bookmark**

```bash
Method: GET
URL: http://localhost:3000/api/bookmarks/:id
Replace :id with a bookmark ID from the “Get All” response.
Expected: 200 OK, returns that bookmark.
If not yours: 404 Not Found.
```

**Update Bookmark**

```bash
Method: PUT
URL: http://localhost:3000/api/bookmarks/:id
Body: JSON (raw)

{
"title": "Google Search",
"url": "https://www.google.com/search"
}
Expected: 200 OK, returns updated bookmark.
If empty body: 400 “Nothing to update”
If not yours: 404 Not Found.
```

**Delete Bookmark**

```bash
Method: DELETE
URL: http://localhost:3000/api/bookmarks/:id
Expected: 200 OK, { message: "Deleted successfully" }
If not yours: 404 Not Found.
```

---

#### References

My primary resource for completing the project was the code from our class lessons, [Bryan Santos](https://www.linkedin.com/in/bryandevelops/) code sugestions shared in slack. Additionally, I used the resources mentioned below to deepen my understanding of the concepts and code flow

- [mongoose](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/mongoose)

- [mongoDB Bootcamp](https://generalmotors.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065064#overview)

- [express.js Middleware](https://expressjs.com/en/guide/using-middleware.html)
