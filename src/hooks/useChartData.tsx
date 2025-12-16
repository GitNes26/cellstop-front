// src/hooks/useChartData.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface UseChartDataProps {
   endpoint: string;
   params?: Record<string, any>;
   transformData?: (data: any) => any;
   autoRefresh?: boolean;
   refreshInterval?: number;
}

export const useChartData = ({
   endpoint,
   params = {},
   transformData,
   autoRefresh = false,
   refreshInterval = 30000 // 30 segundos
}: UseChartDataProps) => {
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

   const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
         const response = await axios.get(endpoint, { params });
         const rawData = response.data;

         const transformedData = transformData ? transformData(rawData) : rawData;

         setData(transformedData);
         setLastUpdated(new Date());
      } catch (err: any) {
         setError(err.message || "Error al cargar datos");
         console.error(`Error fetching chart data from ${endpoint}:`, err);
      } finally {
         setLoading(false);
      }
   }, [endpoint, params, transformData]);

   // Auto-refresh
   useEffect(() => {
      if (autoRefresh) {
         const interval = setInterval(fetchData, refreshInterval);
         return () => clearInterval(interval);
      }
   }, [autoRefresh, refreshInterval, fetchData]);

   // Cargar datos iniciales
   useEffect(() => {
      fetchData();
   }, [fetchData]);

   return {
      data,
      loading,
      error,
      lastUpdated,
      refresh: fetchData
   };
};
