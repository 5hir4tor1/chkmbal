/* モバアル更新チェック */

const client  = require('cheerio-httpcli'),
      twitter = require('twitter'),
      confu   = require('confu'),
      fs      = require('fs');

// HTML スクレイピング先
const url_sp = 'http://www.albirex.co.jp/sp/',
      url_pd = 'http://www.albirex.co.jp/news/photo_diary';

// bot の CK/CS 読み込み
const conf = confu('.', 'config', 'key.json');
// console.log(conf);

// token 設定
const bot = new twitter({
    consumer_key: conf.key.cons_key,
    consumer_secret: conf.key.cons_sec,
    access_token_key: conf.key.acc_token,
    access_token_secret: conf.key.acc_token_sec
});


exports.func = function () {

    client.set('browser', 'iphone'); // UA変更

    /**
     * 確認前の最新の記事タイトルを格納
     * [0]: アルビの鼓動       beat
     * [1]: 広報ダイアリー     staff
     * [2]: 新着ニュース       news
     * [3]: アカデミーニュース academy
     * [4]: フォトダイアリー   photo
     * [5]: コラム             column <- NEW!!
     */
    let title_arr = new Array(5);

    /**
     * 確認時の記事タイトルとリンクを格納
     * [0]: 記事タイトル(整形後)
     * [1]: 記事リンク
     */
    let beat    = new Array(2), // アルビの鼓動
        staff   = new Array(2), // 広報ダイアリー
        news    = new Array(2), // 新着ニュース
        academy = new Array(2), // アカデミーニュース
        photo   = new Array(2), // フォトダイアリー
        column  = new Array(2); // コラム


    // 更新の有無
    let flg = false;

    Promise.resolve()
        // 1. 直近の記事タイトルを読み込む
        .then(function () {
            return new Promise(function (resolve, reject) {
                const text = fs.readFileSync('news_log.txt', { encoding: "utf8" });
                // \r を除去し、\n で配列に分割
                title_arr = text.replace(/\r/g, "").split("\n");
                console.log('Recent titles loaded.');
                resolve(null);
            });
        })
        // 2. SP サイトの更新確認とツイート
        .then(function (value) {
            return new Promise(function (resolve, reject) {
                client.fetch(url_sp, function (err, $, res, body) {
                    if (!err) {
                        // console.log($('.news').html());

                        // (i) 記事タイトル(生)
                        const mbal_arr = $('.pickup').eq(0).find('a');
                        let beat_newest, staff_newest, column_newest;
                        let pos_b, pos_s, pos_c; // 記事の位置

                        // アルビの鼓動と広報ダイアリーとコラムの位置探し
                        for (let i = 0, l = mbal_arr.length; i < l; i++) {
                            const title = mbal_arr.eq(i).text();
                            if (title.includes('アルビの鼓動')) {
                                beat_newest = title;
                                pos_b = i;
                            } else if (title.includes('広報ダイアリー')) {
                                staff_newest = title;
                                pos_s = i;
                            } else if (title.includes('コラム')) {
                                column_newest = title;
                                pos_c = i;
                            }
                        }

                        var news_newest = $('.news > .category-detail > ul > li').eq(0);
                        var academy_newest = $('.academy-news > .category-detail > ul > li').eq(0);

                        beat[0] = beat_newest.replace(/^.*\//g, '').split('/').trim();
                        staff[0] = staff_newest.replace(/^.*\//g, '').split('/').trim();
                        news[0] = news_newest.find('span').text();
                        academy[0] = academy_newest.find('span').text();
                        column[0] = column_newest.replace(/^.*\//g, '').split('/').trim();

                        // (ii) URL
                        beat[1] = $('.news').eq(0).find('a').url()[pos_b];
                        staff[1] = $('.news').eq(0).find('a').url()[pos_s];
                        news[1] = news_newest.find('a').url();
                        academy[1] = academy_newest.find('a').url();
                        column[1] = $('.news').eq(0).find('a').url()[pos_c];

                        // 更新確認したらツイート
                        console.log('beat-recent:    ' + title_arr[0]);
                        console.log('beat-result:    ' + beat[0]);
                        if (title_arr[0] != beat[0]) {
                            tweetUpdate('アルビの鼓動', beat);
                            flg = true;
                        }

                        console.log('staff-recent:   ' + title_arr[1]);
                        console.log('staff-result:   ' + staff[0]);
                        if (title_arr[1] != staff[0]) {
                            tweetUpdate('広報ダイアリー', staff);
                            flg = true;
                        }

                        console.log('news-recent:    ' + title_arr[2]);
                        console.log('news-result:    ' + news[0]);
                        if (title_arr[2] != news[0]) {
                            tweetUpdate('ニュース', news);
                            flg = true;
                        }

                        console.log('academy-recent: ' + title_arr[3]);
                        console.log('academy-result: ' + academy[0]);
                        if (title_arr[3] != academy[0]) {
                            tweetUpdate('アカデミー', academy);
                            flg = true;
                        }

                        console.log('column-recent:  ' + title_arr[5]);
                        console.log('column-result:  ' + column[0]);
                        if (title_arr[5] != column[0]) {
                            tweetUpdate('コラム', column);
                            flg = true;
                        }

                        resolve(null);
                    } else {
                        console.log('FATAL ERROR!!')
                        console.log(err);
                    }
                });
            });
        })
        // 3. PC サイト - フォトダイアリーの更新確認とツイート
        .then(function (value) {
            return new Promise(function (resolve, reject) {
                client.fetch(url_pd, function (err, $, res, body) {
                    if (!err) {
                        // console.log($.html());

                        photo[0] = $('.second-news-area').eq(0).find('a').eq(0).text();
                        photo[1] = $('.second-news-area').eq(0).find('a').url()[1];

                        // 更新確認したらツイート
                        console.log('photo-recent:   ' + title_arr[4]);
                        console.log('photo-result:   ' + photo[0]);
                        if (title_arr[4] != photo[0]) {
                            tweetUpdate('フォトダイアリー', photo);
                            flg = true;
                        }

                        resolve(null);
                    } else {
                        console.log('FATAL ERROR!!')
                        console.log(err);
                    }
                });
            });
        })
        // 4. 記事タイトルログの更新
        .then(function (value) {
            return new Promise(function (resolve, reject) {
                if (flg) {
                    const text = beat[0] + '\n' + staff[0] + '\n'
                        + news[0] + '\n' + academy[0] + '\n'
                        + photo[0] + '\n' + column[0];
                    fs.writeFileSync('news_log.txt', text, function (err) {
                        if (!err)
                            console.log('Log update succeeded.');
                        else {
                            console.log('Log update failed.');
                            console.log(err);
                        }
                    });

                    resolve(null);
                } else {
                    console.log('Log is not updated.');
                    resolve(null);
                }
            });
        })
        .then(function (value) {
            console.log('All processing is done.');
        })
        .catch(function (err) {
            console.log(err);
        })
}

/**
 * ツイートする
 * @param head カテゴリ
 * @param data ツイートの中身
 */
function tweetUpdate(head, data) {

    const tweet_body = '【' + head + '】'
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