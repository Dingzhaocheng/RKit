/* 
  this is the main file for the OCR component
  read the README.md for more information
  @author: dinn
*/ class $0e07b8e9c9958daa$var$TaggingBoard {
    constructor(canvas, image){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.image = image;
    }
    drawRectangles(rectangles) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        rectangles.forEach((rect)=>{
            this.ctx.strokeStyle = "red";
            this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
    }
}
class $0e07b8e9c9958daa$var$RKit {
    file = null;
    fileUrl = "";
    canvasElement = null;
    constructor(){
        // @ts-ignore 
        // use new textDetector() to create a new textDetector object
        this.textDetector = new TextDetector();
    }
    setFile(file) {
        this.file = file;
        this.createUrl();
    }
    createUrl() {
        if (!this.file) throw new Error("RKit: no file set");
        URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = URL.createObjectURL(this.file);
    }
    async recognizePositionFromTextDetector() {
        // this is where the magic happens
        if (!this.file) {
            console.error("RKit: no file set");
            return [];
        }
        const image2Bit = await createImageBitmap(this.file);
        const retangles = await this.textDetector.detect(image2Bit);
        return retangles;
    }
    createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 800;
        return canvas;
    }
    async drawBoxes(mountNode) {
        if (!this.canvasElement) {
            this.canvasElement = this.createCanvas();
            const canvasMountNode = mountNode ? mountNode : document.body;
            canvasMountNode.append(this.canvasElement);
        }
        const rectangles = await this.recognizePositionFromTextDetector();
        const image = new Image();
        image.src = this.fileUrl;
        const tb = new $0e07b8e9c9958daa$var$TaggingBoard(this.canvasElement, image);
        image.onload = ()=>{
            tb.drawRectangles(rectangles.map((rect)=>rect.boundingBox));
        };
    }
    async openLocalFile() {
        // @ts-ignore
        // use showOpenFilePicker
        const [fileHandler] = await window.showOpenFilePicker();
        const file = await fileHandler.getFile();
        this.setFile(file);
        this.drawBoxes();
    }
}
var $0e07b8e9c9958daa$export$2e2bcd8739ae039 = $0e07b8e9c9958daa$var$RKit;


export {$0e07b8e9c9958daa$export$2e2bcd8739ae039 as default};
