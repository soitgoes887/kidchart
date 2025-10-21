// AWS Lambda Function URLs from environment variables
export const API_CONFIG = {
  saveUrl: import.meta.env.VITE_SAVE_URL,
  loadUrl: import.meta.env.VITE_LOAD_URL,
};

export const SHARE_URL_BASE = import.meta.env.VITE_SHARE_URL_BASE || 'https://kidchart.com';
