module.exports = function generateReport(analysis) {
  // For now, just return the analysis as report
  return {
    summary: analysis.summary,
    details: analysis.details,
    generatedAt: new Date()
  };
};