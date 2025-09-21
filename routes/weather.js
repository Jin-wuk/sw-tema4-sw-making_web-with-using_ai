const express = require('express');
const axios = require('axios');
const router = express.Router();

// 강원도 주요 도시들의 좌표 정보
const GANGWON_CITIES = {
  '춘천': { lat: 37.8813, lon: 127.7298 },
  '원주': { lat: 37.3444, lon: 127.9203 },
  '강릉': { lat: 37.7519, lon: 128.8761 },
  '동해': { lat: 37.5236, lon: 129.1142 },
  '태백': { lat: 37.1641, lon: 128.9856 },
  '속초': { lat: 38.2072, lon: 128.5918 },
  '삼척': { lat: 37.4500, lon: 129.1667 },
  '홍천': { lat: 37.6975, lon: 128.0047 },
  '횡성': { lat: 37.4919, lon: 127.9853 },
  '영월': { lat: 37.1836, lon: 128.4675 },
  '평창': { lat: 37.3708, lon: 128.3897 },
  '정선': { lat: 37.3808, lon: 128.6608 },
  '철원': { lat: 38.1464, lon: 127.3131 },
  '화천': { lat: 38.1064, lon: 127.7069 },
  '양구': { lat: 38.1075, lon: 127.9897 },
  '인제': { lat: 38.0697, lon: 128.1708 },
  '고성': { lat: 38.3797, lon: 128.4678 },
  '양양': { lat: 38.0758, lon: 128.6192 }
};

// 강원도 날씨 정보 조회
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (city && GANGWON_CITIES[city]) {
      // 특정 도시의 날씨 정보
      const weatherData = await getWeatherForCity(city);
      res.json({
        success: true,
        city,
        data: weatherData
      });
    } else {
      // 전체 강원도 도시들의 날씨 정보
      const weatherPromises = Object.keys(GANGWON_CITIES).map(cityName => 
        getWeatherForCity(cityName)
      );
      
      const weatherResults = await Promise.all(weatherPromises);
      
      const weatherData = {};
      Object.keys(GANGWON_CITIES).forEach((cityName, index) => {
        weatherData[cityName] = weatherResults[index];
      });
      
      res.json({
        success: true,
        data: weatherData
      });
    }
  } catch (error) {
    console.error('날씨 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '날씨 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 도시의 날씨 정보 가져오기
async function getWeatherForCity(cityName) {
  try {
    const { lat, lon } = GANGWON_CITIES[cityName];
    
    // OpenWeatherMap API 호출 (실제 API 키가 필요함)
    // 현재는 샘플 데이터 반환
    const sampleData = {
      temperature: Math.round(Math.random() * 15 + 5), // 5-20도
      humidity: Math.round(Math.random() * 30 + 40), // 40-70%
      description: ['맑음', '흐림', '비', '눈'][Math.floor(Math.random() * 4)],
      windSpeed: Math.round(Math.random() * 10 + 2), // 2-12 m/s
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    };
    
    return sampleData;
  } catch (error) {
    console.error(`${cityName} 날씨 정보 오류:`, error);
    throw error;
  }
}

// 날씨 예보 정보 (향후 확장용)
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;
    
    // 5일 예보 샘플 데이터
    const forecastData = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecastData.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(Math.random() * 10 + 0),
          max: Math.round(Math.random() * 15 + 10)
        },
        description: ['맑음', '흐림', '비', '눈'][Math.floor(Math.random() * 4)],
        humidity: Math.round(Math.random() * 30 + 40),
        windSpeed: Math.round(Math.random() * 10 + 2)
      });
    }
    
    res.json({
      success: true,
      city: city || '강원도',
      forecast: forecastData
    });
  } catch (error) {
    console.error('예보 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '예보 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
