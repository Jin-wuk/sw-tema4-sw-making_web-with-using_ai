module.exports = {
  NODE_ENV: 'development',
  PORT: 5000,
  
  // OpenWeatherMap API Key (날씨 정보용)
  OPENWEATHER_API_KEY: 'your_openweather_api_key_here',
  
  // 공공데이터포털 API Keys
  PUBLIC_DATA_API_KEY: 'your_public_data_api_key_here',
  
  // MongoDB 연결 문자열 (선택사항)
  MONGODB_URI: 'mongodb://localhost:27017/gangwon-info',
  
  // JWT Secret (인증용, 필요시)
  JWT_SECRET: 'your_jwt_secret_here'
};
