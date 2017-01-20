/* 定期起動用(5分毎発火)) */

var cu = require('./chk_update.js');
var rt = require('./regularly_tweet.js');
let CronJob = require('cron').CronJob; 

var reg_tweet     = '【定期】本アカウントはモバイルアルビレックスのコンテンツ・ニュース更新を確認しツイートする非公式のbotです。詳細は固定ツイートをご参照ください。\n#albirex';
var start_update  = '本日のモバアル更新確認を開始します。';
var finish_update = '本日のモバアル更新確認を終了します。終了後に更新があった場合は再開時にまとめてツイートします。';

// check update
new CronJob('0 0-55/5 0-2,9-23 * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    cu.func();
}, null, true, "Asia/Tokyo");

// regularly tweet
new CronJob('0 0 14,18,22 * * *', function() {
    var ctime = Date();
    var hour  = new Date().getHours();
    rt.func(reg_tweet);
}, null, true, "Asia/Tokyo");

// start update
new CronJob('0 0 9 * * *', function() {
    var ctime = Date();
    rt.func(start_update);
}, null, true, "Asia/Tokyo");

// finish update
new CronJob('0 0 3 * * *', function() {
    var ctime = Date();
    rt.func(finish_update);
}, null, true, "Asia/Tokyo");
