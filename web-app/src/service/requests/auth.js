import api from "../axiosInstance";

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${process.env.REACT_APP_API_BASE_URL}/users/create`, userData);
    return response.data; 
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await api.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

