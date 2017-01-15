var f = require('./chk_update.js');
let CronJob = require('cron').CronJob; 

new CronJob('0-5,30-35 * * * * *', function() {
    var ctime = Date();
    console.log(ctime);
    f.func();
}, null, true, "Asia/Tokyo");