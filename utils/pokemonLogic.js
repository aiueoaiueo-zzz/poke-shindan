// 1. 18問の質問と、選択肢（A〜D）に対応する確定タイプマトリクスデータ
const QUESTIONS = [
  // --- NT型セクション ---
  { id: 1, choices: { A: 'fire', B: 'ice', C: 'grass', D: 'electric' } },
  { id: 2, choices: { A: 'rock', B: 'fighting', C: 'poison', D: 'flying' } },
  { id: 3, choices: { A: 'fire', B: 'steel', C: 'ghost', D: 'electric' } },
  { id: 4, choices: { A: 'fire', B: 'steel', C: 'bug', D: 'poison' } },
  // --- NF型セクション ---
  { id: 5, choices: { A: 'ghost', B: 'dragon', C: 'flying', D: 'bug' } },
  { id: 6, choices: { A: 'fighting', B: 'steel', C: 'fairy', D: 'psychic' } },
  { id: 7, choices: { A: 'flying', B: 'grass', C: 'electric', D: 'water' } },
  { id: 8, choices: { A: 'fire', B: 'ice', C: 'psychic', D: 'flying' } },
  // --- SJ型セクション ---
  { id: 9, choices: { A: 'water', B: 'fighting', C: 'fairy', D: 'bug' } },
  { id: 10, choices: { A: 'dragon', B: 'fire', C: 'rock', D: 'ice' } },
  { id: 11, choices: { A: 'fighting', B: 'steel', C: 'rock', D: 'ice' } },
  { id: 12, choices: { A: 'ghost', B: 'rock', C: 'poison', D: 'electric' } },
  // --- SP型セクション ---
  { id: 13, choices: { A: 'bug', B: 'poison', C: 'ground', D: 'fairy' } },
  { id: 14, choices: { A: 'water', B: 'electric', C: 'ground', D: 'ghost' } },
  { id: 15, choices: { A: 'dark', B: 'steel', C: 'water', D: 'grass' } },
  { id: 16, choices: { A: 'ground', B: 'ghost', C: 'rock', D: 'water' } },
  // --- 特別枠セクション ---
  { id: 17, choices: { A: 'normal', B: 'dark', C: 'steel', D: 'psychic' } },
  { id: 18, choices: { A: 'steel', B: 'rock', C: 'normal', D: 'dark' } }
];

/**
 * ユーザーの回答（A〜Dの配列）から、最も点数の高いタイプを計算する関数
 * @param {string[]} userAnswers - 例: ['A', 'C', 'B', 'D', ...] （18個の要素が入った配列）
 * @returns {string} 確定したタイプ名（例: 'fire'）
 */
