// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useDepartmentStore from "../stores/departmentStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/departments";

// //#region CRUD
// export const getAllDepartments = async () => {
//    const setAllDepartments = useDepartmentStore.getState().setAllDepartments;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllDepartments ~ error:", error);
//    // console.log("🚀 ~ getAllDepartments ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllDepartments ~ error:", error);
//       const message = error.response.data.message || "getAllDepartments ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllDepartments(res.result);

//    return res;
// };

// export const getSelectIndexDepartments = async () => {
//    const setDepartmentsSelect = useDepartmentStore.getState().setDepartmentsSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexDepartments ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexDepartments ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexDepartments ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexDepartments ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setDepartmentsSelect(res.result);

//    return res;
// };

// export const createOrUpdateDepartment = async (data) => {
//    // console.log("🚀 ~ createOrUpdateDepartment ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateDepartment ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateDepartment ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateDepartment ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllDepartments();

//    return res;
// };

// export const getDepartment = async (id) => {
//    const setDepartment = useDepartmentStore.getState().setDepartment;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getDepartment ~ error:", error);
//    // console.log("🚀 ~ getDepartment ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getDepartment ~ error:", error);
//       const message = error.response.data.message || "getDepartment ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setDepartment(res.result);

//    return res;
// };

// export const deleteDepartment = async (id) => {
//    // console.log("🚀 ~ deleteDepartment ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteDepartment ~ error:", error);
//    // console.log("🚀 ~ deleteDepartment ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteDepartment ~ error:", error);
//       const message = error.response.data.message || "deleteDepartment ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllDepartments();

//    return res;
// };

// export const disEnableDepartment = async (id, active) => {
//    // console.log("🚀 ~ disEnableDepartment ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableDepartment ~ error:", error);
//    // console.log("🚀 ~ disEnableDepartment ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableDepartment ~ error:", error);
//       const message = error.response.data.message || "disEnableDepartment ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllDepartments();

//    return res;
// };

// //#endregion CRUD
