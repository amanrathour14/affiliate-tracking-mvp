const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateClickParams, validatePostbackParams } = require('../utils/validation');

// Track click
router.get('/click', async (req, res, next) => {
  try {
    const { affiliate_id, campaign_id, click_id } = req.query;

    // Validate parameters
    const validationErrors = validateClickParams(affiliate_id, campaign_id, click_id);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Insert click (ignore if duplicate due to UNIQUE constraint)
    await db.execute(`
      INSERT IGNORE INTO clicks (affiliate_id, campaign_id, click_id) 
      VALUES (?, ?, ?)
    `, [affiliate_id, campaign_id, click_id]);

    res.json({ status: 'success', message: 'Click tracked' });
  } catch (error) {
    next(error);
  }
});

// Track conversion (postback)
router.get('/postback', async (req, res, next) => {
  try {
    const { affiliate_id, click_id, amount, currency } = req.query;

    // Validate parameters
    const validationErrors = validatePostbackParams(affiliate_id, click_id, amount, currency);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Validate that click exists for given affiliate
    const [clickRows] = await db.execute(`
      SELECT id FROM clicks 
      WHERE affiliate_id = ? AND click_id = ?
    `, [affiliate_id, click_id]);

    if (clickRows.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid click' 
      });
    }

    const clickDbId = clickRows[0].id;

    // Check if conversion already exists
    const [existingConversion] = await db.execute(`
      SELECT id FROM conversions WHERE click_id = ?
    `, [clickDbId]);

    if (existingConversion.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'Conversion already tracked for this click'
      });
    }

    // Insert conversion
    await db.execute(`
      INSERT INTO conversions (click_id, amount, currency) 
      VALUES (?, ?, ?)
    `, [clickDbId, amount, currency]);

    res.json({ status: 'success', message: 'Conversion tracked' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
