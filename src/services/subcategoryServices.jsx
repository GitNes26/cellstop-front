// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useSubcategoryStore from "../stores/subcategoryStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/subcategories";

// export const SP_affairsByDepartment = async () => {
//    const setAllSubcategories = useSubcategoryStore.getState().setAllSubcategories;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/SP_affairsByDepartment`));
//    // console.log("🚀 ~ SP_affairsByDepartment ~ error:", error);
//    // console.log("🚀 ~ SP_affairsByDepartment ~ response:", response);
//    if (error) {
//       // console.log("🚀 ~ SP_affairsByDepartment ~ error:", error);
//       const message = error.response.data.message || "SP_affairsByDepartment ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllSubcategories(res.result);

//    return res;
// };

// //#region CRUD
// export const getAllSubcategories = async () => {
//    const setAllSubcategories = useSubcategoryStore.getState().setAllSubcategories;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllSubcategories ~ error:", error);
//    // console.log("🚀 ~ getAllSubcategories ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllSubcategories ~ error:", error);
//       const message = error.response.data.message || "getAllSubcategories ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllSubcategories(res.result);

//    return res;
// };

// export const getSelectIndexSubcategories = async () => {
//    const setSubcategoriesSelect = useSubcategoryStore.getState().setSubcategoriesSelect;
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexSubcategories ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexSubcategories ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexSubcategories ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexSubcategories ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setSubcategoriesSelect(res.result);

//    return res;
// };

// export const createOrUpdateSubcategory = async (data) => {
//    // console.log("🚀 ~ createOrUpdateSubcategory ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateSubcategory ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateSubcategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateSubcategory ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateSubcategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSubcategories();

//    return res;
// };

// export const getSubcategory = async (id) => {
//    const setSubcategory = useSubcategoryStore.getState().setSubcategory;
//    // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getSubcategory ~ error:", error);
//    // console.log("🚀 ~ getSubcategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSubcategory ~ error:", error);
//       const message = error.response.data.message || "getSubcategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setSubcategory(res.result);

//    return res;
// };

// export const deleteSubcategory = async (id) => {
//    // console.log("🚀 ~ deleteSubcategory ~ data:", data);
//    // // if (!(await checkLoggedIn())) return;

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteSubcategory ~ error:", error);
//    // console.log("🚀 ~ deleteSubcategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteSubcategory ~ error:", error);
//       const message = error.response.data.message || "deleteSubcategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSubcategories();

//    return res;
// };

// export const disEnableSubcategory = async (id, active) => {
//    // console.log("🚀 ~ disEnableSubcategory ~ data:", data);
//    // await checkLoggedIn();
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableSubcategory ~ error:", error);
//    // console.log("🚀 ~ disEnableSubcategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableSubcategory ~ error:", error);
//       const message = error.response.data.message || "disEnableSubcategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllSubcategories();

//    return res;
// };

// //#endregion CRUD
