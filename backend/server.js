import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import opportunitiesRouter from './routes/opportunities.js'

const app = express()
const PORT = process.env.PORT || (5000 + Math.floor(Math.random() * 500));

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Faculty login endpoint
app.post('/api/faculty/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const credentialsPath = path.join(process.cwd(), 'backend/config/facultyCredentials.json')
    const credentialsData = await fs.readFile(credentialsPath, 'utf8')
    const credentials = JSON.parse(credentialsData)

    if (email === credentials.email && password === credentials.password) {
      const user = {
        email: credentials.email,
        name: 'Faculty',
        role: 'faculty'
      }
      const token = `mock-jwt-token-${Date.now()}`
      res.json({ token, user })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.use('/opportunities', opportunitiesRouter)

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
