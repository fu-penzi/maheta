<h1 align="center">
  <br>
<img src="https://github.com/user-attachments/assets/3ab6b358-475d-4427-bd4e-1c27280cc95b" width="220">
  <br>
  <b>Maheta</b>
  <br>
</h1>


<h1 align="center">
</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/13a5546b-d68b-4e88-81d6-01cd48f5a923" width="150">
  <img src="https://github.com/user-attachments/assets/4bae5b4a-edc9-4246-b911-f6c0246e1fa8" width="150">
  <img src="https://github.com/user-attachments/assets/a1199e2a-291c-4177-8f35-12fea8a377b1" width="150">
  <img src="https://github.com/user-attachments/assets/6f8cfa5a-33b1-4b54-a1c0-d1e97522e469" width="150">
</p>

Figma project: https://www.figma.com/file/0Pzn4AXPqLykVoBipj7dID/Maheta?node-id=2%3A4
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.5.

## General information
Maheta is a mobile app for language learners. It let's you play songs, display lyrics and translate words on the fly.

Main functionality:
- play songs stored in phone memory
- create songs playlists
- add lyrics to song
- lookup translation of words

REST API service was created using Flask microframework and it uses Azure Translator service for translations (it's no longer UP, because my student Azure subscription ended).


## Build

Run `update-android` to build the project. The build artifacts will be stored in the `dist/` directory.

Run `run-android` to run the project in Android Studio.

APK in `releases` section are generated with Android Studio.

For browser debugging configure IP settings in <a href='https://github.com/fu-penzi/maheta/blob/master/capacitor.config.ts'>capacitor.config.ts</a>.

# Contributors

<a href="https://github.com/fu-penzi/maheta/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fu-penzi/maheta" />
</a>

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
