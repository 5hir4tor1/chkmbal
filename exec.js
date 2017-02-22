/* 定期起動用(5分毎発火)) */

const cu = require('./chk_update.js'),
      rt = require('./regularly_tweet.js');
let   CronJob = require('cron').CronJob; 

const reg_tweet     = ':00 -【定期】本アカウントはモバイルアルビレックスの' + 
                      'コンテンツ・ニュース更新を確認しツイートする非公式の' + 
                      'botです。詳細は固定ツイートをご参照ください。\n#albirex',
      start_update  = '本日のモバアル更新確認を開始します。',
      finish_update = '本日のモバアル更新確認を終了します。終了後に更新が' + 
                      'あった場合は再開時にまとめてツイートします。';

// check update
new CronJob('0 0-55/5 8-23 * * *', function() {
    const ctime = Date();
    console.log('\n=== ' + ctime + ' ===');
    cu.func();
}, null, true, "Asia/Tokyo");

// regularly tweet
new CronJob('0 0 12-21/3 * * *', function() {
    const ctime = Date(),
          hour  = new Date().getHours();
    rt.func(hour + reg_tweet);
}, null, true, "Asia/Tokyo");

// start update
new CronJob('0 0 8 * * *', function() {
    const ctime = Date();
    rt.func(start_update);
}, null, true, "Asia/Tokyo");

// finish update
new CronJob('0 0 0 * * *', function() {
    const ctime = Date();
    rt.func(finish_update);
}, null, true, "Asia/Tokyo");