/*
Model de pregunta radio button 
  BM_resultat (number): resultat introduit per el usuari
  BM_id (string): id i clau aliena a pregunta
  BM_opcions (string[]): array de opcions per a selecciona de l'usuari
*/
export class opcio {
  BM_checked: boolean;
  value?: string;
  constructor(checked: boolean) {
    this.BM_checked = checked;
  }
}
