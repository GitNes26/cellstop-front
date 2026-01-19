// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useUserStore from "../stores/userStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/users";

// //#region CRUD
// export const getAllUsers = async () => {
//    const setAllUsers = useUserStore.getState().setAllUsers;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllUsers ~ error:", error);
//    // console.log("🚀 ~ getAllUsers ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllUsers ~ error:", error);
//       const message = error.response.data.message || "getAllUsers ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllUsers(res.result);

//    return res;
// };

// export const getSelectIndexUsersByRole = async (role_id) => {
//    const setUsersSelect = useUserStore.getState().setUsersSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndexByRole/${role_id}`));
//    // console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexUsers ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexUsers ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setUsersSelect(res.result);

//    return res;
// };
// export const getSelectIndexUsers = async () => {
//    const setUsersSelect = useUserStore.getState().setUsersSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexUsers ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexUsers ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexUsers ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setUsersSelect(res.result);

//    return res;
// };

// export const createOrUpdateUser = async (data) => {
//    // console.log("🚀 ~ createOrUpdateUser ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateUser ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateUser ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateUser ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateUser ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllUsers();

//    return res;
// };

// export const getUser = async (id) => {
//    const setUser = useUserStore.getState().setUser;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getUser ~ error:", error);
//    // console.log("🚀 ~ getUser ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getUser ~ error:", error);
//       const message = error.response.data.message || "getUser ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setUser(res.result);

//    return res;
// };

// export const deleteUser = async (id) => {
//    // console.log("🚀 ~ deleteUser ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteUser ~ error:", error);
//    // console.log("🚀 ~ deleteUser ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteUser ~ error:", error);
//       const message = error.response.data.message || "deleteUser ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllUsers();

//    return res;
// };

// export const disEnableUser = async (id, active) => {
//    // console.log("🚀 ~ disEnableUser ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableUser ~ error:", error);
//    // console.log("🚀 ~ disEnableUser ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableUser ~ error:", error);
//       const message = error.response.data.message || "disEnableUser ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllUsers();

//    return res;
// };

// //#endregion CRUD
