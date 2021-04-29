export class auditories {
  BM_id: number;
  BM_nom: string;
  BM_tendaId: number;
  BM_data: string;
}

export function NuevoAuditoria(id, nom, tendaId, data): auditories {
  return {
    BM_id: id,
    BM_nom: nom,
    BM_tendaId: tendaId,
    BM_data: data,
  };
}
