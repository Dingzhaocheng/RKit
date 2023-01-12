# RKit

Text recognition function based on experimental browser features TextDetector

### Source

- Based TextDetector API from Chrome experimental features
  [https://developer.chrome.com/articles/shape-detection/#textdetector]

## Usage

```
import { default as RKit } from '/dist/main.js'
const kit = new RKit()
// if you have button element on the page
// you can add click event to open local file panel
button.addEventListener("click", async () => {
     await kit.openLocalFile()
   })
```
