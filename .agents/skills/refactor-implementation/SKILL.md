---
name: refactor-implementation
description: "フロントエンド実装をリファクタし、DOM を単純化して不要な div/class/attr/style を削減するスキル。Astro component cleanup, simplify markup, reduce global class dependencies, tighten component boundaries に使う。"
argument-hint: "対象コンポーネント、ページ、またはリファクタの目的"
user-invocable: true
disable-model-invocation: false
---

# 実装リファクタリング

## このスキルで行うこと

このスキルは、コンポーネント単位で自己完結しやすい、より単純なマークアップとスタイルへ寄せるためのフロントエンド実装リファクタを行います。

主な目標は次のとおりです。

- 冗長な div など、不要なラッパー要素を削除する。
- 明確な意味を持たない class、attribute、inline style、構造上のフックを削減する。
- より浅い構造や、より意味的な要素で同じ UI を表現できるなら、DOM 全体を単純化する。
- グローバルクラスに頼らず、できるだけ各コンポーネント内でスタイルと振る舞いを閉じる。
- 明示的に広い redesign を求められていない限り、既存の挙動、意味論、アクセシビリティ、見た目は維持する。

## 使う場面

次のような場面で使います。

- コンポーネントにラッパー要素や見た目専用 class が多すぎる。
- マークアップとスタイルの結び付きが強すぎて、ページやコンポーネントが読みにくい。
- 名前変更ではなく、DOM 構造そのものを単純化する refactor が必要。
- グローバル utility class や共有構造 class への依存がコンポーネント境界をまたいで漏れている。
- scoped style を活かして、より自己完結した構造へ寄せられる。

次の用途には向きません。

- 単純化が目的ではない大規模な見た目の redesign。
- 構造変更を伴わない lint や formatting だけの修正。
- スタイルを意図的にグローバル utility に寄せる方向の refactor。

## リファクタ方針

1. ラッパーより意味を優先する。
   余分な div を減らせるなら、section、article、header、footer、ul、li、button、a などの semantic な要素を優先する。

2. 意味を持たない構造を削る。
   レイアウト、見た目、挙動が明確に保てるなら、wrapper、class、attr、inline style を削除する。

3. 名前ではなく DOM を簡潔にする。
   ネスト構造を変えたほうが木全体を理解しやすくなるなら、複雑な DOM を惰性で維持しない。

4. コンポーネントを自己完結させる。
   component-local なマークアップと scoped style を優先し、明確な design token や app shell 上の理由がない限り、構造や見た目をグローバル class に依存させない。

5. 必要な状態フックは残す。
   state、JS targeting、accessibility、testing、API 互換のために本当に必要な class や attribute は維持する。
   例: is-open、is-active、aria-expanded、script が読む data attribute。

6. 広すぎる selector による退行を避ける。
   Astro の scoped style 内で class をタグ selector に置き換えるときは、ネストされた要素に誤爆しないよう、ローカル構造に限定した selector を使う。
   例: article > a、header > p、.card > img。

7. media query は本来の class の近くに閉じる。
   responsive な差分は、まず通常状態の style を本来の class に定義し、差分として必要な部分だけを media query に書く。可能なら class の style の入れ子として media query を定義し、関連する rule が離れないようにする。

8. style は常に scss を使う。
   Astro コンポーネント内の style タグは、style lang="scss" を前提にする。まだ scss になっていない style タグがあれば、refactor のついでに scss へ揃える。

9. その場限りの値より design token を優先する。
   スタイルを残す場合は、周囲の実装上どうしても必要でない限り、新しいハードコード値より既存の変数や token を使う。

10. 構造変更後はブラウザで見た目を確認する。
    DOM を単純化すると、デザイン上意味のある div やレイアウト境界まで消してしまうことがある。構造を変えたあとは、コード上の妥当性だけで完了とせず、実際にブラウザで見た目とレイアウトを確認する。最終状態だけでなく、どの変更が見た目に影響したかも意識して確認する。

## 手順

1. 最小の具体的な refactor 対象を決める。
   特定のコンポーネント、ページ内セクション、または繰り返し現れる DOM パターンから始める。構造、スタイル、挙動を誰が支配しているか分かる範囲だけ読む。

2. 構造上のノイズを洗い出す。
   冗長に見える wrapper、class、attr、inline style を列挙する。
   それぞれが次のどれかの理由で必要か確認する。

- semantics
- layout containment
- state または script targeting
- accessibility
- slot や content projection の境界
- public API compatibility

3. 局所的な単純化の仮説を 1 つ立てる。
   反証可能な仮説として、たとえば次のように置く。

- この wrapper は削除でき、style は semantic な親要素へ移せる。
- この 2 つのネスト container は 1 つにまとめられる。
- このグローバル class は component-local な scoped style に置き換えられる。
- この inline style はローカル rule か token 化された prop にできる。

4. 最も安全な単純化経路を選ぶ。
   挙動を保ったまま仮説を検証できる最小変更を入れる。推測ベースの大きな変更より、局所的な構造変更を優先する。

