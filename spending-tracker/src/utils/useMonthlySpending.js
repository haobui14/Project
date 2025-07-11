import { useEffect, useState, useCallback } from 'react';
import { fetchMonthlySpending, setMonthlySpending } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

export default function useMonthlySpending(year, month) {
  const [user] = useAuthState(auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMonthlySpending(user.uid, year, month);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [user, year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save entire doc (used for adding or overwriting)
  const saveData = async (newData) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await setMonthlySpending(user.uid, year, month, newData);
      await fetchData();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // Update a single item in items array, or doc-level fields
  const updateData = async (id, fields) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMonthlySpending(user.uid, year, month);
      let items = res?.items ? [...res.items] : [];

      // If editing or deleting an item
      if (id !== null && id !== undefined) {
        if (fields._delete) {
          // Delete item by id
          items = items.filter((item) => item.id !== id);
        } else {
          // Edit item by id
          items = items.map((item) =>
            item.id === id ? { ...item, ...fields } : item
          );
        }
      }

      // If just updating doc-level fields (like status)
      let updateFields = {};
      if ((id === null || id === undefined) && fields) {
        updateFields = { ...fields };
      }

      // Recalculate total, paid, and status
      const total = items.reduce((sum, s) => sum + s.amount, 0);
      const paid = items
        .filter((s) => s.paid)
        .reduce((sum, s) => sum + s.amount, 0);
      let status = updateFields.status || 'unpaid';
      if (!updateFields.status) {
        if (paid === total && total > 0) status = 'paid';
        else if (paid > 0) status = 'partial';
        else status = 'unpaid';
      }

      // Compose updated doc
      const updatedDoc = {
        ...res,
        items,
        total,
        paid,
        status,
        ...updateFields, // doc-level fields (if any)
      };

      await setMonthlySpending(user.uid, year, month, updatedDoc);
      await fetchData();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, saveData, updateData, refetch: fetchData };
}
