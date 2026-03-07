# Expense Tracker - Backend Project with Express.js

## Syllabus Topics Covered (First Evaluation)

### ✅ 1. HTTP Module & Express.js
- Using Express.js framework instead of raw HTTP module
- Creating server with `app.listen()`
- Handling requests and responses

### ✅ 2. NPM (Node Package Manager)
- `package.json` configuration
- Installing and managing dependencies
- Scripts for running the application

### ✅ 3. Different Frameworks of Node.js
- Using **Express.js** framework
- MVC architecture implementation

### ✅ 4. Serving Static Files
- `express.static()` middleware in `index.js`
- Serving HTML, CSS, and JS files from `/public` folder
- See: `index.js` line with `express.static()`

### ✅ 5. Routing
**Routing Methods:**
- GET, POST, PUT, DELETE methods
- See: `routes/expenseRoutes.js` and `routes/fileRoutes.js`

**Route Paths:**
- Simple paths: `/api/info`, `/api/status`
- Dynamic paths: `/expenses/:id`

**Route Parameters:**
- `:id` parameter in expense routes
- Access via `req.params.id`
- Example: `GET /expenses/:id`, `PUT /expenses/:id`, `DELETE /expenses/:id`

**Route Handlers:**
- Single handler: `app.get('/api/info', handler)`
- Multiple handlers: `router.get('/', auth, fetchExpenses)`
- See: All controller files

**Query Parameters:**
- Filtering with `?sort=asc&limit=5`
- Access via `req.query`
- Example: `GET /expenses?sort=desc&limit=10`

### ✅ 6. Response Methods
Demonstrated in various controllers:
- `res.send()` - Send string response
- `res.json()` - Send JSON response
- `res.sendFile()` - Send file
- `res.download()` - Download file
- `res.status()` - Set status code
- Example locations: `index.js`, `controllers/fileController.js`

### ✅ 7. Handling Static Pages with File Stream
- Static file serving with `express.static()`
- File streaming for downloads in `fileController.js`
- See: `streamLogs()` and `exportExpensesStream()` methods

### ✅ 8. Handling Exceptions
- Try-catch blocks in models
- Error handling middleware in `middleware/errorMiddleware.js`
- Custom AppError class
- 404 Not Found handler

### ✅ 9. Middleware Lifecycle

**Application-Level Middleware:**
- `requestLogger` - Logs all requests with file streams
- `requestTimer` - Measures request duration
- `corsMiddleware` - Handles CORS
- See: `middleware/loggingMiddleware.js`

**Router-Level Middleware:**
- `auth` middleware applied to expense routes
- Mounted on specific paths: `/auth`, `/expenses`, `/files`
- See: `middleware/authMiddleware.js`

**Error-Handling Middleware:**
- Must have 4 parameters: `(err, req, res, next)`
- `errorHandler` - Centralized error handling
- `notFoundHandler` - 404 handler
- See: `middleware/errorMiddleware.js`

**Third-Party Middleware:**
- `express.json()` - Parse JSON
- `express.urlencoded()` - Parse form data
- Custom CORS middleware (third-party like)

### ✅ 10. File Module
**Synchronous Operations:**
- `fs.readFileSync()` - Read file
- `fs.writeFileSync()` - Write file
- `fs.appendFileSync()` - Append to file
- `fs.existsSync()` - Check file exists
- `fs.statSync()` - Get file stats
- See: `models/expenseModel.js`, `models/userModel.js`

**Asynchronous Operations:**
- `fs.promises.readFile()` - Async read
- `fs.promises.writeFile()` - Async write
- See: `getExpensesAsync()`, `saveExpensesAsync()`

### ✅ 11. File Streaming
**Read Streams:**
- `fs.createReadStream()` for reading large files
- Piping streams to response: `readStream.pipe(res)`
- See: `fileController.js` - `streamLogs()`

