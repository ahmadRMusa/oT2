// CSS is actually compiled as a separate file
require("./css/index.scss");

System.import('./app').then(app => {
    // loaded
})
.catch(error => {
    // handle error
});
