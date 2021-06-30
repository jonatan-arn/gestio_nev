import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { auditories } from '../models/BM_Auditories';
import { preguntaCreacio } from '../models/BM_PreguntaCreacio';
import { Observable } from 'rxjs';
import { smile } from '../models/BM_smile';
import { numero } from '../models/BM_numero';
import { si_no } from '../models/BM_si_no';
import { radio } from '../models/BM_Radio';
import { checkbox } from '../models/BM_checkbox';
import { slider } from '../models/BM_slider';
import { text } from '../models/BM_text';
import { pregunta } from '../models/BM_Pregunta';
import { StoragesessionService } from './storagesession.service';

@Injectable({
  providedIn: 'root',
})
export class AuditoriesService {
  esView: boolean;

  auditoria: auditories;
  auditorias: Observable<auditories[]>;
  auditories_tendes: Observable<auditories[]>;

  admin: boolean = false;

  private auditoriaCollection: AngularFirestoreCollection<auditories>;

  constructor(
    public router: Router,
    private afs: AngularFirestore,
    private stgService: StoragesessionService
  ) {
    this.auditoriaCollection = this.afs.collection<auditories>('BM_Auditories');
    this.getAllAuditories();
    this.setAdminView();
  }
  private setAdminView() {
    this.admin = this.stgService.isAdmin();
  }
  getEsView(): boolean {
    return this.esView;
  }
  setEsView(esView: boolean) {
    this.esView = esView;
  }

  getAdminView(): boolean {
    return this.admin;
  }
  setAuditoria(auditoria: auditories) {
    this.auditoria = auditoria;
  }
  getAuditoria(): auditories {
    return this.auditoria;
  }
  private getAllAuditories() {
    this.auditorias = this.afs
      .collection<auditories>('BM_Auditories')
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as auditories))
      );
    this.auditories_tendes = this.afs
      .collection<auditories>('BM_AuditoriesTenda')
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as auditories))
      );
  }

  getAllPreguntes() {
    return this.afs
      .collection<preguntaCreacio>('BM_PreguntesCreades')
      .get()
      .toPromise();
    /*
      .snapshotChanges()
      .pipe(
        map((action) =>
          action.map((a) => a.payload.doc.data() as preguntaCreacio)
        )
      );
      */
  }
  getAllPreguntesTenda() {
    return this.afs.collection<pregunta>('BM_Preguntes').get().toPromise();
    /*
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as pregunta))
      );
      */
  }
  getAllPreguntesAuditoria(auditoria: auditories) {
    return this.afs
      .collection<pregunta>('BM_Preguntes', (ref) =>
        ref.where('BM_auditoriaId', '==', auditoria.BM_id)
      )
      .get()
      .toPromise();
  }
  getAllCheckbox() {
    return this.afs.collection<checkbox>('BM_Checkbox').get().toPromise();
    /*
      .snapshotChanges()
      .pipe(
        map((action) => action.map((a) => a.payload.doc.data() as checkbox))
      );
      */
  }
  getAllRadio() {
    return this.afs.collection<radio>('BM_Radio').get().toPromise();
  }
  getAllSiNo() {
    return this.afs.collection<si_no>('BM_SiNo').get().toPromise();
  }
  getAllNumero() {
    return this.afs.collection<numero>('BM_Numero').get().toPromise();
  }
  getAllSlider() {
    return this.afs.collection<slider>('BM_Slider').get().toPromise();
  }
  getAllSmile() {
    return this.afs.collection<smile>('BM_Smile').get().toPromise();
  }

  getAllText() {
    return this.afs.collection<text>('BM_Text').get().toPromise();
  }

  onDelete(id: string, collection: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('objecte id:' + id);
        console.log('colleccio:' + collection);
        const result = await this.afs.collection(collection).doc(id).delete();
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
  onSave(objecte, collection: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = objecte.BM_id || this.afs.createId();
        const data = { ...objecte };
        const result = await this.afs.collection(collection).doc(id).set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
  onSaveAudTenda(objecte, collection: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = objecte.BM_id;
        const data = { ...objecte };
        const result = await this.afs.collection(collection).doc(id).set(data);
        resolve(result);
      } catch (err) {
        reject(err.message);
      }
    });
  }
  async checkIdPregunta(id) {
    try {
      const dataCollection: AngularFirestoreCollection<preguntaCreacio> =
        this.afs.collection<preguntaCreacio>('BM_PreguntesCreades/', (ref) =>
          ref.where('BM_id', '==', id)
        );
      return dataCollection.valueChanges();
    } catch (err) {
      return err;
    }
  }

  getPreguntesbyIdAudutoria(id) {
    const dataCollection: AngularFirestoreCollection<preguntaCreacio> =
      this.afs.collection<preguntaCreacio>('BM_PreguntesCreades/', (ref) =>
        ref.where('BM_auditoriaId', '==', id)
      );
    return dataCollection.valueChanges();
  }

  async checkIdAuditoria(id) {
    try {
      const result = await this.afs.collection<auditories>(
        'BM_Auditories/',
        (ref) => ref.where('BM_id', '==', id)
      );
      return result.valueChanges();
    } catch (err) {
      return err;
    }
  }
}
