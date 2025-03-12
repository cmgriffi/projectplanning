import { useState, createContext, useEffect, useCallback, useMemo } from 'react';
import ReactConfetti from 'react-confetti';
import { IdeaDetail } from './components/IdeaDetail';
import { AddIdeaModal } from './components/AddIdeaModal';
import { CreateIdea } from './components/CreateIdea';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { FiMessageSquare, FiX, FiSearch, FiColumns, FiPlus, FiFilter, FiDownload } from 'react-icons/fi';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import EnterpriseLayout from './components/EnterpriseLayout';
import DataTable from './components/DataTable';
import ChatModal from './components/ChatModal';

const lightTheme = {
  background: '#f7fafc',
  text: '#2d3748',
  tableBackground: 'white',
  headerBackground: '#2d3748',
  rowHover: '#f7fafc',
  borderColor: '#e2e8f0',
  buttonBackground: '#2d3748',
  buttonHover: '#4a5568',
  isDark: false
};

const darkTheme = {
  background: '#1a202c',
  text: '#f7fafc',
  tableBackground: '#2d3748',
  headerBackground: '#1a202c',
  rowHover: '#374151',
  borderColor: '#374151',
  buttonBackground: '#4a5568',
  buttonHover: '#374151',
  isDark: true
};

export const ThemeContext = createContext(null);

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: ${props => props.theme.buttonBackground};
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.buttonHover};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  .filters {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.text};
    opacity: 0.5;
    width: 1rem;
    height: 1rem;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.theme.tableBackground};
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  width: 200px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.buttonHover};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.buttonBackground};
    box-shadow: 0 0 0 2px ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'In Progress':
        return '#10B981';
      case 'Under Review':
        return '#F59E0B';
      case 'New':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  }};
  color: white;
`;

const PriorityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.priority) {
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#F59E0B';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  }};
  color: white;
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: ${props => props.primary ? props.theme.buttonBackground : props.theme.tableBackground};
  color: ${props => props.primary ? 'white' : props.theme.text};
  border: ${props => props.primary ? 'none' : `1px solid ${props.theme.borderColor}`};
  
  &:hover {
    background: ${props => props.primary ? props.theme.buttonHover : props.theme.rowHover};
  }
`;

const initialColumns = [
  { id: 'drag', label: '', fixed: true },
  { id: 'title', label: 'Title' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: 'owner', label: 'Owner' },
  { id: 'eta', label: 'ETA' },
  { id: 'region', label: 'Region' },
  { id: 'businessFunction', label: 'Business Function' },
  { id: 'application', label: 'Application / Team' }
];

const initialItems = [
  { 
    id: '1', 
    title: 'AI-Powered Task Manager',
    description: 'A smart task manager that uses AI to prioritize and organize tasks',
    status: 'In Progress',
    priority: 'High',
    owner: 'Sarah Chen',
    eta: 'Q2 2025',
    region: 'North America',
    businessFunction: 'Product Development',
    application: 'Productivity Suite'
  },
  { 
    id: '2', 
    title: 'Smart Home Dashboard',
    description: 'Unified dashboard for controlling all smart home devices',
    status: 'New',
    priority: 'Medium',
    owner: 'James Wilson',
    eta: 'Q3 2025',
    region: 'Europe',
    businessFunction: 'IoT Solutions',
    application: 'Smart Home Team'
  },
  { 
    id: '3', 
    title: 'Health Tracking App',
    description: 'Comprehensive health and fitness tracking application',
    status: 'Under Review',
    priority: 'High',
    owner: 'Lisa Martinez',
    eta: 'Q4 2025',
    region: 'APAC',
    businessFunction: 'Healthcare Solutions',
    application: 'Health & Wellness'
  },
  { 
    id: '4', 
    title: 'Social Learning Platform',
    description: 'Platform for connecting students and mentors',
    status: 'New',
    priority: 'Low',
    owner: 'Ryan Kim',
    eta: 'Q1 2026',
    region: 'Global',
    businessFunction: 'Education Technology',
    application: 'Learning Platform'
  },
  { 
    id: '5', 
    title: 'AR Shopping Assistant',
    description: 'Augmented reality app for enhanced shopping experience',
    status: 'In Progress',
    priority: 'Medium',
    owner: 'Olivia Zhang',
    eta: 'Q3 2025',
    region: 'APAC',
    businessFunction: 'Retail Innovation',
    application: 'AR/VR Team'
  }
];

