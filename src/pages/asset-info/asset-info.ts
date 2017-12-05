import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AssetsService} from "../../providers/assets.service";
import {UploadPage} from "../upload/upload";


@IonicPage()
@Component({
  selector: 'page-asset-info',
  templateUrl: 'asset-info.html',
})
export class AssetInfoPage {

  asset = {};
  assets = [];
  pet:string = "puppies";

  constructor(public navCtrl:NavController, public navParams:NavParams, private assetService:AssetsService) {

  }

  ionViewDidLoad() {
    this.asset = this.navParams.get('asset');
    console.log(this.asset);
  }

  uploadPage() {
    this.navCtrl.push(UploadPage,{config:{uploadType:'field'}});
  }
  
}
