/* テスト用(10秒毎発火)) */

var cu = require('./dev_chk_update.js');
var rt = require('./regularly_tweet.js');
let CronJob = require('cron').CronJob; 

var reg_tweet     = '【定期】本アカウントはモバイルアルビレックスのコンテンツ・ニュース更新を確認しツイートする非公式のbotです。詳細は固定ツイートをご参照ください。\n#albirex';
var start_update  = '本日のモバアル更新確認を開始します。';
var finish_update = '本日のモバアル更新確認を終了します。終了後に更新があった場合は翌日8:00にまとめてツイートします。';

// check update
new CronJob('0-50/10 * * * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    cu.func();
}, null, true, "Asia/Tokyo");

// regularly tweet
new CronJob('2-52/10 * * * * *', function() {
    var ctime = Date();
    var hour  = new Date().getHours();
    // rt.func(hour + reg_tweet);
    // console.log(hour + reg_tweet);
}, null, true, "Asia/Tokyo");

// start update
new CronJob('5-55/10 * * * * *', function() {
    var ctime = Date();
    // rt.func(start_update);
    // console.log(start_update);
}, null, true, "Asia/Tokyo");

// finish update
new CronJob('8-58/10 * * * * *', function() {
    var ctime = Date();
    // rt.func(finish_update);
    // console.log(finish_update);
}, null, true, "Asia/Tokyo");
