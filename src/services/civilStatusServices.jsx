// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useCivilStatusStore from "../stores/civilStatusStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/civilStatuses";

// //#region CRUD
// export const getAllCivilStatuses = async () => {
//    const setAllCivilStatuses = useCivilStatusStore.getState().setAllCivilStatuses;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllCivilStatuses ~ error:", error);
//    // console.log("🚀 ~ getAllCivilStatuses ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllCivilStatuses ~ error:", error);
//       const message = error.response.data.message || "getAllCivilStatuses ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllCivilStatuses(res.result);

//    return res;
// };

// export const getSelectIndexCivilStatuses = async () => {
//    const setCivilStatusesSelect = useCivilStatusStore.getState().setCivilStatusesSelect;
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexCivilStatuses ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexCivilStatuses ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexCivilStatuses ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexCivilStatuses ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setCivilStatusesSelect(res.result);

//    return res;
// };

// export const createOrUpdateCivilStatus = async (data) => {
//    // console.log("🚀 ~ createOrUpdateCivilStatus ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateCivilStatus ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateCivilStatus ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateCivilStatus ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateCivilStatus ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCivilStatuses();

//    return res;
// };

// export const getCivilStatus = async (id) => {
//    const setCivilStatus = useCivilStatusStore.getState().setCivilStatus;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getCivilStatus ~ error:", error);
//    // console.log("🚀 ~ getCivilStatus ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getCivilStatus ~ error:", error);
//       const message = error.response.data.message || "getCivilStatus ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setCivilStatus(res.result);

//    return res;
// };

// export const deleteCivilStatus = async (id) => {
//    // console.log("🚀 ~ deleteCivilStatus ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteCivilStatus ~ error:", error);
//    // console.log("🚀 ~ deleteCivilStatus ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteCivilStatus ~ error:", error);
//       const message = error.response.data.message || "deleteCivilStatus ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCivilStatuses();

//    return res;
// };

// export const disEnableCivilStatus = async (id, active) => {
//    // console.log("🚀 ~ disEnableCivilStatus ~ data:", data);
//    // await checkLoggedIn();
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableCivilStatus ~ error:", error);
//    // console.log("🚀 ~ disEnableCivilStatus ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableCivilStatus ~ error:", error);
//       const message = error.response.data.message || "disEnableCivilStatus ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCivilStatuses();

//    return res;
// };

// //#endregion CRUD
