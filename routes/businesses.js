const express = require('express');
const router = express.Router();

// 강원도 착한업소 정보 (샘플 데이터)
const GOOD_BUSINESSES = [
  {
    id: 1,
    name: '춘천시청',
    category: '공공기관',
    address: '강원도 춘천시 중앙로 112',
    phone: '033-250-3000',
    description: '시민을 위한 다양한 복지 서비스 제공',
    services: ['시민상담', '복지서비스', '행정업무'],
    operatingHours: '09:00 - 18:00',
    coordinates: { lat: 37.8813, lon: 127.7298 },
    rating: 4.8,
    reviews: 156,
    goodDeeds: ['무료 상담 서비스', '장애인 편의시설 완비', '다국어 서비스'],
    verified: true
  },
  {
    id: 2,
    name: '강릉시의료원',
    category: '의료기관',
    address: '강원도 강릉시 경강로 2105',
    phone: '033-610-9114',
    description: '지역 의료 서비스의 중심지',
    services: ['응급의료', '진료', '건강검진'],
    operatingHours: '24시간 응급실 운영',
    coordinates: { lat: 37.7519, lon: 128.8761 },
    rating: 4.6,
    reviews: 89,
    goodDeeds: ['응급실 24시간 운영', '의료비 지원 프로그램', '원격진료 서비스'],
    verified: true
  },
  {
    id: 3,
    name: '원주시장애인복지관',
    category: '복지기관',
    address: '강원도 원주시 원일로 456',
    phone: '033-747-1234',
    description: '장애인을 위한 종합 복지 서비스',
    services: ['재활치료', '직업훈련', '상담'],
    operatingHours: '09:00 - 18:00',
    coordinates: { lat: 37.3444, lon: 127.9203 },
    rating: 4.9,
    reviews: 67,
    goodDeeds: ['무료 재활치료', '장애인 직업훈련', '가족 상담 서비스'],
    verified: true
  },
  {
    id: 4,
    name: '속초시노인복지관',
    category: '복지기관',
    address: '강원도 속초시 중앙로 789',
    phone: '033-639-5678',
    description: '어르신들을 위한 종합 복지 서비스',
    services: ['건강관리', '취미활동', '상담'],
    operatingHours: '08:00 - 20:00',
    coordinates: { lat: 38.2072, lon: 128.5918 },
    rating: 4.7,
    reviews: 43,
    goodDeeds: ['무료 건강검진', '문화프로그램 운영', '무료 급식 서비스'],
    verified: true
  },
  {
    id: 5,
    name: '동해시청소년수련관',
    category: '교육기관',
    address: '강원도 동해시 망상동 123',
    phone: '033-530-2345',
    description: '청소년을 위한 다양한 프로그램 제공',
    services: ['체육활동', '문화활동', '상담'],
    operatingHours: '09:00 - 22:00',
    coordinates: { lat: 37.5236, lon: 129.1142 },
    rating: 4.5,
    reviews: 34,
    goodDeeds: ['무료 체육시설 이용', '청소년 상담 서비스', '진로지도 프로그램'],
    verified: true
  },
  {
    id: 6,
    name: '태백시사회적경제센터',
    category: '사회적기업',
    address: '강원도 태백시 동태백로 321',
    phone: '033-552-6789',
    description: '사회적 가치 창출을 위한 기업 지원',
    services: ['창업지원', '교육', '컨설팅'],
    operatingHours: '09:00 - 18:00',
    coordinates: { lat: 37.1641, lon: 128.9856 },
    rating: 4.4,
    reviews: 28,
    goodDeeds: ['무료 창업교육', '사회적기업 육성', '일자리 창출'],
    verified: true
  }
];

const BUSINESS_CATEGORIES = [
  '공공기관', '의료기관', '복지기관', '교육기관', 
  '사회적기업', '협동조합', '자원봉사단체', '기타'
];

// 착한업소 목록 조회
router.get('/', async (req, res) => {
  try {
    const { category, city, verified } = req.query;
    
    let filteredData = [...GOOD_BUSINESSES];
    
    // 카테고리별 필터링
    if (category) {
      filteredData = filteredData.filter(business => 
        business.category === category
      );
    }
    
    // 도시별 필터링
    if (city) {
      filteredData = filteredData.filter(business => 
        business.address.includes(city)
      );
    }
    
    // 인증업소만 필터링
    if (verified === 'true') {
      filteredData = filteredData.filter(business => 
        business.verified === true
      );
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('착한업소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '착한업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 업소 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = GOOD_BUSINESSES.find(b => b.id === parseInt(id));
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: '업소를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('업소 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 업소 검색
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    const searchResults = GOOD_BUSINESSES.filter(business =>
      business.name.includes(keyword) ||
      business.address.includes(keyword) ||
      business.description.includes(keyword) ||
      business.services.some(service => service.includes(keyword)) ||
      business.goodDeeds.some(deed => deed.includes(keyword))
    );
    
    res.json({
      success: true,
      keyword,
      data: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    console.error('업소 검색 오류:', error);
    res.status(500).json({
      success: false,
      error: '업소 검색 중 오류가 발생했습니다.'
    });
  }
});

// 카테고리별 통계
router.get('/stats/categories', async (req, res) => {
  try {
    const categoryStats = BUSINESS_CATEGORIES.map(category => ({
      category,
      count: GOOD_BUSINESSES.filter(business => business.category === category).length
    }));
    
    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('카테고리 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '카테고리 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 전체 통계 정보
router.get('/stats/summary', async (req, res) => {
  try {
    const totalBusinesses = GOOD_BUSINESSES.length;
    const verifiedBusinesses = GOOD_BUSINESSES.filter(b => b.verified).length;
    const averageRating = (GOOD_BUSINESSES.reduce((sum, b) => sum + b.rating, 0) / totalBusinesses).toFixed(1);
    const totalReviews = GOOD_BUSINESSES.reduce((sum, b) => sum + b.reviews, 0);
    
    const cityStats = GOOD_BUSINESSES.reduce((stats, business) => {
      const city = business.address.split(' ')[1]; // 강원도 다음의 시/군/구
      stats[city] = (stats[city] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      success: true,
      stats: {
        totalBusinesses,
        verifiedBusinesses,
        verificationRate: `${Math.round((verifiedBusinesses / totalBusinesses) * 100)}%`,
        averageRating,
        totalReviews,
        businessesByCity: cityStats
      }
    });
  } catch (error) {
    console.error('통계 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '통계 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 인기 착한업소 (평점 기준)
router.get('/popular/top-rated', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const topRated = GOOD_BUSINESSES
      .sort((a, b) => b.rating - a.rating)
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: topRated
    });
  } catch (error) {
    console.error('인기 업소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '인기 업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
