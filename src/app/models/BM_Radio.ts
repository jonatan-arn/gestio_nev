import { opcio } from './BM_opcio';

/*
Model de pregunta radio button 
  BM_resultat (number): resultat introduit per el usuari
  BM_id (string): id i clau aliena a pregunta
  BM_opcions (string[]): array de opcions per a selecciona de l'usuari
*/
export class radio {
  BM_resultat: string;
  BM_id: string;
  BM_opcions: opcio[];
  constructor(resultat, id, opcions) {
    this.BM_resultat = resultat;
    this.BM_id = id;
    this.BM_opcions = opcions;
  }
}
