import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaCloudSun, 
  FaThermometerHalf, 
  FaTint, 
  FaWind,
  FaEye,
  FaMapMarkerAlt,
  FaSearch
} from 'react-icons/fa';

const WeatherContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
`;

const SearchTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
`;

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const CityCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CityHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const CityName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const WeatherIcon = styled.div`
  font-size: 24px;
  color: #667eea;
`;

const WeatherInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const WeatherItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const WeatherValue = styled.span`
  font-weight: 600;
  color: #333;
`;

const Temperature = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  text-align: center;
  margin: 15px 0;
`;

const ForecastSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-top: 30px;
  backdrop-filter: blur(10px);
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ForecastCard = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
`;

const ForecastDate = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const ForecastTemp = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ForecastDesc = styled.div`
  font-size: 14px;
  color: #667eea;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 18px;
`;

const Error = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`;

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gangwonCities = [
    '춘천', '원주', '강릉', '동해', '태백', '속초', 
    '삼척', '홍천', '횡성', '영월', '평창', '정선', 
    '철원', '화천', '양구', '인제', '고성', '양양'
  ];

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/weather');
      const data = await response.json();
      
      if (data.success) {
        setWeatherData(data.data);
      } else {
        throw new Error(data.error || '날씨 정보를 가져올 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastData = async (city) => {
    try {
      const response = await fetch(`/api/weather/forecast?city=${city}`);
      const data = await response.json();
      
      if (data.success) {
        setForecastData(data.forecast);
      }
    } catch (err) {
      console.error('예보 정보 오류:', err);
    }
  };

  const handleCitySearch = async () => {
    if (!selectedCity.trim()) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/weather?city=${selectedCity}`);
      const data = await response.json();
      
      if (data.success) {
        setWeatherData({ [selectedCity]: data.data });
        await fetchForecastData(selectedCity);
      } else {
        throw new Error(data.error || '해당 도시의 날씨 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName);
    fetchForecastData(cityName);
  };

  if (loading && !weatherData) {
    return (
      <WeatherContainer>
        <PageTitle>강원도 날씨 정보</PageTitle>
        <Loading>날씨 정보를 불러오는 중...</Loading>
      </WeatherContainer>
    );
  }

  return (
    <WeatherContainer>
      <PageTitle>강원도 날씨 정보</PageTitle>
      
      <SearchSection>
        <SearchTitle>도시별 날씨 검색</SearchTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="도시명을 입력하세요 (예: 춘천, 강릉, 속초)"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
          />
          <SearchButton onClick={handleCitySearch}>
            <FaSearch />
            검색
          </SearchButton>
        </SearchContainer>
      </SearchSection>

      {error && <Error>{error}</Error>}

      {weatherData && (
        <CityGrid>
          {Object.entries(weatherData).map(([cityName, weather]) => (
            <CityCard key={cityName} onClick={() => handleCityClick(cityName)}>
              <CityHeader>
                <FaMapMarkerAlt style={{ color: '#667eea' }} />
                <CityName>{cityName}</CityName>
              </CityHeader>
              
              <WeatherIcon>
                <FaCloudSun />
              </WeatherIcon>
              
              <Temperature>{weather.temperature}°C</Temperature>
              
              <WeatherInfo>
                <WeatherItem>
                  <FaTint />
                  <WeatherValue>{weather.humidity}%</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <FaWind />
                  <WeatherValue>{weather.windSpeed}m/s</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <FaEye />
                  <WeatherValue>{weather.description}</WeatherValue>
                </WeatherItem>
                <WeatherItem>
                  <FaThermometerHalf />
                  <WeatherValue>체감 {weather.temperature}°C</WeatherValue>
                </WeatherItem>
              </WeatherInfo>
            </CityCard>
          ))}
        </CityGrid>
      )}

      {forecastData && (
        <ForecastSection>
          <SearchTitle>{selectedCity} 5일 예보</SearchTitle>
          <ForecastGrid>
            {forecastData.map((forecast, index) => (
              <ForecastCard key={index}>
                <ForecastDate>
                  {new Date(forecast.date).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </ForecastDate>
                <ForecastTemp>
                  {forecast.temperature.max}° / {forecast.temperature.min}°
                </ForecastTemp>
                <ForecastDesc>{forecast.description}</ForecastDesc>
              </ForecastCard>
            ))}
          </ForecastGrid>
        </ForecastSection>
      )}
    </WeatherContainer>
  );
}

export default Weather;
