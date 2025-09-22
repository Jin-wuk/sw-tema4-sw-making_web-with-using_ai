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

// 도시별 현재 날씨 샘플 캐시: "하루" 단위로 동일 값을 유지하고, 자정에 갱신되도록 함
const cityWeatherCache = {
  // [cityName]: { data: any, dateKey: 'YYYYMMDD', expiresAt: number }
};

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function getMsUntilEndOfDay() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return Math.max(1000, end.getTime() - now.getTime());
}

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

    // 캐시 확인: 날짜 키가 동일하고 아직 만료되지 않았다면 해당 데이터 사용
    const now = Date.now();
    const todayKey = getTodayKey();
    const cached = cityWeatherCache[cityName];
    if (cached && cached.dateKey === todayKey && now < cached.expiresAt) {
      return cached.data;
    }

    // 현재는 외부 API 없이 샘플 데이터를 생성하되, TTL 동안 고정
    const generated = {
      temperature: Math.round(Math.random() * 15 + 5),
      humidity: Math.round(Math.random() * 30 + 40),
      description: ['맑음', '흐림', '비', '눈'][Math.floor(Math.random() * 4)],
      windSpeed: Math.round(Math.random() * 10 + 2),
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    };

    cityWeatherCache[cityName] = { 
      data: generated, 
      dateKey: todayKey, 
      expiresAt: now + getMsUntilEndOfDay()
    };
    return generated;
  } catch (error) {
    console.error(`${cityName} 날씨 정보 오류:`, error);
    throw error;
  }
}

