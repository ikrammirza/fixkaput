import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  ShoppingBag,
  User,
  Menu,
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  LogOut,
  Calendar,
  Bell,
  Search,
  Wind,
  Flame,
  Wrench,
  Zap,
  Recycle,
  Camera
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

// Services data for search
const services = [
  {
    id: 'ac-services',
    name: 'AC Services',
    title: 'Air Conditioning Services',
    description: 'Professional AC installation, repair, and maintenance services',
    keywords: ['ac', 'air conditioning', 'cooling', 'hvac', 'repair', 'installation', 'maintenance'],
    icon: 'Wind',
    path: '/services/ac'
  },
  {
    id: 'geyser-services',
    name: 'Geyser Services',
    title: 'Water Heater & Geyser Services',
    description: 'Expert geyser installation, repair, and maintenance services',
    keywords: ['geyser', 'water heater', 'hot water', 'installation', 'repair', 'maintenance'],
    icon: 'Flame',
    path: '/services/geyser'
  },
  {
    id: 'plumbing-services',
    name: 'Plumbing Services',
    title: 'Professional Plumbing Solutions',
    description: 'Complete plumbing services including repairs, installations, and maintenance',
    keywords: ['plumbing', 'pipes', 'water', 'drainage', 'faucet', 'leak', 'repair', 'installation'],
    icon: 'Wrench',
    path: '/services/plumbing'
  },
  {
    id: 'electrician-services',
    name: 'Electrician Services',
    title: 'Electrical Services & Solutions',
    description: 'Licensed electrician services for all your electrical needs',
    keywords: ['electrician', 'electrical', 'wiring', 'lights', 'power', 'installation', 'repair'],
    icon: 'Zap',
    path: '/services/electrician'
  },
  {
    id: 'scrap-services',
    name: 'Scrap Services',
    title: 'Scrap Collection & Recycling',
    description: 'Eco-friendly scrap collection and recycling services',
    keywords: ['scrap', 'recycling', 'waste', 'collection', 'metal', 'paper', 'disposal'],
    icon: 'Recycle',
    path: '/services/scrap'
  },
  {
    id: 'cctv-services',
    name: 'CCTV Services',
    title: 'Security Camera & CCTV Solutions',
    description: 'Professional CCTV installation and security camera services',
    keywords: ['cctv', 'security', 'camera', 'surveillance', 'monitoring', 'installation', 'security system'],
    icon: 'Camera',
    path: '/services/cctv'
  }
];

// Icon mapping
const iconMap = {
  Wind,
  Flame,
  Wrench,
  Zap,
  Recycle,
  Camera
};

const Navbar = ({
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  logout,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [dropdown, setdropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);

  const router = useRouter();
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = services.filter(service => {
      // Search in service name
      if (service.name.toLowerCase().includes(query)) return true;

      // Search in service title
      if (service.title.toLowerCase().includes(query)) return true;

      // Search in keywords
      return service.keywords.some(keyword =>
        keyword.toLowerCase().includes(query)
      );
    });

    setFilteredServices(filtered);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setShowDesktopSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCartSidebar = () => {
    setCartSidebarOpen(!isCartSidebarOpen);
  };

  const handleLogoutClick = () => {
    toast.success("Successfully logged out!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
    setTimeout(() => {
      logout();
    }, 2000);
  };

  // Search handlers
  const handleDesktopSearchClick = () => {
    setShowDesktopSearch(true);
    setIsSearchOpen(true);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setIsSearchOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setShowDesktopSearch(false);
  };

  const handleServiceSelect = (service) => {
    router.push(service.path);
    clearSearch();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  // Search Results Component
  const SearchResults = ({ services, isVisible, isMobile = false }) => {
    if (!isVisible || services.length === 0) return null;

    return (
      <div className={`absolute ${isMobile ? 'top-full' : 'top-full'} left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-80 overflow-y-auto z-50`}>
        <div className="p-2">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon];

            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {service.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {services.length === 0 && searchQuery && (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No services found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>24/7 Emergency: +91-9381145944</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Serving All Major Cities</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.8/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Same Day Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200'
        : 'bg-white shadow-lg'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Image src="/fklogo.png" alt="FixKaput Logo" width={32} height={32} />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  FixKaput
                </h1>
                <p className="text-xs text-gray-500 font-medium">Professional Services</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 group ${router.pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full ${router.pathname === link.href ? 'w-full' : ''
                    }`} />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">

              {/* Desktop Search */}
              <div className="relative" ref={searchRef}>
                {!showDesktopSearch ? (
                  <button
                    onClick={handleDesktopSearchClick}
                    className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                  >
                    <Search className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Search services...</span>
                  </button>
                ) : (
                  <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Search className="w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none w-48"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                <SearchResults
                  services={filteredServices}
                  isVisible={isSearchOpen && showDesktopSearch}
                />
              </div>

              {/* Cart Button */}
              <button
                onClick={toggleCartSidebar}
                className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {Object.keys(cart).length}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div className="relative">
                {user.value ? (
                  <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onMouseEnter={() => setdropdown(true)}
                    onMouseLeave={() => setdropdown(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 hidden lg:block" />

                    {/* Dropdown Menu */}
                    {dropdown && (
                      <div
                        className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                        onMouseEnter={() => setdropdown(true)}
                        onMouseLeave={() => setdropdown(false)}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                          <p className="text-xs text-gray-500">Manage your account</p>
                        </div>

                        <Link href="/mybookings" className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">My Bookings</span>
                        </Link>

                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Login
                    </button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-40">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMobileMenu}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${router.pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Search */}
              <div className="px-4 py-3" ref={mobileSearchRef}>
                <div className="relative">
                  <div className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-xl">
                    <Search className="w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <SearchResults
                    services={filteredServices}
                    isVisible={isSearchOpen}
                    isMobile={true}
                  />
                </div>
              </div>

              {/* Mobile Contact Info */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">24/7 Emergency</span>
                </div>
                <p className="text-sm text-gray-600">+91-XXXXX-XXXXX</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <div className={`fixed inset-0 z-50 ${isCartSidebarOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isCartSidebarOpen ? 'opacity-50' : 'opacity-0'
            }`}
          onClick={toggleCartSidebar}
        />

        {/* Sidebar */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button
                onClick={toggleCartSidebar}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {Object.keys(cart).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some services to get started</p>
                  <button
                    onClick={toggleCartSidebar}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(cart).map((k) => (
                    <div key={k} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{cart[k].name}</h4>
                        <span className="text-lg font-bold text-blue-600">₹{(cart[k].price * cart[k].qty).toFixed(2)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">₹{cart[k].price} each</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => removeFromCart(k, 1)}

                            className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4 text-red-600" />
                          </button>
                          <span className="w-8 text-center font-semibold">{cart[k].qty}</span>
                          <button
                            onClick={() => addToCart(k, 1, cart[k].price, cart[k].name)}
                            className="p-1 hover:bg-green-100 rounded-lg transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4 text-green-600" />
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {Object.keys(cart).length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{subTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <button
                      onClick={toggleCartSidebar}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                    </button>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-white !text-gray-900 !shadow-xl !border !border-gray-200"
      />
    </>
  );
};

export default Navbar;