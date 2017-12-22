import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NavController, AlertController, Events, ActionSheetController} from "ionic-angular/index";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ServerUrl} from '../../app/api.config'
import {ToastProvider} from "../../providers/toast";
import {IUploadPageConfig} from "../../interface/uploadPageConfig.interface";
import {UserService} from "../../providers/user.service";
import {Iuser} from "../../interface/user.interface";
import {TranslateServiceProvider} from "../../providers/translate-service";
import {Storage} from '@ionic/storage';
import {FingerprintProvider} from "../../providers/fingerprint";
import {UploadProvider} from "../../providers/upload";


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  serverUrl = ServerUrl;
  user = {profileUrl: {}} as Iuser;
  defaultLangauge:string = 'ch';
  showdropdown:boolean = false;


  constructor(public navCtrl:NavController,
              private actionSheetCtrl:ActionSheetController,
              private events:Events, public alertCtrl:AlertController, private socialSharing:SocialSharing,
              private toastService:ToastProvider,private fingerprintService:FingerprintProvider,
              private uploadService:UploadProvider,
              private userService:UserService, private translateService:TranslateServiceProvider,
              private storage:Storage) {

    this.events.subscribe('profileImage:uploaded', (url)=> {
      this.user.profileUrl.url = url;
    })
  }

  ionViewDidLoad() {

    this.defaultLangauge = this.translateService.getDefaultLanguage() || 'ch';
    this.userService.getUser().subscribe((user:Iuser)=> {
      this.user = user;
    }, (err)=> {
    });
  }



  async upload(source:string){
      let isVerified=await  this.fingerprintService.securityCheck(this.user.passcode);
      if(!isVerified){
        return false;
      }

    const config:IUploadPageConfig={
      uploadType:'profile', //profile,field
      id:this.user.id
    };
    let isUploaded;
    if(source==='camera'){
      isUploaded=await this.uploadService.takePhotoFromCamera(config);

    }
    else if(source==='album') {
      isUploaded=await this.uploadService.takePhotoFromAlbum(config);

    }
    if(isUploaded){
      return true;
    }
    else{
      return false;
    }
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change Profile',
      buttons: [
        {
          text: 'From Gallery',
          icon: 'folder-open',
          handler: () => {
            this.upload('album')
            return;
          }
        },
        {
          text: 'From Camera',
          icon: 'camera',
          handler: () => {
            this.upload('camera')

          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  changeLang() {
    this.defaultLangauge = this.defaultLangauge === 'ch' ? 'en' : 'ch';
    this.translateService.changeLang(this.defaultLangauge);
    this.showdropdown = false
    console.log(this.defaultLangauge)

  }



}
