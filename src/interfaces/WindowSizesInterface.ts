
export interface WindowSizesInterface{
    name? : string,
    pages?: string[],
    size: {
        width: number,
        height: number,
    },
    position?:{
        x: number,
        y: number,
    },
    pinned?: Boolean,
}