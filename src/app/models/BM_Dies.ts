/*
Model de dies
  BM_id(String): id
  BM_dia(String): data del dia
  BM_temperatura(number): temperatura de una nevera en un dia
  BM_idNevere(number): clau aliena a la nevera
*/
export class dies {
  BM_id: string;
  BM_dia: string;
  BM_temperatura: number;
  BM_idNevera: any;
  constructor(
    BM_id: string,
    BM_dia: string,
    BM_temperatura: number,
    BM_idNevera: any
  ) {
    this.BM_id = BM_id;
    this.BM_dia = BM_dia;
    this.BM_temperatura = BM_temperatura;
    this.BM_idNevera = BM_idNevera;
  }
}
