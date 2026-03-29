# CLAUDE.md

## 環境変数の確認

作業を開始する前に、以下の環境変数が設定されていることを確認してください。

- `GITHUB_TOKEN`: GitHub API へのアクセスおよび git push に必要です。設定されていない場合は、作業を中断してユーザーに通知してください。

## Git push の方法

デフォルトの remote URL では push に失敗する場合があります。その場合は `GITHUB_TOKEN` を使って remote URL を設定してから push してください。

```bash
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/hurumeki/soro-complement.git"
git push -u origin <branch-name>
```

## 仕様書

プロジェクトの仕様書は `docs/` ディレクトリに格納されています。

- `docs/SPECIFICATION.md`: 仕様書の目次（各セクションへのリンク）
- `docs/spec/`: セクションごとに分割された仕様書（英語）

## 作業前の確認事項

- 実装やコード変更を行う前に、必ず `docs/SPECIFICATION.md` および関連する `docs/spec/` 内のファイルを読んで仕様を把握してください。
- 仕様書の内容に沿った実装を行ってください。

## 仕様書の更新

- 実装の過程で仕様に変更が生じた場合は、該当する `docs/spec/` 内のファイルを最新の状態に更新してください。
- 仕様書とコードの整合性を常に保つようにしてください。

## 作業中のルール

- 指示された方法やプランの手順が失敗した場合、自己判断で別の方法に切り替えず、必ずユーザーに確認を取ってから次の方法を試してください。
