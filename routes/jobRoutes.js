const express = require('express')
const router = express.Router()
const {
   getAllJobs,
   getJobById,
   createJob,
   updateJob,
   deleteJob,
   addPdfFile,
   removePdfFile,
   getJobsByTitle
} = require('../controllers/jobController')

// Get all jobs
router.get('/', getAllJobs)

// Get jobs by title (search)
router.get('/search/:title', getJobsByTitle)

// Get single job
router.get('/:id', getJobById)

// Create new job
router.post('/', createJob)

// Update job
router.put('/:id', updateJob)

// Delete job
router.delete('/:id', deleteJob)

// Add PDF file to job
router.post('/:jobId/pdf', addPdfFile)

// Remove PDF file from job
router.delete('/:jobId/pdf/:fileId', removePdfFile)

module.exports = router
