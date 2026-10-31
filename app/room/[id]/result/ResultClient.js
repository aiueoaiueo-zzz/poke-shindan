'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../utils/supabase';
import { getRandomPokemonsByType, checkCompatibility } from '../../../../utils/pokemonLogic';
// 📋 追加した性格解説文データをインポート
import { TYPE_DESCRIPTIONS } from '../../../../constants/descriptions';
import { isValidRoomId } from '../../../../utils/roomId';

export default function ResultClient() {
  const params = useParams();
  const roomId = params.id;
  // 🎯 「自分が誰か」はURLの ?p_id=xxx で判断する（クイズ画面から引き継がれる）
  const urlPlayerId = useSearchParams().get('p_id');

  const [myPlayer, setMyPlayer] = useState(null); // 画面を見ている「自分」のデータ
  const [hostPlayer, setHostPlayer] = useState(null); // 部屋を作った「ホスト」のデータ
  const [allPlayers, setAllPlayers] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        if (!isValidRoomId(roomId)) return;

        // 1. この部屋に参加している全員のデータを取得（入った順）
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true }); // 一番古い人を先頭にする

        if (error) throw error;

        if (data && data.length > 0) {
          setAllPlayers(data);
          
          // 👑 常にリストの1番最初（0番目）の人が部屋主（ホスト）
          const host = data[0];
          setHostPlayer(host);

          // 👤 URLの p_id と一致する人を「自分」としてキープする
          //    （以前は「最後に登録された人」を自分扱いしていたため、
          //      友達が参加するとホストの画面に友達の結果が出てしまっていた）
          const me = data.find((player) => String(player.id) === urlPlayerId) || null;
          setMyPlayer(me);

          // 確定した正しいカラム名である pokemon_type を使用
          const myType = me?.pokemon_type;

          if (myType) {
            // 2. 確定した「自分」のタイプを元に、PokeAPIからポケモンを取得！
            const pokeData = await getRandomPokemonsByType(myType);
            setPokemons(pokeData);
          }
        }
      } catch (err) {
        console.error('結果の取得に失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultData();
  }, [roomId, urlPlayerId]);

  if (isLoading) {
    return (
      <main className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <article>
          <div aria-busy="true">ポケモンの世界からデータをひっぱってきているよ...</div>
        </article>
      </main>
    );
  }

  // 🚪 自分が特定できない（p_idなし・別の部屋のp_id・まだ回答していない）場合は、クイズへ案内する
  if (!myPlayer || !myPlayer.pokemon_type) {
    return (
      <main className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
        <article style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.4rem' }}>あなたの診断結果が見つかりませんでした 🤔</h1>
          <p style={{ color: '#666' }}>
            {hostPlayer ? `${hostPlayer.name}さんの部屋で、まずは診断に答えてみよう！` : 'お部屋が見つかりませんでした。'}
          </p>
          <Link href={hostPlayer ? `/room/${roomId}/quiz` : '/'} role="button">
            {hostPlayer ? '診断に参加する' : 'トップへ戻る'}
          </Link>
        </article>
      </main>
    );
  }

  // カラム名を pokemon_type に完全統一
  const myFinalType = myPlayer ? myPlayer.pokemon_type : 'normal';
  const hostType = hostPlayer?.pokemon_type || '';

  // 自分自身がホスト（部屋主）かどうかの判定フラグ
  const isHost = myPlayer?.id === hostPlayer?.id;

  // 🏆 自分がホスト（部屋主）の場合に、友達を「相性が良い順番」にソートするロジック
  const getSortedFriends = () => {
    // まだ回答し終わっていない（pokemon_typeが空の）友達はランキングから外す
    const friends = allPlayers.slice(1).filter((player) => player.pokemon_type);

    const priority = {
      'こうかはばつぐんだ！(最高のパートナー)': 4,
      'ふつうの相性のようだ。(安定した居心地の良さ)': 3,
      'こうかはいまひとつのようだ…(すれ違いライバル)': 2,
      'こうかがないようだ…(未知の宇宙人関係)': 1
    };

    return friends.sort((a, b) => {
      const resA = checkCompatibility(myFinalType, a.pokemon_type);
      const resB = checkCompatibility(myFinalType, b.pokemon_type);
      return (priority[resB] || 0) - (priority[resA] || 0);
    });
  };

  const sortedFriends = getSortedFriends();
  return (
    <main className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
      <article style={{ textAlign: 'center' }}>
        <header>
          <h1>🎉 診断結果 🎉</h1>
          <h2>{myPlayer?.name} さんのタイプは...</h2>
          {/* 🎯 マークタグ：ここに自分のタイプが表示されます */}
          <mark style={{ fontSize: '2rem', padding: '0.2rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
            【 {myFinalType ? myFinalType.toUpperCase() : '???'} タイプ 】
          </mark>
        </header>

        {/* 📋 【新設】性格の詳細解説文章を表示するエリア（マークタグのすぐ下） */}
        {TYPE_DESCRIPTIONS[myFinalType] && (
          <section style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '12px', textAlign: 'left', borderLeft: '5px solid #28a745' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.15rem', fontWeight: 'bold' }}>
              🌟 性格の特徴: {TYPE_DESCRIPTIONS[myFinalType].catchphrase}
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', lineHeight: '1.6' }}>
              {TYPE_DESCRIPTIONS[myFinalType].detail}
            </p>
          </section>
        )}

        {/* 🔴 ポケモンAPIから取得したランダム2匹を表示するエリア */}
        <section style={{ marginTop: '2.5rem' }}>
          <h3>✨ こんなポケモンたちがいるよ！</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            {pokemons.map((poke, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: '#f9f9f9', width: '45%' }}>
                {poke.image ? (
                  <img src={poke.image} alt={poke.name} style={{ width: '120px', height: '120px' }} />
                ) : (
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❓</div>
                )}
                <p style={{ fontWeight: 'bold', margin: '0.5rem 0 0 0', textTransform: 'capitalize' }}>{poke.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 👥 友達（2人目以降）との相性ランキングを表示するエリア */}
        <section style={{ marginTop: '3rem', textAlign: 'left' }}>
          <h3>👥 相性チェック</h3>
          
          {/* 🛡️ 自分がホストではない場合（2人目以降の友達の場合） */}
          {!isHost ? (
            <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', color: '#0d47a1' }}>
              <div>
                <strong>{hostPlayer?.name} さん（{hostType ? hostType.toUpperCase() : '???'} タイプ）との相性は...</strong>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#28a745' }}>
                {hostType ? checkCompatibility(myFinalType, hostType) : `${hostPlayer?.name} さんがまだ回答中みたい。あとでもう一度見てね！`}
              </div>
            </div>
          ) : (
            /* 👑 自分がホスト（部屋主）だった場合のみ、相性ランキング一覧と招待ボタンを表示 */
            <>
              {sortedFriends.length === 0 ? (
                <div style={{ padding: '1.5rem', background: '#f4f4f4', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>まだあなた以外の回答者がいません。</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    下のボタンを押して招待リンクをコピーし、友達に送って診断に答えてもらいましょう！
                  </p>
                </div>
              ) : (
                <ol style={{ paddingLeft: '1.2rem' }}>
                  {sortedFriends.map((friend, rankIndex) => {
                    const friendType = friend.pokemon_type;
                    const compatibilityResult = checkCompatibility(myFinalType, friendType);

                    const isBest = compatibilityResult.includes('ばつぐん');

                    return (
                      <li key={friend.id} style={{ marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>
                            <strong>{rankIndex + 1}位: {friend.name} さん</strong> ({friendType.toUpperCase()}タイプ)
                          </span>
                          {isBest && <span style={{ fontSize: '1.2rem' }}>👑</span>}
                        </div>
                        <div style={{ fontWeight: 'bold', color: isBest ? '#d32f2f' : '#28a745', marginTop: '0.2rem', fontSize: '1.05rem' }}>
                          {compatibilityResult}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/room/${roomId}/quiz`;
                  navigator.clipboard.writeText(shareUrl);
                  alert('招待リンクをコピーしたよ！友達にLINEなどで送ってね。');
                }}
                style={{ width: '100%', marginTop: '1rem', background: '#28a745', border: 'none', fontWeight: 'bold', color: '#fff' }}
              >
                リンクをコピーして友達を招待する
              </button>
            </>
          )}
        </section>
      </article>
    </main>
  );
}
