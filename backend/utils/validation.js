const { DB_CONSTRAINTS, VALIDATION } = require('../config/constants');

const validateClickParams = (affiliate_id, campaign_id, click_id) => {
  const errors = [];

  if (!affiliate_id || isNaN(affiliate_id) || parseInt(affiliate_id) <= 0) {
    errors.push('affiliate_id must be a positive number');
  }

  if (!campaign_id || isNaN(campaign_id) || parseInt(campaign_id) <= 0) {
    errors.push('campaign_id must be a positive number');
  }

  if (!click_id || typeof click_id !== 'string' || click_id.trim().length === 0) {
    errors.push('click_id must be a non-empty string');
  } else if (click_id.length > DB_CONSTRAINTS.MAX_CLICK_ID_LENGTH) {
    errors.push(`click_id must be less than ${DB_CONSTRAINTS.MAX_CLICK_ID_LENGTH} characters`);
  }

  return errors;
};

const validatePostbackParams = (affiliate_id, click_id, amount, currency) => {
  const errors = [];

  if (!affiliate_id || isNaN(affiliate_id) || parseInt(affiliate_id) <= 0) {
    errors.push('affiliate_id must be a positive number');
  }

  if (!click_id || typeof click_id !== 'string' || click_id.trim().length === 0) {
    errors.push('click_id must be a non-empty string');
  } else if (click_id.length > DB_CONSTRAINTS.MAX_CLICK_ID_LENGTH) {
    errors.push(`click_id must be less than ${DB_CONSTRAINTS.MAX_CLICK_ID_LENGTH} characters`);
  }

  const numAmount = parseFloat(amount);
  if (!amount || isNaN(numAmount) || numAmount < VALIDATION.MIN_AMOUNT) {
    errors.push(`amount must be a number greater than or equal to ${VALIDATION.MIN_AMOUNT}`);
  }

  if (!currency || typeof currency !== 'string' || currency.length !== VALIDATION.CURRENCY_CODE_LENGTH) {
    errors.push(`currency must be a ${VALIDATION.CURRENCY_CODE_LENGTH}-letter currency code (e.g., USD)`);
  } else if (!VALIDATION.SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
    errors.push(`currency must be one of: ${VALIDATION.SUPPORTED_CURRENCIES.join(', ')}`);
  }

  return errors;
};

module.exports = {
  validateClickParams,
  validatePostbackParams
};
