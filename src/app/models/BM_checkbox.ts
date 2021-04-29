export class checkbox {
  BM_resultat: string;
  BM_preguntaId: string;
  BM_opcions: any;
  constructor(resultat, preguntaid, opcions) {
    this.BM_opcions = opcions;
    this.BM_preguntaId = preguntaid;
    this.BM_resultat = resultat;
  }
}
export function NuevoCheckbox(a, b, c): checkbox {
  return {
    BM_resultat: a,
    BM_preguntaId: b,
    BM_opcions: c,
  };
}
