const User = require('../models/User')

// Login user
const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
         return res.status(401).json({
            success: false,
            message: 'פרטי התחברות שגויים'
         })
      }

      // Check if user is active
      if (!user.isActive) {
         return res.status(401).json({
            success: false,
            message: 'חשבון המשתמש אינו פעיל'
         })
      }

      // Check password (simple comparison for now)
      if (user.password !== password) {
         return res.status(401).json({
            success: false,
            message: 'פרטי התחברות שגויים'
         })
      }

      // Return user without password
      const userWithoutPassword = user.toObject()
      delete userWithoutPassword.password

      res.json({
         success: true,
         message: 'התחברות הצליחה',
         data: userWithoutPassword
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'שגיאה בשרת',
         error: error.message
      })
   }
}

// Get all users
const getUsers = async (req, res) => {
   try {
      const users = await User.find()
         .select('-password')
         .sort({ createdAt: -1 })
      res.json({
         success: true,
         data: users
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Server error',
         error: error.message
      })
   }
}

// Get users by role
const getUsersByRole = async (req, res) => {
   try {
      const { role } = req.params
      const users = await User.find({ role })
         .select('-password')
         .sort({ createdAt: -1 })

      res.json({
         success: true,
         data: users
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Server error',
         error: error.message
      })
   }
}

// Get single user
const getUserById = async (req, res) => {
   try {
      const user = await User.findById(req.params.id).select('-password')
      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }
      res.json({
         success: true,
         data: user
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Server error',
         error: error.message
      })
   }
}

// Create new user
const createUser = async (req, res) => {
   try {
      const user = await User.create(req.body)
      const userWithoutPassword = user.toObject()
      delete userWithoutPassword.password

      res.status(201).json({
         success: true,
         message: 'User created successfully',
         data: userWithoutPassword
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error creating user',
         error: error.message
      })
   }
}

// Update user
const updateUser = async (req, res) => {
   try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      }).select('-password')

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      res.json({
         success: true,
         message: 'User updated successfully',
         data: user
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error updating user',
         error: error.message
      })
   }
}

// Delete user
const deleteUser = async (req, res) => {
   try {
      const user = await User.findByIdAndDelete(req.params.id)

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      res.json({
         success: true,
         message: 'User deleted successfully'
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Error deleting user',
         error: error.message
      })
   }
}

// Add CV file to user
const addCvFile = async (req, res) => {
   try {
      const { userId } = req.params
      const { fileName, filePath } = req.body

      const user = await User.findById(userId)

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      user.cvFile = {
         fileName,
         filePath
      }

      await user.save()

      res.status(200).json({
         success: true,
         data: user
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error adding CV file',
         error: error.message
      })
   }
}

// Remove CV file from user
const removeCvFile = async (req, res) => {
   try {
      const { userId } = req.params
      const fs = require('fs')
      const path = require('path')

      const user = await User.findById(userId)

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      // Delete physical file if it exists
      if (user.cvFile && user.cvFile.filePath) {
         const filePath = path.join(__dirname, '..', user.cvFile.filePath)
         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
         }
      }

      user.cvFile = undefined
      await user.save()

      res.status(200).json({
         success: true,
         message: 'הקובץ נמחק בהצלחה',
         data: user
      })
   } catch (error) {
      res.status(400).json({
         success: false,
         message: 'Error removing CV file',
         error: error.message
      })
   }
}

// View PDF file
const viewPdfFile = async (req, res) => {
   try {
      const { userId } = req.params
      const fs = require('fs')
      const path = require('path')

      const user = await User.findById(userId)

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      // בדיקה אם יש קובץ CV
      if (!user.cvFile || !user.cvFile.filePath) {
         return res.status(404).json({
            success: false,
            message: 'לא נמצא קובץ CV למשתמש זה'
         })
      }

      // בניית הנתיב המלא לקובץ
      const filePath = path.join(__dirname, '..', user.cvFile.filePath)

      // בדיקה אם הקובץ קיים
      if (!fs.existsSync(filePath)) {
         return res.status(404).json({
            success: false,
            message: 'הקובץ לא נמצא בשרת'
         })
      }

      // בדיקת סוג הקובץ
      const fileExtension = path.extname(filePath).toLowerCase()
      if (fileExtension !== '.pdf') {
         return res.status(400).json({
            success: false,
            message: 'הקובץ אינו בפורמט PDF'
         })
      }

      // קריאת הקובץ
      const fileBuffer = fs.readFileSync(filePath)
      const fileName = user.cvFile.fileName || 'document.pdf'

      // קבלת זמן העדכון האחרון של הקובץ
      const stats = fs.statSync(filePath)
      const lastModified = stats.mtime.getTime()

      // הגדרת headers לתצוגת PDF עם מניעת cache
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
      res.setHeader('Content-Length', fileBuffer.length)
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
      res.setHeader('Last-Modified', stats.mtime.toUTCString())
      res.setHeader('ETag', `"${lastModified}"`)

      res.send(fileBuffer)
   } catch (error) {
      console.error('שגיאה בצפייה בקובץ PDF:', error)
      res.status(500).json({
         success: false,
         message: 'שגיאה בשרת בטעינת הקובץ',
         error: error.message
      })
   }
}

// Get file info for PDF viewer
const getFileInfo = async (req, res) => {
   try {
      const { userId } = req.params
      const fs = require('fs')
      const path = require('path')

      const user = await User.findById(userId)

      if (!user) {
         return res.status(404).json({
            success: false,
            message: 'User not found'
         })
      }

      // בדיקה אם יש קובץ CV
      if (!user.cvFile || !user.cvFile.filePath) {
         return res.status(404).json({
            success: false,
            message: 'לא נמצא קובץ CV למשתמש זה'
         })
      }

      // בניית הנתיב המלא לקובץ
      const filePath = path.join(__dirname, '..', user.cvFile.filePath)

      // בדיקה אם הקובץ קיים
      if (!fs.existsSync(filePath)) {
         return res.status(404).json({
            success: false,
            message: 'הקובץ לא נמצא בשרת'
         })
      }

      // קבלת מידע על הקובץ
      const stats = fs.statSync(filePath)
      const fileSize = stats.size
      const fileExtension = path.extname(filePath).toLowerCase()

      // בדיקה אם זה קובץ PDF
      if (fileExtension !== '.pdf') {
         return res.status(400).json({
            success: false,
            message: 'הקובץ אינו בפורמט PDF'
         })
      }

      // יצירת hash פשוט של הקובץ (גודל + זמן עדכון)
      const fileHash = `${fileSize}-${stats.mtime.getTime()}`

      res.json({
         success: true,
         data: {
            fileName: user.cvFile.fileName,
            filePath: user.cvFile.filePath,
            fileSize: fileSize,
            fileType: 'application/pdf',
            lastModified: stats.mtime,
            lastModifiedTimestamp: stats.mtime.getTime(),
            fileHash: fileHash,
            viewUrl: `/api/users/${userId}/view-pdf`
         }
      })
   } catch (error) {
      console.error('שגיאה בקבלת מידע על הקובץ:', error)
      res.status(500).json({
         success: false,
         message: 'שגיאה בשרת',
         error: error.message
      })
   }
}

module.exports = {
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
}
