const express = require('express');
const router = express.Router();
const { getInfo, getStatus, downloadSample, testError } = require('../controllers/apiController');

router.get('/info', getInfo);
router.get('/status', getStatus);
router.get('/download-sample', downloadSample);
router.get('/test-error', testError);

module.exports = router;
