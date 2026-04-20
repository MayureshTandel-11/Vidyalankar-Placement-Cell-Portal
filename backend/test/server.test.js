import request from 'supertest'
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

app.use(limiter)
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
})

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

app.get('/opportunities', async (_req, res) => {
  try {
    const { readOpportunitiesFile } = await import('./utils/fileHandler.js');
    const opportunities = await readOpportunitiesFile();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to read opportunities' });
  }
});

app.use('/opportunities', authenticateToken, opportunitiesRouter);

describe('API Tests', () => {
  test('GET /health should return ok', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })

  test('POST /api/faculty/login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/faculty/login')
      .send({ email: 'placement_faculty@vsit.edu.in', password: 'Placement_Faculty@123456' })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
  })

  test('POST /api/faculty/login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/faculty/login')
      .send({ email: 'wrong@email.com', password: 'wrong' })
    expect(response.status).toBe(401)
  })

  test('GET /opportunities should return opportunities', async () => {
    const response = await request(app).get('/opportunities')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
