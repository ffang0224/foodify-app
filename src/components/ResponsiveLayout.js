import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  UtensilsCrossed,
  Home,
  List,
  Search,
  Bell,
  Trophy,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuthUser } from '../hooks/useAuthUser';
import { NavBar } from '../App';
const MobileHeader = ({ isOpen, onToggle }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 md:hidden">
    <div className="flex items-center justify-between px-4 h-full">
      <div className="flex items-center">
        <UtensilsCrossed className="w-8 h-8 text-orange-500" />
        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Foodify</span>
      </div>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </header>
);

const MobileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuthUser();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/map' },
    { icon: List, label: 'My Lists', path: '/lists' },
    { icon: UtensilsCrossed, label: 'Discover', path: '/discover' },
    { icon: Search, label: 'Search Foodies', path: '/DisplayUser' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <UtensilsCrossed className="w-8 h-8 text-orange-500" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Foodify</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-3 mb-6 p-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <span className="text-orange-500 font-semibold">
              {userData?.firstName?.[0]}{userData?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{userData?.username}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                location.pathname === item.path
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const ResponsiveLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <MobileHeader 
        isOpen={isMobileMenuOpen} 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
      
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavBar />
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
      
      {/* Main Content */}
      <main className={`${isMobile ? 'px-4 pt-16' : 'pl-20 lg:pl-64'} min-h-screen`}>
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResponsiveLayout;