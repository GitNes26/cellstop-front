// types/productDetail.ts
export interface ProductDetailData {
   id: string | number;
   filtro?: string;
   telefono?: string;
   imei?: string;
   iccid?: string;
   estatus_lin?: string;
   movimiento?: string;
   fecha_activ?: string | Date;
   fecha_prim_llam?: string | Date;
   fecha_dol?: string | Date;
   estatus_pago?: "PAGADA" | "RECHAZADA" | string;
   motivo_estatus?: string;
   monto_com?: number;
   tipo_comision?: string;
   evaluacion?: string | number;
   fza_vta_pago?: string;
   fecha_evaluacion?: string | Date;
   folio_factura?: string;
   fecha_publicacion?: string | Date;
   import_id?: number;
   active?: boolean;
   created_at?: string | Date;
   updated_at?: string | Date;
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
