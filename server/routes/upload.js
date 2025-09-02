const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const csv = require('csv-parser');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to parse CSV
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  let extractedData = null;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  if (file.mimetype === 'application/pdf') {
    // Parse PDF
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    extractedData = pdfData.text; // Extracted text from PDF
    // You may want to further parse tables or values from the text
  } else if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    // Parse CSV
    extractedData = await parseCSV(file.path);
    // For Excel, use a library like xlsx
  } else {
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  // Send extracted data to AI microservice (mock)
  // Example: POST to http://localhost:5001/analyze with { data: extractedData }

  // For demonstration, just echo extractedData
  res.json({ extractedData });
});

module.exports = router;