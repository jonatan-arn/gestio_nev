/*
Model de pregunta text
  BM_resultat (string): text introduit per l'usuari
  BM_id (string): id i clau aliena a pregunta
*/
export class text {
  BM_resultat: string;
  BM_id: string;
  constructor(resultat, id) {
    this.BM_resultat = resultat;
    this.BM_id = id;
  }
}
