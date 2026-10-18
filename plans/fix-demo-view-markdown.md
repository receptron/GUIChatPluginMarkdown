# demo の View に markdown が出ない問題を直す

## 原因
- gui-chat-protocol では `data` が View に渡る描画用のデータ、`jsonData` は LLM に返す JSON
- プラグインの `execute`（`presentDocument`）は `data: { markdown, filenameHint }` を返し、View は `data.markdown` を読む。ホストは `execute` の結果をそのまま View に渡す
- demo だけが `execute` を通さずに結果を手で組み立て、入力した引数を `jsonData` に入れていた。`data` が無いので View は常に空

## 修正
- 直すのは demo 側（src は protocol どおり）
- demo は入力 JSON を `isMarkdownArgs`（`demo/markdownArgs.ts`）で確かめてから `executeMarkdown(null, args)` を呼び、その結果を View / Preview に渡す
