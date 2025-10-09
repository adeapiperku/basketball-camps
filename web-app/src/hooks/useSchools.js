import { useState, useEffect } from "react";
import { SchoolService } from "../service/SchoolService";

export const useSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const service = new SchoolService();
        const data = await service.findAll();
        setSchools(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return { schools, loading, error };
};

export default useSchools;
