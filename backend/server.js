import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import opportunitiesRouter from './routes/opportunities.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5001;

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Faculty login endpoint
app.post('/api/faculty/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const credentialsPath = path.join(__dirname, 'config/facultyCredentials.json')
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  if (!token.startsWith('mock-jwt-token-')) {
    return res.status(403).json({ error: 'Invalid token' })
  }
  req.user = { role: 'faculty' }
  next()
}

// Public GET opportunities for student portal
app.get('/opportunities', async (_req, res) => {
  try {
    const { readOpportunitiesFile } = await import('./utils/fileHandler.js');
    const opportunities = await readOpportunitiesFile();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read opportunities' });
  }
});

// Protected mutations (POST/PUT/DELETE) for faculty
app.use('/opportunities', authenticateToken, opportunitiesRouter);

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