export function calculatePokemonType(userAnswers) {
  if (!userAnswers || !Array.isArray(userAnswers) || userAnswers.length < 18) {
    return 'normal';
  }

  // 【ステップ1】すべてのタイプを0点で初期化
  const scores = {
    normal: 0, fire: 0, water: 0, electric: 0, grass: 0, ice: 0,
    fighting: 0, poison: 0, ground: 0, flying: 0, psychic: 0, bug: 0,
    rock: 0, ghost: 0, dragon: 0, dark: 0, steel: 0, fairy: 0
  };

  // 【ステップ2】ユーザーの回答を1問ずつチェックして点数を足す
  userAnswers.forEach((answer, index) => {
    const question = QUESTIONS[index];
    if (question && question.choices && question.choices[answer]) {
      const selectedType = question.choices[answer];
      scores[selectedType] += 1;
    }
  });

  // 【ステップ3】一番点数が高かったタイプを見つける
  let highestType = 'normal';
  let highestScore = -1;

  for (const [type, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      highestType = type;
    }
  }

  return highestType;
}
// 2. 18×18のMBTIベース相性マトリクスデータ（1人目のタイプから見た2人目への相性関係）
const COMPATIBILITY_CHART = {
  steel: { steel: 'ふつう', electric: 'ばつぐん', fire: 'いまひとつ', poison: 'ばつぐん', grass: 'ふつう', fairy: 'いまひとつ', psychic: 'ふつう', flying: 'ばつぐん', rock: 'ばつぐん', ice: 'ふつう', fighting: 'いまひとつ', bug: 'いまひとつ', ground: 'ふつう', ghost: 'ふつう', dark: 'ふつう', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  electric: { steel: 'ばつぐん', electric: 'ふつう', fire: 'ふつう', poison: 'ふつう', grass: 'いまひとつ', fairy: 'ふつう', psychic: 'ふつう', flying: 'ばつぐん', rock: 'いまひとつ', ice: 'ふつう', fighting: 'ふつう', bug: 'ふつう', ground: 'ばつぐん', ghost: 'ふつう', dark: 'ふつう', water: 'ばつぐん', dragon: 'ばつぐん', normal: 'ふつう' },
  fire: { steel: 'いまひとつ', electric: 'ふつう', fire: 'ふつう', poison: 'ふつう', grass: 'ばつぐん', fairy: 'ばつぐん', psychic: 'ばつぐん', flying: 'いまひとつ', rock: 'いまひとつ', ice: 'ばつぐん', fighting: 'ばつぐん', bug: 'ふつう', ground: 'いまひとつ', ghost: 'いまひとつ', dark: 'ばつぐん', water: 'いまひとつ', dragon: 'ばつぐん', normal: 'ふつう' },
  poison: { steel: 'ばつぐん', electric: 'ふつう', fire: 'ばつぐん', poison: 'ふつう', grass: 'いまひとつ', fairy: 'ばつぐん', psychic: 'いまひとつ', flying: 'ばつぐん', rock: 'ふつう', ice: 'いまひとつ', fighting: 'ふつう', bug: 'ふつう', ground: 'ふつう', ghost: 'ばつぐん', dark: 'ばつぐん', water: 'ふつう', dragon: 'ふつう', normal: 'ふつう' },
  grass: { steel: 'ふつう', electric: 'いまひとつ', fire: 'ばつぐん', poison: 'いまひとつ', grass: 'ふつう', fairy: 'ばつぐん', psychic: 'ふつう', flying: 'ばつぐん', rock: 'ふつう', ice: 'ばつぐん', fighting: 'ふつう', bug: 'いまひとつ', ground: 'いまひとつ', ghost: 'ふつう', dark: 'いまひとつ', water: 'ばつぐん', dragon: 'ばつぐん', normal: 'ふつう' },
  fairy: { steel: 'いまひとつ', electric: 'ふつう', fire: 'ばつぐん', poison: 'ばつぐん', grass: 'ばつぐん', fairy: 'ふつう', psychic: 'ばつぐん', flying: 'ふつう', rock: 'いまひとつ', ice: 'ばつぐん', fighting: 'いまひとつ', bug: 'いまひとつ', ground: 'ふつう', ghost: 'ふつう', dark: 'いまひとつ', water: 'ばつぐん', dragon: 'ばつぐん', normal: 'ふつう' },
  psychic: { steel: 'ふつう', electric: 'いまひとつ', fire: 'ばつぐん', poison: 'いまひとつ', grass: 'ふつう', fairy: 'ばつぐん', psychic: 'ふつう', flying: 'ばつぐん', rock: 'ばつぐん', ice: 'ばつぐん', fighting: 'いまひとつ', bug: 'ばつぐん', ground: 'いまひとつ', ghost: 'いまひとつ', dark: 'なし', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  flying: { steel: 'ばつぐん', electric: 'ばつぐん', fire: 'いまひとつ', poison: 'ばつぐん', grass: 'ばつぐん', fairy: 'ふつう', psychic: 'ばつぐん', flying: 'ふつう', rock: 'いまひとつ', ice: 'ばつぐん', fighting: 'いまひとつ', bug: 'ばつぐん', ground: 'ふつう', ghost: 'ばつぐん', dark: 'ふつう', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  rock: { steel: 'ばつぐん', electric: '本気', fire: 'いまひとつ', poison: 'いまひとつ', grass: 'ふつう', fairy: 'いまひとつ', psychic: 'ばつぐん', flying: 'いまひとつ', rock: 'ふつう', ice: 'ばつぐん', fighting: 'ばつぐん', bug: 'ばつぐん', ground: 'ふつう', ghost: 'いまひとつ', dark: 'ふつう', water: 'いまひとつ', dragon: 'ふつう', normal: 'ふつう' },
  ice: { steel: 'ふつう', electric: 'ふつう', fire: 'ばつぐん', poison: 'いまひとつ', grass: 'ふつう', fairy: 'ばつぐん', psychic: 'ばつぐん', flying: 'ばつぐん', rock: 'ばつぐん', ice: 'ふつう', fighting: 'ばつぐん', bug: 'ばつぐん', ground: 'いまひとつ', ghost: 'いまひとつ', dark: 'いまひとつ', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  fighting: { steel: 'いまひとつ', electric: 'いまひとつ', fire: 'ばつぐん', poison: 'ふつう', grass: 'ふつう', fairy: 'いまひとつ', psychic: 'いまひとつ', flying: 'いまひとつ', rock: 'ばつぐん', ice: 'ばつぐん', fighting: 'ふつう', bug: 'ばつぐん', ground: 'ふつう', ghost: 'なし', dark: 'ばつぐん', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  bug: { steel: 'いまひとつ', electric: 'ふつう', fire: 'いまひとつ', poison: 'ふつう', grass: 'いまひとつ', fairy: 'いまひとつ', psychic: 'ばつぐん', flying: 'ばつぐん', rock: 'ばつぐん', ice: 'ばつぐん', fighting: 'ばつぐん', bug: 'ふつう', ground: 'いまひとつ', ghost: 'いまひとつ', dark: 'ふつう', water: 'ばつぐん', dragon: 'ふつう', normal: 'ふつう' },
  ground: { steel: 'ふつう', electric: 'ばつぐん', fire: 'いまひとつ', poison: 'ふつう', grass: 'いまひとつ', fairy: 'ふつう', psychic: 'いまひとつ', flying: 'ふつう', rock: 'ふつう', ice: 'いまひとつ', fighting: 'ふつう', bug: 'いまひとつ', ground: 'ふつう', ghost: 'ふつう', dark: 'ばつぐん', water: 'ふつう', dragon: 'ふつう', normal: 'ふつう' },
  ghost: { steel: 'ばつぐん', electric: 'ふつう', fire: 'いまひとつ', poison: 'ばつぐん', grass: 'ふつう', fairy: 'ふつう', psychic: 'いまひとつ', flying: 'ばつぐん', rock: 'いまひとつ', ice: 'いまひとつ', fighting: 'なし', bug: 'いまひとつ', ground: 'ふつう', ghost: 'ふつう', dark: 'ばつぐん', water: '⁪ばつぐん', dragon: '⁪ばつぐん', normal: 'ふつう' },
  dark: { steel: 'いまひとつ', electric: 'ふつう', fire: 'ばつぐん', poison: 'ばつぐん', grass: 'いまひとつ', fairy: 'いまひとつ', psychic: 'なし', flying: 'いまひとつ', rock: 'ふつう', ice: 'いまひとつ', fighting: 'ばつぐん', bug: 'ふつう', ground: 'ふつう', ghost: 'ばつぐん', dark: 'ふつう', water: 'ばつぐん', dragon: 'ふつう', normal: 'ふつう' },
  water: { steel: 'いまひとつ', electric: 'ばつぐん', fire: 'いまひとつ', poison: 'ふつう', grass: 'ふつう', fairy: 'ばつぐん', psychic: 'ふつう', flying: 'ふつう', rock: 'いまひとつ', ice: 'ふつう', fighting: 'ふつう', bug: 'ばつぐん', ground: 'ふつう', ghost: 'ばつぐん', dark: 'ばつぐん', water: 'ふつう', dragon: 'ふつう', normal: 'ふつう' },
  dragon: { steel: 'ばつぐん', electric: 'ふつう', fire: 'ばつぐん', poison: 'ふつう', grass: 'ばつぐん', fairy: 'ばつぐん', psychic: 'ばつぐん', flying: 'ばつぐん', rock: 'ふつう', ice: 'ふつう', fighting: 'ふつう', bug: 'ふつう', ground: 'ふつう', ghost: 'ふつう', dark: 'ふつう', water: 'ふつう', dragon: 'ばつぐん', normal: 'ふつう' },
  normal: { steel: 'ふつう', electric: 'ふつう', fire: 'ふつう', poison: 'ふつう', grass: 'ふつう', fairy: 'ふつう', psychic: 'ふつう', flying: 'ふつう', rock: 'ふつう', ice: 'ふつう', fighting: 'ふつう', bug: 'ふつう', ground: 'ふつう', ghost: 'ふつう', dark: 'ふつう', water: 'ふつう', dragon: 'ふつう', normal: 'ふつう' }
};

/**
 * 2人のタイプ名から相性の結果（ステータス）を返す関数（日本語・英語どちらも対応）
 * @param {string} type1 - 1人目のタイプ 例: 'ほのお' または 'fire'
 * @param {string} type2 - 2人目のタイプ 例: 'くさ' または 'grass'
 * @returns {string} 相性の結果テキスト
 */
export function checkCompatibility(type1, type2) {
  if (!type1 || !type2) return 'ふつうの相性のようだ。(安定した居心地の良さ)';

  // 日本語名から英語キーへの変換マップ
  const typeTranslation = {
    'ノーマル': 'normal', 'ドラゴン': 'dragon', 'はがね': 'steel', 'でんき': 'electric',
    'ほのお': 'fire', 'どく': 'poison', 'くさ': 'grass', 'フェアリー': 'fairy',
    'エスパー': 'psychic', 'ひこう': 'flying', 'いわ': 'rock', 'こおり': 'ice',
    'かくとう': 'fighting', 'むし': 'bug', 'じめん': 'ground', 'ゴースト': 'ghost',
    'あく': 'dark', 'みず': 'water'
  };

  const raw1 = String(type1).trim();
  const raw2 = String(type2).trim();

  // 日本語なら英語へ置換、英語なら小文字に統一
  const t1 = typeTranslation[raw1] || raw1.toLowerCase();
  const t2 = typeTranslation[raw2] || raw2.toLowerCase();

  // 1人目から見た2人目の相性関係をチャートから引く
  const relation = COMPATIBILITY_CHART[t1]?.[t2];

  // データに基づいて、テキストを分岐
  if (relation === 'ばつぐん') {
    return 'こうかはばつぐんだ！(最高のパートナー)';
  } else if (relation === 'いまひとつ') {
    return 'こうかはいまひとつのようだ…(すれ違いライバル)';
  } else if (relation === 'なし') {
    return 'こうかがないようだ…(未知の宇宙人関係)';
  } else {
    return 'ふつうの相性のようだ。(安定した居心地の良さ)';
  }
}

/**
 * 指定したタイプのポケモン一覧をPokeAPIから取得し、ランダムに2匹選んで返す関数
 * （通信エラー時やローカルネットワークブロック時はピカチュウとイーブイの安全データを返します）
 */
export async function getRandomPokemonsByType(typeName) {
  try {
    if (!typeName) throw new Error('タイプ名が指定されていません');
    
    // 日本語タイプ名を英語に変換するマップ
    const typeTranslation = {
      'ノーマル': 'normal', 'ドラゴン': 'dragon', 'はがね': 'steel', 'でんき': 'electric',
      'ほのお': 'fire', 'どく': 'poison', 'くさ': 'grass', 'フェアリー': 'fairy',
      'エスパー': 'psychic', 'ひこう': 'flying', 'いわ': 'rock', 'こおり': 'ice',
      'かくとう': 'fighting', 'むし': 'bug', 'じめん': 'ground', 'ゴースト': 'ghost',
      'あく': 'dark', 'みず': 'water'
    };

    const rawType = String(typeName).trim();
    const cleanType = typeTranslation[rawType] || rawType.toLowerCase();

    // 1. 正しいEnd点URLでfetchを実行
    const response = await fetch(`https://pokeapi.co{cleanType}`);
    
    if (!response.ok) throw new Error('APIの取得に失敗しました');
    const data = await response.json();

    const pokemonList = data.pokemon;
    if (!pokemonList || pokemonList.length === 0) throw new Error('ポケモンリストが空です');

    // 2. ランダムに2つの要素を重複なしでピックアップ
    const selectedPokemons = [];
    const usedIndexes = new Set();
    const maxPick = Math.min(2, pokemonList.length);

    while (selectedPokemons.length < maxPick) {
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      if (!usedIndexes.has(randomIndex)) {
        usedIndexes.add(randomIndex);
        selectedPokemons.push(pokemonList[randomIndex].pokemon);
      }
    }

    // 3. それぞれの詳細情報から画像(front_default)を解決
    const result = await Promise.all(
      selectedPokemons.map(async (poke) => {
        const detailResponse = await fetch(poke.url);
        if (!detailResponse.ok) throw new Error('詳細データの取得に失敗');
        const detailData = await detailResponse.json();
        return {
          name: detailData.name,
          image: detailData.sprites.front_default || "https://githubusercontent.com"
        };
      })
    );

    return result;

  } catch (error) {
    console.warn('PokeAPIへの通信が失敗またはブロックされたため、身代わりデータを返却します:', error);
    
    // 🛡️【安全フォールバック】本家公式スプライトの完全なピカチュウとイーブイ画像パスを指定
    return [
      {
        name: "pikachu (代理データ)",
        image: "https://githubusercontent.com"
      },
      {
        name: "eevee (代理データ)",
        image: "https://githubusercontent.com"
      }
    ];
  }
}
