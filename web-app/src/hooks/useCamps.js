import { useState, useEffect } from 'react';
import { CampService } from '../service/CampService';

const campService = new CampService();

export function useCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const data = await campService.findAll();
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
}

export default useCamps;

export function useCamp(campId) {
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamp = async () => {
      if (!campId) {
        setLoading(false);
        setError(new Error('No camp ID provided'));
        return;
      }

      try {
        setLoading(true);
        const data = await campService.findById(campId);
        if (!data) throw new Error('Camp data is null or undefined');

        setCamp(data);
        setError(null);
      } catch (err) {
        console.error('Error in useCamp:', {
          message: err.message,
          campId,
          error: err,
        });
        setError(err);
        setCamp(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCamp();
  }, [campId]);

  return { camp, loading, error };
}
