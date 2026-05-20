import { create } from 'zustand';
import { DEFAULT_PLAN } from '../constants/plan';
import { LS } from '../utils/storage';
import { dk, sk, uid } from '../utils/dates';
import type { Plan, Profile, SchedKey, SessionData, SetEntry, ThemeKey } from '../types';

type ViewKey = 'home' | 'plan' | 'workout' | 'progress' | 'profile';

function loadPlan(): Plan {
  return LS.getJ<Plan>('plan') || (JSON.parse(JSON.stringify(DEFAULT_PLAN)) as Plan);
}
function loadProfile(): Profile {
  return (
    LS.getJ<Profile>('profile') || {
      name: '',
      age: 28,
      weight: 101,
      height: 191,
      goal: 'cut',
      kcal: { cut: 2000, maintain: 2500, bulk: 2900 },
    }
  );
}
export function loadBests(): Record<string, number> {
  const b: Record<string, number> = {};
  LS.keys('sess_').forEach(k => {
    try {
      const d = LS.getJ<SessionData>(k) || ({} as SessionData);
      Object.entries(d.sets || {}).forEach(([n, sets]) => {
        const mx = Math.max(...sets.map(s => parseFloat(s.w) || 0));
        if (mx > 0 && (!b[n] || mx > b[n])) b[n] = mx;
      });
    } catch {}
  });
  return b;
}
function loadInlineData(type: string): Record<string, SetEntry[]> {
  try {
    const r = LS.getJ<SessionData>(sk(dk(), type));
    return r?.sets || {};
  } catch { return {}; }
}

const prefs = LS.getJ<{ theme?: ThemeKey; sched?: SchedKey }>('prefs') || {};

interface StoreState {
  theme: ThemeKey;
  sched: SchedKey;
  view: ViewKey;
  plan: Plan;
  selPlan: string;
  openEx: string | null;
  editMode: boolean;
  addExForm: string | null;
  inline: Record<string, SetEntry[]>;
  inlineType: string;
  wkOn: boolean;
  wkType: string;
  wkSets: Record<string, SetEntry[]>;
  wkDate: string;
  saved: boolean;
  progEx: string;
  profile: Profile;
  editProfile: boolean;
  profileDraft: Partial<Profile>;
  bests: Record<string, number>;

  setTheme(t: ThemeKey): void;
  setSched(s: SchedKey): void;
  setView(v: ViewKey): void;
  setSelPlan(k: string): void;
  toggleEdit(): void;
  toggleEx(id: string): void;
  removeEx(type: string, id: string): void;
  showAddEx(): void;
  cancelAddEx(): void;
  confirmAddEx(data: { n: string; g: string; s: number; r: string }): void;
  addInlineSet(name: string): void;
  removeInlineSet(name: string, i: number): void;
  updateInlineSet(name: string, i: number, field: 'w' | 'r', v: string): void;
  startWorkout(type: string): void;
  addWkSet(name: string): void;
  removeWkSet(name: string, i: number): void;
  updateWkSet(name: string, i: number, field: 'w' | 'r', v: string): void;
  finishWorkout(): void;
  cancelWorkout(): void;
  setProgEx(n: string): void;
  startEditProfile(): void;
  cancelEditProfile(): void;
  saveProfile(draft: Partial<Profile> & { kcal?: Partial<Profile['kcal']> }): void;
  setGoal(g: Profile['goal']): void;
  resetAllData(): void;
  refreshBests(): void;
}

function persistPrefs(theme: ThemeKey, sched: SchedKey): void {
  LS.set('prefs', { theme, sched });
}

function persistInline(type: string, sets: Record<string, SetEntry[]>): void {
  LS.set(sk(dk(), type), { type, dateKey: dk(), sets, ts: Date.now() });
}

