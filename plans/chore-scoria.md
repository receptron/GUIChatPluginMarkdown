# scoria でコード品質を計測する

GUIChatPluginSpreadsheet と同じ形で入れる。

## 方針
- `scoria` を devDependencies に入れ、`yarn quality`（= `scoria`）で走らせる
- `scoria.config.json`（profile: library / stacks: vue, ts / mode: report）で検出結果を固定し、`scoria baseline` で `.scoria/baseline.json` を記録する
- coverage は `c8` で取る。`yarn test:coverage` = `c8 yarn run test`（テストは `tsx --test` なので vitest の coverage は使えない）
  - `.c8rc.json`：`all: true` でテストが読み込まないファイルも母数に入れる。`include: src/**`
  - `coverage/` は `.gitignore` に入れる
- CI は `.github/workflows/scoria.yml`（Spreadsheet と同じ）
  - 計測ジョブは読み取り権限のみ。SARIF のアップロードは `security-events: write` を持つ別ジョブで、プロジェクトのコードは走らせない
  - `mode: report` なのでビルドは落とさない

## Node の版
- scoria は `engines: node >=24`。Yarn v1 は engines 不一致で install を失敗させるので、Node 22 では `yarn install` できない
- このパッケージも `engines: node >=24` とし、CI の行列は Node 24.x / 26.x にする

## 注意
- `.vue` は c8 では変換されないので、行数は概算
