const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
         trim: true
      },
      lastName: {
         type: String,
         required: true,
         trim: true
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true
      },
      password: {
         type: String,
         required: true,
         trim: true
      },
      role: {
         type: String,
         enum: ['employee', 'recruiter'],
         default: 'employee'
      },
      phoneNumber: {
         type: String,
         trim: true
      },
      isActive: {
         type: Boolean,
         default: true
      },
      cvFile: {
         fileName: String,
         filePath: String
      }
   },
   {
      timestamps: true
   }
)

const User = mongoose.model('User', userSchema)

module.exports = User
