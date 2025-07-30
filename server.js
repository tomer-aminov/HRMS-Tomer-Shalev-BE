const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

// Import database connection
const connectDB = require('./config/database')

// Import routes
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoutes')

const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
   fs.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(
   cors({
      //origin: 'https://hrms-tomer-shalev-fe.netlify.app',
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
   })
)
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Serve static HTML files from parent directory
app.use('/', express.static(path.join(__dirname, '..')))

// Basic route
app.get('/', (req, res) => {
   res.json({
      message: 'HRMS Backend API is running!',
      status: 'success',
      timestamp: new Date().toISOString()
   })
})

// Health check route
app.get('/health', (req, res) => {
   res.json({
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
   })
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)

// PDF Viewer route
app.get('/pdf-viewer.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'pdf-viewer.html'))
})

// PDF Viewer route (alternative)
app.get('/pdf-viewer', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'pdf-viewer.html'))
})

// Start server
app.listen(PORT, () => {
   console.log(`🚀 HRMS Backend Server is running on port ${PORT}`)
   console.log(`📡 Health check: http://localhost:${PORT}/health`)
   console.log(`👥 Users API: http://localhost:${PORT}/api/users`)
   console.log(`💼 Jobs API: http://localhost:${PORT}/api/jobs`)
   console.log(`📁 Uploads: http://localhost:${PORT}/uploads`)
})

module.exports = app
