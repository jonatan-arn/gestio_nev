import { Component, OnInit } from '@angular/core';
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@capacitor-community/camera-preview';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-view',
  templateUrl: './camera-view.page.html',
  styleUrls: ['./camera-view.page.scss'],
})
export class CameraViewPage implements OnInit {
  cameraActive: boolean = false;
  image = null;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.openCamera();
  }
  openCamera() {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview ',
    };
    CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
  }
  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
    this.modalController.dismiss(null);
  }
  async captureImage() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90,
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.image = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera();
    this.modalController.dismiss(this.image);
  }
}
