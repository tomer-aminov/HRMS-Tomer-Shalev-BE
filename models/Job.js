const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },
   description: {
      type: String,
      required: true,
      trim: true
   },
   pdfFiles: [
      {
         fileName: {
            type: String,
            required: true
         },
         filePath: {
            type: String,
            required: true
         },
         uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
         }
      }
   ]
})

module.exports = mongoose.model('Job', jobSchema)
