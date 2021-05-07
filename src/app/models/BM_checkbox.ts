export class checkbox {
  BM_resultat: string;
  BM_id: string;
  BM_opcions: any;
  constructor(resultat, id, opcions) {
    this.BM_opcions = opcions;
    this.BM_id = id;
    this.BM_resultat = resultat;
  }
}
