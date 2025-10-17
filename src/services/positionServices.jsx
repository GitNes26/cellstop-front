// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import usePositionStore from "../stores/positionStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/positions";

// //#region CRUD
// export const getAllPositions = async () => {
//    const setAllPositions = usePositionStore.getState().setAllPositions;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllPositions ~ error:", error);
//    // console.log("🚀 ~ getAllPositions ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllPositions ~ error:", error);
//       const message = error.response.data.message || "getAllPositions ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllPositions(res.result);

//    return res;
// };

// export const getSelectIndexPositions = async () => {
//    const setPositionsSelect = usePositionStore.getState().setPositionsSelect;
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexPositions ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexPositions ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexPositions ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexPositions ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setPositionsSelect(res.result);

//    return res;
// };

// export const createOrUpdatePosition = async (data) => {
//    // console.log("🚀 ~ createOrUpdatePosition ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdatePosition ~ error:", error);
//    // console.log("🚀 ~ createOrUpdatePosition ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdatePosition ~ error:", error);
//       const message = error.response.data.message || "createOrUpdatePosition ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllPositions();

//    return res;
// };

// export const getPosition = async (id) => {
//    const setPosition = usePositionStore.getState().setPosition;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getPosition ~ error:", error);
//    // console.log("🚀 ~ getPosition ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getPosition ~ error:", error);
//       const message = error.response.data.message || "getPosition ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setPosition(res.result);

//    return res;
// };

// export const deletePosition = async (id) => {
//    // console.log("🚀 ~ deletePosition ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deletePosition ~ error:", error);
//    // console.log("🚀 ~ deletePosition ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deletePosition ~ error:", error);
//       const message = error.response.data.message || "deletePosition ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllPositions();

//    return res;
// };

// export const disEnablePosition = async (id, active) => {
//    // console.log("🚀 ~ disEnablePosition ~ data:", data);
//    // await checkLoggedIn();
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnablePosition ~ error:", error);
//    // console.log("🚀 ~ disEnablePosition ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnablePosition ~ error:", error);
//       const message = error.response.data.message || "disEnablePosition ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllPositions();

//    return res;
// };

// //#endregion CRUD
