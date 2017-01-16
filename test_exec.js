/* 動作テスト用(5秒毎発火)) */

var f = require('./chk_update.js');
let CronJob = require('cron').CronJob; 

new CronJob('0-55/5 * * * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    f.func();
    console.log();
}, null, true, "Asia/Tokyo");

