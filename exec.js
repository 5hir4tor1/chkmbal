var f = require('./chk_update.js');
let cron = require('node-cron'); 

cron.schedule('0 0,10,20,30,40,50 8−23 * * *', () => {
    var ctime = Date();
    console.log(ctime);
    f.func();
});