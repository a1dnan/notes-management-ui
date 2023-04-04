import { Level } from "../enums/level";

export interface Note {
    id: number;
    title: string;
    description: string;
    level: Level;
    createdAt: Date;
}
