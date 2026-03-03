export interface Review {
  id?: number;
  movieId: number;
  userEmail: string;
  userName: string;
  comment: string;
  rate: number;
  date: string;
}
