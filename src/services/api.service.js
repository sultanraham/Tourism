import axiosInstance from '../api/axios';

/**
 * Service to handle all API communications for ROAM PK
 */
const apiService = {
  // Auth
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  
  // Destinations
  getDestinations: (params) => axiosInstance.get('/destinations', { params }),
  getDestination: (slug) => axiosInstance.get(`/destinations/${slug}`),
  
  // Stays
  getHotels: (params) => axiosInstance.get('/hotels', { params }),
  getHotel: (slug) => axiosInstance.get(`/hotels/${slug}`),
  
  // Food
  getRestaurants: (params) => axiosInstance.get('/restaurants', { params }),
  getRestaurant: (slug) => axiosInstance.get(`/restaurants/${slug}`),

  // Planner
  generateItinerary: (data) => axiosInstance.post('/planner/generate', data),
};

export default apiService;
