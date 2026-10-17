# 使っていない依存を消す

## 方針
- `vite-plugin-dts`：vite.config で読み込まれていない。d.ts は `vue-tsc -p tsconfig.build.json --emitDeclarationOnly` で出している
- `minimatch`（dependencies）：src / demo / 設定ファイル / scripts のどこからも import されていない
- どちらも `yarn remove` で消す

## 残したもの
- `resolutions.minimatch` は残す。eslint / @eslint/config-array / @typescript-eslint/typescript-estree が推移的に minimatch を使っており、その解決をこの resolution が押さえているため
