/*
Model de pregunta d'usuari
  BM_id (string): id
  BM_nom (string): titol de la pregunta
  BM_imatge (File): imatge realitzada per l'usuari
  BM_comentari (string): comentari de l'usuari
  BM_puntuacio (number): pes que te la pregunta en el total de la auditoria
  BM_perill (boolean): si la pregunta esta marcada com a perill
  BM_auditoriaId (string): clau aliena de la auditoria
  BM_tipo (string): el tipus al que correspon la pregunta
*/

export class pregunta {
  BM_id: string;
  BM_nom: string;
  BM_imatge: File;
  BM_comentari: string;
  BM_puntuacio: number;
  BM_perill: boolean;
  BM_auditoriaId: string;
  BM_tipo: string;
  constructor(
    id: string,
    nom: string,
    imatge: File,
    comentari: string,
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
