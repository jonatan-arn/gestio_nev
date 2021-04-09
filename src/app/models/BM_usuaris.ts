export class usuaris {
  BM_id: string;
  BM_user: string;
  BM_password: string;
  BM_idLocalitat: number;
}
export interface user {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}
export class NewUsuari {
  constructor(
    BM_id: number,
    BM_user: string,
    BM_password: string,
    BM_idLocalitat: number
  ) {}
}
