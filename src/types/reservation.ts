import { Property } from './property';

export interface ReservationClient {
  id: number;
  nombrecompleto: string;
  email: string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

// El backend devuelve los precios como string y, en el endpoint por cliente,
// el alojamiento llega dentro de un arreglo `lugar`.
export interface Reservation {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: string;
  precioLimpieza: string;
  precioNoches: string;
  precioServicio: string;
  created_at: string;
  updated_at: string;
  cliente?: ReservationClient;
  lugar?: Property[];
}

export interface CreateReservationPayload {
  lugar_id: number;
  cliente_id: number;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: string;
  precioLimpieza: string;
  precioNoches: string;
  precioServicio: string;
}
