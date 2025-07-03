export interface Reservation {
  id?: number;
  location: string;
  start_time: string;
  end_time: string;
  reserved: boolean;
  imageName?: string;
}