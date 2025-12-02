// types/productDetail.ts
export interface ProductDetailData {
   id: string | number;
   telefono?: string;
   iccid: string;
   imei?: string;
   filtro?: string;
   estatusLin?: string;
   movimiento?: string;
   fechaActiv?: string | Date;
   fechaPrimLlam?: string | Date;
   fechaDol?: string | Date;
   estatusPago?: "PAGADA" | "RECHAZADA" | "PENDIENTE" | string;
   motivoEstatus?: string;
   montoCom?: number;
   tipoComision?: string;
   evaluacion?: string | number;
   fzaVtaPago?: string;
   fechaEvaluacion?: string | Date;
   folioFactura?: string;
   fechaPublicacion?: string | Date;
   importId?: number;
   active?: boolean;
   createdAt?: string | Date;
   updatedAt?: string | Date;
}

export interface ProcessedProductDetail extends ProductDetailData {
   // Campos adicionales procesados
   formattedFechaActiv?: string;
   formattedMontoCom?: string;
   statusColor?: string;
   isPaid?: boolean;
}

export interface TableDetailsData {
   keyName: string;
   processedData: ProcessedProductDetail[];
   title?: string;
   showFilters?: boolean;
   onRowClick?: (row: ProcessedProductDetail) => void;
}
