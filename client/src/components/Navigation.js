import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaCloudSun, 
  FaParking, 
  FaPaw, 
  FaStore 
} from 'react-icons/fa';

const NavContainer = styled.nav`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 999;
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  text-decoration: none;
  color: #666;
  font-weight: 600;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
    
    span {
      display: none;
    }
  }
`;

const Icon = styled.div`
  font-size: 16px;
`;

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: FaHome, label: '홈' },
    { path: '/weather', icon: FaCloudSun, label: '날씨' },
    { path: '/parking', icon: FaParking, label: '주차장' },
    { path: '/pets', icon: FaPaw, label: '반려동물' },
    { path: '/businesses', icon: FaStore, label: '착한업소' }
  ];
  
  return (
    <NavContainer>
      <NavContent>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavItem
              key={item.path}
              to={item.path}
              className={isActive ? 'active' : ''}
            >
              <Icon>
                <IconComponent />
              </Icon>
              <span>{item.label}</span>
            </NavItem>
          );
        })}
      </NavContent>
    </NavContainer>
  );
}

export default Navigation;
