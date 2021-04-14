export class dies {
  id: string;
  BM_dia: string;
  BM_temperatura: number;
  BM_idNevera: any;
}

export class NewDia {
  constructor(
    BM_id: number,
    BM_dia: string,
    BM_temperatura: number,
    BM_idNevera: any
  ) {}
}

export function NuevoDia(a, b, c, d): dies {
  return {
    id: a,
    BM_dia: b,
    BM_temperatura: c,
    BM_idNevera: d,
  };
}
