import React, { useState, useEffect } from 'react';
import { HiOutlineSparkles } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import RegistrationForm from './RegistrationForm';

// Dynamically import MapLibre components
const Map = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.Map),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.Marker),
  { ssr: false }
);
const NavigationControl = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.NavigationControl),
  { ssr: false }
);

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 20,
    longitude: 0,
    zoom: 1.5
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleRegistrationSubmit = (data) => {
    console.log('Form data submitted:', data);
    alert(`Registration successful for ${data.firstName} ${data.lastName}`);
    setShowRegister(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data. Please try again later.');
        setUsers([
          {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            email: "john@example.com",
            phone: "123-456-7890",
            address: {
              street: "123 Main St",
              suite: "Apt 101",
              city: "New York",
              zipcode: "10001",
              geo: { lat: "40.7128", lng: "-74.0060" }
            },
            company: {
              name: "Example Corp",
              catchPhrase: "Making examples since 2020"
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsMobileSidebarOpen(false); // Close sidebar when user is clicked
    if (user.address?.geo) {
      setViewport({
        latitude: parseFloat(user.address.geo.lat),
        longitude: parseFloat(user.address.geo.lng),
        zoom: 10
      });
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="xl:hidden fixed top-4 right-4 z-40">
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-700 hover:text-purple-600"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Sidebar */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        xl:translate-x-0
        fixed top-0 right-0 z-30 w-72 xl:w-[320px] h-full bg-white border-l border-gray-200
        transition-transform duration-300 ease-in-out overflow-y-auto
      `}>
        {/* Close button for mobile */}
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="xl:hidden absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col h-full p-4">
          {/* Cloud-style Register Button */}
          <div 
            className="relative bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full px-4 py-2 mb-4 cursor-pointer hover:to-amber-500 transition-colors"
            onClick={() => {
              setShowRegister(true);
              setIsMobileSidebarOpen(false);
            }}
          >
            <div className="flex items-center justify-center">
              <span className="font-bold">Register Now!</span>
            </div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-yellow-100 transform rotate-45"></div>
          </div>

          <div className='sticky top-0 bg-white flex justify-between font-medium text-[20px] px-4 py-2 border-b border-gray-200 z-10'>
            <h2 className="text-xl font-bold">People you may know</h2>
            <HiOutlineSparkles className="text-gray-800" />
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-500 text-center">{error}</div>
            ) : (
              users.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center p-3 hover:bg-yellow-200 rounded-lg cursor-pointer transition"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 font-bold mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">@{user.username.toLowerCase()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-4 text-xs text-gray-500 px-4">
            <div className="flex flex-wrap gap-2">
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Cookies</span>
            </div>
            <p className="mt-2">© 2025 Tangled</p>
          </div>
        </div>
      </div>

      {/* Registration Form Modal - Centered overlay */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <RegistrationForm 
              onClose={() => setShowRegister(false)}
              onSubmit={handleRegistrationSubmit}
            />
          </div>
        </div>
      )}

      {/* User Details Modal - Centered overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-700">Contact Information</h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <p className="text-gray-600">{selectedUser.phone}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-700">Company</h4>
                    <p className="text-gray-600 italic">&quot;{selectedUser.company?.catchPhrase}&quot;</p>
                    <p className="text-gray-600 italic">"{selectedUser.company?.catchPhrase}"</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700">Address</h4>
                    <p className="text-gray-600">
                      {selectedUser.address?.street}, {selectedUser.address?.suite}<br />
                      {selectedUser.address?.city}, {selectedUser.address?.zipcode}
                    </p>
                  </div>
                </div>

                <div className="h-64 md:h-full rounded-lg overflow-hidden border border-gray-200">
                  <Map
                    initialViewState={{
                      longitude: viewport.longitude,
                      latitude: viewport.latitude,
                      zoom: viewport.zoom
                    }}
                    mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=DdmVCy3cbiOYEjdTHk4e"
                    style={{ width: '100%', height: '100%' }}
                    attributionControl={true}
                  >
                    <NavigationControl position="top-left" />
                    {selectedUser?.address?.geo && (
                      <Marker
                        longitude={parseFloat(selectedUser.address.geo.lng)}
                        latitude={parseFloat(selectedUser.address.geo.lat)}
                        anchor="bottom"
                      >
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {selectedUser.name.charAt(0)}
                        </div>
                      </Marker>
                    )}
                  </Map>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default RightSidebar;