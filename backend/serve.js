import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Example API route
app.get('/api/projects', (req, res) => {
  res.json([
    { id: 1, title: 'Project 1', image: '/project1.jpg' },
    { id: 2, title: 'Project 2', image: '/project2.jpg' },
  ])
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
