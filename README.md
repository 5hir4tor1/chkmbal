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

node.js

- [cheerio-httpcli](https://www.npmjs.com/package/cheerio-httpcli)  
モバアルのHTTPソースを取ってくるのに使用
- [twitter](https://www.npmjs.com/package/twitter)  
ツイート用
- [confu](https://www.npmjs.com/package/confu)  
bot の CK/CS を読み込むのに使用  
(ハードコーディングしたままなのに気付かなくてコミット消したりリポジトリ消したりてんやわんやでした。反省)
- [async](https://www.npmjs.com/package/async)  
更新確認時の同期処理用
- [cron](https://github.com/kelektiv/node-cron)  
定期実行用
- [pm2](https://www.npmjs.com/package/pm2)  
実行プロセスのデーモン化に使用  
  
AWS EC2  
- 自前のインスタンスで動いてます

## 問題点
- 記事単体のURLが取得できない  
各携帯キャリアの会員認証が必要なので無理っぽいです。

## なにかあったら
[@albNo273](https://twitter.com/albNo273) までご連絡ください。