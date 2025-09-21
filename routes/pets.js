const express = require('express');
const router = express.Router();

// 강원도 반려동물 관련 정보 (샘플 데이터)
const PET_SERVICES = [
  {
    id: 1,
    name: '춘천동물병원',
    type: '동물병원',
    address: '강원도 춘천시 중앙로 123',
    phone: '033-252-1234',
    services: ['진료', '예방접종', '수술', '미용'],
    operatingHours: '09:00 - 19:00',
    coordinates: { lat: 37.8813, lon: 127.7298 },
    rating: 4.5,
    reviews: 23
  },
  {
    id: 2,
    name: '강릉펫케어센터',
    type: '펫샵',
    address: '강원도 강릉시 경강로 456',
    phone: '033-654-5678',
    services: ['미용', '목욕', '호텔', '용품판매'],
    operatingHours: '10:00 - 20:00',
    coordinates: { lat: 37.7519, lon: 128.8761 },
    rating: 4.2,
    reviews: 18
  },
  {
    id: 3,
    name: '원주애완동물약국',
    type: '동물약국',
    address: '강원도 원주시 원일로 789',
    phone: '033-742-9012',
    services: ['약품판매', '상담', '건강검진'],
    operatingHours: '09:00 - 18:00',
    coordinates: { lat: 37.3444, lon: 127.9203 },
    rating: 4.7,
    reviews: 31
  },
  {
    id: 4,
    name: '속초펫파크',
    type: '펫파크',
    address: '강원도 속초시 중앙로 321',
    phone: '033-638-3456',
    services: ['산책', '놀이', '교육', '카페'],
    operatingHours: '08:00 - 21:00',
    coordinates: { lat: 38.2072, lon: 128.5918 },
    rating: 4.8,
    reviews: 45
  },
  {
    id: 5,
    name: '동해동물보호소',
    type: '보호소',
    address: '강원도 동해시 망상동 654',
    phone: '033-532-7890',
    services: ['입양', '보호', '중성화', '교육'],
    operatingHours: '09:00 - 17:00',
    coordinates: { lat: 37.5236, lon: 129.1142 },
    rating: 4.6,
    reviews: 67
  }
];

const PET_FRIENDLY_PLACES = [
  {
    id: 1,
    name: '춘천남이섬',
    type: '관광지',
    address: '강원도 춘천시 남산면 남이섬길 1',
    description: '반려동물과 함께 즐길 수 있는 자연 경관',
    petPolicy: '리드줄 착용 필수',
    coordinates: { lat: 37.7900, lon: 127.5258 },
    rating: 4.3
  },
  {
    id: 2,
    name: '강릉커피거리',
    type: '카페거리',
    address: '강원도 강릉시 경강로 2105',
    description: '반려동물 동반 가능한 카페들이 모인 거리',
    petPolicy: '소형견 동반 가능',
    coordinates: { lat: 37.7519, lon: 128.8761 },
    rating: 4.4
  },
  {
    id: 3,
    name: '속초해변',
    type: '해변',
    address: '강원도 속초시 조양동',
    description: '반려동물과 함께 바다를 즐길 수 있는 해변',
    petPolicy: '특정 구역에서만 가능',
    coordinates: { lat: 38.2072, lon: 128.5918 },
    rating: 4.5
  }
];

const PET_CARE_TIPS = [
  {
    id: 1,
    title: '강원도 겨울철 반려동물 관리법',
    content: '강원도의 추운 겨울철에는 반려동물의 체온 유지가 중요합니다. 실내 온도를 적절히 유지하고, 외출 시에는 따뜻한 옷을 입혀주세요.',
    category: '건강관리',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: '산악지역 반려동물 산책 주의사항',
    content: '강원도의 산악지역에서는 급격한 고도 변화로 인한 건강 문제를 주의해야 합니다. 충분한 휴식과 물 공급이 필요합니다.',
    category: '산책',
    date: '2024-01-10'
  },
  {
    id: 3,
    title: '지역별 동물병원 응급상황 대처법',
    content: '강원도는 지리적으로 응급상황 발생 시 접근이 어려울 수 있습니다. 평소 응급병원 위치를 파악하고 연락처를 준비해두세요.',
    category: '응급처치',
    date: '2024-01-05'
  }
];

// 반려동물 서비스 목록 조회
router.get('/services', async (req, res) => {
  try {
    const { type, city } = req.query;
    
    let filteredData = [...PET_SERVICES];
    
    if (type) {
      filteredData = filteredData.filter(service => service.type === type);
    }
    
    if (city) {
      filteredData = filteredData.filter(service => 
        service.address.includes(city)
      );
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('반려동물 서비스 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 서비스 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 동반 가능 장소 조회
router.get('/places', async (req, res) => {
  try {
    const { type } = req.query;
    
    let filteredData = [...PET_FRIENDLY_PLACES];
    
    if (type) {
      filteredData = filteredData.filter(place => place.type === type);
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('반려동물 동반 장소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 동반 장소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 케어 팁 조회
router.get('/tips', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredData = [...PET_CARE_TIPS];
    
    if (category) {
      filteredData = filteredData.filter(tip => tip.category === category);
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('반려동물 케어 팁 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 케어 팁을 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 서비스 상세 정보
router.get('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = PET_SERVICES.find(s => s.id === parseInt(id));
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: '서비스를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('서비스 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '서비스 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 관련 통계
router.get('/stats', async (req, res) => {
  try {
    const serviceStats = PET_SERVICES.reduce((stats, service) => {
      stats[service.type] = (stats[service.type] || 0) + 1;
      return stats;
    }, {});
    
    const placeStats = PET_FRIENDLY_PLACES.reduce((stats, place) => {
      stats[place.type] = (stats[place.type] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      success: true,
      stats: {
        totalServices: PET_SERVICES.length,
        totalPlaces: PET_FRIENDLY_PLACES.length,
        totalTips: PET_CARE_TIPS.length,
        servicesByType: serviceStats,
        placesByType: placeStats
      }
    });
  } catch (error) {
    console.error('반려동물 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
