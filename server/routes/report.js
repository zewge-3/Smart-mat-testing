const express = require('express');
const Report = require('../models/Report');
const fetch = require('node-fetch'); // npm install node-fetch@2
const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { filename, userId } = req.body;
  // In production, read and parse the file here

  // Send dummy data to AI microservice
  const aiRes = await fetch('http://localhost:5001/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  });
  const analysis = await aiRes.json();

  // Save report
  const report = new Report({ user: userId, filename, analysis });
  await report.save();

  res.json(report);
});

router.get('/:id', async (req, res) => {
  const report = await Report.findById(req.params.id);
  res.json(report);
});

module.exports = router;