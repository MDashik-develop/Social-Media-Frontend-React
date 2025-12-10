import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const http = axios.create({
      baseURL: 'http://127.0.0.1:8000/api/auth/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    http.post('/logout')
      .then((res) => {
        localStorage.removeItem("token");
         localStorage.removeItem("userData");
         // console.log(res.data);
        navigate('/login', { replace: true });
      })
      .catch(err => {
        console.log(err);
        // কোনো error হলে ও logout redirect করা যেতে পারে
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate('/login', { replace: true });
      });
  }, []);

  return null; // কিছু render করতে হবে না
}
