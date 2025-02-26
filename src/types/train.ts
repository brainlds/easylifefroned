export interface Seat {
    available: boolean;
    price: number;
    type: string;
}

export interface TrainTicket {
    train_no: string;
    type: string | null;
    departure_station: string;
    arrival_station: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    seats: Seat[];
    can_buy: boolean;
}

export interface TrainTicketsResponse {
    success: boolean;
    data: {
        start: string;
        end: string;
        date: string;
        trains: TrainTicket[];
    };
} 