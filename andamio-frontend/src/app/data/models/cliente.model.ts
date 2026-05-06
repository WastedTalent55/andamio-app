export interface Cliente {
    id: number;
    nombre: string;
    contacto: string; 
    ubicaciones: string[];  
    notas?: string;         
    estaActivo: boolean; 
}