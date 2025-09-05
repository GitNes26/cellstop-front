import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { env } from "../constant";
// import { colorPrimaryDark, colorSecondaryDark } from "../context/GlobalContext";
const colorPrimaryDark =
   localStorage.getItem("mui-mode") === "dark" ? env.THEME.colorSchemes.dark.palette.primary.main : env.THEME.colorSchemes.light.palette.primary.main;
// console.log(`🚀 ~ localStorage.getItem("mui-mode"):`, localStorage.getItem("mui-mode"));

const Success = (msg, timer = 1500) => {
   withReactContent(Swal).fire({
      icon: "success",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      showConfirmButton: timer == null ? true : false,
      timer,
      confirmButtonText: "<b>OK</b>"
   });
};

const Error = (msg) => {
   withReactContent(Swal).fire({
      icon: "error",
      title: `Error!`,
      html: `${msg}`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>"
   });
};

const Info = (msg) => {
   withReactContent(Swal).fire({
      icon: "info",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>"
   });
};

const Warning = (msg, width = "600px") => {
   withReactContent(Swal).fire({
      icon: "warning",
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, // "#3e3e3e"
      confirmButtonText: "<b>OK</b>",
      width: width // "600px" o '80%', '50em', etc.
   });
};
const Question = (msg, confirmText, cancelText) => {
   let res = null;
   withReactContent(Swal)
      .fire({
         icon: "question",
         html: `<h3>${msg}</h3>`,
         confirmButtonText: `<b>${confirmText}<b/>` || "<b>Si, eliminar!<b/>",
         confirmButtonColor: colorPrimaryDark, //"green",
         showCancelButton: true,
         cancelButtonText: `<b>${cancelText}<b/>` || "<b>No, cancelar!<b/>",
         reverseButtons: true
      })
      .then((result) => {
         return (res = result);
      });
   return res;
};

const Customizable = (msg, icon, showConfirmButton = false, timer = 1500) => {
   withReactContent(Swal).fire({
      icon,
      html: `<h3>${msg}</h3>`,
      confirmButtonColor: colorPrimaryDark, //"#3e3e3e",
      showConfirmButton,
      timer: showConfirmButton ? 0 : timer,
      confirmButtonText: "<b>OK</b>"
   });
};

export const QuestionAlertConfig = (
   msg,
   confirmText = "Si, eliminar!",
   cancelText = "No, cancelar!",
   showCancelButton = true,
   showDenyButton = false,
   denyText = "Rechazar!"
) => {
   return {
      icon: "question",
      html: `<h3>${msg}</h3>`,
      confirmButtonText: `<b>${confirmText}<b/>` || "<b>Si, eliminar!<b/>",
      confirmButtonColor: colorPrimaryDark, //"green",
      showCancelButton: showCancelButton,
      showDenyButton: showDenyButton,
      denyButtonText: `<b>${denyText}<b/>` || "<b>Rechazar!<b/>",
      cancelButtonText: `<b>${cancelText}<b/>` || "<b>No, cancelar!<b/>",
      reverseButtons: true
   };
};

export default {
   Success,
   Error,
   Info,
   Warning,
   Question,
   Customizable
};
