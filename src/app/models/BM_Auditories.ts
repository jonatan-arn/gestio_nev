//Modelo de les auditories

export class auditories {
  BM_id: string;
  BM_nom: string;
  BM_tendaId: number;
  BM_data: string;
  BM_Resultat: number;
  constructor(id, nom, tendaId, data, resultat) {
    this.BM_id = id;
    this.BM_nom = nom;
    this.BM_tendaId = tendaId;
    this.BM_data = data;
    this.BM_Resultat = resultat;
  }
}
