import express from 'express';
import path from 'path';

const router = express.Router();

// Serve static files from build directory
// For S3 deployment, this would be handled by S3 + CloudFront
router.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA routing
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

export default router;
