/* モバアル更新チェックスクリプト */

var client = require('cheerio-httpcli');
var twitter = require('twitter');
var confu = require('confu');
var fs = require('fs');

var url = 'http://www.albirex.co.jp/sp/'

// bot の CK/CS 読み込み
var conf = confu('.', 'config', 'key.json');
// console.log(conf);

// token 設定
var bot = new twitter({
    consumer_key: conf.key.cons_key,
    consumer_secret: conf.key.cons_sec,
    access_token_key: conf.key.acc_token,
    access_token_secret: conf.key.acc_token_sec
});

exports.func = function () {

    client.setBrowser('iphone');　// UA 偽装

    /** 
     * 確認前の最新の記事タイトルを格納
     * [0]: 更新情報　　  update
     * [1]: 新着ニュース  news
     * [2]: アカデミー　  academy    
     */
    var news_arr = readTextAsList('news_log.txt');
    /*
    for (var i = 0; i < news_arr.length; i++) {
        console.log(news_arr[i]);
    }
    */

    // DOM 取得
    client.fetch(url, function (err, $, res, body) {
        if (!err) {

            // console.log($.html());

            /**
             * [0]: 記事タイトル(整形後)
             * [1]: 記事タイトル(生)
             * [2]: 記事リンク
             */
            var update = new Array(3);
            var news = new Array(3);
            var academy = new Array(3);

            // 日付部分を切る
            update[0]  = $('.news').eq(0).find('a').eq(0).text().slice(11);
            news[0]    = $('.news').eq(1).find('a').eq(0).text().slice(11);
            academy[0] = $('.news').eq(2).find('a').eq(0).text().slice(11);

            // スラッシュが入ってる時だけ整形
            if (update[0].match(/\//)) {
                var tmp = update[0];
                update[0] = tmp.split('/')[0] + '「' + tmp.split('/ ')[1] + '」';
                update[1] = tmp;
            } else {
                update[1] = update[0];
            }
            news[1] = news[0];
            academy[1] = academy[0];

            update[2]  = $('.news').eq(0).find('a').url()[0];
            news[2]    = $('.news').eq(1).find('a').url()[0];
            academy[2] = $('.news').eq(2).find('a').url()[0];

            // console.log(update);
            // console.log(news);
            // console.log(academy);

            console.log('update-recent:  ' + news_arr[0]);
            console.log('update-result:  ' + update[1]);
            console.log('news-recent:    ' + news_arr[1]);
            console.log('news-result:    ' + news[1]);
            console.log('academy-recent: ' + news_arr[2]);
            console.log('academy-result: ' + academy[1]);

            // 更新確認
            var flg = false;
            if (news_arr[0] != update[1]) {
                tweetUpdate('【モバアル】', update[0], update[2]);
                flg = true;
            }
            if (news_arr[1] != news[1]) {
                tweetUpdate('【ニュース】', news[0], news[2]);
                flg = true;
            }
            if (news_arr[2] != academy[1]) {
                tweetUpdate('【アカデミー】', academy[0], academy[2]);
                flg = true;
            }

            if (flg) {
                var text = update[1] + '\n' + news[1] + '\n' + academy[1];
                fs.writeFileSync('news_log.txt', text, function (err) {
                    if(!err)
                        console.log('Log update succeeded.');
                    else {
                        console.log('Log update failed.');
                        console.log(err);
                    }
                });
            } else {
                console.log('Log is not updated.');
            }

        } else {

            console.log('FATAL ERROR!!')
            console.log(err);

        }
    });
}

/**
 * テキストファイルを各行の配列の形式で読み込む
 * @param  path テキストファイルのパス
 * @return array
 */
function readTextAsList(path) {
    var text = fs.readFileSync(path, { encoding: "utf8" });
    // \r を除去し、\n で配列に分割
    return text.replace(/\r/g, "").split("\n");
}

/**
 * ツイートする
 * @param  head カテゴリ
 * @param  text 記事タイトル(整形後)
 * @param  link 記事リンク
 */
function tweetUpdate(head, text, link) {
    var tweet_body = head + '\n' + text + '\n' + '#albirex\n' + link;

    bot.post(
        'statuses/update',
        { status: tweet_body },
        function (err, tweet, response) {
            if (!err) {
                console.log(tweet_body)
                console.log('Tweet succeeded.');
            } else {
                console.log('Tweet failed.');
                console.log(err);
            }
        }
    );

}