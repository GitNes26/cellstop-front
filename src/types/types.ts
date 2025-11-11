export interface ChipData {
   id: string;
   iccid: string;
   phoneNumber: string;
   preActivationDate: string;
   status: "Pre-activado" | "Activado" | "Pendiente";
   amount: string;
   selected?: boolean;
}

export type TemplateType = "A4" | "TABLOIDE";
export type ViewMode = "edit" | "preview" | "selection";