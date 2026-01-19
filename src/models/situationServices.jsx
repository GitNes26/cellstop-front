// import to from "await-to-js";
// import { Axios, AxiosFiles, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useSituationStore from "../stores/situationStore";
// // import { checkLoggedIn } from "./authService";
// import { useParams } from "react-router-dom";

// const prefixPath = "/situations";

// //#region CRUD
// export const getAllSituations = async () => {
//    const setAllSituations = useSituationStore.getState().setAllSituations;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllSituations ~ error:", error);
//    // console.log("🚀 ~ getAllSituations ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllSituations ~ error:", error);
//       const message = error.response.data.message || "getAllSituations ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllSituations(res.result);

//    return res;
// };

// export const getSelectIndexSituations = async () => {
//    const setSituationsSelect = useSituationStore.getState().setSituationsSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexSituations ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexSituations ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexSituations ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexSituations ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setSituationsSelect(res.result);

//    return res;
// };

// export const createOrUpdateSituation = async (data) => {
//    // console.log("🚀 ~ createOrUpdateSituation ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateSituation ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateSituation ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateSituation ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateSituation ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSituations();

//    return res;
// };

// export const followUpSituation = async (data) => {
//    console.log("🚀 ~ followUpSituation ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`${prefixPath}/followUp${id}`, data));
//    // console.log("🚀 ~ followUpSituation ~ error:", error);
//    // console.log("🚀 ~ followUpSituation ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ followUpSituation ~ error:", error);
//       const message = error.response.data.message || "followUpSituation ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSituations();

//    return res;
// };

// export const getSituation = async (column, value) => {
//    const setSituation = useSituationStore.getState().setSituation;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/${column}/${value}`));
//    // console.log("🚀 ~ getSituation ~ error:", error);
//    // console.log("🚀 ~ getSituation ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSituation ~ error:", error);
//       const message = error.response.data.message || "getSituation ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setSituation(res.result);

//    return res;
// };

// export const deleteSituation = async (id) => {
//    // console.log("🚀 ~ deleteSituation ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteSituation ~ error:", error);
//    // console.log("🚀 ~ deleteSituation ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteSituation ~ error:", error);
//       const message = error.response.data.message || "deleteSituation ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSituations();

//    return res;
// };

// export const disEnableSituation = async (id, active) => {
//    // console.log("🚀 ~ disEnableSituation ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableSituation ~ error:", error);
//    // console.log("🚀 ~ disEnableSituation ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableSituation ~ error:", error);
//       const message = error.response.data.message || "disEnableSituation ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSituations();

//    return res;
// };
// //#endregion CRUD

// //#region FAMILIA
// export const getAllFamilyDataByFolio = async (folio) => {
//    const setAllFamilyData = useSituationStore.getState().setAllFamilyData;
//

//    const [error, response] = await to(Axios.get(`familyData/indexByFolio/${folio}`));
//    // console.log("🚀 ~ getAllFamilyDataByFolio ~ error:", error);
//    // console.log("🚀 ~ getAllFamilyDataByFolio ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllFamilyDataByFolio ~ error:", error);
//       const message = error.response.data.message || "getAllFamilyDataByFolio ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllFamilyData(res.result);
//    // await setAllSituations(res.result);

//    return res;
// };
// export const createOrUpdateFamilyData = async (data, folio) => {
//    console.log("🚀 ~ createOrUpdateFamilyData ~ folio:", folio);
//    console.log("🚀 ~ createOrUpdateFamilyData ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`familyData/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateFamilyData ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateFamilyData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateFamilyData ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateFamilyData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllFamilyDataByFolio(folio);

//    return res;
// };
// export const deleteFamilyData = async (id, folio) => {
//    // console.log("🚀 ~ deleteFamilyData ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`familyData/delete/${id}`));
//    // console.log("🚀 ~ deleteFamilyData ~ error:", error);
//    // console.log("🚀 ~ deleteFamilyData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteFamilyData ~ error:", error);
//       const message = error.response.data.message || "deleteFamilyData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllFamilyDataByFolio(folio);
//    // await getSituation("id", data.situation_id);

//    return res;
// };
// export const disEnableFamilyData = async (id, active, folio) => {
//    // console.log("🚀 ~ disEnableFamilyData ~ data:", data);
//