// 날씨 예보 정보 (향후 확장용)
router.get('/forecast', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city || !GANGWON_CITIES[city]) {
      return res.status(400).json({ success: false, error: 'city 쿼리 파라미터가 필요합니다.' });
    }

    // 키 준비: 단기/중기 각각 환경변수 허용, 없으면 공통키 사용
    const baseKey = process.env.KMA_SERVICE_KEY || process.env.KMA_MID_FORECAST_KEY || '';
    const shortKeyRaw = process.env.KMA_VILAGE_FORECAST_KEY || process.env.KMA_SHORT_FORECAST_KEY || baseKey;
    const midKeyRaw = process.env.KMA_MID_FORECAST_KEY || baseKey;
    const shortKey = shortKeyRaw && shortKeyRaw.includes('%') ? decodeURIComponent(shortKeyRaw) : shortKeyRaw;
    const midKey = midKeyRaw && midKeyRaw.includes('%') ? decodeURIComponent(midKeyRaw) : midKeyRaw;
    if (!shortKey || !midKey) {
      return res.status(500).json({ success: false, error: '서비스키가 설정되지 않았습니다. (.env 확인)' });
    }

    const { lat, lon } = GANGWON_CITIES[city];
    const { nx, ny } = toGridXY(lat, lon);

    // 0~2일: 동네예보 요약
    const { baseDate, baseTime } = getLatestVillageBase();
    const vilageUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const vilageResp = await axios.get(vilageUrl, {
      params: { serviceKey: shortKey, pageNo: 1, numOfRows: 1000, dataType: 'JSON', base_date: baseDate, base_time: baseTime, nx, ny },
      timeout: 12000
    });
    const vilageItems = vilageResp.data?.response?.body?.items?.item || [];
    const shortDays = summarizeVillageDaily(vilageItems);

    // 3~7일: 중기예보 (영동/영서 regId만 사용)
    const tmFc = getLatestMidForecastBaseTime();
    const regionKey = mapCityToRegion(city);
    const REGIONS = { gangwonYeongdong: '11D10000', gangwonYeongseo: '11D20000' };
    const landUrl = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst';
    const tempUrl = 'https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa';
    const [landResp, tempResp] = await Promise.all([
      axios.get(landUrl, { params: { serviceKey: midKey, pageNo: 1, numOfRows: 10, dataType: 'JSON', regId: REGIONS[regionKey], tmFc }, timeout: 8000 }),
      axios.get(tempUrl, { params: { serviceKey: midKey, pageNo: 1, numOfRows: 10, dataType: 'JSON', regId: REGIONS[regionKey], tmFc }, timeout: 8000 })
    ]);
    const midLand = landResp.data?.response?.body?.items?.item?.[0] || null;
    const midTa = tempResp.data?.response?.body?.items?.item?.[0] || null;
    const midMerged = mergeLandAndTemp(midLand, midTa);

    const days = buildUnifiedSevenDays(shortDays, midMerged, tmFc);
    return res.json({ success: true, city, forecast: { baseTime: { short: `${baseDate}${baseTime}`, mid: tmFc }, days } });
  } catch (error) {
    console.error('예보 정보 조회 오류:', error);
    res.status(500).json({ success: false, error: '예보 정보를 가져오는 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

// 최신 중기예보 기준시각(06:00 또는 18:00) 계산
function getLatestMidForecastBaseTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = now.getHours();

  // 발표시각: 06, 18. 현재 시간이 18시 이후면 금일 18시, 6시 이후면 금일 06시, 그 외는 전일 18시
  let baseDate = new Date(yyyy, now.getMonth(), now.getDate());
  let baseHour;

  if (hh >= 18) {
    baseHour = '1800';
  } else if (hh >= 6) {
    baseHour = '0600';
  } else {
    // 전일 18시
    baseDate.setDate(baseDate.getDate() - 1);
    baseHour = '1800';
  }

  const by = baseDate.getFullYear();
  const bm = String(baseDate.getMonth() + 1).padStart(2, '0');
  const bd = String(baseDate.getDate()).padStart(2, '0');
  return `${by}${bm}${bd}${baseHour}`;
}

// 중기 육상예보 item을 간단 구조로 정리
function simplifyMidLandItem(item) {
  // 주요 키: rnSt(강수확률), wf(날씨), 각각 3~10일 구간
  const dayKeys = [3,4,5,6,7,8,9,10];
  const days = dayKeys.map((d) => ({
    day: d,
    rainProbability: item[`rnSt${d}Am`] ?? item[`rnSt${d}`] ?? null,
    weatherMorning: item[`wf${d}Am`] ?? null,
    weatherAfternoon: item[`wf${d}Pm`] ?? null
  }));

  return {
    regionId: item.regId,
    summaryDays: days
  };
}

// 육상예보 요약과 기온예보를 병합하여 한 구조로 반환
function mergeLandAndTemp(landItem, tempItem) {
  if (!landItem && !tempItem) return null;

  const simplified = landItem ? simplifyMidLandItem(landItem) : { regionId: tempItem?.regId, summaryDays: [] };
  if (!tempItem) return simplified;

  const dayKeys = [3,4,5,6,7,8,9,10];
  const withTemps = dayKeys.map((d, idx) => {
    const base = simplified.summaryDays[idx] || { day: d };
    return {
      ...base,
      tmin: tempItem[`taMin${d}`] ?? null,
      tmax: tempItem[`taMax${d}`] ?? null
    };
  });

  return {
    ...simplified,
    summaryDays: withTemps
  };
}

// 동네예보 일간 요약 만들기 (오늘/내일/모레 최대 3일)
function summarizeVillageDaily(items) {
  const byDate = new Map();
  for (const it of items) {
    const date = it.fcstDate; // YYYYMMDD
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(it);
  }
  const dates = Array.from(byDate.keys()).sort();
  const result = [];
  for (const d of dates.slice(0, 3)) {
    const arr = byDate.get(d);
    const dayObj = { date: d, tmax: null, tmin: null, pop: null, dayWeather: null, nightWeather: null };

    const tmx = arr.find(x => x.category === 'TMX')?.fcstValue;
    const tmn = arr.find(x => x.category === 'TMN')?.fcstValue;
    if (tmx != null) dayObj.tmax = Number(tmx);
    if (tmn != null) dayObj.tmin = Number(tmn);
    if (dayObj.tmax == null || dayObj.tmin == null) {
      const tmps = arr.filter(x => x.category === 'TMP').map(x => Number(x.fcstValue));
      if (tmps.length) {
        dayObj.tmax = dayObj.tmax ?? Math.max(...tmps);
        dayObj.tmin = dayObj.tmin ?? Math.min(...tmps);
      }
    }

    const pops = arr.filter(x => x.category === 'POP').map(x => Number(x.fcstValue));
    if (pops.length) dayObj.pop = Math.max(...pops);

    dayObj.dayWeather = interpretWeather(arr, '0900');
    dayObj.nightWeather = interpretWeather(arr, '1500');

    result.push(dayObj);
  }
  return result;
}

function interpretWeather(arr, time) {
  const pty = arr.find(x => x.fcstTime === time && x.category === 'PTY')?.fcstValue;
  const sky = arr.find(x => x.fcstTime === time && x.category === 'SKY')?.fcstValue;
  if (pty && Number(pty) > 0) return '비';
  if (sky != null) {
    const n = Number(sky);
    if (n <= 3) return '맑음';
    if (n === 4) return '흐림';
  }
  return '-';
}

function buildUnifiedSevenDays(shortDays, midMerged, tmFc) {
  const output = [];
  for (const d of shortDays) {
    const dateObj = parseYYYYMMDD(d.date);
    output.push({
      date: formatKoreanDate(dateObj),
      pop: d.pop ?? null,
      dayWeather: d.dayWeather || '-',
      nightWeather: d.nightWeather || '-',
      tmax: d.tmax ?? null,
      tmin: d.tmin ?? null
    });
    if (output.length === 3) break;
  }
  for (const sd of (midMerged?.summaryDays || [])) {
    if (sd.day < 3) continue;
    if (output.length >= 7) break;
    const dateStr = computeDateFromBase(tmFc, sd.day);
    output.push({
      date: dateStr,
      pop: sd.rainProbability ?? null,
      dayWeather: sd.weatherMorning || '-',
      nightWeather: sd.weatherAfternoon || '-',
      tmax: sd.tmax ?? null,
      tmin: sd.tmin ?? null
    });
  }
  return output.slice(0, 7);
}

function parseYYYYMMDD(s) {
  const y = Number(s.slice(0,4));
  const m = Number(s.slice(4,6)) - 1;
  const d = Number(s.slice(6,8));
  return new Date(y, m, d);
}

function mapCityToRegion(city) {
  const yeongdong = ['강릉', '동해', '속초', '삼척', '양양', '고성'];
  return yeongdong.includes(city) ? 'gangwonYeongdong' : 'gangwonYeongseo';
}

function toGridXY(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;
  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  return { nx: x, ny: y };
}

function getLatestVillageBase() {
  const times = ['2300','2000','1700','1400','1100','0800','0500','0200'];
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  const hhmm = String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0');
  for (const t of times) {
    if (hhmm >= t) return { baseDate: `${y}${m}${d}`, baseTime: t };
  }
  const prev = new Date(now.getTime() - 24*60*60*1000);
  const py = prev.getFullYear();
  const pm = String(prev.getMonth()+1).padStart(2,'0');
  const pd = String(prev.getDate()).padStart(2,'0');
  return { baseDate: `${py}${pm}${pd}`, baseTime: '2300' };
}
