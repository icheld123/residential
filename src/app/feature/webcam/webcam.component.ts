import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.css'
})
export class WebcamComponent {
      public showWebcam = true;
      public allowCameraSwitch = true;
      public multipleWebcamsAvailable = false;
      public deviceId: string = "";
      public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
      };
      public errors: WebcamInitError[] = [];
    
      public webcamImage: WebcamImage | null = null;
    
      private trigger: Subject<void> = new Subject<void>();
      private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
    
      public ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs()
          .then((mediaDevices: MediaDeviceInfo[]) => {
            this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
          });
      }
    
      public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
      }
    
      public showNextWebcam(directionOrDeviceId: boolean|string): void {
        this.nextWebcam.next(directionOrDeviceId);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        console.info('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
      }
    
      public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
      }
    
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }
}
