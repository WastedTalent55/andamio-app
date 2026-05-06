export interface Cliente {
    id: number;
    nombre: string;
    contacto: string; // Tu teléfono
    ubicaciones: string[];   // Un arreglo porque dijiste que pueden tener varias direcciones
    notas?: string;          // El signo '?' significa que es opcional
}