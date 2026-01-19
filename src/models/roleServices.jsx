// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useRoleStore from "../stores/roleStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/roles";

// export const updatePermissions = async (data) => {
//    // console.log("🚀 ~ updatePermissions ~ data:", data);
//

//    const [error, response] = await to(Axios.post(`${prefixPath}/updatePermissions`, data));
//    // console.log("🚀 ~ updatePermissions ~ error:", error);
//    // console.log("🚀 ~ updatePermissions ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ updatePermissions ~ error:", error);
//       const message = error.response.data.message || "updatePermissions ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRoles();

//    return res;
// };

// //#region CRUD
// export const getAllRoles = async () => {
//    const setAllRoles = useRoleStore.getState().setAllRoles;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllRoles ~ error:", error);
//    // console.log("🚀 ~ getAllRoles ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllRoles ~ error:", error);
//       const message = error.response.data.message || "getAllRoles ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllRoles(res.result);

//    return res;
// };

// export const getSelectIndexRoles = async () => {
//    const setRolesSelect = useRoleStore.getState().setRolesSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexRoles ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexRoles ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexRoles ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexRoles ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setRolesSelect(res.result);

//    return res;
// };

// export const createOrUpdateRole = async (data) => {
//    // console.log("🚀 ~ createOrUpdateRole ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateRole ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateRole ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateRole ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateRole ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRoles();

//    return res;
// };

// export const getRole = async (id) => {
//    const setRole = useRoleStore.getState().setRole;
//    const setRoleSelect = useRoleStore.getState().setRoleSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getRole ~ error:", error);
//    // console.log("🚀 ~ getRole ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getRole ~ error:", error);
//       const message = error.response.data.message || "getRole ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setRole(res.result);
//    await setRoleSelect(res.result);

//    return res;
// };

// export const deleteRole = async (id) => {
//    // console.log("🚀 ~ deleteRole ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteRole ~ error:", error);
//    // console.log("🚀 ~ deleteRole ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteRole ~ error:", error);
//       const message = error.response.data.message || "deleteRole ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRoles();

//    return res;
// };

// export const disEnableRole = async (id, active) => {
//    // console.log("🚀 ~ disEnableRole ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableRole ~ error:", error);
//    // console.log("🚀 ~ disEnableRole ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableRole ~ error:", error);
//       const message = error.response.data.message || "disEnableRole ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllRoles();

//    return res;
// };

// //#endregion CRUD
