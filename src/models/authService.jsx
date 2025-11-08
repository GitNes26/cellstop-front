// import to from "await-to-js";
// import { Axios, AxiosAuth, Response } from "../utils/Api";
// import Toast from "../utils/Toast";
// import useAuthStore from "../stores/authStore";
// import { includesInArray } from "../utils/Formats";
// import { isNumeric } from "../utils/Validations";

// export const login = async (username, password) => {
//    let postData = {
//       username,
//       password
//    };
//    if (username.includes("@"))
//       postData = {
//          email: username,
//          password
//       };
//    else if (isNumeric(username))
//       postData = {
//          payroll_number: username,
//          password
//       };
//    const [error, response] = await to(AxiosAuth.post(`/login`, postData));
//    console.log("🚀 ~ login ~ error:", error);
//    console.log("🚀 ~ login ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ login ~ error:", error);
//       const message = error.response.data.message || "login ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//       // throw new Error("que sale aqui?");
//    }

//    response.data.data.result.auth.permissions = {
//       read: false,
//       create: false,
//       update: false,
//       delete: false,
//       more_permissions: []
//    };

//    Response.success = response.data.data;
//    const res = Response.success;
//    console.log("🚀 ~ login ~ res:", res);

//    return res;
// };

// export const signup = async (data) => {
//    const [error, response] = await to(AxiosAuth.post(`/signup`, data));
//    // console.log("🚀 ~ signup ~ error:", error);
//    // console.log("🚀 ~ signup ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ signup ~ error:", error);
//       const message = error.response.data.message || "signup ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//    }

//    Response.success = response.data.data;
//    const res = Response.success;

//    return res;
// };

// export const logout = async () => {
//    const [error, response] = await to(Axios.get(`/logout`));
//    // console.log("🚀 ~ login ~ error:", error);
//    // console.log("🚀 ~ login ~ response:", response);
//    if (error) {
//       console.log("🚀 ~ login ~ error:", error);
//       const message = error.response.data.message || "logout ~ Ocurrio algun error, intenta de nuevo :c";
//       Toast.Error(message);
//       return;
//    }

//    Response.success = response.data.data;
//    const res = Response.success;

//    return res;
// };

// export const checkLoggedIn = async () => {
//    console.log("🚀 ~ checkLoggedIn ~ a checar:");
//    const auth = useAuthStore.getState().auth;
//    const token = useAuthStore.getState().token;
//    const isAuth = useAuthStore.getState().isAuth;
//    const setAuth = useAuthStore.getState().setAuth;
//    const removeAuth = useAuthStore.getState().removeAuth;
//    const location = window.location;
//    let url = location.hash.split("#").reverse()[0];
//    const paths = url.split("/");
//    url = paths.length > 2 ? url : "";
//    // console.log("🚀 ~ checkLoggedIn ~ paths:", paths);
//    // console.log("🚀 ~ checkLoggedIn ~ url:", url);

//    let data = { url };
//    // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
//    // console.log("🚀 ~ checkLoggedIn ~ data:", data);
//    let [error, response] = await to(Axios.post(`checkLoggedIn`, data));
//    // console.log("🚀 ~ checkLoggedIn ~ error:", error);
//    // console.log("🚀 ~ checkLoggedIn ~ response:", response);

//    if (error) {
//       await removeAuth();
//       const message = error.response.data.message || "Tu sesión ha expirado, vuelve a iniciar sesión";
//       Toast.Info(message);
//       location.hash = "/";
//       return false;
//    }
//    // ESTA SECCION ES PARA CUANDO TIENEN MAS NIVELES LA URL Y NO ESTAN REGISTRADAS EN MENUS, VAMOS REDUCIENDO LA URL
//    while (response.data.data.result == null) {
//       paths.pop();
//       // console.log("🚀 ~ checkLoggedIn ~ paths:", paths);
//       url = paths.join("/");
//       data = { url };
//       [error, response] = await to(Axios.post(`checkLoggedIn`, data));
//       // console.log("🚀 ~ checkLoggedIn ~ while ~ error:", error);
//       // console.log("🚀 ~ checkLoggedIn ~ while ~ response:", response);
//       if (error) {
//          await removeAuth();
//          const message = error.response.data.message || "Tu sesión ha expirado, vuelve a iniciar sesión";
//          Toast.Info(message);
//          location.hash = "/";
//          return false;
//       }
//    }
//    if (!auth) {
//       Toast.Error("Sesión expirada");
//       console.log("checkLoggedIn ~ No está autenticado");
//       await removeAuth();
//       location.hash = "/";
//       return false;
//    }
//    const res = response.data.data;
//    if (!res || res.status_code != 200) {
//       // await removeAuth();
//       const message = "Tu sesión ha expirado, vuelve a iniciar sesión";
//       Toast.Info(message);
//       location.hash = auth.page_index;
//       return false;
//    }

//    if (url !== "") {
//       const idPage = res.result.id;
//       if (!includesInArray(auth.read.split(","), ["todas", idPage.toString()])) {
//          // await removeAuth();
//          // const message = "que haces aqui metiche?";
//          // Toast.Info(message);
//          location.hash = auth.page_index;
//          return false;
//       }
//       // console.log("🚀 ~ checkLoggedIn ~ idPage:", idPage);
//       // console.log("🚀 ~ checkLoggedIn ~ auth:", auth);
//       auth.permissions = {
//          read: auth.read ? includesInArray(auth.read.split(","), ["todas", idPage.toString()]) : false,
//          create: auth.create ? includesInArray(auth.create.split(","), ["todas", idPage.toString()]) : false,
//          update: auth.update ? includesInArray(auth.update.split(","), ["todas", idPage.toString()]) : false,
//          delete: auth.delete ? includesInArray(auth.delete.split(","), ["todas", idPage.toString()]) : false,
//          more_permissions: auth.more_permissions
//       };
//       const data = {
//          auth,
//          token,
//          isAuth
//       };
//       // console.log("🚀 ~ checkLoggedIn ~ data:", data);
//       await setAuth(data);
//    }

//    return true;
// };

// // export const updatePassword = async (data) => {
// //    const setIsLoading = useGlobalStore.getState().setIsLoading;
// //    const auth = useAuthStore.getState().auth;

// //    try {
// //       await checkLoggedIn();
// //       // console.log("🚀 ~ updatePassword ~ auth:", auth);
// //       let res = null;

// //       if (auth) {
// //          const req = await Axios(`/users/updatepassword/${auth.id}`, {
// //             method: "POST",
// //             data
// //          });
// //          // console.log("🚀 ~ updatePassword ~ req:", req);
// //          res = req.data.data;
// //          console.log("🚀 ~ updatePassword ~ res:", res);
// //          if (!res.status) {
// //             setIsLoading(false);
// //             ToastAndroid.showWithGravity(res.message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
// //             return;
// //          }
// //       }
// //       Axios.defaults.headers.common["Authorization"] = null;
// //       AxiosFiles.defaults.headers.common["Authorization"] = null;
// //       // console.log("Todas las cabeceras:", Axios.defaults.headers);
// //       return res;
// //    } catch (error) {
// //       console.log("🚀 ~ updatePassword ~ error:", error);
// //       setIsLoading(false);
// //       ToastAndroid.showWithGravity("Error en el servidor", ToastAndroid.LONG, ToastAndroid.BOTTOM);
// //       return;
// //    }
// // };
