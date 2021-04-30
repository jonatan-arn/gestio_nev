export class auditories {
  BM_id: number;
  BM_nom: string;
  BM_tendaId: number;
  BM_data: string;
  constructor(id, nom, tendaId, data) {
    this.BM_id = id;
    this.BM_nom = nom;
    this.BM_tendaId = tendaId;
    this.BM_data = data;
  }
}
