var f = require('./chk_update.js');
let CronJob = require('cron').CronJob; 

new CronJob('0 0-55/5 8-23/1 * * *', function() {
    var ctime = Date();
    console.log(ctime);
    f.func();
}, null, true, "Asia/Tokyo");
