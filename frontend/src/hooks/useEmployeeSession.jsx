import { useEffect, useState } from "react";
import axios from "axios";

export const useEmployeeSession = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employee/me`, {
      withCredentials: true
    })
    .then((res) => setEmployee(res.data))
    .catch(() => setEmployee(null))
    .finally(() => setLoading(false));
  }, []);

  return { employee, loading };
};
