import { Reservation } from './reservation';

export interface Host {
  id: number;
  nombrecompleto: string;
  email: string;
  telefono: string;
  email_verified_at: string | null;
  password: string;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: number;
  url: string;
  lugar_id: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  nombre: string;
  descripcion: string;
  cantPersonas: number;
  cantCamas: number;
  cantBanios: number;
  cantHabitaciones: number;
  tieneWifi: number;
  cantVehiculosParqueo: number;
  precioNoche: string;
  costoLimpieza: string;
  ciudad: string;
  latitud: string;
  longitud: string;
  arrendatario_id: number;
  created_at: string;
  updated_at: string;
  arrendatario: Host;
  fotos: PropertyImage[];
  reservas?: Reservation[];
}

export interface AdvancedSearchPayload {
  ciudad: string;
  descripcion?: string;
  cantPersonas?: string;
  cantCamas?: number;
  cantBanios?: number;
  cantHabitaciones?: number;
  tieneWifi?: number;
  cantVehiculosParqueo?: number;
  precioNoche?: number;
}

function withProtocol(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const noLeadingSlash = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `http://${noLeadingSlash}`;
}

export function getPhotoUrls(property: Property): string[] {
  if (!property.fotos || property.fotos.length === 0) {
    return [];
  }
  return property.fotos
    .map((foto) => foto.url)
    .filter((url): url is string => Boolean(url))
    .map(withProtocol);
}
