// AliExpress API Configuration
// Get your API key from: https://rapidapi.com/aliexpress-business-api/api/aliexpress-business-api

export const ALIEXPRESS_CONFIG = {
  RAPIDAPI_KEY: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '60c5353658msheb47e1595f9c783p1861dajsn771ccb0aec1f',
  RAPIDAPI_HOST: 'aliexpress-business-api.p.rapidapi.com',
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_COUNTRY: 'US',
  DEFAULT_LANG: 'en_US',
};
