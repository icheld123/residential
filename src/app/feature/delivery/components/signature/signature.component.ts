import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.css'
})
export class SignatureComponent {
  drawing = false;
	mousePos = { x:0, y:0 };
	ultimaPos = { x:0, y:0 };
  urlImg: string = "";
  existeFirma: boolean =  false;
  // canvas: any;
  @ViewChild('canvasElement', { static: true })
  canvas!: ElementRef;

  constructor() {

  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx!.imageSmoothingEnabled = true;
    ctx!.imageSmoothingQuality = 'high';

    const dpi = window.devicePixelRatio * 2;

    canvas.width = 400 * dpi;
    canvas.height = 200 * dpi;
    canvas.style.width = '400px';
    canvas.style.height = '200px';
    ctx!.scale(dpi, dpi);

    let drawing = false;
    ctx!.lineWidth = 1;

    canvas.addEventListener('click', (event) => {
      this.ultimaPos = this.obtenerPosicionMouse(canvas, event);
      // Dibuja un punto en las coordenadas (x, y)
      ctx!.fillStyle = 'black'; // Color del punto
      ctx!.beginPath();
      ctx!.arc(this.ultimaPos.x, this.ultimaPos.y, 1, 0, 2 * Math.PI); // Tamaño del punto (radio de 3 píxeles)
      ctx!.fill();
    });

    canvas.addEventListener('mousedown', (event) => {
      drawing = true;
      this.ultimaPos = this.obtenerPosicionMouse(canvas, event);

      ctx!.beginPath();
      ctx!.moveTo(this.ultimaPos.x, this.ultimaPos.y);
    });

    canvas.addEventListener('mousemove', (event) => {
      if (drawing) {
        this.existeFirma = true;
        this.ultimaPos = this.obtenerPosicionMouse(canvas, event);

        ctx!.lineTo(this.ultimaPos.x, this.ultimaPos.y);
        ctx!.stroke();
      }
    });

    canvas.addEventListener('mouseup', () => {
      drawing = false;
      ctx!.closePath();
    });

    canvas.addEventListener('touchstart', (event) => {
      this.ultimaPos = this.obtenerPosicionTouch(canvas, event);
      event.preventDefault(); // Prevent scrolling when touching the canvas
      var touch = event.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchend", (event) => {
      event.preventDefault(); // Prevent scrolling when touching the canvas
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchleave", (event) => {
      event.preventDefault(); // Prevent scrolling when touching the canvas
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchmove", (event) => {
      event.preventDefault(); // Prevent scrolling when touching the canvas
      var touch = event.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    });
  }

  obtenerPosicionMouse(canvas: HTMLCanvasElement, mouseEvent: MouseEvent){
    var rect = canvas.getBoundingClientRect();
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		};
  }

  obtenerPosicionTouch(canvas: HTMLCanvasElement, touchEvent: TouchEvent) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left, // Popiedad de todo evento Touch
			y: touchEvent.touches[0].clientY - rect.top
		};
	}

  limpiarEspacioFirma(){
    this.existeFirma = false;
    this.urlImg = "";
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
  }

  generarImagen(){
    if(this.existeFirma){
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      var dataUrl = canvas.toDataURL();
      this.urlImg = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
      // this.firmaService.guardarFirma({"cod_base64": this.urlImg}).subscribe((respuesta: any) => {
      //   console.log(respuesta);
      // });
    }
  }

  ngOnInit(): void {

  }
}
