const express = require('express')
const router = express.Router()
const {
   getAllJobs,
   getJobById,
   createJob,
   updateJob,
   deleteJob,
   addUserToJob,
   removeUserFromJob,
   getJobsByTitle
} = require('../controllers/jobController')

// Get all jobs
router.get('/', getAllJobs)

// Get jobs by title (search)
router.get('/search/:title', getJobsByTitle)

// Get single job by ID
router.get('/:id', getJobById)

// Create new job
router.post('/', createJob)

// Update job
router.put('/:id', updateJob)

// Delete job
router.delete('/:id', deleteJob)

// Add user to job
router.post('/:jobId/users', addUserToJob)

// Remove user from job
router.delete('/:jobId/users/:userId', removeUserFromJob)

module.exports = router
