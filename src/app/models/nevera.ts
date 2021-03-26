export class nevera {
    id:number;
    idLocalitat:number;
}

export class NewNevera {
    constructor(
        id:number,       
        idLocalitat:number,
    ){};
}

export function neveraToAJSON(data):nevera[]{
    return data["nevera"].records.map((val)=>{
        return {
        id:val[0],
        idLocalitat:val[1],
        }
    })
}