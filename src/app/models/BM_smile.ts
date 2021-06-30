/*
Model de pregunta smile slider 
  BM_resultat (number): numero del smile slider seleccionat per l'usuari
  BM_id (string): id i clau aliena a pregunta
*/
export class smile {
  BM_resultat: number;
  BM_id: string;
  constructor(resultat, id) {
    this.BM_resultat = resultat;
    this.BM_id = id;
  }
}
