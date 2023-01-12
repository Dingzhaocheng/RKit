/* 
  this is the main file for the OCR component
  read the README.md for more information
  @author: dinn
*/

export interface ITextDetectorRect {
  boundingBox: DOMRectReadOnly;
  cornerPoints: DOMPointReadOnly[];
  rawValue: string;
}


export interface ITextDetector {
  detect: (ib: ImageBitmap) => Promise<ITextDetectorRect[]>;
}



class TaggingBoard {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.image = image;
  }

  drawRectangles(rectangles: DOMRect[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.image, 0, 0);
    rectangles.forEach(rect => {
      this.ctx.strokeStyle = "red";
      this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    })
  }
}


class RKit {
  private file: File | null = null;
  private fileUrl: string = "";
  private textDetector: ITextDetector;
  canvasElement: HTMLCanvasElement | null = null;
  constructor() {
    // @ts-ignore 
    // use new textDetector() to create a new textDetector object
    this.textDetector = new TextDetector() as ITextDetector;
  }

  public setFile(file: File) {
    this.file = file;
    this.createUrl();
  }

  private createUrl() {
    if (!this.file) {
      throw new Error("RKit: no file set");
    }
    URL.revokeObjectURL(this.fileUrl)
    this.fileUrl = URL.createObjectURL(this.file);
  }

  private async recognizePositionFromTextDetector() {
    // this is where the magic happens
    if (!this.file) {
      console.error("RKit: no file set");
      return [];
    }
    const image2Bit = await createImageBitmap(this.file)
    const retangles = await this.textDetector.detect(image2Bit);
    return retangles;
  }

  private createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 800;
    return canvas;
  }

  public async drawBoxes(mountNode?: HTMLDivElement) {
    if (!this.canvasElement) {
      this.canvasElement = this.createCanvas()
      const canvasMountNode = mountNode ? mountNode : document.body;
      canvasMountNode.append(this.canvasElement);
    }

    const rectangles = await this.recognizePositionFromTextDetector();
    const image = new Image();
    image.src = this.fileUrl;

    const tb = new TaggingBoard(this.canvasElement as HTMLCanvasElement, image);
    image.onload = () => {
      tb.drawRectangles(rectangles.map(rect => rect.boundingBox));
    }
  }

  public async openLocalFile() {
    // @ts-ignore
    // use showOpenFilePicker
    const [fileHandler] = await window.showOpenFilePicker()
    const file = await fileHandler.getFile()
    this.setFile(file);
    this.drawBoxes()
  }
}


export default RKit;