/*
Model de pregunta creada per l'administrador
  BM_id (string): id
  BM_nom (string): titol de la pregunta
  BM_imatge (boolean): si es obligatori introduir una imatge
  BM_comentari (boolean): si es obligatori introduir un comentari
  BM_puntuacio (number): pes que te la pregunta en el total de la auditoria
  BM_perill (boolean): si la pregunta esta marcada com a perill
  BM_auditoriaId (string): clau aliena de la auditoria
  BM_tipo (string): el tipus al que correspon la pregunta
*/
export class preguntaCreacio {
  BM_id: string;
  BM_nom: string;
  BM_imatge: boolean;
  BM_comentari: boolean;
  BM_puntuacio: number;
  BM_perill: boolean;
  BM_auditoriaId: string;
  BM_tipo: string;
  constructor(
    id: string,
    nom: string,
    imatge: boolean,
    comentari: boolean,
    puntuacio: number,
    perill: boolean,
    auditoria: string,
    tipo: string
  ) {
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
