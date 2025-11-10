// types.ts
export interface ChipData {
   id: string;
   iccid: string;
   phoneNumber: string;
   preActivationDate: string;
   status: "Pre-activado" | "Activado" | "Pendiente";
   amount: string;
}

export type TemplateType = "A4" | "TABLOIDE";
