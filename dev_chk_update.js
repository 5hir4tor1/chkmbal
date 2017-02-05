/* モバアル更新チェック */

var client = require('cheerio-httpcli');
var twitter = require('twitter');
var confu = require('confu');
var fs = require('fs');
var async = require('async');

// HTML スクレイピング先
var url_sp = 'http://www.albirex.co.jp/sp/';
var url_pd = 'http://www.albirex.co.jp/news/photo_diary';

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

    client.setBrowser('iphone');　// UA変更

    /** 
     * 確認前の最新の記事タイトルを格納
     * [0]: アルビの鼓動       beat
     * [1]: 広報ダイアリー     staff
     * [2]: 新着ニュース       news
     * [3]: アカデミーニュース academy    
     * [4]: フォトダイアリー   photo
     */
    var title_arr = new Array(5);

    /**
     * 確認時の記事タイトルとリンクを格納
     * [0]: 記事タイトル(整形後)
     * [1]: 記事リンク
     */
    var beat = new Array(2);    // アルビの鼓動
    var staff = new Array(2);   // 広報ダイアリー
    var news = new Array(2);    // 新着ニュース
    var academy = new Array(2); // アカデミーニュース
    var photo = new Array(2);   // フォトダイアリー

    // 更新の有無
    var flg = false;

    // 順番に処理
    async.waterfall([
        readRecentTitle,
        checkUpdateSPSite,
        checkUpdatePhotoDiary,
        updateLog,
    ], function (err) {
        if (err)
            throw err;
        else
            console.log('All processing is completed.');
    });

    // 1. 直近の記事タイトルを読み込む
    function readRecentTitle(callback) {
        setTimeout(function () {
            var text = fs.readFileSync('news_log.txt', { encoding: "utf8" });
            // \r を除去し、\n で配列に分割
            title_arr = text.replace(/\r/g, "").split("\n");
            console.log('Recent titles loaded.');
            callback(null);
        }, 1000);
    }

    // 2. SP サイトの更新確認とツイート
    function checkUpdateSPSite(callback) {
        setTimeout(function () {
            client.fetch(url_sp, function (err, $, res, body) {
                if (!err) {
                    // console.log($('.news').html());

                    // (i) 記事タイトル(生)
                    var mbal_arr = $('.news').eq(0).find('a');
                    var beat_newest, staff_newest;
                    var pos_b, pos_s; // 2記事の位置

                    // アルビの鼓動と広報ダイアリーの位置探し
                    for (var i = 0, l = mbal_arr.length; i < l; i++) {
                        var title = mbal_arr.eq(i).text();
                        if (title.match(/アルビの鼓動/)) {
                            beat_newest = title;
                            pos_b = i;
                        } else if (title.match(/広報ダイアリー/)) {
                            staff_newest = title;
                            pos_s = i;
                        }
                    }

                    var news_newest = $('.news').eq(1).find('a').eq(0).text();
                    var academy_newest = $('.news').eq(2).find('a').eq(0).text();

                    beat[0] = beat_newest.replace(/^.*\//g, '').trim();
                    staff[0] = staff_newest.replace(/^.*\//g, '').trim();
                    news[0] = news_newest.slice(11);
                    academy[0] = academy_newest.slice(11);

                    // (ii) URL
                    beat[1] = $('.news').eq(0).find('a').url()[pos_b];
                    staff[1] = $('.news').eq(0).find('a').url()[pos_s];
                    news[1] = $('.news').eq(1).find('a').url()[0];
                    academy[1] = $('.news').eq(2).find('a').url()[0];

                    // 更新確認したらツイート
                    console.log('beat-recent:    ' + title_arr[0]);
                    console.log('beat-result:    ' + beat[0]);
                    if (title_arr[0] != beat[0]) {
                        // tweetUpdate('アルビの鼓動', beat);
                        flg = true;
                    }

                    console.log('staff-recent:   ' + title_arr[1]);
                    console.log('staff-result:   ' + staff[0]);
                    if (title_arr[1] != staff[0]) {
                        // tweetUpdate('広報ダイアリー', staff);
                        flg = true;
                    }

                    console.log('news-recent:    ' + title_arr[2]);
                    console.log('news-result:    ' + news[0]);
                    if (title_arr[2] != news[0]) {
                        // tweetUpdate('ニュース', news);
                        flg = true;
                    }

                    console.log('academy-recent: ' + title_arr[3]);
                    console.log('academy-result: ' + academy[0]);
                    if (title_arr[3] != academy[0]) {
                        // tweetUpdate('アカデミー', academy);
                        flg = true;
                    }
                } else {
                    console.log('FATAL ERROR!!')
                    console.log(err);
                }
            });
            callback(null);
        }, 1000);
    }

    // 3. PC サイト - フォトダイアリーの更新確認とツイート
    function checkUpdatePhotoDiary(callback) {
        setTimeout(function () {
            client.fetch(url_pd, function (err, $, res, body) {
                if (!err) {
                    // console.log($.html());

                    photo[0] = $('.second-news-area').eq(0).find('a').eq(0).text();
                    photo[1] = $('.second-news-area').eq(0).find('a').url()[1];

                    // 更新確認したらツイート
                    console.log('photo-recent:   ' + title_arr[4]);
                    console.log('photo-result:   ' + photo[0]);
                    if (title_arr[4] != photo[0]) {
                        // tweetUpdate('フォトダイアリー', photo);
                        flg = true;
                    }
                } else {
                    console.log('FATAL ERROR!!')
                    console.log(err);
                }
            });
            callback(null);
        }, 1000);
    }

    // 4. 記事タイトルログの更新
    function updateLog(callback) {
        setTimeout(function () {
            if (flg) {
                var text = beat[0] + '\n' + staff[0] + '\n'
                    + news[0] + '\n' + academy[0] + '\n' + photo[0];
                fs.writeFileSync('news_log.txt', text, function (err) {
                    if (!err)
                        console.log('Log update succeeded.');
                    else {
                        console.log('Log update failed.');
                        console.log(err);
                    }
                });
            } else {
                console.log('Log is not updated.');
            }
            callback(null);
        }, 1000);
    }

}

/**
 * ツイートする
 * @param head カテゴリ
 * @param data ツイートの中身
 */
function tweetUpdate(head, data) {

    var tweet_body = '【' + head + '】'
        + data[0] + '\n' + data[1] + '\n#albirex';
    console.log(tweet_body);

    bot.post(
        'statuses/update',
        { status: tweet_body },
        function (err, tweet, response) {
            if (!err) {
                console.log('Tweet succeeded.');
            } else {
                console.log('Tweet failed.');
                console.log(err);
            }
        }
    );

}