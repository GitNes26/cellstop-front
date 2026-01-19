// import to from "await-to-js";
// import { Axios, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useCategoryStore from "../stores/categoryStore";
// // import { checkLoggedIn } from "./authService";

// const prefixPath = "/categories";

// //#region CRUD
// export const getAllCategories = async () => {
//    const setAllCategories = useCategoryStore.getState().setAllCategories;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}`));
//    // console.log("🚀 ~ getAllCategories ~ error:", error);
//    // console.log("🚀 ~ getAllCategories ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getAllCategories ~ error:", error);
//       const message = error.response.data.message || "getAllCategories ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setAllCategories(res.result);

//    return res;
// };

// export const getSelectIndexCategories = async () => {
//    const setCategoriesSelect = useCategoryStore.getState().setCategoriesSelect;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/selectIndex`));
//    // console.log("🚀 ~ getSelectIndexCategories ~ error:", error);
//    // console.log("🚀 ~ getSelectIndexCategories ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getSelectIndexCategories ~ error:", error);
//       const message = error.response.data.message || "getSelectIndexCategories ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setCategoriesSelect(res.result);

//    return res;
// };

// export const createOrUpdateCategory = async (data) => {
//

//    const id = data.id > 0 ? `/${data.id}` : "";
//    const [error, response] = await to(Axios.post(`${prefixPath}/createOrUpdate${id}`, data));
//    // console.log("🚀 ~ createOrUpdateCategory ~ error:", error);
//    // console.log("🚀 ~ createOrUpdateCategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ createOrUpdateCategory ~ error:", error);
//       const message = error.response.data.message || "createOrUpdateCategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCategories();

//    return res;
// };

// export const getCategory = async (id) => {
//    const setCategory = useCategoryStore.getState().setCategory;
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/id/${id}`));
//    // console.log("🚀 ~ getCategory ~ error:", error);
//    // console.log("🚀 ~ getCategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ getCategory ~ error:", error);
//       const message = error.response.data.message || "getCategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await setCategory(res.result);

//    return res;
// };

// export const deleteCategory = async (id) => {
//    // console.log("🚀 ~ deleteCategory ~ data:", data);
//

//    const [error, response] = await to(Axios.get(`${prefixPath}/delete/${id}`));
//    // console.log("🚀 ~ deleteCategory ~ error:", error);
//    // console.log("🚀 ~ deleteCategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ deleteCategory ~ error:", error);
//       const message = error.response.data.message || "deleteCategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCategories();

//    return res;
// };

// export const disEnableCategory = async (id, active) => {
//    // console.log("🚀 ~ disEnableCategory ~ data:", data);
//
//    const strActive = active ? "reactivar" : "desactivar";
//    const [error, response] = await to(Axios.get(`${prefixPath}/disEnable/${id}/${strActive}`));
//    // console.log("🚀 ~ disEnableCategory ~ error:", error);
//    // console.log("🚀 ~ disEnableCategory ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ disEnableCategory ~ error:", error);
//       const message = error.response.data.message || "disEnableCategory ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    Response.success = response.data.data;
//    const res = Response.success;
//    await getAllCategories();

//    return res;
// };

// //#endregion CRUD