**Write Streams:**
- `fs.createWriteStream()` for writing logs
- Streaming CSV export directly to response
- See: `fileController.js` - `exportExpensesStream()`
- See: `loggingMiddleware.js` - log file writing

---

## Project Structure

```
Expense_Tracker/
├── index.js                      # Main server with all middleware
├── package.json                  # NPM configuration
├── controllers/
│   ├── authController.js         # Login/Register handlers
│   ├── expenseController.js      # CRUD operations with route params
│   └── fileController.js         # File streaming & download
├── models/
│   ├── expenseModel.js           # File operations (sync & async)
│   └── userModel.js              # File operations (sync & async)
├── routes/
│   ├── authRoutes.js             # Auth routes
│   ├── expenseRoutes.js          # Expense CRUD routes
│   └── fileRoutes.js             # File streaming routes
├── middleware/
│   ├── authMiddleware.js         # Router-level auth
│   ├── loggingMiddleware.js      # Application-level logging
│   └── errorMiddleware.js        # Error-handling middleware
├── public/                        # Static files served by Express
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── style.css
│   └── *.js files
└── data/
    ├── users.json                # User data
    ├── expenses.json             # Expense data
    ├── activity.log              # Request logs (streams)
    └── expense_changes.log       # Change logs
```

---

## API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Expense Routes (`/expenses`)
- `GET /expenses` - Fetch all expenses (supports `?sort=asc&limit=5`)
- `POST /expenses` - Add new expense
- `GET /expenses/:id` - Get single expense by ID
- `PUT /expenses/:id` - Update expense by ID
- `DELETE /expenses/:id` - Delete expense by ID

### File Operations (`/files`)
- `GET /files/logs` - Stream activity log file
- `GET /files/download` - Download expenses as CSV
- `GET /files/export-stream` - Export expenses using streams
- `GET /files/info/:filename` - Get file information

### System Routes
- `GET /` - Serve login page (static)
- `GET /api/info` - API information
- `GET /api/status` - Server status
- `GET /api/test-error` - Test error handling

---

## Running the Project

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs at http://localhost:3000
```

---

## Testing Syllabus Features

### 1. Test Route Parameters
```bash
GET http://localhost:3000/expenses/1234567890
PUT http://localhost:3000/expenses/1234567890
DELETE http://localhost:3000/expenses/1234567890
```

### 2. Test Query Parameters
```bash
GET http://localhost:3000/expenses?sort=asc&limit=5
```

### 3. Test File Streaming
```bash
GET http://localhost:3000/files/logs
GET http://localhost:3000/files/export-stream
```

### 4. Test File Download
```bash
GET http://localhost:3000/files/download
```

### 5. Test Error Handling
```bash
GET http://localhost:3000/api/test-error
GET http://localhost:3000/invalid-route
```

### 6. Test Response Methods
```bash
GET http://localhost:3000/api/info        # res.send()
GET http://localhost:3000/api/status      # res.json()
GET http://localhost:3000/api/download-sample  # res.sendFile()
```

---

## Key Concepts Demonstrated

1. **Middleware Lifecycle**: Application → Router → Error-handling
2. **File Module**: Sync/Async operations, streams
3. **Routing**: Methods, parameters, handlers
4. **Response Methods**: send(), json(), sendFile(), download()
5. **Static Files**: express.static() middleware
6. **File Streaming**: Read/Write streams, piping
7. **Exception Handling**: Try-catch, error middleware
8. **Request/Response**: Headers, body, params, query

---

## Notes for Evaluation

✅ All syllabus topics strictly implemented
✅ File streaming with createReadStream/createWriteStream
✅ File module (fs) with sync and async operations
✅ All types of middleware (application, router, error-handling)
✅ Route parameters (:id) and query parameters (?sort=asc)
✅ Different response methods demonstrated
✅ Static file serving with express.static()
✅ Proper MVC architecture maintained

**Important**: All topics mentioned by your teacher are included!
