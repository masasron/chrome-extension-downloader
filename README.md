# Chrome Extension Downloader
### A few helpful functions to help you download and unzip chrome extensions with a few lines of code.

### Installation
`npm install chrome-extension-downloader`

### Usage

```js
const {readFile} = require('chrome-extension-downloader')

readFile({
    filename: 'manifest.json',
    extension_id: 'gighmmpiobklfepjocnamgkkbiglidom'
}).then(buff => {
    console.log(buff.toString('utf8'))
})
```