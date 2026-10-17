// サーバー用のファイルから、動く中身（HomeClient）を呼び出すだけにする
import HomeClient from './HomeClient';

export default function HomePage() {
  return <HomeClient />;
}
