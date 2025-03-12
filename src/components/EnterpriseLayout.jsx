import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiMenu, FiUser, FiBell, FiSettings, FiHelpCircle,
  FiHome, FiList, FiBarChart2, FiFileText, FiSearch,
  FiChevronRight
} from 'react-icons/fi';

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: ${props => props.sidebarCollapsed ? '64px' : '240px'} 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas: 
    "sidebar header"
    "sidebar main";
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  grid-area: header;
  background: ${props => props.theme.tableBackground};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: ${props => props.theme.headerBackground};
  border-right: 1px solid ${props => props.theme.borderColor};
  overflow-y: auto;
  transition: width 0.3s ease;
  width: ${props => props.collapsed ? '64px' : '240px'};
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  padding: ${props => props.collapsed ? '0' : '0 1rem'};
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const SidebarLogo = styled.div`
  font-weight: 600;
  font-size: ${props => props.collapsed ? '1.25rem' : '1rem'};
  color: ${props => props.theme.isDark ? '#f7fafc' : '#f7fafc'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.isDark ? '#f7fafc' : '#f7fafc'};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
  }
`;

const SidebarMenu = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const SidebarMenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: ${props => props.collapsed ? '1rem 0' : '0.75rem 1rem'};
  color: ${props => props.active ? 'white' : (props.theme.isDark ? '#cbd5e0' : '#cbd5e0')};
  text-decoration: none;
  transition: all 0.2s;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  border-left: 3px solid ${props => props.active ? 'white' : 'transparent'};
  background: ${props => props.active ? (props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)') : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
    color: white;
  }
  
  svg {
    min-width: 1.25rem;
    margin-right: ${props => props.collapsed ? '0' : '0.75rem'};
  }
`;

const SidebarMenuLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

const Main = styled.main`
  grid-area: main;
  overflow-y: auto;
  padding: 1.5rem;
  background: ${props => props.theme.background};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  opacity: 0.7;
  margin-bottom: 0.5rem;
  
  a {
    color: ${props => props.theme.text};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  svg {
    margin: 0 0.5rem;
    width: 12px;
    height: 12px;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => props.theme.buttonBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: #EF4444;
`;

function EnterpriseLayout({ 
  children, 
  title = 'Dashboard', 
  onThemeToggle,
  currentTheme
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <LayoutContainer sidebarCollapsed={sidebarCollapsed}>
      <Sidebar collapsed={sidebarCollapsed}>
        <SidebarHeader collapsed={sidebarCollapsed}>
          <SidebarLogo collapsed={sidebarCollapsed}>
            {!sidebarCollapsed && 'Product Ideas'}
            {sidebarCollapsed && 'PI'}
          </SidebarLogo>
          <SidebarToggle onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FiMenu />
          </SidebarToggle>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem active collapsed={sidebarCollapsed}>
            <FiHome />
            <SidebarMenuLabel collapsed={sidebarCollapsed}>Dashboard</SidebarMenuLabel>
          </SidebarMenuItem>
          <SidebarMenuItem collapsed={sidebarCollapsed}>
            <FiList />
            <SidebarMenuLabel collapsed={sidebarCollapsed}>All Ideas</SidebarMenuLabel>
          </SidebarMenuItem>
          <SidebarMenuItem collapsed={sidebarCollapsed}>
            <FiBarChart2 />
            <SidebarMenuLabel collapsed={sidebarCollapsed}>Analytics</SidebarMenuLabel>
          </SidebarMenuItem>
          <SidebarMenuItem collapsed={sidebarCollapsed}>
            <FiFileText />
            <SidebarMenuLabel collapsed={sidebarCollapsed}>Reports</SidebarMenuLabel>
          </SidebarMenuItem>
          <SidebarMenuItem collapsed={sidebarCollapsed}>
            <FiSettings />
            <SidebarMenuLabel collapsed={sidebarCollapsed}>Settings</SidebarMenuLabel>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
      
      <Header>
        <div>
          <Breadcrumbs>
            <a href="#">Home</a>
            <FiChevronRight />
            <a href="#">{title}</a>
          </Breadcrumbs>
        </div>
        <HeaderControls>
          <IconButton>
            <FiSearch />
          </IconButton>
          <IconButton>
            <FiBell />
            <NotificationBadge />
          </IconButton>
          <IconButton onClick={onThemeToggle}>
            {currentTheme.isDark ? '☀️' : '🌙'}
          </IconButton>
          <UserMenu>
            <UserAvatar>JD</UserAvatar>
            <div style={{ display: sidebarCollapsed ? 'none' : 'block' }}>
              <div style={{ fontWeight: 500 }}>John Doe</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Product Manager</div>
            </div>
          </UserMenu>
        </HeaderControls>
      </Header>
      
      <Main>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
        </PageHeader>
        {children}
      </Main>
    </LayoutContainer>
  );
}

export default EnterpriseLayout;
