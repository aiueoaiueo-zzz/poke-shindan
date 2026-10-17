'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';

export default function HomeClient() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) {
      alert('あなたのお名前（ニックネーム）を入力してね！');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. 🚪 roomsテーブルに新しい部屋を作成
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .insert([{}])
        .select()
        .single();

      if (roomError) throw roomError;

      const roomId = roomData.id;

      // 2. 👑 部屋を作った人を「ホスト（1人目）」としてplayersテーブルに登録
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .insert([
          {
            room_id: roomId,
            name: hostName.trim(),
            answers: [],
            pokemon_type: 'normal' 
          }
        ])
        .select()
        .single();

      if (playerError) throw playerError;

      // 🎯【ホストも解答する修正】
      // 部屋を作ったら結果画面ではなく、まずクイズ画面（/quiz）へ進みます。
      // その際、自分がホストであることを引き継ぐために、URLの末尾に「?p_id=\${playerData.id}」をくっつけて送ります。
      router.push(`/room/${roomId}/quiz?p_id=${playerData.id}`);

    } catch (err) {
      console.error('部屋の作成に失敗しました:', err);
      alert('部屋の作成中にエラーが発生しました。Supabaseの接続設定等を確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: '600px' }}>
      <article style={{ textAlign: 'center' }}>
        <header>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ポロック相性診断アプリ 🎮
          </h1>
          <p style={{ color: '#666' }}>
            もしもポケモン世界に迷い込んだら？18タイプであなたの性格と友達との相性を診断！
          </p>
        </header>

        <form onSubmit={handleCreateRoom} style={{ marginTop: '2rem', textAlign: 'left' }}>
          <label htmlFor="hostNameInput">
            <strong>あなたのニックネーム（部屋主）</strong>
            <input
              type="text"
              id="hostNameInput"
              placeholder="例：サトシ"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              disabled={isSubmitting}
              style={{ marginTop: '0.5rem' }}
            />
          </label>
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', fontWeight: 'bold' }}
          >
            {isSubmitting ? 'お部屋を準備中...' : '新しく部屋を作って相性診断をはじめる'}
          </button>
        </form>
      </article>
    </main>
  );
}
