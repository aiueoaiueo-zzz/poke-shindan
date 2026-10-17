'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { supabase } from '../../../../utils/supabase';
import { calculatePokemonType } from '../../../../utils/pokemonLogic';

// 🗺️ 「もしもポケモン世界に迷い込んだら」18問の確定設問データ
const QUESTION_TEXTS = [
  {
    q: "気づけば見知らぬ森の中。目の前に見たことのない生き物（ポケモン）が。あなたが最初に取る行動は？",
    A: "「よし、捕まえて仲間にしよう！」と、すぐに作戦を立てて行動に移す",
    B: "むやみに近づかず、相手が敵対していないかじっと様子を伺う",
    C: "怯えさせないように、優しく声をかけたり食べ物を分け合おうとする",
    D: "「どういう生態なんだろう？」と、習性や特徴を観察して分析し始める"
  },
  {
    q: "この世界の街に到着。ひとまず生活の拠点を決めたい。あなたが選ぶ場所は？",
    A: "歴史があり、警察や警備がしっかりしている治安のいい古い街",
    B: "最先端の施設があり、自分の力を試せるジムやリーグの本部がある大都市",
    C: "噂話や裏情報が集まる、ちょっと怪しくてスリリングな路地裏の街",
    D: "定住はせず、いろんな地方を自由に旅しながらその日暮らしをする"
  },
  {
    q: "伝説のポケモンの遺跡を発見！入り口には複雑な仕掛け（謎解き）が。どうやって突破する？",
    A: "「みんなで手分けしてヒントを探そう！」と指示を出し、チームを率いて挑む",
    B: "壁画や文字を解読し、トラップの位置や最短の正解ルートを完璧に計算する",
    C: "「直感でこっちが怪しい…」と、自分のひらめきを信じて進む",
    D: "なぜこの仕掛けが作られたのか、その古代の仕組みのロジックを追求する"
  },
  {
    q: "街の広場で、2人のトレーナーがバトルのルールを巡って激しく揉めています。あなたならどうする？",
    A: "どちらがより建設的か判断し、最も効率よく丸く収まる結論をズバッと言い渡す",
    B: "リーグの公式ルールブックに照らし合わせ、どちらの論理が破綻しているかを冷静に指摘する",
    C: "「まあまあ、バトルはお互いが楽しくなきゃ！」と、雰囲気が悪くならないよう仲裁する",
    D: "あえてどっちの肩も持たず、「こういう新しいルールにすればもっと面白いんじゃない？」と煽ってみる"
  },
  {
    q: "夜、森の中で野生のポケモンたちが怪しげな儀式（踊り）をしています。それを見たあなたは？",
    A: "「何か不吉なことが起きる予兆かも…」と、ミステリアスな雰囲気に想像を巡らせる",
    B: "恐れずに堂々と近づき、その儀式の中心にいる主（ヌシ）ポケモンに挨拶しに行く",
    C: "「楽しそう！」とワクワクして、自分もその輪の中に飛び込んで一緒に踊り出す",
    D: "邪魔をしないように隠れて、彼らの絆や不思議な生態を温かい目で見守る"
  },
  {
    q: "傷ついた迷子のポケモンを見つけました。でも、助けようとすると警戒して威嚇してきます。どうする？",
    A: "弱気にならず、こちらの真剣な目力を伝えて「助けるから安心しろ！」と堂々と向き合う",
    B: "適切な距離を保ち、まずは手当に必要な道具や木の実を論理的に準備する",
    C: "相手の恐怖心に寄り添い、優しく語りかけながら心が通じ合うのをじっくり待つ",
    D: "ポケモンの気持ちを察し、安心させるための理想的な環境や空気感をサッと作り出す"
  },
  {
    q: "相棒のポケモンが、バトルに負けてひどく落ち込んでいます。あなたがかける言葉は？",
    A: "「どんまい！次はあの空みたいに高く羽ばたいて、新しい技を試してみよう！」と励ます",
    B: "「悔しかったね。でも君が頑張ったのは知ってるよ」と、隣に座って静かに寄り添う",
    C: "「負けた原因を分析して、明日の特訓メニューを効率よく考え直そう！」と切り替える",
    D: "「美味しいものでも食べて、パーッと気分転換しに街へ繰り出そう！」と笑い飛ばす"
  },
  {
    q: "町の人々が、街を発展させるために「近くのポケモンの住処（森）」を切り開く計画を立てています。あなたのスタンスは？",
    A: "街の発展のために必要不可欠なことなら、多少の犠牲はあっても進めるべきだと思う",
    B: "ポケモンたちの住処を奪うのは絶対によくない。伝統を守り、共存する方法を静かに模索する",
    C: "人間とポケモンが、100%お互いに幸せになれる「第3の理想の土地」を見つけようと提案する",
    D: "「自然を壊さずに街をアトラクション化すればもっとワクワクするはず！」と、斬新なアイデアを広める"
  },
  {
    q: "初めてポケモンセンターでアルバイト（お手伝い）をすることに。あなたが一番やりたい役割は？",
    A: "受付や案内など、笑顔でたくさんのトレーナーを歓迎する賑やかな仕事",
    B: "ポケモンたちの体調管理や、センター内の規律をきっちり守る管理責任者の仕事",
    C: "傷ついたポケモンたちがリラックスできるような、内装の飾り付けや心のケア",
    D: "医療器具の準備やベッドの整理など、みんながスムーズに働けるよう裏方に徹する仕事"
  },
  {
    q: "チャンピオンロードに挑戦するための推薦状をもらえることに。あなたが一番嬉しい理由は？",
    A: "選ばれし強者しか入れない、伝説の舞台への切符を手に入れたから",
    B: "自分の実力が公式に認められ、トップを目指す挑戦権を得られたから",
    C: "これまで地道にルールを守り、コツコツと積み上げてきた努力が報われたから",
    D: "推薦してくれた人の期待に応えることができ、恩返しができたから"
  },
  {
    q: "広大なサファリゾーン（保護区）を探索中、急な大雨で立ち往生。あなたはどうする？",
    A: "「雨なんか気にするな！」と、当初の目的通りに次のチェックポイントへ突き進む",
    B: "近くの洞窟を探し、雨が止むまでの時間を逆算して効率的な予定を立て直す",
    C: "事前に用意しておいたマップと雨具を確認し、安全なルートを堅実に引き返す",
    D: "周りのトレーナーやポケモンたちが寒がっていないか心配し、雨宿りの場所を譲る"
  },
  {
    q: "お世話になった街を離れ、次の街へ出発する前日。あなたが最後にする準備は？",
    A: "夜の静かなお気に入りの場所へ行き、これまでの旅の思い出を一人で静かに噛みしめる",
    B: "次の旅路に備えて、荷物のチェックや回復アイテムの買い出しを完璧に終わらせる",
    C: "お世話になった人たちに、ちょっとした仕掛けやサプライズでお礼のメッセージを残す",
    D: "次のルートの地形や出現するポケモンの情報を、ネットや本で徹底的に調べて予習する"
  },
  {
    q: "珍しいきのみが実るという、噂の深い洞窟。入り口がツタで塞がれています。どうやって入る？",
    A: "「みんなで協力して引っ張ろう！」と、近くの人に声をかけて人海戦術で取り除く",
    B: "ツタの隙間にあえて怪しい薬品や煙を流し込んで、どう変化するか実験してみる",
    C: "道具バッグから手際よくナイフや工具を取り出し、無駄のない動きでササッと切り開く",
    D: "「ツタを傷つけるのはかわいそう…」と、優しく解きほぐす方法をじっくり試みる"
  },
  {
    q: "新しく見つけたきのみの粉末を使って、相棒の「ポロック（お菓子）」を作ります。あなたの調理スタイルは？",
    A: "味見をしながら「美味しい！楽しい！」と、その場のノリで色んな味を混ぜていく",
    B: "きのみの栄養成分や配合比率を計算し、最も効果の高い精密なレシピを追求する",
    C: "レシピ本は見ず、道具の使い心地や火加減など、自分の手の感覚を頼りに最高の逸品を仕上げる",
    D: "色合いや形にこだわり、ポケモンが喜ぶような自分だけの美しい芸術作品に仕上げる"
  },
  {
    q: "お祭りの目玉イベント「最速自転車レース」に出場！あなたの走りのスタイルは？",
    A: "スタートから全力疾走！スリリングな急カーブも持ち前の反射神経で突っ込んでいく",
    B: "風の抵抗やギアの切り替えタイミングを冷徹に計算し、マシンの性能を100%引き出す",
    C: "沿道の観客の声援に笑顔で手を振り返しながら、お祭りの熱い雰囲気を最高に楽しむ",
    D: "周りの順位は気にせず、風や自然の心地よさを感じながらマイペースにゴールを目指す"
  },
  {
    q: "旅の途中で、美しい砂浜を見つけました。ここであなたが過ごす時間は？",
    A: "砂を掘って頑丈な即席の拠点（基地）を作ったり、流れ着いた流木で何か道具を工作する",
    B: "波の音を聴きながら、スケッチブックを広げて景色の絵を描いたり、一人で静かに感性に浸る",
    C: "ビーチのルール看板を確認し、危ない区域に入らないようマナーを守って散歩する",
    D: "ビーチバレーをしているグループを見つけ、「俺も入れて！」とすぐに飛び込んで盛り上がる"
  },
  {
    q: "旅の終盤、あなたをずっと見守ってくれた謎の老人が「君にとって旅とは何だった？」と尋ねてきました。あなたの答えは？",
    A: "「平凡だけどかけがえのない、毎日の積み重ねそのものでした」",
    B: "「自分の限界に挑み、数々のピンチを切り抜けて勝利を掴む最高のゲームでした」",
    C: "「目的を果たすために、一歩ずつ計画を遂行していく戦略のプロセスでした」",
    D: "「多くの人と出会い、お互いの絆や心の成長を実感するための最高のステージでした」"
  },
  {
    q: "いよいよ最後のバトル。大観衆があなたを凝視しています。コートに立つあなたの心境は？",
    A: "「これまでの鉄壁の戦略通りに動けば勝てる」と、冷徹に勝利へのルートをなぞる",
    B: "「これまで通り、基本に忠実に、いつも通りの堅実なバトルをしよう」と心を落ち着かせる",
    C: "「勝っても負けても、自分らしくいつも通りの自然体で楽しもう」と、いつもと変わらぬ笑顔を見せる",
    D: "「この大舞台、ハラハラするほど燃えてきた！」と、相手の裏をかく大胆な一手で会場を沸かせる"
  }
];

