/*
Model de pregunta slider 
  BM_resultat (number): numero del slider seleccionat per l'usuari
  BM_id (string): id i clau aliena a pregunta
*/
export class slider {
  BM_resultat: number;
  BM_id: string;

  constructor(resultat, id) {
    this.BM_resultat = resultat;
    this.BM_id = id;
  }
}
