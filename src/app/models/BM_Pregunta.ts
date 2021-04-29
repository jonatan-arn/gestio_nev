export class pregunta {
  BM_id: number;
  BM_nom: string;
  BM_imatge: boolean;
  BM_comentari: boolean;
  BM_puntuacio: number;
  BM_perill: boolean;
  BM_auditoriaId: number;
}
export function NuevoPregunta(a, b, c, d, e, f, g): pregunta {
  return {
    BM_id: a,
    BM_nom: b,
    BM_imatge: c,
    BM_comentari: d,
    BM_puntuacio: e,
    BM_perill: f,
    BM_auditoriaId: g,
  };
}
