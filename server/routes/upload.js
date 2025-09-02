const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const axios = require('axios');
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

// Helper to parse Excel
function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const result = {};
  workbook.SheetNames.forEach(sheet => {
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
    result[sheet] = data;
  });
  return result;
}

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;
  let extractedData = null;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedData = { text: pdfData.text };
    } else if (file.mimetype === 'text/csv') {
      extractedData = await parseCSV(file.path);
    } else if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      extractedData = parseExcel(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Send to AI microservice
    const aiResponse = await axios.post('http://localhost:5001/analyze', {
      data: extractedData
    });

    res.json({
      extractedData,
      aiRecommendations: aiResponse.data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;
