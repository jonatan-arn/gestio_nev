export class radio {
  BM_resultat: string;
  BM_preguntaId: number;
  BM_opcions: any;
  constructor(resultat, id, opcions) {
    this.BM_resultat = resultat;
    this.BM_preguntaId = id;
    this.BM_opcions = opcions;
  }
}
