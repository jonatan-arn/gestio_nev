export class preguntaCreacio {
  BM_id: number;
  BM_nom: string;
  BM_imatge: File;
  BM_comentari: string;
  BM_puntuacio: number;
  BM_perill: boolean;
  BM_auditoriaId: number;
}
export function NuevoPreguntaCreacio(
  id,
  nom,
  imatge,
  comentari,
  puntuacio,
  perill,
  idAuditoria
): preguntaCreacio {
  return {
    BM_id: id,
    BM_nom: nom,
    BM_imatge: imatge,
    BM_comentari: comentari,
    BM_puntuacio: puntuacio,
    BM_perill: perill,
    BM_auditoriaId: idAuditoria,
  };
}
