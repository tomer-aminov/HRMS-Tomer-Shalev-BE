const Job = require('../models/Job')

// Get all jobs
exports.getAllJobs = async (req, res) => {
   try {
      const jobs = await Job.find().populate(
         'pdfFiles.uploadedBy',
         'firstName lastName'
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
      const job = await Job.findById(req.params.id).populate(
         'pdfFiles.uploadedBy',
         'firstName lastName'
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

// Add PDF file to job
exports.addPdfFile = async (req, res) => {
   try {
      const { jobId } = req.params
      const { fileName, filePath, uploadedBy } = req.body

      const job = await Job.findById(jobId)

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      job.pdfFiles.push({
         fileName,
         filePath,
         uploadedBy
      })

      await job.save()

      res.status(200).json({
         success: true,
         data: job
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error adding PDF file',
         error: error.message
      })
   }
}

// Remove PDF file from job
exports.removePdfFile = async (req, res) => {
   try {
      const { jobId, fileId } = req.params

      const job = await Job.findById(jobId)

      if (!job) {
         return res.status(404).json({
            success: false,
            message: 'Job not found'
         })
      }

      job.pdfFiles = job.pdfFiles.filter(
         (file) => file._id.toString() !== fileId
      )
      await job.save()

      res.status(200).json({
         success: true,
         data: job
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error removing PDF file',
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
      }).populate('pdfFiles.uploadedBy', 'firstName lastName')

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
