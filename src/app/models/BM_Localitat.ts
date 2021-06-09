/*
Model de localitat
  BM_ID(number): id 
  BM_Poblacio(String): poblacio on es localitza 
  BM_cp(number): codig postal
  BM_direccio: carrer on es localitza la tenda
*/
export class localitat {
  BM_ID: number;
  BM_Poblacio: string;
  BM_cp: number;
  BM_direccio: string;
  constructor(
    BM_ID: number,
    BM_cp: number,
    BM_direccio: string,
    BM_Poblacio: string
  ) {
    this.BM_ID = BM_ID;
    this.BM_cp = BM_cp;
    this.BM_direccio = BM_direccio;
    this.BM_Poblacio = BM_Poblacio;
  }
}