function App() {
  const [data, setData] = useState(initialItems);
  const [isAddIdeaOpen, setIsAddIdeaOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showColumnControls, setShowColumnControls] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? darkTheme : lightTheme;
  });

  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [draggedRowId, setDraggedRowId] = useState(null);

  const handleDragStart = useCallback((rowId) => {
    setDraggedRowId(rowId);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!draggedRowId) return;
    setDraggedRowId(null);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [draggedRowId]);

  const handleDragOver = useCallback((e, targetRowId) => {
    e.preventDefault();
    if (!draggedRowId || draggedRowId === targetRowId) return;

    setData(prevData => {
      const newData = [...prevData];
      const draggedIndex = newData.findIndex(item => item.id === draggedRowId);
      const targetIndex = newData.findIndex(item => item.id === targetRowId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prevData;
      
      const [draggedItem] = newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, draggedItem);
      return newData;
    });
  }, [draggedRowId]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'drag',
        header: '',
        cell: () => (
          <div style={{ cursor: 'grab', padding: '0.5rem' }}>
            ⋮⋮
          </div>
        ),
        size: 48,
        enableHiding: false,
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => {
          const value = info.getValue() || 'Untitled';
          return (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `hsl(${Math.abs(value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360}, 70%, 80%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a202c',
                fontWeight: '500',
                fontSize: '0.875rem',
              }}>
                {value.split(' ').map(word => word[0]).join('')}
              </div>
              {value}
            </div>
          );
        },
        size: 200,
        minSize: 150,
        enableHiding: false,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => (
          <div style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4',
            opacity: 0.9,
          }}>
            {info.getValue() || 'No description'}
          </div>
        ),
        size: 350,
        minSize: 250,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => {
          const value = info.getValue() || 'New';
          return (
            <StatusBadge status={value}>
              {value}
            </StatusBadge>
          );
        },
        size: 140,
        minSize: 120,
        enableHiding: false,
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: info => {
          const value = info.getValue() || 'Medium';
          return (
            <PriorityBadge priority={value}>
              {value}
            </PriorityBadge>
          );
        },
        size: 120,
        minSize: 100,
        enableHiding: false,
      }),
      columnHelper.accessor('owner', {
        header: 'Owner',
        cell: info => {
          const value = info.getValue() || 'Unassigned';
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `hsl(${Math.abs(value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360}, 70%, 80%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a202c',
                fontWeight: '500',
                fontSize: '0.875rem',
              }}>
                {value.split(' ').map(word => word[0]).join('')}
              </div>
              {value}
            </div>
          );
        },
        size: 180,
        minSize: 150,
      }),
      columnHelper.accessor('eta', {
        header: 'ETA',
        cell: info => {
          const quarter = info.getValue();
          const isOverdue = quarter < 'Q' + ((new Date().getMonth() / 3 | 0) + 1) + ' ' + new Date().getFullYear();
          return (
            <div style={{ 
              color: isOverdue ? '#EF4444' : 'inherit',
              fontWeight: isOverdue ? '500' : 'inherit',
            }}>
              {quarter}
            </div>
          );
        },
        size: 120,
        minSize: 100,
      }),
      columnHelper.accessor('region', {
        header: 'Region',
        cell: info => (
          <div style={{ 
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            background: currentTheme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            fontSize: '0.875rem',
          }}>
            {info.getValue()}
          </div>
        ),
        size: 120,
        minSize: 100,
      }),
      columnHelper.accessor('businessFunction', {
        header: 'Business Function',
        cell: info => info.getValue(),
        size: 180,
        minSize: 150,
      }),
      columnHelper.accessor('application', {
        header: 'Application',
        cell: info => info.getValue(),
        size: 150,
        minSize: 120,
      }),
    ],
    [currentTheme]
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stopConfetti = useCallback(() => {
    const fadeOutDuration = 1000;
    const fadeOutSteps = 20;
    const stepDuration = fadeOutDuration / fadeOutSteps;
    
    setTimeout(() => {
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 1 / fadeOutSteps;
        setConfettiOpacity(Math.max(0, opacity));
        
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          setShowConfetti(false);
          setConfettiOpacity(1);
        }
      }, stepDuration);
    }, 2000);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme.isDark ? 'dark' : 'light');
  }, [currentTheme]);

  const handleSaveIdea = (editedIdea) => {
    setData(prevData => prevData.map(item =>
      item.id === editedIdea.id ? editedIdea : item
    ));
  };

  const handleAddIdea = (newIdea) => {
    const idea = {
      ...newIdea,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setData(prev => [...prev, idea]);
    setIsAddIdeaOpen(false);
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    enableSorting: true,
    enableMultiSort: true,
    enableColumnVisibility: true,
    enableGlobalFilter: true,
  });

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: confettiOpacity, transition: 'opacity 0.05s linear', zIndex: 9999 }}>
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.2}
            initialVelocityY={20}
            colors={['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899']}
          />
        </div>
      )}
      
      <EnterpriseLayout 
        title="Product Ideas Pipeline"
        onThemeToggle={() => setCurrentTheme(prev => prev.isDark ? lightTheme : darkTheme)}
        currentTheme={currentTheme}
      >
        <Controls>
          <ToolbarGroup>
            <SearchInputWrapper>
              <FiSearch />
              <SearchInput
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search ideas..."
              />
            </SearchInputWrapper>
            <ActionButton>
              <FiFilter />
              Filter
            </ActionButton>
            <ActionButton onClick={() => setShowColumnControls(!showColumnControls)}>
              <FiColumns />
              Columns
            </ActionButton>
          </ToolbarGroup>
          
          <ToolbarGroup>
            <ActionButton>
              <FiDownload />
              Export
            </ActionButton>
            <ActionButton primary onClick={() => setIsAddIdeaOpen(true)}>
              <FiPlus />
              Add Idea
            </ActionButton>
          </ToolbarGroup>
        </Controls>
        
        {showColumnControls && (
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap',
            padding: '0.75rem',
            marginBottom: '1rem',
            background: currentTheme.tableBackground,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: '6px'
          }}>
            {table.getAllLeafColumns()
              .filter(column => column.columnDef.enableHiding !== false)
              .map(column => {
                return (
                  <div key={column.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        userSelect: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        background: column.getIsVisible() ? currentTheme.buttonBackground : 'transparent',
                        color: column.getIsVisible() ? 'white' : currentTheme.text,
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        style={{ margin: 0 }}
                      />
                      {column.columnDef.header}
                    </label>
                  </div>
                );
              })}
          </div>
        )}
        
        <DataTable 
          table={table}
          onRowClick={setSelectedIdea}
          showPagination={true}
        />
        
        {isAddIdeaOpen && (
          <AddIdeaModal
            onClose={() => setIsAddIdeaOpen(false)}
            onSubmit={handleAddIdea}
          />
        )}
        
        {showCreateForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '2rem' }}>
              <CreateIdea
                onSubmit={(newIdea) => {
                  const id = String(data.length + 1);
                  setData(prev => [...prev, { ...newIdea, id }]);
                  setShowCreateForm(false);
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 3000);
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}
        
        <ChatModal 
          isOpen={isChatOpen}
          onClose={setIsChatOpen}
          idea={selectedIdea}
          allIdeas={data}
        />
        
        {selectedIdea && (
          <IdeaDetail
            idea={selectedIdea}
            onClose={() => setSelectedIdea(null)}
            onSave={handleSaveIdea}
          />
        )}
      </EnterpriseLayout>
    </ThemeProvider>
  );
}

export default App;
