export type TApiResponse = {
   status: number;
   result: object | Array<object> | null;
   message: string;
   alert_icon: "success" | "error" | "warning" | "info";
   alert_title: string;
   alert_text: string;
};

/**
 * Envoltorio genérico para respuestas de la API.
 *
 * @template T - Tipo del payload contenido en la propiedad `data`.
 *
 * @remarks
 * Usa esta interfaz para estandarizar las respuestas de los endpoints del servidor.
 * La propiedad `data` contiene el payload real y se espera que esté presente.
 * `message` y `success` son campos opcionales que sirven como metadatos.
 *
 * @example
 * // const response: ApiResponse<User> = {
 * //   data: { id: 1, name: 'Alice' },
 * //   success: true,
 * //   message: 'Usuario obtenido correctamente'
 * // };
 *
 * @property data - El payload devuelto por la API (tipo genérico T).
 * @property message - Mensaje opcional legible para humanos devuelto por el servidor.
 * @property success - Booleano opcional que indica si la solicitud fue exitosa.
 */
export type ApiResponse = {
   status: number;
   result: object | Array<object> | null;
   message: string;
   alert_icon: "success" | "error" | "warning" | "info";
   alert_title: string;
   alert_text: string;
   // data: T[] | T;
   // message?: string;
   // success?: boolean;
};

/**
 * Representa una entrada de menú.
 *
 * @property id - Identificador único del menú.
 * @property name - Nombre a mostrar del elemento de menú.
 * @property icon - (Opcional) nombre o ruta del ícono.
 * @property route - (Opcional) ruta asociada al elemento de menú.
 * @property parent_id - (Opcional) id del elemento padre, o null si es raíz.
 * @property children - (Opcional) submenús anidados.
 */
export interface Menu {
   id: number;
   name: string;
   icon?: string;
   route?: string;
   parent_id?: number | null;
   children?: Menu[];
}
