import { Sources } from "../Library/Enums/Sources";

export type CustomResponse<T> = {
    data: T;
    source: Sources;
};