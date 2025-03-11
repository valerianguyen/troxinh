import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

import { config } from '@/utils';

const axiosClient = axios.create({
  baseURL: config.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

const jwtAxios = axios.create({
  baseURL: config.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})


axiosClient.interceptors.request.use(async (c) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const date = new Date()
    const decodedToken = jwtDecode(accessToken)
    if (decodedToken.exp < date.getTime() / 1000) {
      try {
        const res = await jwtAxios.post(`auth/renew/`, {}, {
          headers: {
            "x-client-id": decodedToken.id,
          }
        });
        const newAccessToken = res.data.metadata.accessToken
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken)
          c.headers.Authorization = `Bearer ${newAccessToken}`;
          c.headers["x-client-id"] = decodedToken.id
        }

      } catch (error) {
        if (error.status === 403 || error.status == 500 || error.status === 401 || error.status === 400) {
          localStorage.removeItem('accessToken')
          window.location.href = '/auth/login'
        }
      }
    } else {
      c.headers.Authorization = `Bearer ${accessToken}`;
      c.headers["x-client-id"] = decodedToken.id
    }
  }
  return c;
});


axiosClient.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error?.response?.data && error.response.data.code !== 404) {
      toast.error(error.response.data.message, {
        duration: 1000,
      })
    }
    return error.response
  })

export default axiosClient