// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Axios } from "../utils/Api";

interface DashboardFilters {
   startDate: Date | null;
   endDate: Date | null;
   sellerIds: number[];
   locationStatus: string | null;
   activationStatus: string | null;
   productTypeId: number | null;
   searchText: string;
}

export interface DashboardData {
   stats: {
      activation_rate: number;
      points_of_sale: number;
      sellers: number;
      avg_products_per_seller: number;
      portability_rate: number;
      distributed: number;
      portados: number;
      products: number;
      activated: number;
      visits: number;

      assigned?: number;
      in_transit?: number;
      [key: string]: number | undefined;
   };
   portability_by_month: Record<string, number>;
   top_sellers: Array<{ id: number; name: string; port_count: number; color: string }>;
   top_products: Array<{ producto: string; count: number }>;
   status_distribution: Record<string, number>;
   ported_numbers: Array<any>;
   points_of_sale: Array<any>;
   sellers_performance: Array<any>;
   visits_summary: Record<string, any>;
}
interface ObjRes {
   alert_icon: string;
   alert_text: string;
   alert_title: string;
   message: string;
   result: DashboardData;
   status: boolean;
   status_code: number;
   toast: boolean;
}

export const useDashboardData = (filters: DashboardFilters) => {
   const [data, setData] = useState<DashboardData | null>(null);
   const [response, setResponse] = useState<ObjRes | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

   const buildParams = useCallback(() => {
      const params: any = {};

      if (filters.startDate) {
         params.start_date = filters.startDate.toISOString().split("T")[0];
      }

      if (filters.endDate) {
         params.end_date = filters.endDate.toISOString().split("T")[0];
      }

      if (filters.sellerIds.length > 0) {
         params.seller_id = filters.sellerIds;
      }

      if (filters.locationStatus) {
         params.location_status = filters.locationStatus;
      }

      if (filters.activationStatus) {
         params.activation_status = filters.activationStatus;
      }

      if (filters.productTypeId) {
         params.product_type_id = filters.productTypeId;
      }

      if (filters.searchText) {
         params.search = filters.searchText;
      }

      return params;
   }, [filters]);

   const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
         const params = buildParams();
         params._t = Date.now(); // Evitar cache

         // const response = await axios.get("/api/dashboard/stats", { params });
         const response = await Axios.get("/dashboard/stats", { params });

         console.log("🚀 ~ useDashboardData ~ response.data:", response.data);
         setData(response.data.data.result);
         setResponse(response.data.data);
         setLastUpdated(new Date());
      } catch (err) {
         setError(err as Error);
         console.error("Error fetching dashboard data:", err);
      } finally {
         setLoading(false);
      }
   }, [buildParams]);

   const refresh = useCallback(() => {
      fetchData();
   }, [fetchData]);

   const exportData = useCallback(
      async (type: "excel" | "pdf") => {
         try {
            const params = buildParams();
            params.export_type = type;

            const response = await axios.get("/api/dashboard/export", {
               params,
               responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            const timestamp = new Date().toISOString().split("T")[0];
            link.setAttribute("download", `dashboard_cellstop_${timestamp}.${type === "excel" ? "xlsx" : "pdf"}`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
         } catch (err) {
            console.error("Error exporting data:", err);
            throw err;
         }
      },
      [buildParams]
   );

   // Debounce para evitar múltiples llamadas
   useEffect(() => {
      const timer = setTimeout(() => {
         fetchData();
      }, 500);

      return () => clearTimeout(timer);
   }, [fetchData]);

   return {
      data,
      response,
      loading,
      error,
      refresh,
      exportData,
      lastUpdated
   };
};

// import { useState, useEffect, useCallback } from "react";
// import { HeaderStatsProps } from "../components/dashboard/sections/HeaderStats";
// import axios from "axios";
// import { Axios } from "../utils/Api";

// interface DashboardFilters {
//    startDate: Date | null;
//    endDate: Date | null;
//    sellerIds: number[];
//    locationStatus: string | null;
//    activationStatus: string | null;
//    productTypeId: number | null;
//    searchText: string;
// }

// interface DashboardData {
//    stats: HeaderStatsProps;
//    portability_by_month: Record<number, number>;
//    top_sellers: Array<{ id: number; name: string; port_count: number; color: string }>;
//    top_products: Array<{ producto: string; count: number }>;
//    status_distribution: Record<string, number>;
//    ported_numbers: Array<{
//       id: number;
//       celular: string;
//       iccid: string;
//       producto: string;
//       port_date: string;
//       vendedor: string;
//       vendedor_color: string;
//       vendedor_id: number;
//    }>;
//    points_of_sale: Array<any>;
// }

// export const useDashboardData = (filters: DashboardFilters) => {
//    const [data, setData] = useState<DashboardData | null>(null);
//    const [loading, setLoading] = useState(false);
//    const [error, setError] = useState<Error | null>(null);
//    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//    // Función para construir parámetros
//    const buildParams = useCallback(() => {
//       const params: any = {};

//       if (filters.startDate) {
//          params.start_date = filters.startDate.toISOString().split("T")[0];
//       }

//       if (filters.endDate) {
//          params.end_date = filters.endDate.toISOString().split("T")[0];
//       }

//       if (filters.sellerIds.length > 0) {
//          params.seller_id = filters.sellerIds;
//       }

//       if (filters.locationStatus) {
//          params.location_status = filters.locationStatus;
//       }

//       if (filters.activationStatus) {
//          params.activation_status = filters.activationStatus;
//       }

//       if (filters.productTypeId) {
//          params.product_type_id = filters.productTypeId;
//       }

//       if (filters.searchText) {
//          params.search = filters.searchText;
//       }

//       return params;
//    }, [filters]);

//    const fetchData = useCallback(async () => {
//       setLoading(true);
//       setError(null);

//       try {
//          const params = buildParams();

//          // Agregar timestamp para evitar cache
//          params._t = Date.now();

//          const response = await Axios.get("/dashboard/stats", { params });
//          // console.log("🚀 ~ useDashboardData ~ response:", response);

//          setData(response.data);
//          setLastUpdated(new Date());
//       } catch (err) {
//          setError(err as Error);
//          console.error("Error fetching dashboard data:", err);
//       } finally {
//          setLoading(false);
//       }
//    }, [buildParams]);

//    const refresh = useCallback(() => {
//       fetchData();
//    }, [fetchData]);

//    const exportData = useCallback(
//       async (type: "excel" | "pdf") => {
//          try {
//             const params = buildParams();
//             params.export_type = type;

//             const response = await axios.get("/api/dashboard/export", {
//                params,
//                responseType: "blob"
//             });

//             // Crear y descargar archivo
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement("a");
//             link.href = url;

//             const timestamp = new Date().toISOString().split("T")[0];
//             link.setAttribute("download", `dashboard_cellstop_${timestamp}.${type === "excel" ? "xlsx" : "pdf"}`);

//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(url);

//             return true;
//          } catch (err) {
//             console.error("Error exporting data:", err);
//             throw err;
//          }
//       },
//       [buildParams]
//    );

//    // Efecto para cargar datos iniciales y cuando cambian los filtros
//    useEffect(() => {
//       const timer = setTimeout(() => {
//          fetchData();
//       }, 300); // Debounce de 300ms

//       return () => clearTimeout(timer);
//    }, [fetchData]);

//    return {
//       data,
//       loading,
//       error,
//       refresh,
//       exportData,
//       lastUpdated
//    };
// };
