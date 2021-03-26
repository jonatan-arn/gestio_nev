export class localitat {
    id:number;
    cp:string;
    direccio:string;
}

export class NewLocalitat {
    constructor(
        id:number,
        cp:string,
        direccio:string,
    ){};
}

export function LocalitatToAJSON(data):localitat[]{
    return data["localitat"].records.map((val)=>{
        return {
        id:val[0],
        cp:val[1],
        direccio:val[2],  
        }
    })
}