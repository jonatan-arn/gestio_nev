/*
Model de nevera
  BM_id (number): id
  BM_idLocalitat (number): clau aliena de la localtat
  BM_esObrador (boolean): si es localitza o no al obrador
  BM_nomNevera (string): el nom de la nevera
*/
export class nevera {
  BM_id: number;
  BM_idLocalitat: number;
  BM_esObrador: boolean;
  BM_nomNevera: string;
}

export class NewNevera {
  constructor(
    BM_id: number,
    BM_idLocalitat: number,
    BM_esObrador: boolean,
    BM_nomNevera: string
  ) {}
}
