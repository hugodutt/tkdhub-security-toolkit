// Comentário para forçar novo deploy no Vercel
export const env = {
  VITE_WHOISJSON_API_KEY: import.meta.env.VITE_WHOISJSON_API_KEY,
  VITE_APILAYER_API_KEY: import.meta.env.VITE_APILAYER_API_KEY,
  VITE_IPAPI_KEY: import.meta.env.VITE_IPAPI_KEY,
  VITE_EMAIL_CHECKER_API_KEY: import.meta.env.VITE_EMAIL_CHECKER_API_KEY,
}; 