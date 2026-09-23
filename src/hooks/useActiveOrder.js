// hooks/useActiveOrder.js
import { useEffect, useState } from 'react';

/**
 * Fetch order aktif user.
 * Return:
 *  - order: object | null
 *  - loading: boolean
 *  - error: string | null
 *  - refetch: () => void
 */
export function useActiveOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/orders/active', {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.status === 404) return null;     // nggak ada order = bukan error
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [trigger]);

  const refetch = () => setTrigger((t) => t + 1);

  return { order, loading, error, refetch };
}