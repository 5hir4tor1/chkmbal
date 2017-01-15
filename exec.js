var f = require('./chk_update.js');
let CronJob = require('cron').CronJob; 

new CronJob('0 0,10,20,30,40,50 8−23 * * *', function() {
    var ctime = Date();
    console.log(ctime);
    f.func();
}, null, true, "Asia/Tokyo");