
# しょぼちゃっと

## Overview
シンプルなチャットアプリです。

## Usage
下のメッセージ入力欄に自分の名前とメッセージを書き込み、送信ボタンを押すと、メッセージを共有することができます。
送信が完了すると、「下にメッセージを送信しました」と出され、共有が完了したことを示します。
他のユーザーが送信したときも即座に内容が反映され、スムーズな情報共有を可能にします。また、間違えて送信してしまった場合もメッセージを長押しすることで、削除可能です。

## Feature
- ステータス欄
    - 操作が成功したかどうか出力されるため、何が起きたのかわかりやすい
- WebSocket
    - 他のユーザーが送った後でも即座に反映される
- Markdown
    - 見やすいメッセージを送ることができる
- 安全性
    - 名前の入力にはエスケープ処理をし、メッセージの入力にはサニタイズ処理
