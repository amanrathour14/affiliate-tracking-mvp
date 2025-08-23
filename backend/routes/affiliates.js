const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all affiliates
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM affiliates ORDER BY name');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Get affiliate clicks
router.get('/:id/clicks', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid affiliate ID' 
      });
    }

    const [rows] = await db.execute(`
      SELECT c.*, cam.name as campaign_name 
      FROM clicks c 
      JOIN campaigns cam ON c.campaign_id = cam.id 
      WHERE c.affiliate_id = ? 
      ORDER BY c.timestamp DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Get affiliate conversions
router.get('/:id/conversions', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid affiliate ID' 
      });
    }

    const [rows] = await db.execute(`
      SELECT conv.*, c.click_id as original_click_id, cam.name as campaign_name
      FROM conversions conv
      JOIN clicks c ON conv.click_id = c.id
      JOIN campaigns cam ON c.campaign_id = cam.id
      WHERE c.affiliate_id = ?
      ORDER BY conv.timestamp DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
