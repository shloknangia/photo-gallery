import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform; //retrieve information about the current device


  constructor(platForm: Platform) {
    this.platform = platForm;
   }


  async addNewToGallery(){
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedimageFile = await this.savePicture(capturedPhoto);

    // this.photos.unshift({
    //   filePath: "soon..",
    //   webviewPath: capturedPhoto.webPath
    // })

    this.photos.unshift(savedimageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    })
  }


  public async loadSaved(){
    const photoList = await Storage.get({key: this.PHOTO_STORAGE});
    this.photos = JSON.parse(photoList.value) || [];

    if(!this.platform.is('hybrid')){
      for(let photo of this.photos){
        const readFile = await Filesystem.readFile({
          path: photo.filePath,
          directory: Directory.Data
        })
  
        photo.webviewPath = `data:image/jpeg;base64, ${readFile.data}`
      }
    }
  }

  private async savePicture(photo:Photo){
    // convert to base 64
    const base64Data = await this.readAsBase64(photo);

    // Write
    const fileName = new Date().getTime() + ".jpeg";
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if(this.platform.is('hybrid')){
      return {
        filePath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(photo.webPath)
      }
    }
    else {
      return {
        filePath: fileName,
        webviewPath: photo.webPath
      }
    }
  }


  async readAsBase64(photo: Photo) {

    // "hybrid" will detect Cordova or Capacitor
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: photo.path
      })
      return file.data;
    }
    else {
      // read as blob and convert
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertedBolbToBase64(blob) as string;

    }
    
  }

  convertedBolbToBase64 = (blob: Blob) => new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.readAsDataURL(blob);
  });
}

export interface UserPhoto{
  filePath: string;
  webviewPath: string;
}
