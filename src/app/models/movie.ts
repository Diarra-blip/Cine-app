export interface Movie {
  id?: number;
  title: string;
  director: string;
  releaseDate: string | Date; 
  synopsis: string;
  rate?: number;
  image?: string;
}