//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`familyData/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableFamilyData ~ error:", error);
//    // console.log("🚀 ~ disEnableFamilyData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableFamilyData ~ error:", error);
//       const message = error.response.data.message || "disEnableFamilyData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllFamilyDataByFolio(folio);

//    return res;
// };
// //#endregion FAMILIA

// //#region VIVIENDA
// export const getLivingDataByFolio = async (folio) => {
//    const setLivingData = useSituationStore.getState().setLivingData;
//

//    const [error, response] = await to(Axios.get(`livingData/indexByFolio/${folio}`));
//    // console.log("🚀 ~ getLivingDataByFolio ~ error:", error);
//    // console.log("🚀 ~ getLivingDataByFolio ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getLivingDataByFolio ~ error:", error);
//       const message = error.response.data.message || "getLivingDataByFolio ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setLivingData(res.result);
//    // await setAllSituations(res.result);

//    return res;
// };
// export const createOrUpdateLivingData = async (data, folio) => {
//    console.log("🚀 ~ createOrUpdateLivingData ~ folio:", folio);
//    console.log("🚀 ~ createOrUpdateLivingData ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`livingData/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateLivingData ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateLivingData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateLivingData ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateLivingData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getLivingDataByFolio(folio);

//    return res;
// };
// export const deleteLivingData = async (id, folio) => {
//    // console.log("🚀 ~ deleteLivingData ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`livingData/delete/${id}`));
//    // console.log("🚀 ~ deleteLivingData ~ error:", error);
//    // console.log("🚀 ~ deleteLivingData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteLivingData ~ error:", error);
//       const message = error.response.data.message || "deleteLivingData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getLivingDataByFolio(folio);
//    // await getSituation("id", data.situation_id);

//    return res;
// };
// export const disEnableLivingData = async (id, active, folio) => {
//    // console.log("🚀 ~ disEnableLivingData ~ data:", data);
//

//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`livingData/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableLivingData ~ error:", error);
//    // console.log("🚀 ~ disEnableLivingData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableLivingData ~ error:", error);
//       const message = error.response.data.message || "disEnableLivingData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getLivingDataByFolio(folio);

//    return res;
// };
// //#endregion VIVIENDA

// //#region ECONOMIA
// export const getEconomicDataByFolio = async (folio) => {
//    const setEconomicData = useSituationStore.getState().setEconomicData;
//

//    const [error, response] = await to(Axios.get(`economicData/indexByFolio/${folio}`));
//    // console.log("🚀 ~ getEconomicDataByFolio ~ error:", error);
//    // console.log("🚀 ~ getEconomicDataByFolio ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getEconomicDataByFolio ~ error:", error);
//       const message = error.response.data.message || "getEconomicDataByFolio ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setEconomicData(res.result);
//    // await setAllSituations(res.result);

//    return res;
// };
// export const createOrUpdateEconomicData = async (data, folio) => {
//    console.log("🚀 ~ createOrUpdateEconomicData ~ folio:", folio);
//    console.log("🚀 ~ createOrUpdateEconomicData ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`economicData/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateEconomicData ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateEconomicData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateEconomicData ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateEconomicData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getEconomicDataByFolio(folio);

//    return res;
// };
// export const deleteEconomicData = async (id, folio) => {
//    // console.log("🚀 ~ deleteEconomicData ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`economicData/delete/${id}`));
//    // console.log("🚀 ~ deleteEconomicData ~ error:", error);
//    // console.log("🚀 ~ deleteEconomicData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteEconomicData ~ error:", error);
//       const message = error.response.data.message || "deleteEconomicData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getEconomicDataByFolio(folio);
//    // await getSituation("id", data.situation_id);

//    return res;
// };
// export const disEnableEconomicData = async (id, active, folio) => {
//    // console.log("🚀 ~ disEnableEconomicData ~ data:", data);
//

//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`economicData/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableEconomicData ~ error:", error);
//    // console.log("🚀 ~ disEnableEconomicData ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableEconomicData ~ error:", error);
//       const message = error.response.data.message || "disEnableEconomicData ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getEconomicDataByFolio(folio);

//    return res;
// };
// //#endregion ECONOMIA

// //#region FAMILIA
// //#endregion FAMILIA
