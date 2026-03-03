export interface Review {
  id?: number;
  movieId: number;
  userId: string;
  userName: string;
  comment: string;
  rate: number;
  date: string;
}
