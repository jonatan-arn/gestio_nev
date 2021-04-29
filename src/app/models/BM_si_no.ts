export class si_no {
  BM_resultat: boolean;
  BM_preguntaId: number;
  BM_text1: string;
  BM_text2: string;
  correcta: string;
  constructor(resultat, id, text1, text2, correcta) {
    this.BM_resultat = resultat;
    this.BM_preguntaId = id;
    this.BM_text1 = text1;
    this.BM_text2 = text2;
    this.correcta = correcta;
  }
}
