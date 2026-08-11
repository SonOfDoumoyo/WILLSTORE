import type { Social } from "./socialtype";

export type User = {
    uid: string;
    email: string;
    fullname: string; 
    role: string;
    verified: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    socials: Social[]
}