5. markup と style を一緒に直す。
   wrapper や class を削るときは、隣接する style も同じタイミングで更新する。

- レイアウトを担う style は、その責務を持つ semantic な要素へ移す。
- 使われなくなった selector はすぐ削除する。
- component 内の scoped style を優先し、style タグは lang="scss" に揃える。
- media query は通常 rule の近くに置き、できるだけ対象 class の入れ子として書く。
- 既存のグローバル class を置き換えるために、新しいグローバル class を増やさない。

6. コンポーネント境界を見直す。
   局所変更のあとで、そのコンポーネントがより独立したか確認する。
   確認点:

- まだグローバルな構造 class に依存していないか。
- 見た目や構造がこのファイルだけで理解できるか。
- public な props や slots の整合性は保たれているか。

7. ブラウザ確認のための開発サーバを用意する。
   ブラウザで確認するときは、まず localhost:4321 へアクセスする。開発サーバが起動していない、またはアクセスできない場合は、プロジェクトルートで pnpm dev を起動してから再度アクセスする。

8. 最小の focused check で検証する。
   次のうち、より狭くて安い確認から行う。

- 局所的な見た目または rendering の確認
- localhost:4321 をブラウザで開き、変更箇所の見た目、余白、区切り、崩れを確認
- 変更前後で差分が出るはずの箇所を意識して見て、消した div や class が担っていた見た目上の役割が失われていないか確認
- 対象範囲の lint または typecheck
- 既存の component/page test
- 狭い検証手段がない場合だけ full lint

9. 同じ根本原因に隣接する単純化だけ続ける。
   さらに掃除が必要なら、次の最小変更を入れて再度検証する。無関係な redesign には広げない。

## 判断ルール

### wrapper を削除してよい条件

- semantic な親子要素へ style を移せば済む。
- 親の layout 上の役割を重複している。
- semantics、挙動、accessibility の価値を追加していない。

### wrapper を残す条件

- 他で素直に表現できない実レイアウト境界を定義している。
- overflow、positioning、stacking、animation の分離に必要。
- slot、hydration 境界、script hook に必要。

### class を削除してよい条件

- selector を安全に component-local かつ構造ベースへ移せる。
- state の意味を持たない見た目専用 alias に過ぎない。
- 削除しようとしている古い DOM 形状の都合でだけ存在している。

### class を残す条件

- state、variant、JS targeting を表している。
- コンポーネント外部 API の契約に含まれている。
- 削除すると selector が悪化したり、隠れた coupling が増える。

### グローバル依存を置き換える条件

- グローバル utility や共有構造 class が実質 1 箇所、または 1 コンポーネント内でしか使われていない。
- その style を component 側の scoped rule で持てる。

### 限定的なグローバル依存を許す条件

- 安定した design token の供給元、app shell の primitive、または明確に意図された共有挙動である。
- ローカルに複製すると不整合や API drift のほうが大きくなる。

## 完了条件

このスキルによる refactor は、次を満たしたら完了です。

- DOM tree が実際により単純、またはより浅くなっている。
- 冗長な wrapper、class、attr、inline style が削除されている。
- コンポーネント単体で理解しやすくなっている。
- 実用上可能な範囲で、グローバル構造 class への依存が減っている、またはなくなっている。
- 通常 style と media query の責務が分かれており、responsive 差分だけが追加されている。
- media query ができるだけ対象 class の近く、またはその入れ子にまとまっている。
- style タグが lang="scss" に統一されている。
- localhost:4321 上で変更箇所を確認し、デザイン上必要な box、余白、区切り、レイアウト境界を壊していない。
- localhost:4321 上で、変更点そのものを確認し、削除・統合した wrapper や class が見た目上どの役割を持っていたかを見落としていない。
- accessibility と semantics が維持されている。
- state hook や必要な挙動フックが保たれている。
- dead CSS と dead markup が削除されている。
- 触った範囲の validation が通っている。

## 出力時の期待事項

このスキルを使うときは、次を出力します。

- 最初の edit 前に置いた局所的な単純化仮説
- 実際に行う具体的な構造変更
- それ以上の単純化を止める制約や、維持した hook
- localhost:4321 のブラウザ確認結果。サーバ未起動なら pnpm dev で起動したことも含める。
- 変更点をブラウザ上でどう確認したか。特に削除した div、class、区切り線、余白、ラッパーの役割に差分が出ていないか。
- refactor 後に行った validation

## 例のプロンプト

- /refactor-implementation HeroSection.astro を、不要な div と class を減らして DOM を単純化してください
- /refactor-implementation ContactInfoSection を、グローバルクラスに頼らず自己完結した実装に寄せてください
- /refactor-implementation index ページのセクション構造を見直して、意味のないラッパーを整理してください
- /refactor-implementation このコンポーネントを見て、style と attr を整理しつつ構造からリファクタしてください
