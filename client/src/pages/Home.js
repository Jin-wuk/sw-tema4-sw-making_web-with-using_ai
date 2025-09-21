import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaCloudSun, 
  FaParking, 
  FaPaw, 
  FaStore,
  FaArrowRight,
  FaMapMarkerAlt,
  FaUsers,
  FaHeart
} from 'react-icons/fa';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 60px;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatIcon = styled.div`
  font-size: 32px;
  margin-bottom: 15px;
  color: #ffd700;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const FeatureCard = styled(Link)`
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  
  &.weather {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }
  
  &.parking {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  }
  
  &.pets {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  }
  
  &.businesses {
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const FeatureLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
`;

const InfoSection = styled.section`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const InfoTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

function Home() {
  const stats = [
    { icon: FaMapMarkerAlt, number: '18', label: '시군구' },
    { icon: FaUsers, number: '1.5M', label: '인구' },
    { icon: FaHeart, number: '100+', label: '착한업소' },
    { icon: FaParking, number: '50+', label: '주차장' }
  ];

  const features = [
    {
      path: '/weather',
      icon: FaCloudSun,
      iconClass: 'weather',
      title: '실시간 날씨',
      description: '강원도 전 지역의 현재 날씨와 예보 정보를 확인하세요.'
    },
    {
      path: '/parking',
      icon: FaParking,
      iconClass: 'parking',
      title: '주차장 정보',
      description: '실시간 주차 공간 현황과 요금 정보를 제공합니다.'
    },
    {
      path: '/pets',
      icon: FaPaw,
      iconClass: 'pets',
      title: '반려동물 서비스',
      description: '동물병원, 펫샵, 동반 가능 장소 정보를 찾아보세요.'
    },
    {
      path: '/businesses',
      icon: FaStore,
      iconClass: 'businesses',
      title: '착한업소',
      description: '사회적 가치를 실현하는 착한업소들을 소개합니다.'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>강원도 정보 웹</HeroTitle>
        <HeroSubtitle>
          강원도의 모든 정보를 한 곳에서<br />
          날씨, 주차장, 반려동물, 착한업소까지
        </HeroSubtitle>
      </HeroSection>

      <StatsContainer>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <StatCard key={index}>
              <StatIcon>
                <IconComponent />
              </StatIcon>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          );
        })}
      </StatsContainer>

      <FeaturesGrid>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <FeatureCard key={index} to={feature.path}>
              <FeatureIcon className={feature.iconClass}>
                <IconComponent />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <FeatureLink>
                자세히 보기 <FaArrowRight />
              </FeatureLink>
            </FeatureCard>
          );
        })}
      </FeaturesGrid>

      <InfoSection>
        <InfoTitle>강원도 정보 웹이란?</InfoTitle>
        <InfoText>
          강원도 주민과 방문객들을 위해 개발된 종합 정보 서비스입니다. 
          실시간 날씨 정보부터 주차장 현황, 반려동물 관련 서비스, 
          사회적 가치를 실현하는 착한업소까지 강원도의 모든 정보를 
          편리하게 확인할 수 있습니다.
        </InfoText>
      </InfoSection>
    </HomeContainer>
  );
}

export default Home;
