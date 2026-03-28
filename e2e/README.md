# E2E テスト

[Playwright](https://playwright.dev/) を使用したエンドツーエンドテストおよびビジュアルリグレッションテスト。

## セットアップ

```bash
npm install
npx playwright install --with-deps chromium
```

> 全ブラウザをインストールする場合: `npx playwright install --with-deps`

## テストの実行

```bash
# 全テスト実行
npm run test:e2e

# UIモードで実行（デバッグ用）
npm run test:e2e:ui

# 特定のプロジェクトのみ実行
npx playwright test --project=mobile-chrome

# 特定のテストファイルのみ実行
npx playwright test e2e/screens.spec.js
```

## スクリーンショットテスト

`screenshots.spec.js` はビジュアルリグレッションテストを行います。

- **初回実行**: ベースラインスクリーンショットを `e2e/screenshots.spec.js-snapshots/` に生成
- **以降の実行**: 現在の画面をベースラインと比較し、差分があれば失敗

```bash
# ベースライン生成 / 更新
npm run test:e2e:update

# テストレポートを表示
npm run test:e2e:report
```

## ファイル構成

```
e2e/
├── README.md                          ← このファイル
├── screens.spec.js                    ← 画面遷移・機能テスト
├── screenshots.spec.js                ← ビジュアルリグレッションテスト
├── screenshots.spec.js-snapshots/     ← ベースラインスクリーンショット（自動生成・git管理）
├── test-results/                      ← テスト実行結果（.gitignore）
└── report/                            ← HTMLレポート（.gitignore）
```

## テスト対象デバイス

| プロジェクト名 | デバイス | 用途 |
|---|---|---|
| `mobile-chrome` | Pixel 7 | メインターゲット |
| `mobile-safari` | iPhone 14 | iOS確認 |
| `desktop-chrome` | Chrome 1280x720 | デスクトップ確認 |

## CI

GitHub Actions (`.github/workflows/e2e.yml`) で PR ごとに `mobile-chrome` プロジェクトのテストが自動実行されます。失敗時はスクリーンショット差分が Artifact としてダウンロード可能です。

## Tips

- スクリーンショットのベースラインは**デバイスごと**に生成されます。ローカルのOSによってフォントレンダリングが異なるため、CIで生成したベースラインを使うことを推奨します。
- 問題の数字はランダムなので、`screenshots.spec.js` ではマスク (`mask`) を使って除外しています。
