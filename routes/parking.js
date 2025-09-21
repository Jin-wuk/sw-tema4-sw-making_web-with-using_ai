const express = require('express');
const router = express.Router();

// 강원도 주차장 정보 (샘플 데이터)
const PARKING_DATA = [
  {
    id: 1,
    name: '춘천시청 주차장',
    address: '강원도 춘천시 중앙로 112',
    type: '공영',
    totalSpaces: 150,
    availableSpaces: 45,
    operatingHours: '06:00 - 22:00',
    fee: '30분당 500원',
    coordinates: { lat: 37.8813, lon: 127.7298 },
    amenities: ['장애인 주차장', '전기차 충전소'],
    phone: '033-250-3000'
  },
  {
    id: 2,
    name: '강릉시외버스터미널 주차장',
    address: '강원도 강릉시 경강로 2105',
    type: '공영',
    totalSpaces: 200,
    availableSpaces: 78,
    operatingHours: '24시간',
    fee: '30분당 400원',
    coordinates: { lat: 37.7519, lon: 128.8761 },
    amenities: ['장애인 주차장'],
    phone: '033-651-2000'
  },
  {
    id: 3,
    name: '원주시 중앙시장 주차장',
    address: '강원도 원주시 원일로 172',
    type: '공영',
    totalSpaces: 100,
    availableSpaces: 23,
    operatingHours: '07:00 - 21:00',
    fee: '30분당 600원',
    coordinates: { lat: 37.3444, lon: 127.9203 },
    amenities: ['장애인 주차장'],
    phone: '033-737-3000'
  },
  {
    id: 4,
    name: '속초시 중앙시장 주차장',
    address: '강원도 속초시 중앙로 147',
    type: '공영',
    totalSpaces: 80,
    availableSpaces: 12,
    operatingHours: '08:00 - 20:00',
    fee: '30분당 700원',
    coordinates: { lat: 38.2072, lon: 128.5918 },
    amenities: ['장애인 주차장', '전기차 충전소'],
    phone: '033-630-3000'
  },
  {
    id: 5,
    name: '동해시 해변공원 주차장',
    address: '강원도 동해시 망상동 123-45',
    type: '공영',
    totalSpaces: 120,
    availableSpaces: 67,
    operatingHours: '06:00 - 23:00',
    fee: '30분당 500원',
    coordinates: { lat: 37.5236, lon: 129.1142 },
    amenities: ['장애인 주차장'],
    phone: '033-530-2000'
  }
];

// 주차장 목록 조회
router.get('/', async (req, res) => {
  try {
    const { city, type, available } = req.query;
    
    let filteredData = [...PARKING_DATA];
    
    // 도시별 필터링
    if (city) {
      filteredData = filteredData.filter(parking => 
        parking.address.includes(city)
      );
    }
    
    // 주차장 유형별 필터링
    if (type) {
      filteredData = filteredData.filter(parking => 
        parking.type === type
      );
    }
    
    // 주차 가능 여부 필터링
    if (available === 'true') {
      filteredData = filteredData.filter(parking => 
        parking.availableSpaces > 0
      );
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('주차장 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 주차장 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parking = PARKING_DATA.find(p => p.id === parseInt(id));
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        error: '주차장을 찾을 수 없습니다.'
      });
    }
    
    // 실시간 주차 공간 정보 업데이트 (시뮬레이션)
    const updatedParking = {
      ...parking,
      availableSpaces: Math.floor(Math.random() * parking.totalSpaces),
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: updatedParking
    });
  } catch (error) {
    console.error('주차장 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 주차장 검색
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    const searchResults = PARKING_DATA.filter(parking =>
      parking.name.includes(keyword) ||
      parking.address.includes(keyword) ||
      parking.amenities.some(amenity => amenity.includes(keyword))
    );
    
    res.json({
      success: true,
      keyword,
      data: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    console.error('주차장 검색 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 검색 중 오류가 발생했습니다.'
    });
  }
});

// 주차장 통계 정보
router.get('/stats/summary', async (req, res) => {
  try {
    const totalSpaces = PARKING_DATA.reduce((sum, parking) => sum + parking.totalSpaces, 0);
    const totalAvailable = PARKING_DATA.reduce((sum, parking) => sum + parking.availableSpaces, 0);
    const occupancyRate = Math.round(((totalSpaces - totalAvailable) / totalSpaces) * 100);
    
    const typeStats = PARKING_DATA.reduce((stats, parking) => {
      stats[parking.type] = (stats[parking.type] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      success: true,
      stats: {
        totalParkingLots: PARKING_DATA.length,
        totalSpaces,
        totalAvailable,
        occupancyRate: `${occupancyRate}%`,
        byType: typeStats
      }
    });
  } catch (error) {
    console.error('주차장 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
