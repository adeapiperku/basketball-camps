import { useState, useEffect } from 'react';
import { CoachService } from '../service/CoachService';

export const useCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const service = new CoachService();
        const data = await service.findAll();
        setCoaches(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return { coaches, loading, error };
};

export default useCoaches;
