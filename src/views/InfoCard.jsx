import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { Typography } from "@mui/material";
import { formatCurrency, formatDatetime, formatPhone, getAge, numberToText, splitArroba } from "../../../../utils/Formats";
import Toast from "../../../../utils/Toast";
import icons from "../../../../constant/icons";
import images from "../../../../constant/images";
import env from "../../../../constant/env";
import { Divider } from "../../../../components/basics";
// import MyPDFComponent from "../../../utils/createPDF";
// import { Document, Page } from "@react-pdf/renderer";
// import {} from "html-pdf-client";

const registroDIF = {
   numeroRegistro: "DIF-2023-1234",
   fechaSolicitud: "2023-12-15",
   nombre: "María González López",
   fechaNacimiento: "1985-03-20",
   direccion: "Calle Principal 123, Col. Centro, Ciudad de México",
   telefono: "(55) 1234-5678",
   tipoApoyo: "Asistencia Alimentaria",
   descripcionCaso: "Madre soltera con dos hijos menores. Solicita apoyo alimentario debido a dificultades económicas tras perder su empleo.",
   estadoSolicitud: "En proceso"
};

export default function SituationInfoCard({ data, targetSection = "sectionPortada" }) {
   // console.log("🚀 ~ SituationInfoCard ~ data:", data);
   const sectionPortadaRef = useRef(null);
   const sectionAvisoPrivacidadRef = useRef(null);
   const sectionFirstRequestRef = useRef(null);
   const sectionRequestRef = useRef(null);
   const sectionReceiptRef = useRef(null);
   const sectionSocioEconomicRef = useRef(null);
   const sectionDocsRef = useRef(null);
   const sectionEvidencesRef = useRef(null);

   const checkCross = (value, size = 24) => {
      try {
         return value ? (
            <div className="checkCross" style={{ color: "green", fontSize: size + 5 }}>
               ✔️
            </div>
         ) : (
            <div className="checkCross" style={{ color: "red", fontSize: size }}>
               ❌
            </div>
         );
         // return value ? <CheckIcon height={size} /> : <CloseIcon fontSize="small" />;
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   const titleStyle = { backgroundColor: "#364152", color: "whitesmoke", fontSize: 18, padding: 8, borderBottom: "1px solid white" },
      subtitleStyle = { backgroundColor: "#525C6A", color: "whitesmoke", fontSize: 14, padding: 6, border: "1px solid #364152" },
      valueStyle = { fontSize: 12, padding: 6, border: "1px solid #364152" },
      subtitleStyleHidden = {
         backgroundColor: "#525C6A",
         color: "whitesmoke",
         fontSize: 14,
         padding: 6,
         border: "1px solid #364152",
         display: ["RECHAZADA", "CANCELADA"].includes(data?.status) ? "block" : "none"
      },
      valueStyleHidden = { fontSize: 12, padding: 6, border: "1px solid #364152", display: ["RECHAZADA", "CANCELADA"].includes(data?.status) ? "block" : "none" };

   const familyData =
      data?.family_data?.map((family) => [
         { colSpan: null, style: valueStyle, value: family.full_name },
         { colSpan: null, style: valueStyle, value: `${family.age} años` },
         { colSpan: null, style: valueStyle, value: family.relationship },
         { colSpan: null, style: valueStyle, value: family.civil_status },
         { colSpan: null, style: valueStyle, value: family.occupation },
         { colSpan: null, style: valueStyle, value: family.schooling }
      ]) ?? [];
   // console.log("🚀 ~ SituationInfoCard ~ familyData:", familyData);
   const tableRows = [
      //DATOS GENERALES
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "DATOS GENERALES" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Folio" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Solicitud" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Termino" },
                     { colSpan: null, style: subtitleStyle, title: "Departamento" },
                     { colSpan: null, style: subtitleStyle, title: "Estatus de la solicitud" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: data?.folio },
                  { colSpan: null, style: valueStyle, value: formatDatetime(data?.created_at, true) },
                  { colSpan: null, style: valueStyle, value: formatDatetime(data?.end_date, true) },
                  { colSpan: null, style: valueStyle, value: data?.subcategory.department },
                  { colSpan: null, style: valueStyle, value: data?.status }
               ]
            },
            {
               tHeadRows: [[{ colSpan: 5, style: subtitleStyleHidden, title: data?.status == "RECHAZADA" ? "Causa del Rechazo" : "" }]],
               tBodyCells: [{ colSpan: 5, style: valueStyleHidden, value: data?.status == "RECHAZADA" ? data?.rejected_feedback : "" }]
            },
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "BENEFICIARIO" }],
                  [
                     { colSpan: 4, style: subtitleStyle, title: "Nombre" },
                     { colSpan: null, style: subtitleStyle, title: "edad" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 4, style: valueStyle, value: data?.beneficiary },
                  { colSpan: null, style: valueStyle, value: `${data?.beneficiary_age ?? 0} años` }
               ]
            },
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "SITUACIÓN" }],
                  [
                     { colSpan: 3, style: subtitleStyle, title: "Caso" },
                     { colSpan: 2, style: subtitleStyle, title: "Apoyo" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 3, style: valueStyle, value: data?.description },
                  { colSpan: 2, style: valueStyle, value: data?.support }
               ]
            },
            {
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Registrado por" },
                     { colSpan: null, style: subtitleStyle, title: "Seguimiento por" },
                     { colSpan: 3, style: subtitleStyle, title: "Autorizado por" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: data?.register.username },
                  { colSpan: null, style: valueStyle, value: data?.follow_uper?.username },
                  { colSpan: 3, style: valueStyle, value: data?.authorizer?.username }
               ]
            }
         ]
      },
      //DATOS DEL SOLICITANTE
      {
         style: { pageBreakAfter: "always" },
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "DATOS DEL SOLICITANTE" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "CURP" },
                     { colSpan: null, style: subtitleStyle, title: "Nombre Completo" },
                     { colSpan: null, style: subtitleStyle, title: "Fecha de Nacimeinto" },
                     { colSpan: null, style: subtitleStyle, title: "Sexo" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: data?.requester.curp },
                  { colSpan: null, style: valueStyle, value: `${data?.requester.full_name}` },
                  {
                     colSpan: null,
                     style: valueStyle,
                     value: `${formatDatetime(data?.requester.birthdate, false)} (${getAge(data?.requester.birthdate, data?.created_at)} años)`
                  },
                  { colSpan: null, style: valueStyle, value: data?.requester.gender }
               ]
            },
            {
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Teléfono" },
                     { colSpan: 2, style: subtitleStyle, title: "Correo electrónico" },
                     { colSpan: null, style: subtitleStyle, title: "Trabaja" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: formatPhone(data?.requester.phone) },
                  { colSpan: 2, style: valueStyle, value: data?.requester.email ?? "Sin correo" },
                  { colSpan: null, style: valueStyle, value: data?.requester.is_working ? "SÍ" : "NO" }
               ]
            },
            {
               //COMUNIDAD p1
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "C.P." },
                     { colSpan: null, style: subtitleStyle, title: "Estado" },
                     { colSpan: null, style: subtitleStyle, title: "Municipio" },
                     { colSpan: 2, style: subtitleStyle, title: "Perímetro" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: data?.community?.CodigoPostal },
                  { colSpan: null, style: valueStyle, value: data?.community?.Estado },
                  { colSpan: null, style: valueStyle, value: data?.community?.Municipio },
                  { colSpan: 2, style: valueStyle, value: data?.community?.Perimetro }
               ]
            },
            {
               //COMUNIDAD p2
               tHeadRows: [
                  [{ colSpan: null, style: titleStyle, title: null }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Colonia" },
                     { colSpan: 3, style: subtitleStyle, title: "Dirección" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: data?.community?.Colonia },
                  {
                     colSpan: 3,
                     style: valueStyle,
                     value: `${data?.requester.street} #${data?.requester.num_ext} ${data?.requester.num_int != null ? `N° interior: ${data?.requester.num_int}` : ""}`
                  }
               ]
            }
         ]
      },
      //DATOS FAMILIARES
      {
         style: null,
         TableCellcolSpan: 6,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 6, style: titleStyle, title: "DATOS FAMILIARES" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Nombre completo" },
                     { colSpan: null, style: subtitleStyle, title: "Edad" },
                     { colSpan: null, style: subtitleStyle, title: "Parentesco" },
                     { colSpan: null, style: subtitleStyle, title: "Estado civil" },
                     { colSpan: null, style: subtitleStyle, title: "Ocupación" },
                     { colSpan: null, style: subtitleStyle, title: "Grado de estudio" }
                  ]
               ],
               tBodyCells: [...familyData]
            }
         ]
      },
      //DATOS ECONOMICOS
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 4, style: titleStyle, title: "DATOS ECONOMICOS" }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "Ingresos Mensuales" },
                     { colSpan: 3, style: subtitleStyle, title: "Egresos Mensuales" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: formatCurrency(data?.economic_data?.monthly_income) },
                  { colSpan: 3, style: valueStyle, value: formatCurrency(data?.economic_data?.monthly_expenses) }
               ]
            }
         ]
      },
      //DATOS DE LA VIVIENDA
      {
         style: null,
         TableCellcolSpan: 5,
         table: [
            {
               tHeadRows: [
                  [{ colSpan: 5, style: titleStyle, title: "DATOS DE LA VIVIENDA" }],
                  [
                     { colSpan: 2, style: subtitleStyle, title: "La casa donde vivo es" },
                     { colSpan: null, style: subtitleStyle, title: "# Cuartos" },
                     { colSpan: 2, style: subtitleStyle, title: "Material de construcción" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: 2, style: valueStyle, value: data?.living_data?.house },
                  { colSpan: null, style: valueStyle, value: data?.living_data?.rooms },
                  { colSpan: 2, style: valueStyle, value: data?.living_data?.house_material }
               ]
            },
            {
               tHeadRows: [
                  [{ colSpan: 5, style: subtitleStyle, title: "Aparatos/Muebles con los que cuentan en casa" }],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Sala" },
                     { colSpan: null, style: subtitleStyle, title: "Comedor" },
                     { colSpan: null, style: subtitleStyle, title: "Antecomedor" },
                     { colSpan: null, style: subtitleStyle, title: "Recámara" },
                     { colSpan: null, style: subtitleStyle, title: "Estufa" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.living, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.dining, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.breakfast_nook, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.bedroom, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.stove, 20) }
               ]
            },
            {
               tHeadRows: [
                  [
                     {
                        colSpan: 5,
                        style: subtitleStyle,
                        title: "¿Con que servicios cuentas en tu casa?"
                     }
                  ],
                  [
                     { colSpan: null, style: subtitleStyle, title: "Agua Potable" },
                     { colSpan: null, style: subtitleStyle, title: "Luz Eléctrica" },
                     { colSpan: null, style: subtitleStyle, title: "Drenaje" },
                     { colSpan: null, style: subtitleStyle, title: "Fosa" },
                     { colSpan: null, style: subtitleStyle, title: "Fecalismo" }
                  ]
               ],
               tBodyCells: [
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.water_service, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.electricity_service, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.drainage_service, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.fosa_service, 20) },
                  { colSpan: null, style: valueStyle, value: checkCross(data?.living_data?.fecalismo_service, 20) }
               ]
            }
         ]
      }
   ];

   const dataDocs = [];
   data?.documents_data?.map((item) =>
      dataDocs.push({
         name: item.name_doc,
         url: item.img_doc,
         description: item.description_doc
      })
   );
   // console.log("🚀 ~ SituationInfoCard ~ dataDocs:", dataDocs);
   const dataEvidences = [];
   data?.evidences_data?.map((item) =>
      dataEvidences.push({
         name: item.name_evidence,
         url: item.img_evidence,
         description: item.description_evidence
      })
   );

   useEffect(() => {
      // console.log(data);
      const scrollToSection = () => {
         if (targetSection === "sectionPortada") sectionPortadaRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionAvisoPrivacidad") sectionAvisoPrivacidadRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionFirstRequest") sectionFirstRequestRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionRequest") sectionRequestRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionReceipt") sectionReceiptRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionSocioEconomic") sectionSocioEconomicRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionDocs") sectionDocsRef.current.scrollIntoView({ behavior: "smooth" });
         if (targetSection === "sectionEvidences") {
            if (!data?.evidences_data) return Toast.Info("no hay evidencias cargadas");
            sectionEvidencesRef.current.scrollIntoView({ behavior: "smooth" });
         }
      };

      scrollToSection();
   }, [targetSection]);

   return (
      <Paper id="reportPaper" sx={{ width: "100%", overflow: "hidden", backgroundColor: "white" }}>
         {/* PORTADA */}
         <div className="w-full" ref={sectionPortadaRef} style={{ pageBreakAfter: "always" }}>
            {/* <div className="overflow-hidden rounded-lg shadow-lg"> */}
            <div className="flex justify-between p-6 text-white bg-gray-800">
               <div className="">
                  <h2 className="text-3xl font-black">PETICIÓN DE APOYO</h2>
                  <p className="mt-2 text-xl font-semibold">Folio: {data?.folio}</p>
               </div>
               <img src={images.logoDark} style={{ width: "150px" }} />
            </div>

            <div className="p-6 space-y-6">
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <figure className="flex justify-around">
                     <img src={`${env.API_URL_IMG}/${data?.requester.img_photo}`} style={{ maxHeight: "300px" }} className="rounded-lg" />
                     {/* <img src={`${env.API_URL_IMG}/${data?.requester.img_ine}`} style={{ width: "300px" }} /> */}
                  </figure>

                  <div className="p-4 transition-all duration-300 rounded-lg shadow sm:col-span-2 bg-gray-50 hover:shadow-md">
                     <div className="flex items-center gap-3 mb-2">
                        <icons.Ri.RiUser2Fill className="w-5 h-5 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Solicitante</h3>
                     </div>
                     <p className="text-lg text-gray-800">{data?.requester.full_name}</p>
                     <div className="flex items-center gap-3 my-2">
                        <icons.Ri.RiCalendar2Fill className="w-5 h-5 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Fecha de Nacimiento</h3>
                     </div>
                     <p className="text-lg text-gray-800">{formatDatetime(data?.requester.birthdate, false)}</p>
                     <div className="flex items-center gap-3 my-2">
                        <icons.Ri.RiPhoneFill className="w-5 h-5 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                     </div>
                     <p className="text-lg text-gray-800">{formatPhone(data?.requester.phone)}</p>
                     <div className="flex items-center gap-3 my-2">
                        <icons.Ri.RiMapPin2Fill className="w-5 h-5 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                     </div>
                     <p className="text-lg text-gray-800">{data?.community.full_address}</p>
                  </div>
               </div>

               <div className="flex flex-wrap gap-4">
                  <StatusChip icon={icons.Ri.RiBuilding2Fill} label="Departamento" value={`${data?.subcategory.letters} - ${data?.subcategory.department}`} />
                  <StatusChip icon={icons.Ri.RiAccountCircleFill} label="Tipo de Apoyo" value={`${data?.subcategory.category} ${data?.subcategory.subcategory}`} />
                  <StatusChip icon={icons.Ri.RiAlertFill} label="Estado" value={data?.status} />
                  <StatusChip icon={icons.Ri.RiClockwise2Fill} label="Fecha de Solicitud" value={formatDatetime(data?.created_at, false, "DD / MMMM / YYYY")} />
               </div>

               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="p-6 rounded-lg bg-gray-50">
                     <h3 className="flex items-center gap-2 mb-3 text-xl font-semibold">
                        <icons.Ri.RiFileTextFill className="w-5 h-5 text-gray-600" />
                        Descripción del Caso
                     </h3>
                     <p className="leading-relaxed text-gray-700">{data?.description}</p>
                  </div>
                  <div className="p-6 rounded-lg bg-gray-50">
                     <h3 className="flex items-center gap-2 mb-3 text-xl font-semibold">
                        <icons.Fa.FaHandHoldingHeart className="w-5 h-5 text-gray-600" />
                        Apoyo
                     </h3>
                     <p className="leading-relaxed text-gray-700">{data?.support}</p>
                     <Divider text="DIRECCIÓN" />
                     <i>
                        {data?.authorized_comment}. {data?.amount && formatCurrency(data?.amount)}
                     </i>
                  </div>
               </div>

               {data?.authorizer != null && (
                  <div className="relative flex">
                     <img src={`${images.stamp}`} width={"150px"} className="absolute right-0 rounded-lg -bottom-50" />
                  </div>
               )}
               <div className="flex flex-wrap gap-4">
                  <StatusChip
                     icon={icons.Ri.RiUser2Line}
                     label="Registrado por"
                     value={`${data?.register?.username} ${data?.register?.full_name != null ? `- ${data?.register?.full_name}` : ""}`}
                  />
                  <StatusChip
                     icon={icons.Ri.RiUser2Line}
                     label="Seguimiento por"
                     value={`${data?.follow_uper == null ? "-" : `${data?.follow_uper?.username} ${data?.follow_uper?.full_name != null ? `- ${data?.follow_uper?.full_name}` : ""}`}`}
                  />
                  <StatusChip
                     icon={icons.Ri.RiUser2Line}
                     label="Autorizado por"
                     value={`${data?.authorizer == null ? "-" : `${data?.authorizer?.username} ${data?.authorizer?.full_name != null ? `- ${data?.authorizer?.full_name}` : ""}`}`}
                  />
               </div>
            </div>
            {/* </div> */}
         </div>
         {/* AVISO DE PRIVACIDAD */}
         <div className="flex flex-col w-full p-10 " ref={sectionAvisoPrivacidadRef} style={{ pageBreakAfter: "always" }}>
            <img src={images.logoDark} style={{ width: "120px" }} className="self-center mb-5" />
            <h2 className="text-[24px] font-light text-center">AVISO DE PRIVACIDAD INTEGRAL</h2>
            <p className="mt-2 text-[14px]">
               El Desarrollo Integral De La Familia De Gómez Palacio, Dgo., con domicilio en Blvd. Ejército mexicano 528, Rinconadas Bugambilias 35010, Gómez Palacio,
               Dgo es el responsable del uso y la protección de sus datos personales, de acuerdo a las normas vigentes en la materia, por lo que le informamos lo
               siguiente:
               <br />
               <br />
               <b>¿Para qué fines utilizaremos sus datos personales?</b>
               <br />
               <br />
               Sus datos personales son recabados exclusivamente para la atención y seguimiento a las solicitudes o tramites que usted realice ante el Desarrollo
               Integral De La Familia de Gómez Palacio, Dgo.
               <br />
               <br />
               Para los fines antes señalados, y en caso de las solicitudes de información es fundamental para brindarle la atención y seguimiento a su trámite, se le
               pudiera requerir algunos de los siguientes datos personales:
               <br />
               <br />
               Nombre completo, domicilio, fecha y lugar de nacimiento, número de teléfono fijo o móvil, correo electrónico, firma.
               <br />
               <br />
               <b>¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse a su uso?</b>
               <br />
               <br />
               Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Así
               mismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación);
               que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como
               oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
               <br />
               <br /> Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva a través del siguiente medio: <br />
               Acudiendo a la oficina de la Unidad de Transparencia ubicada en Blvd. Ejército mexicano 528, Rinconadas Bugambilias 35010, Gómez Palacio, Dgo. <br />
               <br />
               Los datos de contacto de la persona o departamento de datos personales, que está a cargo de dar trámite a las solicitudes de derechos ARCO, son los
               siguientes:
               <ol className="pl-3 text-[14px]">
                  <li>a) Nombre de la persona o departamento de datos personales: Unidad de Transparencia y Acceso a la Información.</li>
                  <li>b) Domicilio: Blvd. Ejército mexicano 528, Rinconadas Bugambilias 35010, Gómez Palacio, Dgo.</li>
                  <li>c) Correo electrónico: transparencia.difgomezpalacio@gmail.com</li>
                  <li>d) Número telefónico: (871) 4108667</li>
               </ol>
               <br />
               <b>Usted puede revocar su consentimiento para el uso de sus datos personales</b>
               <br />
               <br />
               Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos personales. Sin embargo, es importante que
               tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna
               obligación legal requiramos sus datos personales.
               <br />
               <br />
               Para revocar su consentimiento deberá presentar su solicitud a través del siguiente medio: transparencia.difgomezpalacio@gmail.com
               <br />
               <br />
               Para conocer el procedimiento y requisitos para la revocación del consentimiento, ponemos a su disposición el siguiente email:
               transparencia.difgomezpalacio@gmail.com
               <br />
               <br />
               <b>El uso de tecnologías de rastreo en nuestro portal de internet</b>
               <br />
               <br />
               Le informamos que en nuestra página de internet utilizamos cookies, web beacons y otras tecnologías, a través de las cuales es posible monitorear su
               comportamiento como usuario de internet, así como brindarle un mejor servicio y experiencia al navegar en nuestra página. Los datos personales que
               recabamos a través de estas tecnologías, los utilizaremos para los siguientes fines:
               <br />
               <ol className="pl-3 text-[14px]">
                  <li>
                     a) Sus datos personales son recabados exclusivamente para la atención y seguimiento a las solicitudes o tramites que usted realice ante el
                     Desarrollo Integral De La Familia de Gómez Palacio, Dgo. Los datos personales que obtenemos de estas tecnologías de rastreo son los siguientes:
                     Datos de identificación, nombre de usuario y la contraseña de una sesión.
                  </li>
               </ol>
               <br />
               <b>¿Cómo puede conocer los cambios en este aviso de privacidad?</b>
               <br />
               <br />
               El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales o por las propias
               necesidades de los trámites o servicios que realizamos.
               <br />
               <br />
               Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, a través de nuestra página oficial:
               <br />
               <br />
               <a href="https://dif.gomezpalacio.gob.mx/" target="_blank">
                  <b>https://dif.gomezpalacio.gob.mx/</b>
               </a>
            </p>
            {data?.img_firm_requester != null && (
               <img src={`${env.API_URL_IMG}/${data?.img_firm_requester}`} style={{ width: "200px" }} className="self-center object-scale-down mt-5 -mb-5" />
            )}
            <p style={{ textAlign: "center", fontWeight: "bolder" }} className={data?.img_firm_requester == null && "mt-16"}>
               ___________________________________________________________
            </p>
            <p style={{ textAlign: "center", fontWeight: "bolder" }}>FIRMA DEL SOLICITANTE.</p>
         </div>
         {/* HOJA DE PRIMERA SOLICITUD */}
         <div className="flex flex-col w-full p-10 -2" ref={sectionFirstRequestRef} style={{ pageBreakAfter: "always" }}>
            <div className="flex justify-between">
               <img src={images.logoGPD} style={{ width: "150px" }} className="self-center mb-5" />
               <img src={images.logoDark} style={{ width: "150px" }} className="self-center mb-5" />
            </div>
            {/* <h2 className="text-[24px] font-light text-center">AVISO DE PRIVACIDAD INTEGRAL</h2> */}
            <p className="text-right">
               Gómez Palacio, Dgo. A: <span className="px-2 font-bold border-b-2 border-black">{formatDatetime(data?.created_at, false, "DD / MMMM / YYYY")}</span>
            </p>
            <br />
            <p className="font-bold">
               LIC. BRENDA DEL SOCORRO CALDERON CARRETE <br />
               Directora General de DIF Municiapl de Gómez Palacio Durango <br />
               Presente.-
            </p>
            <br />
            <p className="mt-2 " style={{ lineHeight: 2 }}>
               De la manera más atenta solicito me apoye con{" "}
               <span className="px-2 font-bold border-b-2 border-black">
                  {data?.subcategory?.category} {data?.subcategory?.subcategory}
               </span>
               . Ya que no cuento con los recursos para solventar el gasto.
               <br />
               <br />
               GRACIAS.
            </p>
            {data?.img_firm_requester != null && (
               <img src={`${env.API_URL_IMG}/${data?.img_firm_requester}`} style={{ width: "200px" }} className="self-center object-scale-down mt-5 -mb-5" />
            )}
            <p style={{ textAlign: "center", fontWeight: "bolder" }} className={data?.img_firm_requester == null && "mt-16"}>
               ___________________________________________________________
            </p>
            <p style={{ textAlign: "center", fontWeight: "bolder" }}>FIRMA DEL SOLICITANTE.</p>
         </div>
         {/* HOJA DE SOLICITUD */}
         <div className="flex flex-col w-full p-10 -2" ref={sectionRequestRef} style={{ pageBreakAfter: "always" }}>
            <div className="flex justify-between">
               <img src={images.logoGPD} style={{ width: "150px" }} className="self-center mb-5" />
               <img src={images.logoDark} style={{ width: "150px" }} className="self-center mb-5" />
            </div>
            {/* <h2 className="text-[24px] font-light text-center">AVISO DE PRIVACIDAD INTEGRAL</h2> */}
            <p className="text-right">
               Gómez Palacio, Dgo. A: <span className="px-2 font-bold border-b-2 border-black">{formatDatetime(data?.created_at, false, "DD / MMMM / YYYY")}</span>
            </p>
            <br />
            <p className="font-bold">
               LIC. BRENDA DEL SOCORRO CALDERON CARRETE <br />
               Directora General de DIF Municiapl de Gómez Palacio Durango <br />
               Presente.-
            </p>
            <br />
            <p className="mt-2 " style={{ lineHeight: 2 }}>
               A sus amables atenciones me dirijo para solicitarle tenga a bien apoyarme con{" "}
               <span className="px-2 font-bold border-b-2 border-black">
                  {data?.subcategory?.category} {data?.subcategory?.subcategory}
               </span>
               . <br />
               Para <span className="px-2 font-bold border-b-2 border-black">{data?.requester?.full_name}</span>, Edad{" "}
               <span className="px-2 font-bold border-b-2 border-black">{getAge(data?.requester?.birthdate, data?.created_at)} años</span>.
               <br />
               Domicilio <span className="px-2 font-bold border-b-2 border-black">{data?.community?.full_address}</span>.
               <br />
               <br />
               Lo anterior debido a que <span className="px-2 font-bold border-b-2 border-black">{data?.description}</span>.
               <br />
               <br />
               Agradezco su invaluable apoyo.
            </p>
            {data?.img_firm_requester != null && (
               <img src={`${env.API_URL_IMG}/${data?.img_firm_requester}`} style={{ width: "200px" }} className="self-center object-scale-down mt-5 -mb-5" />
            )}
            <p style={{ textAlign: "center", fontWeight: "bolder" }} className={data?.img_firm_requester == null && "mt-16"}>
               ___________________________________________________________
            </p>
            <p style={{ textAlign: "center", fontWeight: "bolder" }}>FIRMA DEL SOLICITANTE.</p>
         </div>
         {/* RECIBO DE PAGO */}
         {data?.receipt && (
            <div className="flex flex-col w-full p-10 -2" ref={sectionReceiptRef} style={{ pageBreakAfter: "always" }}>
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
                     {/* <p>ADMINISTRACIÓN 2022-2025</p> */}
                     <img src={images.cedula} style={{ width: "150px" }} className="self-center mt-20 mb-5" />
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
                           <p className="">
                              <p className="px-2 font-bold border-b-2 border-black">
                                 * Por concepto de: {data?.subcategory?.category} {data?.subcategory?.subcategory}
                              </p>
                              <p className="px-2 font-bold border-b-2 border-black">Nombre: {data?.requester?.full_name}</p>
                              <p className="px-2 font-bold border-b-2 border-black">Domicilio: {data?.community?.full_address}</p>
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
         {/* ESTUDIO SOCIO-ECONOMICO */}
         <table style={{ border: "none", borderSpacing: "0" }} className="m-10">
            <tbody>
               {/* ENCABEZADO */}
               <tr style={{ border: "none" }}>
                  <td align="left">
                     <img src={images.logoGPD} style={{ width: "150px" }} />
                  </td>
                  {/* <td align="center" colSpan={3}>
                     <img src={images.logoGPD} style={{ width: "150px" }} />
                  </td> */}
                  <td align="right">
                     <img src={images.logoDark} style={{ width: "150px" }} />
                  </td>
               </tr>
               <tr style={{ border: "none" }} ref={sectionSocioEconomicRef}>
                  <td colSpan={5} align="center">
                     <h1 style={{ fontWeight: "bolder", fontSize: "35px" }}>DIRECCIÓN DE {data?.subcategory.department}</h1>
                     <h3>
                        <span style={{ fontWeight: "500" }}>ESTUDIO SOCIO-ECONOMICO</span>
                     </h3>
                  </td>
               </tr>
               <tr>
                  <td colSpan={5} align="center" style={{ marginBottom: "25px" }}>
                     <p align="justify" style={{ fontWeight: "normal", maxWidth: "100%" }}>
                        El presente documento tiene por objetivo dar conocer el resumen de la petición del solicitante al <b> DIF Gómez Palacio</b>. La información
                        proporcionada aquí debe ser completamente verdadera.
                     </p>
                  </td>
               </tr>
               {/* DATOS */}
               {tableRows.map((tr, trIndex) => (
                  <tr key={`tr1_${trIndex}`} style={tr.style}>
                     <td colSpan={tr.TableCellcolSpan}>
                        <table style={{ borderSpacing: "0", width: "100%", marginBottom: "35px" }}>
                           {tr.table.map((t, tIndex) => (
                              <>
                                 <thead key={`th1_${tIndex}`}>
                                    {t.tHeadRows.map((thr, thrIndex) => {
                                       if (thr[0]?.title === null) return null;
                                       return (
                                          <tr key={`thr_tr_${thrIndex}`}>
                                             {thr.map((tcTitle, innerIndex) => (
                                                <th key={`arrayTHCell_${thrIndex}_${innerIndex}`} colSpan={tcTitle.colSpan} align="center" style={tcTitle.style}>
                                                   {tcTitle.title}
                                                </th>
                                             ))}
                                          </tr>
                                       );
                                    })}
                                 </thead>
                                 <tbody key={`tb_${tIndex}`}>
                                    {t.tBodyCells.map((tc, tbIndex) => {
                                       if (Array.isArray(tc)) {
                                          return (
                                             <tr role="checkbox" tabIndex={-1} key={`tb_tr_${tbIndex}`}>
                                                {tc.map((tcValue, innerIndex) => (
                                                   <td key={`arrayTBCell_${tbIndex}_${innerIndex}`} colSpan={tcValue.colSpan} align="center" style={tcValue.style}>
                                                      {tcValue.value}
                                                   </td>
                                                ))}
                                             </tr>
                                          );
                                       } else if (typeof tc === "object") {
                                          return (
                                             <td key={`objectTBCell_${tbIndex}`} colSpan={tc.colSpan} align="center" style={tc.style}>
                                                {tc.value}
                                             </td>
                                          );
                                       }
                                    })}
                                 </tbody>
                              </>
                           ))}
                        </table>
                     </td>
                  </tr>
               ))}
               {/* <tr>
                  <td colSpan={5}>
                     <p style={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "bolder" }}>Nota:</span> El usuario a declarado bajo protesta de decir la verdad, manifiesto que la información
                        proporcionada en esta solicitud es verídica.
                     </p>
                  </td>
               </tr> */}
               <tr style={{ height: "50px" }}></tr> {/* SEPARADOR */}
               {/* DOCUMENTOS */}
               <tr style={{ border: "none", pageBreakBefore: "always" }} ref={sectionDocsRef}>
                  <td colSpan={5} align="center">
                     <h1 style={{ fontWeight: "bolder", fontSize: "40px" }} id="section-docs">
                        DOCUMENTOS ADJUNTOS
                     </h1>
                  </td>
               </tr>
               {dataDocs &&
                  dataDocs.map((item, index) => (
                     <tr style={index >= 1 ? { border: "none", pageBreakBefore: "always" } : { border: "none" }}>
                        <td colSpan={5} align="center">
                           {
                              <div className="containerImg">
                                 <div className="title">{item.name}</div>
                                 <p className="caption">{item.description}</p>
                                 <img src={`${env.API_URL_IMG}/${item.url}`} style={{ maxWidth: "80%" }} />
                              </div>
                           }
                        </td>
                     </tr>
                  ))}
               {/* EVIDENCIAS */}
               <tr style={{ border: "none", pageBreakBefore: "always" }} ref={sectionEvidencesRef}>
                  <td colSpan={5} align="center">
                     <h1 style={{ fontWeight: "bolder", fontSize: "40px" }} id="section-docs">
                        EVIDENCIAS
                     </h1>
                  </td>
               </tr>
               {dataEvidences &&
                  dataEvidences.map((item, index) => (
                     <tr style={index >= 1 ? { border: "none", pageBreakBefore: "always" } : { border: "none" }}>
                        <td colSpan={5} align="center">
                           {
                              <div className="containerImg">
                                 <div className="title">{item.name}</div>
                                 <p className="caption">{item.description}</p>
                                 <img src={`${env.API_URL_IMG}/${item.url}`} style={{ maxWidth: "80%" }} />
                              </div>
                           }
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
      </Paper>
   );
}

function InfoCard({ icon: Icon, label, value }) {
   return (
      <div className="p-4 transition-all duration-300 rounded-lg shadow bg-gray-50 hover:shadow-md">
         <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
         </div>
         <p className="text-lg text-gray-800">{value}</p>
      </div>
   );
}

function StatusChip({ icon: Icon, label, value }) {
   return (
      <div className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-200 rounded-full">
         <Icon className="w-4 h-4 mr-2 text-gray-500" />
         <span className="mr-2 text-gray-600">{label}:</span>
         <span className="font-medium text-gray-800">{value}</span>
      </div>
   );
}

const first = (second) => {
   <TableBody>
      {/* DATOS */}
      {tableRows.map((tr, trIndex) => (
         <>
            <TableRow key={`tr1_${trIndex}`}>
               <TableCell key={`tc1_${trIndex}`} colSpan={tr.TableCellcolSpan}>
                  <Table key={`table1_${trIndex}`}>
                     {tr.table.map((t, tIndex) => (
                        <>
                           <TableHead key={`th1_${tIndex}`}>
                              {t.tHeadRows.map((thr, thrIndex) => {
                                 if (thr[0].title === null) return;
                                 return (
                                    <TableRow key={`thr_tr_${thrIndex}`}>
                                       {thr.map((tcTitle, innerIndex) => (
                                          <TableCell key={`arrayTHCell_${thrIndex}_${innerIndex}`} colSpan={tcTitle.colSpan} align={"center"} style={tcTitle.style}>
                                             {tcTitle.title}
                                          </TableCell>
                                       ))}
                                    </TableRow>
                                 );
                              })}
                           </TableHead>
                           <TableBody key={`tb_${tIndex}`}>
                              {t.tBodyCells.map((tc, tbIndex) => {
                                 if (Array.isArray(tc)) {
                                    return (
                                       <TableRow role="checkbox" tabIndex={-1} key={`tb_tr_${tbIndex}`}>
                                          {tc.map((tcValue, innerIndex) => (
                                             <TableCell key={`arrayTBCell_${tbIndex}_${innerIndex}`} colSpan={tcValue.colSpan} align={"center"} style={tcValue.style}>
                                                {tcValue.value}
                                             </TableCell>
                                          ))}
                                       </TableRow>
                                    );
                                 } else if (typeof tc === "object")
                                    return (
                                       <TableCell key={`objectTBCell_${tbIndex}`} colSpan={tc.colSpan} align={"center"} style={tc.style}>
                                          {tc.value}
                                       </TableCell>
                                    );
                              })}
                           </TableBody>
                        </>
                     ))}
                  </Table>
               </TableCell>
            </TableRow>
            <div style={{ pageBreaBbefore: "always" }}></div>
            {/* {trIndex % 3 == 0 && <div className="page-break"></div>} */}
         </>
      ))}
      <TableRow>
         <TableCell colSpan={5}>
            <Typography textAlign={"center"}>
               <span style={{ fontWeight: "bolder" }}>Nota:</span> El usuario a declarado bajo protesta de decir la verdad, manifiesto que la información proporcionada
               en esta solicitud es verídica.
            </Typography>
         </TableCell>
      </TableRow>
      <TableRow sx={{ height: 20 }}></TableRow> {/* SEPARADOR */}
      {/* <TableRow>
         <TableCell colSpan={5}>
            <Typography textAlign={"center"} style={{ fontWeight: "bolder" }}>
               ___________________________________________________________{" "}
            </Typography>
            <Typography textAlign={"center"} style={{ fontWeight: "bolder" }}>
               NOMBRE Y FIRMA DEL PADRE, MADRE O TUTOR.
            </Typography>
         </TableCell>
      </TableRow> */}
   </TableBody>;
};
