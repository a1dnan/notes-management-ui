import { DataState } from "../enums/datastate";

export interface AppState<T> {

    dataState: DataState;
    data?: T;
    error?: string;
}