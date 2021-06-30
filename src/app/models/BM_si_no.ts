import { opcio } from './BM_opcio';

/*
Model de pregunta si/no
  BM_resultat (number): text de la opcio que ha selecciona el usuari
  BM_id (string): id i clau aliena a pregunta
  BM_text1 (string): text de la opcio1
  BM_text2 (string): text de la opcio2
  BM_correcta (string): text  que es igual a l'opcio correcta
*/
export class si_no {
  BM_resultat: string;
  BM_id: string;
  BM_text1: string;
  BM_text2: string;
  BM_correcta: string;
  constructor(resultat, id, text1, text2, correcta) {
    this.BM_resultat = resultat;
    this.BM_id = id;
    this.BM_text1 = text1;
    this.BM_text2 = text2;
    this.BM_correcta = correcta;
  }
}
