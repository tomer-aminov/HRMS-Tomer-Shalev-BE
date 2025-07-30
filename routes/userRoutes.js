const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const {
   loginUser,
   getUsers,
   getUsersByRole,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
   addCvFile,
   removeCvFile,
   viewPdfFile,
   getFileInfo
} = require('../controllers/userController')

// Configure multer for file uploads
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      const userId = req.params.userId
      const userDir = path.join(__dirname, '..', 'uploads', userId)

      // Create user directory if it doesn't exist
      if (!fs.existsSync(userDir)) {
         fs.mkdirSync(userDir, { recursive: true })
      }

      cb(null, userDir)
   },
   filename: function (req, file, cb) {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(
         null,
         file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      )
   }
})

const fileFilter = (req, file, cb) => {
   // Check file type
   const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
   ]

   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
   } else {
      cb(new Error('סוג הקובץ לא נתמך. אנא בחר קובץ PDF, DOC או DOCX'), false)
   }
}

const upload = multer({
   storage: storage,
   fileFilter: fileFilter,
   limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
   }
})

// POST login
router.post('/login', loginUser)

// GET all users
router.get('/', getUsers)

// GET users by role
router.get('/role/:role', getUsersByRole)

// GET single user
router.get('/:id', getUserById)

// POST create new user
router.post('/', createUser)

// PUT update user
router.put('/:id', updateUser)

// DELETE user
router.delete('/:id', deleteUser)

// Add CV file to user (with file upload)
router.post('/:userId/cv-upload', upload.single('cvFile'), async (req, res) => {
   try {
      if (!req.file) {
         return res.status(400).json({
            success: false,
            message: 'לא נבחר קובץ להעלאה'
         })
      }

      const { userId } = req.params
      const fileName = req.file.originalname
      const filePath = `/uploads/${userId}/${req.file.filename}`

      // Update user with file info
      const user = await require('../models/User').findById(userId)
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      user.cvFile = {
         fileName: fileName,
         filePath: filePath
      }

      await user.save()

      res.status(200).json({
         success: true,
         message: 'הקובץ הועלה בהצלחה',
         data: {
            fileName: fileName,
            filePath: filePath
         }
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error uploading CV file',
         error: error.message
      })
   }
})

// Add CV file to user (metadata only)
router.post('/:userId/cv', addCvFile)

// Remove CV file from user
router.delete('/:userId/cv', removeCvFile)

// View PDF file
router.get('/:userId/view-pdf', viewPdfFile)

// Get file info for PDF viewer
router.get('/:userId/file-info', getFileInfo)

module.exports = router
