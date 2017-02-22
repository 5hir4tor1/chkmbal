# chkmbal / Check Mobile Albirex Update

## これなに
自分がいつも[モバイルアルビレックス](http://www.albirex.co.jp/info/mobile.html)の更新を見落とすので作りました。  
更新を検知するとタイトルとURLが Twitter の「モバアル更新情報bot / [@mbal_update](https://twitter.com/mbal_update)」からツイートされます。  
更新確認は5分毎です。0時から8時までの間は動きません。

## つかいかた
1. [@mbal_update](https://twitter.com/mbal_update) をフォロー
1. ツイートが来たらアクセスする
1. 便利

## 使ってるもの

node.js (v7.4.0 で動作します)  
- [cheerio-httpcli](https://www.npmjs.com/package/cheerio-httpcli)  
モバアルのHTTPソースを取ってくるのに使用
- [twitter](https://www.npmjs.com/package/twitter)  
ツイート用
- [confu](https://www.npmjs.com/package/confu)  
bot の CK/CS を読み込むのに使用  
(ハードコーディングしたままなのに気付かなくてコミット消したりリポジトリ消したりてんやわんやでした。反省)
- [cron](https://github.com/kelektiv/node-cron)  
定期実行用
- [pm2](https://www.npmjs.com/package/pm2)  
実行プロセスのデーモン化に使用  
  
AWS EC2  
- 自前のインスタンスで動いてます

## 問題点
- 記事単体のURL取得できないんですか  
各携帯キャリアの会員認証が必要なので無理っぽいです。
- 新着記事があるのにツイートされてないんですけど  
トップページの新着記事一覧を見て判断してるのでこっちが更新されないと検知できない仕様です。  
(各コンテンツの記事一覧ページは認証の向こう)

## なにかあったら
[@albNo273](https://twitter.com/albNo273) までご連絡ください。
