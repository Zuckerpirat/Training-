import { Play, Pencil, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ACCENT_VAR } from '../constants/plan';
import WeekStrip from '../components/plan/WeekStrip';
import DayTabs from '../components/plan/DayTabs';
import ExerciseCard from '../components/plan/ExerciseCard';
import AddExerciseForm from '../components/plan/AddExerciseForm';

export default function PlanView() {
  const plan = useStore(s => s.plan);
  const selPlan = useStore(s => s.selPlan);
  const editMode = useStore(s => s.editMode);
  const addExForm = useStore(s => s.addExForm);
  const toggleEdit = useStore(s => s.toggleEdit);
  const startWorkout = useStore(s => s.startWorkout);
  const showAddEx = useStore(s => s.showAddEx);

  const day = plan[selPlan];
  const accent = ACCENT_VAR[selPlan] || 'var(--push)';

  return (
    <div className="slide-up">
      <WeekStrip accent={accent} />
      <DayTabs />

      <div style={{ padding: '16px 18px' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-bold tracking-tight" style={{ fontSize: 22, color: accent }}>
              {day.lb} DAY
            </div>
            <div className="mt-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {day.sub}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleEdit}
              className="rounded-lg transition-all active:scale-95 flex items-center gap-1.5 font-bold cursor-pointer"
              style={{
                padding: '8px 12px', fontSize: 11,
                border: `1px solid ${editMode ? accent : 'var(--border)'}`,
                background: editMode ? `color-mix(in oklab, ${accent} 15%, transparent)` : 'transparent',
                color: editMode ? accent : 'var(--text-muted)',
              }}
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => startWorkout(selPlan)}
              className="rounded-lg transition-all active:scale-95 flex items-center gap-1.5 font-bold cursor-pointer"
              style={{
                padding: '8px 14px', fontSize: 12,
                background: accent, color: '#fff', border: 'none',
                boxShadow: `0 4px 14px color-mix(in oklab, ${accent} 35%, transparent)`,
              }}
            >
              <Play size={12} fill="#fff" /> Start
            </button>
          </div>
        </div>

        {day.ex.map((ex, i) => (
          <ExerciseCard key={ex.id} ex={ex} index={i} accent={accent} />
        ))}

        {addExForm === selPlan && <AddExerciseForm accent={accent} />}

        <button
          onClick={showAddEx}
          className="w-full rounded-xl mt-1 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          style={{
            padding: 14,
            border: `1px dashed color-mix(in oklab, ${accent} 40%, var(--border))`,
            background: `color-mix(in oklab, ${accent} 5%, transparent)`,
            color: accent, fontSize: 12, fontWeight: 700,
          }}
        >
          <Plus size={14} /> Übung hinzufügen
        </button>
      </div>
    </div>
  );
}
