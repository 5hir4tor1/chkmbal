/* 動作テスト用(5秒毎発火)) */

var cu = require('./chk_update.js');
var rt = require('./regularly_tweet.js');
let CronJob = require('cron').CronJob; 

var reg_tweet     = '【定期】本アカウントはモバイルアルビレックスのコンテンツ・ニュース更新を確認しツイートする非公式のbotです。詳細は固定ツイートをご参照ください。\n#albirex';
var start_update  = '8:00 - 本日のモバアル更新確認を開始します。';
var finish_update = '0:00 - 本日のモバアル更新確認を終了します。終了後に更新があった場合は翌日8:00にまとめてツイートします。';

// check update
new CronJob('0-55/5 * * * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    cu.func();
    console.log();
}, null, true, "Asia/Tokyo");

// regularly tweet
new CronJob('0 0 15,18,21 * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    rt.func(reg_tweet);
    console.log();
}, null, true, "Asia/Tokyo");

// start update
new CronJob('0 0 8 * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    rt.func(start_update);
    console.log();
}, null, true, "Asia/Tokyo");

// finish update
new CronJob('0 0 0 * * *', function() {
    var ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    rt.func(finish_update);
    console.log();
}, null, true, "Asia/Tokyo");