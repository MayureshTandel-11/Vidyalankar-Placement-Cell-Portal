import express from 'express'
import crypto from 'node:crypto'
import Joi from 'joi'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { readOpportunitiesFile, writeOpportunitiesFile } from '../utils/fileHandler.js'

const router = express.Router()

const window = new JSDOM('').window
const DOMPurifyInstance = DOMPurify(window)

const sanitize = (str) => DOMPurifyInstance.sanitize(str, { ALLOWED_TAGS: [] })

const opportunitySchema = Joi.object({
  announcementHeading: Joi.string().min(1).max(200).required(),
  type: Joi.string().valid('Internship', 'Placement').required(),
  description: Joi.string().max(10000).allow(''),
  eligibilityCriteria: Joi.string().max(1000).allow(''),
  lastDate: Joi.date().iso().required(),
  department: Joi.string().allow(''),
  departments: Joi.array().items(Joi.string()).allow(null),
  yearEligibility: Joi.array().items(Joi.string()).allow(null),
  applicationLink: Joi.string().uri().required(),
  createdBy: Joi.string().allow(''),
  status: Joi.string().allow('')
})

function nowIso() {
  return new Date().toISOString()
}

function computeStatus(lastDate) {
  const today = new Date().toISOString().slice(0, 10)
  return lastDate < today ? 'archived' : 'active'
}

router.get('/', async (_req, res) => {
  try {
    const opportunities = await readOpportunitiesFile()
    res.json(opportunities)
  } catch (error) {
    res.status(500).json({ message: 'Failed to read opportunities' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { error, value } = opportunitySchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const payload = value
    const opportunities = await readOpportunitiesFile()
    const newOpportunity = {
      _id: crypto.randomUUID(),
      announcementHeading: sanitize(payload.announcementHeading),
      type: payload.type,
      description: sanitize(payload.description || ''),
      eligibilityCriteria: sanitize(payload.eligibilityCriteria || ''),
      lastDate: payload.lastDate,
      department: payload.departments ? 'Multiple' : (payload.department || 'Broadcast to All'),
      departments: payload.departments,
      yearEligibility: payload.yearEligibility,
      applicationLink: payload.applicationLink,
      createdBy: payload.createdBy || req.user?.email || 'unknown',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      status: payload.status || computeStatus(payload.lastDate),
    }

    opportunities.push(newOpportunity)
    await writeOpportunitiesFile(opportunities)
    return res.status(201).json(newOpportunity)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create opportunity' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { error, value } = opportunitySchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const id = req.params.id
    const payload = value
    const opportunities = await readOpportunitiesFile()
    const index = opportunities.findIndex((item) => item._id === id)

    if (index === -1) return res.status(404).json({ message: 'Opportunity not found' })

    const current = opportunities[index]
    const next = {
      ...current,
      announcementHeading: payload.announcementHeading ? sanitize(payload.announcementHeading) : current.announcementHeading,
      type: payload.type || current.type,
      description: payload.description !== undefined ? sanitize(payload.description) : current.description,
      eligibilityCriteria: payload.eligibilityCriteria !== undefined ? sanitize(payload.eligibilityCriteria) : current.eligibilityCriteria,
      lastDate: payload.lastDate || current.lastDate,
      department: payload.departments ? 'Multiple' : (payload.department || current.department),
      departments: payload.departments !== undefined ? payload.departments : current.departments,
      yearEligibility: payload.yearEligibility !== undefined ? payload.yearEligibility : current.yearEligibility,
      applicationLink: payload.applicationLink || current.applicationLink,
      _id: current._id,
      updatedAt: nowIso(),
    }
    if (next.lastDate) {
      next.status = computeStatus(next.lastDate)
    }

    opportunities[index] = next
    await writeOpportunitiesFile(opportunities)
    return res.json(next)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update opportunity' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const opportunities = await readOpportunitiesFile()
    const filtered = opportunities.filter((item) => item._id !== id)
    if (filtered.length === opportunities.length) {
      return res.status(404).json({ message: 'Opportunity not found' })
    }
    await writeOpportunitiesFile(filtered)
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete opportunity' })
  }
})

export default router
