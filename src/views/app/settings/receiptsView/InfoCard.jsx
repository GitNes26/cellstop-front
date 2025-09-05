import React from "react";
import Paper from "@mui/material/Paper";

import { formatCurrency, formatDatetime, formatPhone, getAge, numberToText } from "../../../../utils/Formats";
import icons from "../../../../constant/icons";
import images from "../../../../constant/images";
import env from "../../../../constant/env";
import { Divider } from "../../../../components/basics";

export default function ReceiptInfoCard({ data }) {
   // console.log("🚀 ~ ReceiptInfoCard ~ data:", data);

   return (
      <Paper id="reportPaper" sx={{ width: "100%", overflow: "hidden", backgroundColor: "white" }}>
         {data?.receipt && (
            <div className="flex flex-col w-full p-10 -2" style={{ pageBreakAfter: "always" }}>
               <div className="flex justify-between gap-2 mb-3">
                  <img src={images.logoDark} style={{ width: "150px" }} className="self-center mb-5" />
                  <div className="self-center text-2xl font-bold text-center">SISTEMA PARA EL DESARROLLO INTEGRAL DE LA FAMILIA</div>
                  <div className="p-0 bg-transparent border-2 border-black card w-[250px]">
                     <div className="items-center p-0 text-center card-body">
                        <h2 className="w-full text-xl font-bold text-center border-b-2 border-black">FOLIO</h2>
                        <div className="flex justify-around w-full font-mono text-2xl font-black text-start text-error">
                           <span>N°</span> <span>{data?.receipt?.num_folio ?? "0"}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex justify-between gap-2 mb-3">
                  <div className="font-bold text-center">
                     <p>
                        ADMINISTRACIÓN <br />
                        2022-2025
                     </p>
                     <p>IMAGEN DE CÉDULA</p>
                  </div>
                  <div className="w-full">
                     <div className="w-full mb-2 border-0 border-black bg-slate-600/20 card">
                        <div className="p-3 font-bold card-body">
                           <p>
                              * Recibimos del Sistema para el <br /> Desarrollo Integral de la Familia, la cantidad de{" "}
                              <span className="px-2 font-bold border-b-2 border-black">{formatCurrency(data?.receipt?.amount ?? 0)}</span>
                           </p>
                           <p className="px-2 font-bold border-b-2 border-black">({numberToText(data?.receipt?.amount ?? 0)})</p>
                        </div>
                     </div>
                     <div className="w-full mb-2 border-0 border-black bg-slate-600/20 card">
                        <div className="p-3 font-bold card-body">
                           <p>
                              <p className="px-2 font-bold border-b-2 border-black">
                                 * Por concepto de: {data?.subcategory?.category} {data?.subcategory?.subcategory}
                              </p>
                              <br /> <p className="px-2 font-bold border-b-2 border-black">Nombre: {data?.requester?.full_name}</p> <br />
                              <p className="px-2 font-bold border-b-2 border-black">Domicilio: {data?.community?.full_address}</p> <br />
                              <p className="px-2 font-bold border-b-2 border-black">Edad: {getAge(data?.requester?.birthdate, data?.created_at)} años</p>
                           </p>
                        </div>
                     </div>
                     <p className="font-bold">
                        Gómez Palacio, Dgo. A: <span className="px-2 font-bold border-b-2 border-black">{formatDatetime(data?.receipt?.created_at, false, "DD")}</span>{" "}
                        de <span className="px-2 font-bold border-b-2 border-black">{formatDatetime(data?.receipt?.created_at, false, "MMMM")}</span> de{" "}
                        <span className="px-2 font-bold border-b-2 border-black">{formatDatetime(data?.receipt?.created_at, false, "YYYY")}</span>
                     </p>
                     <div className="flex flex-col text-center">
                        {data?.img_firm_requester != null && (
                           <img
                              src={`${env.API_URL_IMG}/${data?.img_firm_requester}`}
                              style={{ width: "200px" }}
                              className="self-center object-scale-down mt-5 -mb-5"
                           />
                        )}
                        <p style={{ textAlign: "center", fontWeight: "bolder" }} className={data?.img_firm_requester == null && "mt-16"}>
                           ___________________________________________________________
                        </p>
                        <p style={{ textAlign: "center", fontWeight: "bolder" }}>RECIBÍ.</p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </Paper>
   );
}
