import type { en } from './en'

export const ja: typeof en = {
  // Navbar
  'nav.studio': 'スタジオ',
  'nav.hanna': 'ハンナ',
  'nav.gallery': 'ギャラリー',
  'nav.blog': 'ブログ',
  'nav.academy': 'アカデミー',
  'nav.community': 'コミュニティ',
  'nav.brand': 'AFROMATIONS',
  'nav.brand.sub': 'スタジオ',

  // Hero
  'hero.eyebrow': 'ブラックオーナーのアニメスタジオ',
  'hero.title': 'AFROMATIONS',
  'hero.tagline': '世界が交わる、物語が燃え上がる。',
  'hero.description':
    'ブラックカルチャーとアニメの融合。3Dキャラクター、オリジナルストーリー、型にはまらないクリエイターのためのコミュニティ。',
  'hero.cta.hanna': 'エージェント・ハンナに会う',
  'hero.cta.gallery': 'ギャラリーを見る',
  'hero.scroll': 'スクロール',

  // Hanna Feature
  'hanna.eyebrow': '注目エージェント',
  'hanna.title': 'エージェント・ハンナ',
  'hanna.subtitle': '花 — 創造の刃',
  'hanna.description':
    'アニメの伝統から生まれ、最先端のAIインフラで構築された日本の戦士姫。ハンナはAFROMATIONSの創造エンジン。キャラクターを生成し、コンテンツを書き、トレンドを監視し、アセットをデプロイする。',
  'hanna.placeholder': 'エージェント・ハンナ — 3Dレンダリング読み込み中',
  'hanna.character': '日本の戦士姫 · 27歳 · アニメスタイル',
  'hanna.stat.resolution': 'レンダリング解像度',
  'hanna.stat.resolution.value': '4K',
  'hanna.stat.shader': 'シェーダータイプ',
  'hanna.stat.shader.value': 'トゥーン / アニメ',
  'hanna.stat.version': 'エージェントバージョン',
  'hanna.stat.version.value': '花 v3.0',
  'hanna.stat.pipeline': 'パイプライン',
  'hanna.stat.pipeline.value': 'Eevee → GLB',
  'hanna.capabilities': '能力',
  'hanna.ability.characters': 'アニメキャラクター生成',
  'hanna.ability.avatar': '3Dアバター作成（Blender bpy）',
  'hanna.ability.trends': 'Googleトレンド監視',
  'hanna.ability.blog': 'ブログ記事生成',
  'hanna.ability.digest': 'コミュニティダイジェスト＆スケジューリング',
  'hanna.ability.export': 'アセットエクスポート（GLB, FBX, PNG）',

  // Studio Showcase
  'studio.eyebrow': 'スタジオ',
  'studio.title': '私たちが作るもの',
  'studio.pipeline.tag': 'パイプライン',
  'studio.pipeline.title': '3Dキャラクターパイプライン',
  'studio.pipeline.description':
    'Blender bpy → アニメトゥーンシェーダー → Eeveeレンダー → GLB/FBXエクスポート。コンセプトからデプロイ可能なアセットまでの完全パイプライン。',
  'studio.content.tag': 'コンテンツ',
  'studio.content.title': 'アニメコンテンツエンジン',
  'studio.content.description':
    'Googleトレンド監視 → AI記事生成 → 自動公開。新鮮なアニメコンテンツを毎日、本物の声で。',
  'studio.community.tag': 'コミュニティ',
  'studio.community.title': 'コミュニティハブ',
  'studio.community.description':
    '週刊ダイジェスト、トレンドトピックディスカッション、クリエイタースポットライト。最大のブラックアニメコミュニティを一緒に作ろう。',

  // Blog Preview
  'blog.eyebrow': 'トレンド',
  'blog.title': 'アニメパルス',
  'blog.description':
    'エージェント・ハンナがリアルタイムで監視するアニメトレンド。コミュニティのために自動生成・キュレーションされた記事。',
  'blog.empty': 'ライブアニメトレンドを表示するにはHanna APIをデプロイしてください。',

  // Gallery
  'gallery.eyebrow': '私たちの作品',
  'gallery.title': 'キャラクターアート＆シーン',
  'gallery.description':
    'AFROMATIONSユニバースのオリジナルアートワーク。DUOシリーズのキャラクター、精霊、世界。',

  // Community
  'community.eyebrow': '参加する',
  'community.title': '最大のブラックアニメコミュニティ',
  'community.description':
    'クリエイター、アーティスト、ライター、ファンがまだ存在しないものを作っている。週刊ダイジェスト。クリエイタースポットライト。ゲートキーピングなし。',
  'community.discord': 'Discordに参加',
  'community.twitter': '@afromationsをフォロー',

  // Footer
  'footer.copyright': '© {year} AFROMATIONS Studios. エージェント・ハンナ花が運営',
  'footer.github': 'GitHub',
  'footer.discord': 'Discord',

  // Education / Lessons
  'education.eyebrow': 'ハンナと学ぶ',
  'education.title': 'スタジオアカデミー',
  'education.description': 'ハンナがビジネス、アニメ制作、クリエイティブ起業を教えます。創業者のように考える若いクリエイターのためのレッスン。',
  'education.lesson1.title': 'アニメスタジオの収益モデル',
  'education.lesson1.description': '収益源、ライセンス契約、グッズ展開。好きなアニメの裏にあるビジネス。',
  'education.lesson1.tag': 'ビジネス',
  'education.lesson2.title': 'キャラクターデザインの基礎',
  'education.lesson2.description': 'シルエット、色彩理論、形の個性。記憶に残るキャラクターをデザインする。',
  'education.lesson2.tag': 'アート',
  'education.lesson3.title': '初めてのブランド構築',
  'education.lesson3.description': '名前、ロゴ、声、オーディエンス。かっこいいだけじゃない、意味のあるブランドを。',
  'education.lesson3.tag': '起業',
  'education.lesson4.title': '3Dパイプライン：コンセプトからエクスポートまで',
  'education.lesson4.description': 'スケッチからBlender、GLBファイルまで。実際のスタジオが使う制作パイプライン。',
  'education.lesson4.tag': '制作',
  'education.lesson5.title': '心に響くアニメストーリーの書き方',
  'education.lesson5.description': 'ストーリーアーク、コンフリクト、ペーシング。感情を動かす脚本を書く。',
  'education.lesson5.tag': 'ストーリー',
  'education.lesson6.title': 'クリエイターのためのSNS戦略',
  'education.lesson6.description': 'プラットフォーム戦略、コンテンツカレンダー、売り出さずにファンを増やす方法。',
  'education.lesson6.tag': 'マーケティング',
  'education.coming_soon': '新しいレッスンが近日公開',
  'education.progress': '未着手',
}