export const useStore = create<StoreState>((set, get) => ({
  theme: prefs.theme || 'dark',
  sched: prefs.sched || 'A',
  view: 'home',
  plan: loadPlan(),
  selPlan: 'upper',
  openEx: null,
  editMode: false,
  addExForm: null,
  inline: loadInlineData('upper'),
  inlineType: 'upper',
  wkOn: false,
  wkType: 'upper',
  wkSets: {},
  wkDate: '',
  saved: false,
  progEx: 'Brustpresse Maschine',
  profile: loadProfile(),
  editProfile: false,
  profileDraft: {},
  bests: loadBests(),

  setTheme(t) {
    set({ theme: t });
    persistPrefs(t, get().sched);
  },
  setSched(s) {
    set({ sched: s });
    persistPrefs(get().theme, s);
  },
  setView(v) {
    const s = get();
    if (v === 'plan') {
      set({ inlineType: s.selPlan, inline: loadInlineData(s.selPlan) });
    }
    set({ view: v });
  },
  setSelPlan(k) {
    set({ selPlan: k, openEx: null, inlineType: k, inline: loadInlineData(k) });
  },
  toggleEdit() {
    set(s => ({ editMode: !s.editMode, openEx: null, addExForm: null }));
  },
  toggleEx(id) {
    const s = get();
    const open = s.openEx === id ? null : id;
    const ex = s.plan[s.selPlan].ex.find(e => e.id === id);
    let inline = s.inline;
    if (open && ex && !inline[ex.n]) {
      inline = { ...inline, [ex.n]: [{ w: '', r: '' }] };
    }
    set({ openEx: open, inline });
  },
  removeEx(type, id) {
    const plan = { ...get().plan };
    plan[type] = { ...plan[type], ex: plan[type].ex.filter(e => e.id !== id) };
    set({ plan });
    LS.set('plan', plan);
  },
  showAddEx() {
    set(s => ({ addExForm: s.selPlan, editMode: false }));
  },
  cancelAddEx() {
    set({ addExForm: null });
  },
  confirmAddEx({ n, g, s, r }) {
    if (!n) return;
    const st = get();
    const plan = { ...st.plan };
    plan[st.selPlan] = {
      ...plan[st.selPlan],
      ex: [...plan[st.selPlan].ex, { id: uid(), n, g: g || 'Sonstige', s: s || 3, r: r || '10–12' }],
    };
    set({ plan, addExForm: null });
    LS.set('plan', plan);
  },
  addInlineSet(name) {
    const st = get();
    const inline = { ...st.inline };
    if (!inline[name]) inline[name] = [];
    inline[name] = [...inline[name], { w: '', r: '' }];
    set({ inline });
    persistInline(st.inlineType, inline);
  },
  removeInlineSet(name, i) {
    const st = get();
    const inline = { ...st.inline };
    if (!inline[name]) return;
    inline[name] = inline[name].filter((_, ix) => ix !== i);
    set({ inline });
    persistInline(st.inlineType, inline);
  },
  updateInlineSet(name, i, field, v) {
    const st = get();
    const inline = { ...st.inline };
    if (!inline[name]) inline[name] = [];
    const list = [...inline[name]];
    while (list.length <= i) list.push({ w: '', r: '' });
    list[i] = { ...list[i], [field]: v };
    inline[name] = list;
    set({ inline });
    persistInline(st.inlineType, inline);
  },
  startWorkout(type) {
    const st = get();
    const wkSets: Record<string, SetEntry[]> = {};
    st.plan[type].ex.forEach(ex => { wkSets[ex.n] = [{ w: '', r: '' }]; });
    set({ wkType: type, wkDate: dk(), wkOn: true, saved: false, wkSets, view: 'workout' });
  },
  addWkSet(name) {
    const wkSets = { ...get().wkSets };
    if (!wkSets[name]) wkSets[name] = [];
    wkSets[name] = [...wkSets[name], { w: '', r: '' }];
    set({ wkSets });
  },
  removeWkSet(name, i) {
    const wkSets = { ...get().wkSets };
    if (!wkSets[name]) return;
    wkSets[name] = wkSets[name].filter((_, ix) => ix !== i);
    set({ wkSets });
  },
  updateWkSet(name, i, field, v) {
    const wkSets = { ...get().wkSets };
    if (!wkSets[name]) wkSets[name] = [];
    const list = [...wkSets[name]];
    while (list.length <= i) list.push({ w: '', r: '' });
    list[i] = { ...list[i], [field]: v };
    wkSets[name] = list;
    set({ wkSets });
  },
  finishWorkout() {
    const st = get();
    LS.set(sk(st.wkDate, st.wkType), {
      type: st.wkType, dateKey: st.wkDate, sets: st.wkSets, ts: Date.now(),
    });
    set({ bests: loadBests(), saved: true });
    setTimeout(() => {
      set({ wkOn: false, saved: false, view: 'home' });
    }, 1400);
  },
  cancelWorkout() {
    set({ wkOn: false, saved: false });
  },
  setProgEx(n) { set({ progEx: n }); },
  startEditProfile() {
    set(s => ({ editProfile: true, profileDraft: JSON.parse(JSON.stringify(s.profile)) }));
  },
  cancelEditProfile() { set({ editProfile: false }); },
  saveProfile(draft) {
    const st = get();
    const profile: Profile = {
      ...st.profile,
      ...draft,
      kcal: { ...st.profile.kcal, ...(draft.kcal || {}) },
    };
    set({ profile, editProfile: false });
    LS.set('profile', profile);
  },
  setGoal(g) {
    const profile = { ...get().profile, goal: g };
    set({ profile });
    LS.set('profile', profile);
  },
  resetAllData() {
    LS.clear();
    location.reload();
  },
  refreshBests() {
    set({ bests: loadBests() });
  },
}));
