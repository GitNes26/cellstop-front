// context/VisitContext.tsx
import { createContext, useContext, useRef, useState } from "react";
import { Axios, AxiosFiles, Response } from "../utils/Api";
import Toast from "../utils/Toast";
import { useAuthContext } from "./AuthContext";
import to from "await-to-js";

const VisitContext = createContext();

export const formDataInitialState = {
   id: null,
   seller_id: "",
   pos_id: "",
   contact_name: "",
   contact_phone: "",
   visit_type: "Monitoreo",
   lat: null,
   lon: null,
   ubication: "",
   evidence_photo: "",
   product_ids: [],
   chips_delivered: null,
   chips_sold: null,
   chips_remaining: null,
   observations: ""
};

const prefixPath = "/visits";

export default function VisitContextProvider({ children }) {
   const { auth } = useAuthContext();

   const [visit, setVisit] = useState(null);
   const [allVisits, setAllVisits] = useState([]);
   const [visitsSelect, setVisitsSelect] = useState([]);
   const [formTitle, setFormTitle] = useState("REGISTRAR VISITA");
   const [textBtnSubmit, setTextBtnSubmit] = useState("REGISTRAR");
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);
   const formikRef = useRef(null);
   const [isEdit, setIsEdit] = useState(false);
   const [imgEvidencePhoto, setImgEvidencePhoto] = useState([]);
   const [availableProducts, setAvailableProducts] = useState([]);
   const [currentLocation, setCurrentLocation] = useState(null);
   const [locationError, setLocationError] = useState("");

   //#region CRUD
   const getAllVisits = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}`));

      if (error) {
         console.log("🚀 ~ getAllVisits ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al obtener visitas";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setAllVisits(res.result);
      return res;
   };

   const getSelectIndexVisits = async () => {
      const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));

      if (error) {
         console.log("🚀 ~ getSelectIndexVisits ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al obtener visitas";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setVisitsSelect(res.result);
      return res;
   };

   const createOrUpdateVisit = async (data) => {
      const id = data.id > 0 ? `/${data.id}` : "";
      const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));

      if (error) {
         console.log("🚀 ~ createOrUpdateVisit ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al guardar la visita";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllVisits();
      return res;
   };

   const getVisit = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));

      if (error) {
         console.log("🚀 ~ getVisit ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al obtener la visita";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      setVisit(res.result);
      return res;
   };

   const deleteVisit = async (id) => {
      const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));

      if (error) {
         console.log("🚀 ~ deleteVisit ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al eliminar la visita";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllVisits();
      return res;
   };

   const disEnableVisit = async (id, active) => {
      const strActive = active ? "reactivar" : "desactivar";
      const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));

      if (error) {
         console.log("🚀 ~ disEnableVisit ~ error:", error);
         const message = error.response?.data?.message || "Ocurrió un error al cambiar estado";
         Toast.Error(message);
         return;
      }

      Response.success = response.data.data;
      const res = Response.success;
      await getAllVisits();
      return res;
   };
   //#endregion CRUD

   // Obtener productos disponibles para el vendedor
   const getAvailableProductsForSeller = async (sellerId) => {
      const [error, response] = await to(Axios.get(`/products/available-for-seller/${sellerId}`));

      if (error) {
         console.log("🚀 ~ getAvailableProductsForSeller ~ error:", error);
         Toast.Error("Error al obtener productos disponibles");
         return [];
      }

      const res = response.data.data;
      setAvailableProducts(res.result || []);
      return res.result || [];
   };

   // Verificar ubicación vs punto de venta
   const verifyLocation = async (pos, userLat, userLon) => {
      try {
         // // Obtener coordenadas del punto de venta
         // const [error, response] = await to(Axios.get(`/point-of-sale/coordinates/${posId}`));

         // if (error) {
         //    console.log("🚀 ~ verifyLocation ~ error:", error);
         //    return { valid: false, message: "Error al verificar ubicación del punto de venta" };
         // }

         // const pos = response.data.data.result;
         // if (!pos.lat || !pos.lon) {
         //    return { valid: false, message: "El punto de venta no tiene coordenadas registradas" };
         // }

         const distance = calculateDistance(Number(userLat), Number(userLon), Number(pos.lat), Number(pos.lon));
         const isValid = distance <= 0.01; // ~10 metros

         return {
            valid: isValid,
            distance: distance,
            message: isValid
               ? `Ubicación verificada (${(distance * 1000).toFixed(1)} metros del punto de venta)`
               : `Estás demasiado lejos (${(distance * 1000).toFixed(1)} metros). Debes estar a máximo 10 metros.`
         };
      } catch (error) {
         console.log("🚀 ~ verifyLocation ~ error:", error);
         return { valid: false, message: "Error al verificar ubicación" };
      }
   };

   // Función para calcular distancia en kilómetros
   const calculateDistance = (lat1, lon1, lat2, lon2) => {
      // console.log("🚀 ~ calculateDistance ~ lon1:", lon1);
      // console.log("🚀 ~ calculateDistance ~ lat1:", lat1);
      // console.log("🚀 ~ calculateDistance ~ lon2:", lon2);
      // console.log("🚀 ~ calculateDistance ~ lat2:", lat2);
      const R = 6371; // Radio de la Tierra en km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
   };

   return (
      <VisitContext.Provider
         value={{
            singularName: "Visita",
            pluralName: "Visitas",
            visit,
            setVisit,
            allVisits,
            setAllVisits,
            visitsSelect,
            setVisitsSelect,
            formTitle,
            setFormTitle,
            textBtnSubmit,
            setTextBtnSubmit,
            formData,
            setFormData,
            openDialog,
            setOpenDialog,
            formikRef,
            isEdit,
            setIsEdit,
            imgEvidencePhoto,
            setImgEvidencePhoto,
            availableProducts,
            setAvailableProducts,
            currentLocation,
            setCurrentLocation,
            locationError,
            setLocationError,
            getAllVisits,
            getSelectIndexVisits,
            createOrUpdateVisit,
            getVisit,
            deleteVisit,
            disEnableVisit,
            getAvailableProductsForSeller,
            verifyLocation,
            calculateDistance
         }}
      >
         {children}
      </VisitContext.Provider>
   );
}

export const useVisitContext = () => useContext(VisitContext);
