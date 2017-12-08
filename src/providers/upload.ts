import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {FileUploader} from 'ng2-file-upload';
import {Events} from "ionic-angular/index";
import {HttpClient} from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation';


@Injectable()
export class UploadProvider {
  uploader:FileUploader;

  constructor(public http:HttpClient, private events:Events, private geolocation: Geolocation) {

  }

  initUploader(url, config, lat, long) {
    this.uploader = new FileUploader({
      url: url,
      headers: [{name: 'x-id', value: config.id},
        {name: 'x-assetId', value: config.assetId},
        {name: 'lat', value: lat}, {name: 'long', value: long}],
    });

    this.uploader.onAfterAddingFile = (file:any)=> {
      console.log(file)
      file.withCredentials = false;
      if (config.uploadType === 'profile') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
      else if (config.uploadType === 'evidences') {
        this.uploader.clearQueue()
        this.uploader.queue.push(file);
      }
    };



    this.uploader.onSuccessItem = (item:any, response:any)=> {
      let data:any;
      let url = '';
      try {
        data = JSON.parse(response);
        console.log(data)
        url = data.result.url;
        if(config.uploadType === 'profile')
        this.events.publish('profileImage:uploaded', url);

        if(config.uploadType === 'evidences')
          this.events.publish('evidences:uploaded', url);

      }
      catch (e) {

      }
    };

    return this.uploader;
  }

}
