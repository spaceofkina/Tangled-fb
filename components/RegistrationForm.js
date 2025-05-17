// components/RegistrationForm.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Dynamically import Map components
const Map = dynamic(
  () => import('react-map-gl').then((mod) => mod.Map),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-map-gl').then((mod) => mod.Marker),
  { ssr: false }
);

// Define validation schema
const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
});

const RegistrationForm = ({ onClose, onSubmit }) => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      location: null
    }
  });

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setSelectedLocation({ longitude: lng, latitude: lat });
    setValue('location', { longitude: lng, latitude: lat }, { shouldValidate: true });
  };

  const handleAddressSelect = () => {
    if (selectedLocation) {
      setValue('address', `Selected Location (${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)})`, { shouldValidate: true });
    }
    setMapModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Create an Account</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  {...register("firstName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  {...register("lastName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                {...register("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="address">
                Address
              </label>
              <div className="flex">
                <input
                  id="address"
                  {...register("address")}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setMapModalOpen(true)}
                  className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-2 rounded-r-md hover:to-amber-500"
                >
                  Map
                </button>
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white py-2 px-4 rounded-md hover:to-amber-500  transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {/* Map Modal for Address Selection */}
      {mapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Select Your Location</h3>
              <button 
                onClick={() => setMapModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
              <Map
                initialViewState={{
                  longitude: selectedLocation?.longitude || 0,
                  latitude: selectedLocation?.latitude || 20,
                  zoom: selectedLocation ? 12 : 1.5
                }}
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
                style={{ width: '100%', height: '100%' }}
                attributionControl={false}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker
                    longitude={selectedLocation.longitude}
                    latitude={selectedLocation.latitude}
                    anchor="bottom"
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                  </Marker>
                )}
              </Map>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAddressSelect}
                disabled={!selectedLocation}
                className={`px-4 py-2 rounded-md text-white ${selectedLocation ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:to-amber-500 ' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Select Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationForm;