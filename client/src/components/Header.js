import React from 'react';
import styled from 'styled-components';
import { FaMountain, FaMapMarkerAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const Icon = styled.div`
  color: #667eea;
  font-size: 28px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 400;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
`;

function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <Icon>
            <FaMountain />
          </Icon>
          <div>
            <Title>강원도 정보</Title>
            <Subtitle>Gangwon Info</Subtitle>
          </div>
        </Logo>
        <Location>
          <FaMapMarkerAlt />
          <span>강원특별자치도</span>
        </Location>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
