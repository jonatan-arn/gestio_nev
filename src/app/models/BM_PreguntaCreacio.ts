export class preguntaCreacio {
  BM_id: string;
  BM_nom: string;
  BM_imatge: File;
  BM_comentari: string;
  BM_puntuacio: number;
  BM_perill: boolean;
  BM_auditoriaId: string;
  BM_tipo: string;
  constructor(id, nom, imatge, comentari, puntuacio, perill, auditoria, tipo) {
    this.BM_id = id;
    this.BM_nom = nom;
    this.BM_imatge = imatge;
    this.BM_comentari = comentari;
    this.BM_puntuacio = puntuacio;
    this.BM_perill = perill;
    this.BM_auditoriaId = auditoria;
    this.BM_tipo = tipo;
  }
}
