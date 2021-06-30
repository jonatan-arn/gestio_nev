import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { usuaris } from '../models/BM_usuaris';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsuarisService {
  usuarisCollection: AngularFirestoreCollection;
  private usuarisArray: Observable<usuaris[]>;

  constructor(private afs: AngularFirestore) {
    this.usuarisCollection = this.afs.collection<usuaris>('BM_Usuaris');
  }
  getUsuaris() {
    return this.usuarisArray;
  }
  getUsuari(user: any) {
    let s = this.afs.collection<usuaris>('BM_usuaris/', (ref) =>
      ref.where('BM_user', '==', user)
    );

    return s;
  }
  addUser(user, pwd, tipo): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = this.afs.createId();
        let usuario: usuaris = new usuaris(null, user, pwd, null, tipo);
        usuario.BM_id = id;
        usuario.BM_user = user;
        usuario.BM_password = pwd;
        usuario.BM_tipus = tipo;
        console.log(usuario.BM_user);
        const data = { ...usuario };
        console.log(id);
        console.log(data);
        const result = await this.afs
          .collection('BM_usuaris/')
          .doc(id)
          .set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
}
