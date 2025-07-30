const Job = require('../models/Job')

// Get all jobs
exports.getAllJobs = async (req, res) => {
   try {
      const jobs = await Job.find().populate(
         'users',
         'firstName lastName email role phoneNumber'
      )
      res.status(200).json({
         success: true,
         data: jobs
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error fetching jobs',
         error: error.message
      })
   }
}

// Get single job by ID
exports.getJobById = async (req, res) => {
   try {
      const job = await Job.findById(req.params.id).populate('users')

      console.log(
         'Job data with populated users:',
         JSON.stringify(job, null, 2)
      )

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      res.status(200).json({
         success: true,
         data: job
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error fetching job',
         error: error.message
      })
   }
}

// Create new job
exports.createJob = async (req, res) => {
   try {
      const job = await Job.create(req.body)
      res.status(201).json({
         success: true,
         data: job
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error creating job',
         error: error.message
      })
   }
}

// Update job
exports.updateJob = async (req, res) => {
   try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      })

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      res.status(200).json({
         success: true,
         data: job
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error updating job',
         error: error.message
      })
   }
}

// Delete job
exports.deleteJob = async (req, res) => {
   try {
      const job = await Job.findByIdAndDelete(req.params.id)

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      res.status(200).json({
         success: true,
         message: 'Job deleted successfully'
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error deleting job',
         error: error.message
      })
   }
}

// Add user to job
exports.addUserToJob = async (req, res) => {
   try {
      const { jobId } = req.params
      const { userId } = req.body

      const job = await Job.findById(jobId)

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      // בדיקה אם המשתמש כבר קיים במשרה
      if (job.users.includes(userId)) {
         return res.status(400).json({
            success: false,
            message: 'User is already assigned to this job'
         })
      }

      job.users.push(userId)
      await job.save()

      // החזרת המשרה עם פרטי המשתמשים
      const populatedJob = await Job.findById(jobId).populate(
         'users',
         'firstName lastName email role phoneNumber'
      )

      res.status(200).json({
         success: true,
         data: populatedJob
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error adding user to job',
         error: error.message
      })
   }
}

// Remove user from job
exports.removeUserFromJob = async (req, res) => {
   try {
      const { jobId, userId } = req.params

      const job = await Job.findById(jobId)

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      job.users = job.users.filter((user) => user.toString() !== userId)
      await job.save()

      // החזרת המשרה עם פרטי המשתמשים
      const populatedJob = await Job.findById(jobId).populate(
         'users',
         'firstName lastName email role phoneNumber'
      )

      res.status(200).json({
         success: true,
         data: populatedJob
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error removing user from job',
         error: error.message
      })
   }
}

// Get jobs by title (search functionality)
exports.getJobsByTitle = async (req, res) => {
   try {
      const { title } = req.params
      const jobs = await Job.find({
         title: { $regex: title, $options: 'i' }
      }).populate('users', 'firstName lastName email role phoneNumber')

      res.status(200).json({
         success: true,
         data: jobs
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error searching jobs by title',
         error: error.message
      })
   }
}