// Next.jsのuseSearchParams（クエリパラメータ取得）のエラー対策として、全体をSuspenseで保護します
export default function QuizPage() {
  return (
    <Suspense fallback={<main className="container"><article aria-busy="true">読み込み中...</article></main>}>
      <QuizClient />
    </Suspense>
  );
}

function QuizClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id;
  // URLの末尾の「?p_id=xxx」を調べる
  const urlPlayerId = searchParams.get('p_id');

  const [hostName, setHostName] = useState('');
  const [friendName, setFriendName] = useState('');
  const [isNameRegistered, setIsNameRegistered] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 画面が開いた瞬間の初期チェック
  useEffect(() => {
    const initQuizScreen = async () => {
      try {
        // 👑 1. この部屋のホスト（1人目）の名前を調べる
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setHostName(data[0].name);
        }

        // 🎯 2. ホスト自身の解答フローの自動スキップロジック
        if (urlPlayerId) {
          // URLにp_idが入っている＝「すでにHomeClientでデータが作成済みのホスト本人」とみなす
          setMyPlayerId(urlPlayerId);
          setIsNameRegistered(true); // 名前入力をスキップして直接Q1へ
        }
      } catch (err) {
        console.error('初期化失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initQuizScreen();
  }, [roomId, urlPlayerId]);
  const handleStartQuiz = async () => {
    if (!friendName.trim()) {
      alert('ニックネームを入力してね！');
      return;
    }
    setIsSubmitting(true);

    try {
      // 👥 招待リンクから来た友達（2人目以降）を新規登録する
      const { data, error } = await supabase
        .from('players')
        .insert([
          {
            room_id: roomId,
            name: friendName.trim(),
            answers: [],
            pokemon_type: '' // 初期値は空文字
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setMyPlayerId(data.id); 
      setIsNameRegistered(true); 
    } catch (err) {
      console.error('プレイヤー登録エラー:', err);
      alert('参加登録に失敗しました。Supabaseの接続や設定を確認してね。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSelect = async (choice) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (currentStep < QUESTION_TEXTS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      try {
        const finalType = calculatePokemonType(newAnswers);

        // 🎯 自分のプレイヤーID（ホスト、または登録した友達）を狙い撃ちして結果をアップデート！
        const { error } = await supabase
          .from('players')
          .update({
            answers: newAnswers,
            pokemon_type: finalType 
          })
          .eq('id', myPlayerId);

        if (error) throw error;
        
        // 診断完了！結果画面へジャンプします
        router.push(`/room/${roomId}/result`);

      } catch (error) {
        console.error('回答の保存に失敗しました:', error);
        alert(`エラーが発生しました: ${error.message || JSON.stringify(error)}`);
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return <main className="container"><article aria-busy="true">お部屋を確認中...</article></main>;
  }

  // 🚪 【ステップ1】名前登録がまだなら入力画面を見せる（友達用）
  if (!isNameRegistered) {
    return (
      <main className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
        <article style={{ textAlign: 'center', marginTop: '2rem' }}>
          <header>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💌</h2>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
              {hostName ? `${hostName}さん` : '友達'} から相性診断の招待が届いています！
            </h1>
            <p style={{ color: '#666' }}>ニックネームを入力して、診断に参加しよう！</p>
          </header>

          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <label htmlFor="friendNickname">
              <strong>あなたのニックネーム</strong>
              <input
                type="text"
                id="friendNickname"
                placeholder="例：シゲル"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                disabled={isSubmitting}
                style={{ marginTop: '0.5rem' }}
              />
            </label>
          </div>

          <footer style={{ marginTop: '2rem' }}>
            <button onClick={handleStartQuiz} disabled={isSubmitting} style={{ width: '100%', padding: '0.8rem', fontWeight: 'bold' }}>
              {isSubmitting ? '登録中...' : '名前を登録してクイズをはじめる'}
            </button>
          </footer>
        </article>
      </main>
    );
  }

  // 📝 【ステップ2】登録完了後（またはホスト直入時）、18問のクイズがスタート！
  const currentQuestion = QUESTION_TEXTS[currentStep];

  return (
    <main className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <article>
        <header style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '0.2rem', color: '#666', fontSize: '0.9rem' }}>
            質問 {currentStep + 1} / 18
          </p>
          <progress value={currentStep + 1} max={18}></progress>
          <h2 style={{ fontSize: '1.4rem', marginTop: '1rem', fontWeight: 'bold' }}>
            {currentQuestion.q}
          </h2>
        </header>

        <div style={{ marginTop: '2rem' }}>
          {['A', 'B', 'C', 'D'].map((letter) => (
            <button
              key={letter}
              disabled={isSubmitting}
              onClick={() => handleAnswerSelect(letter)}
              className="outline"
              style={{ width: '100%', textAlign: 'left', marginBottom: '1rem', padding: '1rem', whiteSpace: 'normal', wordBreak: 'break-word' }}
            >
              <strong>{letter}.</strong> {currentQuestion[letter]}
            </button>
          ))}
        </div>
        {isSubmitting && <footer style={{ textAlign: 'center', color: '#666' }}>診断結果を計算中...</footer>}
      </article>
    </main>
  );
}
