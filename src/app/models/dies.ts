export class dies {
    id:number;
    dia:string;
    temperatura:number;
    idNevera:number;
}

export class NewDia {
    constructor(
        id:number,
        dia:string,
        temperatura:number,
        idNevera:number,
    ){};
}

export function NuevoDia(a,b,c,d):dies{

	return {
				id:	a,
				dia:	b,						
				temperatura:	c,
				idNevera:	d
				

	}

}


export function diesToAJSON(data):dies[]{
    return data["dies"].records.map((val)=>{
        return {
        id:val[0],
        dia:val[1],
        temperatura:val[2],  
        idNevera:val[3],
        }
    })
}