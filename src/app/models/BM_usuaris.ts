/*
Model de pregunta  usuaris 
  BM_id (string): id i clau aliena a pregunta
  BM_user (string): nom de l'usuari
  BM_password (string): contrasenya de l'usuari
  BM_idLocalitat (number): clau aliena de l'usuari amb localitat
  BM_tipus (string): tipus de l'usuari
*/
export class usuaris {
  BM_id: string;
  BM_user: string;
  BM_password: string;
  BM_idLocalitat: number;
  BM_tipus: string;
}
