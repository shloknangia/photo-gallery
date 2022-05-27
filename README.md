# photo-gallery
First Ionic App in Angular

## Commands used in this project

### Global Installs
```bash
  npm install -g @ionic/cli
  
  npm install -g @ionic/cli native-run cordova-res
```

### Create a new Ionic Project with Angular

```bash
  ionic start photo-gallery tabs --type=angular --capacitor

  cd photo-gallery/
```

### Install Dependencies
```bash
  npm install @capacitor/camera @capacitor/storage @capacitor/filesystem

  npm install @ionic/pwa-elements
```

### Start the Project and Build the project
```bash
  ionic serve

  ionic build
```

### Add Android and IOS code
```bash
  ionic cap add android
  ionic cap add ios
```

### Open Android code in Android Studio (Androis studio needed to be installed)
```bash
 ionic cap open android
