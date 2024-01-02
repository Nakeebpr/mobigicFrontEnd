


import axios from 'axios';
import { toast } from 'react-toastify';
const url = import.meta.env.REACT_APP_BASEURL
const api = axios.create({
  baseURL: "http://localhost:5050/",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    toast.success(response?.data?.message);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      toast.error(error.response.data.message);
      if (error.response.status == 408) {
        setTimeout(() => {
          // window.location.href = '/';
          localStorage.removeItem("token")
          localStorage.removeItem("role")
        }, 1000);
      }
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    return Promise.reject(error);
  }
);

export const get = async (url, params = {}, additionalHeaders = {}) => {

  try {
    const response = await api.get(url, {
      params,
      headers: {
        ...additionalHeaders, // Merge the additional headers with the interceptor headers
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (url, data = {}, customHeaders = {}) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        ...customHeaders.headers,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};
