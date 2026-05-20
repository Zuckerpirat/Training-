import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomeView from './views/HomeView';
import PlanView from './views/PlanView';
import WorkoutView from './views/WorkoutView';
import ProgressView from './views/ProgressView';
import ProfileView from './views/ProfileView';

export default function App() {
  const view = useStore(s => s.view);
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      className="min-h-screen mx-auto flex flex-col"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        maxWidth: 480,
        minHeight: '100dvh',
      }}
    >
      <Header />
      <main
        key={view}
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ paddingBottom: 80 }}
      >
        {view === 'home' && <HomeView />}
        {view === 'plan' && <PlanView />}
        {view === 'workout' && <WorkoutView />}
        {view === 'progress' && <ProgressView />}
        {view === 'profile' && <ProfileView />}
      </main>
      <BottomNav />
    </div>
  );
}
