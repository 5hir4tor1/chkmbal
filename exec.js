/* 定期起動用(5分毎発火)) */

var f = require('./chk_update.js');
let CronJob = require('cron').CronJob; 

new CronJob('0 0-55/5 8-23 * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    f.func();
    console.log();
}, null, true, "Asia/Tokyo");
