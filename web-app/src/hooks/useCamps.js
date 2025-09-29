import { useState, useEffect } from 'react';
import { CampService } from '../service/CampService';

export const useCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const service = new CampService();
        const data = await service.findAll();
        setCamps(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, []);

  return { camps, loading, error };
};

export default useCamps;
