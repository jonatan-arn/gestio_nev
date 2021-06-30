/*
Modelo de les preguntes checkbox
  BM_resultat(string[]): arrya de strings amb el nom de les opcions que selecciona el usuari
  BM_id(string): id i clau aliena a pregunta
  BM_opcion(string []): opcions que el usuaris crea per a es pugen seleccionar
*/

export class checkbox {
  BM_resultat: string[];
  BM_id: string;
  BM_opcions: any;
  constructor(resultat, id, opcions) {
    this.BM_opcions = opcions;
    this.BM_id = id;
    this.BM_resultat = resultat;
  }
}
