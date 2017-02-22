/* 定期ツイート用 */

const twitter = require('twitter'),
      confu = require('confu');

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

exports.func = function (tweet_body) {

    bot.post(
        'statuses/update',
        { status: tweet_body },
        function (err, tweet, response) {
            if (!err) {
                console.log(tweet_body);
                console.log('Tweet succeeded.');
            } else {
                console.log(tweet_body);
                console.log('Tweet failed.');
                console.log(err);
            }
        }
    );

}