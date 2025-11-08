// import to from "await-to-js";
// import { Axios, AxiosFiles, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useRegisterStore from "../stores/registerStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/registers";

// //#region CRUD
// export const getAllRegisters = async () => {
//    const setAllRegisters = useRegisterStore.getState().setAllRegisters;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllRegisters ~ error:", error);
//    // console.log("🚀 ~ getAllRegisters ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllRegisters ~ error:", error);
//       const message = error.response.data.message || "getAllRegisters ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllRegisters(res.result);

//    return res;
// };

// export const getSelectIndexRegisters = async () => {
//    const setRegistersSelect = useRegisterStore.getState().setRegistersSelect;
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexRegisters ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexRegisters ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexRegisters ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexRegisters ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setRegistersSelect(res.result);

//    return res;
// };

// export const createOrUpdateRegister = async (data) => {
//    // console.log("🚀 ~ createOrUpdateRegister ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateRegister ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateRegister ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateRegister ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateRegister ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRegisters();

//    return res;
// };

// export const getRegister = async (id) => {
//    const setRegister = useRegisterStore.getState().setRegister;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getRegister ~ error:", error);
//    // console.log("🚀 ~ getRegister ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getRegister ~ error:", error);
//       const message = error.response.data.message || "getRegister ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setRegister(res.result);

//    return res;
// };

// export const deleteRegister = async (id) => {
//    // console.log("🚀 ~ deleteRegister ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteRegister ~ error:", error);
//    // console.log("🚀 ~ deleteRegister ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteRegister ~ error:", error);
//       const message = error.response.data.message || "deleteRegister ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRegisters();

//    return res;
// };

// export const disEnableRegister = async (id, active) => {
//    // console.log("🚀 ~ disEnableRegister ~ data:", data);
//    // await checkLoggedIn();
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableRegister ~ error:", error);
//    // console.log("🚀 ~ disEnableRegister ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableRegister ~ error:", error);
//       const message = error.response.data.message || "disEnableRegister ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRegisters();

//    return res;
// };

// //#endregion CRUD
