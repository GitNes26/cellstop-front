// import to from "await-to-js";
// import { Axios, AxiosFiles, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useEmployeeStore from "../stores/employeeStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/employees";

// //#region CRUD
// export const getAllEmployees = async () => {
//    const setAllEmployees = useEmployeeStore.getState().setAllEmployees;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllEmployees ~ error:", error);
//    // console.log("🚀 ~ getAllEmployees ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllEmployees ~ error:", error);
//       const message = error.response.data.message || "getAllEmployees ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllEmployees(res.result);

//    return res;
// };

// export const getSelectIndexEmployees = async () => {
//    const setEmployeesSelect = useEmployeeStore.getState().setEmployeesSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexEmployees ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexEmployees ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexEmployees ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexEmployees ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setEmployeesSelect(res.result);

//    return res;
// };

// export const createOrUpdateEmployee = async (data) => {
//    // console.log("🚀 ~ createOrUpdateEmployee ~ data:", data);
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(AxiosFiles.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateEmployee ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateEmployee ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateEmployee ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateEmployee ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllEmployees();

//    return res;
// };

// export const getEmployee = async (id) => {
//    const setEmployee = useEmployeeStore.getState().setEmployee;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getEmployee ~ error:", error);
//    // console.log("🚀 ~ getEmployee ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getEmployee ~ error:", error);
//       const message = error.response.data.message || "getEmployee ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setEmployee(res.result);

//    return res;
// };

// export const deleteEmployee = async (id) => {
//    // console.log("🚀 ~ deleteEmployee ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteEmployee ~ error:", error);
//    // console.log("🚀 ~ deleteEmployee ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteEmployee ~ error:", error);
//       const message = error.response.data.message || "deleteEmployee ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllEmployees();

//    return res;
// };

// export const disEnableEmployee = async (id, active) => {
//    // console.log("🚀 ~ disEnableEmployee ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableEmployee ~ error:", error);
//    // console.log("🚀 ~ disEnableEmployee ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableEmployee ~ error:", error);
//       const message = error.response.data.message || "disEnableEmployee ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllEmployees();

//    return res;
// };

// //#endregion CRUD
