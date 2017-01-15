// モバアル更新チェックスクリプト

var client  = require('cheerio-httpcli');
var fs      = require('fs');
var twitter = require('twitter');
var confu   = require('confu');

exports.func = function() {

var conf = confu('.', 'config', 'key.json');
// console.log(conf);

// token 設定
var bot = new twitter({
    consumer_key        : conf.key.consumer_key,
    consumer_secret     : conf.key.consumer_secret,
    access_token_key    : conf.key.access_token_key,
    access_token_secret : conf.key.access_token_secret
});

client.setBrowser('iphone');　// UA 偽装
var url = 'http://www.albirex.co.jp/sp/'
var prev = ''; // 確認前の最新の記事タイトル

// 最新タイトル読み込み
fs.readFile('most_new.txt', 'utf8', function (err, text) {
    if (!err) {
        prev = text;
        console.log('prev: '   + prev);
    } else {
        console.log('Read file is failed.');
        console.log(err);
    }
});

// DOM 取得
client.fetch(url, function (err, $, res, body) {
    if (!err) {
     
        // console.log($.html());

        // category / title
        var result = $('.news').find('a').eq(0).text().split("日")[1];
        var category = result.split('/ ')[0];
        var title    = result.split('/ ')[1];
        // console.log(title);

        // link
        var link = $('.news a').url()[0];
        // console.log(link);

        console.log('now:  ' + result);

        // 更新検知
        if (result != prev) {

            var tweet_body = '【モバアル更新情報】\n' + category + '「' + title + '」\n#albirex' + link;
            var params = {screen_name: 'MobileAlbirex_update'};

            bot.post(
                'statuses/update',
                {status: tweet_body},
                function(err, tweet, response) {
                    if (!err) 
                        console.log('Tweet success.');
                    else {
                        console.log('Tweet failed.');
                        console.log(err);
                    }
                }
            )

            // save title
            fs.writeFileSync('most_new.txt', result , function (err) {
                console.log('Update file is failed.\n');
                console.log(err);
            });
        
        } else {
            console.log('Update is not detected.');
        } 

    }else{

        console.log('Error!')
        console.log(err);

    }

});

}