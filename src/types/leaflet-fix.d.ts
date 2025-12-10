declare module "react-leaflet" {
   export interface MapContainerProps {
      center?: [number, number];
      zoom?: number;
      scrollWheelZoom?: boolean;
   }

   export interface TileLayerProps {
      url: string;
      attribution?: string;
   }

   export interface CircleProps {
      center: [number, number];
      radius: number;
      pathOptions?: any;
   }

   export interface MarkerProps {
      position: [number, number];
      icon?: any;
   }
}
