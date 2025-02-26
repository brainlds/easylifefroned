export interface Activity {
    activity_type: string;
    cost: number;
    description: string;
    name: string;
    time: string;
    weather_notice: string;
}

export interface DailyPlan {
    activities: Activity[];
    date: string;
    daily_cost: number;
    weather: string;
}

export interface TravelPlan {
    accommodation_level: string;
    budget: number;
    daily_plans: DailyPlan[];
    departure: string;
    destination: string;
    duration: number;
    summary: string;
    total_cost: number;
    travel_style: string;
}

export interface TravelPlanResponse {
    code: number;
    data: TravelPlan;
    success: boolean;
}

export { }; 