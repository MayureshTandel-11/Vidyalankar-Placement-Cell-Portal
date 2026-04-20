import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import opportunitiesRouter from './routes/opportunities.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

app.use(limiter)
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.'
})

// Faculty login endpoint
app.post('/api/faculty/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const credentialsPath = path.join(__dirname, 'config/facultyCredentials.json')
    const credentialsData = await fs.readFile(credentialsPath, 'utf8')
    const credentials = JSON.parse(credentialsData)

    if (email !== credentials.email) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, credentials.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = {
      email: credentials.email,
      name: 'Faculty',
      role: 'faculty'
    }
    const token = jwt.sign(user, 'your-secret-key', { expiresIn: '24h' })
    res.json({ token, user })
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
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
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
