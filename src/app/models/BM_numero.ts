/*
Model de pregunta numero
  BM_resultat (number): resultat introduit per el usuari
  BM_id (string): id i clau aliena a pregunta
*/
export class numero {
  BM_resultat: number;
  BM_id: string;
  constructor(resultat, id) {
    this.BM_resultat = resultat;
    this.BM_id = id;
  }
}
