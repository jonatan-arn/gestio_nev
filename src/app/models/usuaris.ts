export class usuaris {
    id:number;
    user:string;
    password:string;
    idLocalitat:number;
}

export class NewUsuari {
    constructor(
        id:number,
        user:string,
        password:string,
        idLocalitat:number,
    ){};
}

export function usuarisToAJSON(data):usuaris[]{
    return data["usuaris"].records.map((val)=>{
        return {
        id:val[0],
        user:val[1],
        password:val[2],  
        idLocalitat:val[3],
        }
    })
}