import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { UsuarisService } from '../services/BM_usuaris.service';

export class NameValidator {
  static async isValid(user: string, service: UsuarisService): Promise<any> {
    const checkUser = await service.getUsuari(user).get().toPromise();

    if (checkUser.size != 0) {
      console.log('igual');
      return true;
    }

    return null;
  }
}
