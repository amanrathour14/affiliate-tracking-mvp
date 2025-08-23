module.exports = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Response Messages
  MESSAGES: {
    CLICK_TRACKED: 'Click tracked',
    CONVERSION_TRACKED: 'Conversion tracked',
    INVALID_CLICK: 'Invalid click',
    VALIDATION_FAILED: 'Validation failed',
    DATABASE_ERROR: 'Database error',
    INVALID_AFFILIATE_ID: 'Invalid affiliate ID',
    DUPLICATE_CONVERSION: 'Conversion already tracked for this click',
    SERVER_RUNNING: 'Affiliate tracking API is running'
  },

  // Database Constraints
  DB_CONSTRAINTS: {
    MAX_CLICK_ID_LENGTH: 100,
    MAX_AFFILIATE_NAME_LENGTH: 100,
    MAX_CAMPAIGN_NAME_LENGTH: 100,
    MAX_CURRENCY_LENGTH: 10
  },

  // Validation Rules
  VALIDATION: {
    MIN_AMOUNT: 0.01,
    CURRENCY_CODE_LENGTH: 3,
    SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
  }
};
