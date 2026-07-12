import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const INITIAL_PANTRY = [
  { id: 'p1', name: 'Cajun spice', category: 'Spices', inStock: true },
  { id: 'p2', name: 'Beef spice', category: 'Spices', inStock: true },
  { id: 'p3', name: 'Rosemary', category: 'Spices', inStock: true },
  { id: 'p4', name: 'Thyme', category: 'Spices', inStock: true },
  { id: 'p5', name: 'Red pepper flakes', category: 'Spices', inStock: true },
  { id: 'p6', name: 'Black pepper', category: 'Spices', inStock: true },
  { id: 'p7', name: 'Smoked paprika', category: 'Spices', inStock: false },
  { id: 'p8', name: 'Cumin', category: 'Spices', inStock: false },
  { id: 'p9', name: 'Salt', category: 'Spices', inStock: true },
  { id: 'p10', name: 'Soy sauce', category: 'Sauces', inStock: true },
  { id: 'p11', name: 'Sriracha', category: 'Sauces', inStock: true },
  { id: 'p12', name: 'Worcestershire sauce', category: 'Sauces', inStock: false },
  { id: 'p13', name: 'Olive oil', category: 'Oils', inStock: true },
  { id: 'p14', name: 'Butter', category: 'Dairy', inStock: true },
  { id: 'p15', name: 'Garlic butter', category: 'Dairy', inStock: true },
];

const RECIPES = [
  {
    id: 1, name: 'Cajun Chicken + Rice', time: '25 min', difficulty: 'Easy',
    tags: ['Quick', 'Weekday', 'Batch cook'], isWeekend: false,
    ingredients: ['Chicken thighs x2 packs', 'Rice', 'Garlic', 'Olive oil', 'Lemon'],
    steps: [
      'Toast rice in olive oil for 2 min. Add water (2:1 ratio), bring to boil then cover and simmer on lowest heat for 18 min. Rest covered 5 min off heat.',
      'Season chicken with cajun spice + garlic butter on both sides. Air fry at 400°F for 20-22 min, flipping halfway.',
      'Rest chicken 5 min before slicing. Serve over fluffy rice. Pour any air fryer drippings right over the rice.',
    ],
  },
  {
    id: 2, name: 'Beef & Veggie Skillet + Mash', time: '35 min', difficulty: 'Easy',
    tags: ['Weekday', 'Batch cook', 'Hearty'], isWeekend: false,
    ingredients: ['Ground beef', 'Zucchini', 'Tomatoes', 'Mushrooms', 'Potatoes', 'Onion', 'Garlic'],
    steps: [
      'Boil chopped potatoes + 1 garlic clove in salted water until very soft, about 20 min. Test with fork — should go in with zero resistance.',
      'Cook mushrooms in olive oil on high heat until golden, 5-6 min. Don\'t stir much! Set aside.',
      'Cook onion + garlic in same pan. Add beef, break into small pieces, brown fully. Season with beef spice + cajun spice.',
      'Add zucchini + broccoli, cook 3-4 min. Add tomatoes + mushrooms back in, stir 2 min. Taste and adjust.',
      'Drain potatoes, mash with butter + rosemary + thyme + salt + pepper using a fork. Serve alongside the skillet.',
    ],
  },
  {
    id: 3, name: 'Shrimp Alfredo Pasta', time: '25 min', difficulty: 'Easy',
    tags: ['Quick', 'Weekday', 'Batch cook'], isWeekend: false,
    ingredients: ['Shrimp', 'Pasta', 'Alfredo sauce (jar)', 'Garlic', 'Butter', 'Parmesan', 'Lemon', 'Parsley', 'Zucchini (optional)'],
    steps: [
      'Cook pasta in well-salted water. Before draining, save 1 cup of pasta water.',
      'If using zucchini, sauté in butter until slightly golden first. Set aside.',
      'Cook shrimp in butter, 2 min per side until pink. Remove immediately — they go rubbery fast!',
      'Sauté garlic in same pan 1 min. Add alfredo sauce, warm gently on LOW. Never let it boil.',
      'Toss drained pasta in sauce. Add shrimp + zucchini back. Splash pasta water if too thick. Top with parmesan + parsley.',
    ],
  },
  {
    id: 4, name: 'Chicken Piccata + Pasta', time: '30 min', difficulty: 'Medium',
    tags: ['Nice', 'Weekend', 'Italian', 'Batch cook'], isWeekend: true,
    ingredients: ['Chicken breast x2', 'Pasta', 'Capers', 'Lemons x2', 'Butter', 'Garlic', 'Parmesan', 'Olive oil', 'Parsley'],
    steps: [
      'Flatten chicken breasts to ~1cm thick by bashing with a heavy pan. Season both sides with salt + pepper.',
      'Cook pasta in salted water. Save a cup of pasta water before draining.',
      'Sear chicken in olive oil on medium-high, 3-4 min per side until golden. Set aside to rest.',
      'In same pan, melt butter + garlic 1 min. Add capers + lemon juice, let bubble gently 2 min.',
      'Toss pasta in sauce + splash of pasta water. Slice rested chicken and lay over the top. Sprinkle parmesan + parsley.',
    ],
  },
  {
    id: 5, name: 'Italian Herb Pork Chops + Greek Salad', time: '35 min', difficulty: 'Easy',
    tags: ['Nice', 'Weekend', 'Italian'], isWeekend: true,
    ingredients: ['Pork chops', 'Mushrooms', 'Zucchini', 'Tomatoes', 'Cucumber', 'Red onion', 'Feta cheese', 'Kalamata olives', 'Lemons x2', 'Dried oregano'],
    steps: [
      'Mix rosemary + thyme + garlic butter + salt + pepper. Rub all over pork chops. Let sit 15 min.',
      'Air fry pork at 400°F for 20-22 min, flipping halfway. Let rest 5 min before cutting.',
      'Cook mushrooms + zucchini together in garlic butter until golden. Season with salt + pepper.',
      'Greek salad: chunk tomatoes + cucumber + red onion. Add olives. Crumble feta on top. Dress with olive oil + lemon + oregano.',
      'Serve pork with mushrooms on top, zucchini on the side, and salad next to it.',
    ],
  },
  {
    id: 6, name: 'Creamy Mushroom Chicken + Rice', time: '30 min', difficulty: 'Easy',
    tags: ['Nice', 'Weekend', 'Creamy'], isWeekend: true,
    ingredients: ['Chicken thighs', 'Mushrooms', 'Heavy cream', 'Onion', 'Garlic', 'Butter', 'Rice', 'Lemon'],
    steps: [
      'Toast rice in olive oil 2 min. Add water 2:1, simmer covered 18 min on lowest heat. Rest 5 min.',
      'Season chicken with cajun spice + salt. Air fry at 400°F for 20-22 min. Rest before slicing.',
      'Cook mushrooms in butter on HIGH until golden. Add onion + garlic, cook 3 min.',
      'Pour in heavy cream. Simmer on low 4-5 min until slightly thickened. Squeeze lemon in. Taste.',
      'Fluff rice, slice chicken, serve with cream sauce poured over everything.',
    ],
  },
  {
    id: 7, name: 'Spicy Soy Beef & Broccoli + Rice', time: '25 min', difficulty: 'Easy',
    tags: ['Quick', 'Weekday', 'Spicy'], isWeekend: false,
    ingredients: ['Ground beef', 'Broccoli', 'Garlic', 'Onion', 'Rice'],
    steps: [
      'Toast rice in olive oil, add water 2:1, simmer covered 18 min. Rest 5 min off heat.',
      'Cook onion + garlic in butter 2-3 min. Add beef, break into small pieces, brown fully.',
      'Add broccoli florets, cook 3-4 min stirring occasionally.',
      'Pour in soy sauce + sriracha, stir everything together 1-2 min. Taste and add more sriracha if needed.',
      'Serve over rice. Pour all the pan juices over the rice — that\'s where the flavor is!',
    ],
  },
  {
    id: 8, name: 'Shrimp & Mushrooms in White Sauce', time: '20 min', difficulty: 'Easy',
    tags: ['Nice', 'Weekend', 'Bistro'], isWeekend: true,
    ingredients: ['Shrimp', 'Mushrooms', 'White sauce (jar)', 'Garlic', 'Butter', 'Lemon', 'Cajun spice', 'Parsley', 'Crusty baguette'],
    steps: [
      'Season shrimp with cajun spice + salt + pepper. Pat dry with paper towels.',
      'Cook mushrooms in butter on HIGH heat, 4-5 min until golden. Don\'t stir much. Add garlic 1 min.',
      'Add shrimp to same pan. Cook 2 min per side until pink. Remove immediately.',
      'Pour white sauce over mushrooms. Warm gently on LOW — never let it boil. Squeeze lemon in.',
      'Add shrimp back in. Top with fresh parsley. Serve straight from pan with torn crusty bread.',
    ],
  },
  {
    id: 9, name: 'Shrimp Ceviche', time: '15 min + chill', difficulty: 'Easy',
    tags: ['Fresh', 'Weekend', 'No cook'], isWeekend: true,
    ingredients: ['Cooked shrimp (thawed)', 'Limes x6', 'Lemon', 'Tomatoes x2', 'Cucumber', 'Red onion', 'Avocados x2', 'Cilantro', 'Jalapeño (optional)', 'Tortilla chips'],
    steps: [
      'Thaw shrimp in cold water 15-20 min. Pat dry, chop into bite-sized pieces.',
      'Dice tomatoes, cucumber, and red onion very small and uniform. Soak red onion in cold water 5 min to mellow the sharpness.',
      'Mix shrimp + tomatoes + cucumber + drained red onion in a bowl. Pour all the lime + lemon juice over. Stir well to coat everything.',
      'Add cilantro + jalapeño + salt + pepper. Stir, taste, adjust. Chill at least 30 min — overnight is even better!',
      'Right before serving, gently fold in diced avocado. Serve with tortilla chips for scooping.',
    ],
  },
  {
    id: 10, name: 'Ground Beef Stuffed Bell Peppers', time: '40 min', difficulty: 'Easy',
    tags: ['Weekday', 'Fun', 'One pan'], isWeekend: false,
    ingredients: ['Ground beef', 'Bell peppers x3-4', 'Mushrooms', 'Tomatoes', 'Onion', 'Garlic', 'Parmesan', 'Olive oil'],
    steps: [
      'Cut tops off bell peppers, remove seeds. Dice the tops — they go in the filling, nothing wasted!',
      'Cook onion + garlic + diced pepper tops in olive oil 3 min. Add mushrooms, cook until golden.',
      'Add beef, break apart, brown fully. Add tomatoes + beef spice + cajun spice. Cook 3 min until thickened.',
      'Stuff each pepper tightly with filling. Top generously with parmesan.',
      'Air fry at 375°F for 20-25 min until peppers are soft with slightly charred edges. Let cool 2-3 min before eating.',
    ],
  },
  {
    id: 11, name: 'Chicken & Mushroom Pasta in Red Sauce', time: '35 min', difficulty: 'Medium',
    tags: ['Nice', 'Italian', 'Batch cook'], isWeekend: true,
    ingredients: ['Chicken breast x2', 'Mushrooms', 'Pasta', 'Marinara sauce (jar)', 'Onion', 'Garlic', 'Olive oil', 'Parmesan', 'Parsley'],
    steps: [
      'Season chicken with cajun spice + salt + pepper. Sear in olive oil, 3 min per side until golden. Set aside — not fully cooked yet, that\'s fine.',
      'Cook mushrooms in same pan until golden. Add onion + garlic.',
      'Pour in marinara sauce, stir, simmer 5 min. Place chicken back in sauce, cover, cook on low 10-12 min.',
      'Cook pasta in salted water. Save a cup of pasta water before draining.',
      'Remove chicken, slice or shred it. Toss pasta in sauce + splash of pasta water. Top with chicken, parmesan + parsley.',
    ],
  },
  {
    id: 12, name: 'Tuscan Herb Pork Tenderloin + Pasta', time: '35 min', difficulty: 'Easy',
    tags: ['Nice', 'Weekend', 'Italian'], isWeekend: true,
    ingredients: ['Pork tenderloin (Hatfield Tuscan Herb)', 'Pasta', 'Garlic butter', 'Olive oil', 'Lemon', 'Black pepper', 'Red pepper flakes'],
    steps: [
      'Take tenderloin out of packaging. No extra seasoning needed — it\'s already rubbed! Air fry at 375°F for 25-30 min, flipping halfway.',
      'Cook pasta in salted water. Save a cup of pasta water before draining.',
      'Melt garlic butter in a pan with olive oil. Add red pepper flakes + black pepper.',
      'Toss drained pasta in the garlic butter sauce. Add a splash of pasta water to loosen if needed.',
      'Rest pork 5 min before slicing into medallions. Lay over pasta. Squeeze lemon over everything.',
    ],
  },
];

const INITIAL_WEEK = [
  { day: 'Mon', mealId: 1, note: 'Batch cook — saves for Tue office lunch' },
  { day: 'Tue', mealId: null, note: 'Office lunch from Monday batch' },
  { day: 'Wed', mealId: 7, note: 'Batch cook — saves for Thu office lunch' },
  { day: 'Thu', mealId: null, note: 'Office lunch from Wednesday batch' },
  { day: 'Fri', mealId: 2, note: 'End of week, something hearty' },
  { day: 'Sat', mealId: 5, note: 'Weekend — something nice' },
  { day: 'Sun', mealId: 6, note: 'Weekend — nicer meal' },
];

// ─── Storage ──────────────────────────────────────────────────────────────────

async function load(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}
async function save(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('today');
  const [pantry, setPantry] = useState(INITIAL_PANTRY);
  const [weekPlan, setWeekPlan] = useState(INITIAL_WEEK);
  const [grocery, setGrocery] = useState([]);
  const [aiOpen, setAiOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, w, g] = await Promise.all([
        load('pantry_v2', INITIAL_PANTRY),
        load('week_v2', INITIAL_WEEK),
        load('grocery_v2', []),
      ]);
      setPantry(p); setWeekPlan(w); setGrocery(g);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) save('pantry_v2', pantry); }, [pantry, loaded]);
  useEffect(() => { if (loaded) save('week_v2', weekPlan); }, [weekPlan, loaded]);
  useEffect(() => { if (loaded) save('grocery_v2', grocery); }, [grocery, loaded]);

  const todayIdx = new Date().getDay();
  const todayName = DAYS[todayIdx];
  const tomorrowName = DAYS[(todayIdx + 1) % 7];
  const todayPlan = weekPlan.find(d => d.day === todayName);
  const tomorrowPlan = weekPlan.find(d => d.day === tomorrowName);
  const todayRecipe = todayPlan?.mealId ? RECIPES.find(r => r.id === todayPlan.mealId) : null;
  const tomorrowRecipe = tomorrowPlan?.mealId ? RECIPES.find(r => r.id === tomorrowPlan.mealId) : null;

  const toggleGrocery = id => setGrocery(g => g.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const togglePantry = id => setPantry(p => p.map(i => i.id === id ? { ...i, inStock: !i.inStock } : i));
  const removePantry = id => setPantry(p => p.filter(i => i.id !== id));
  const updateWeekMeal = (day, mealId) => setWeekPlan(w => w.map(d => d.day === day ? { ...d, mealId: mealId || null } : d));

  const generateGrocery = () => {
    const items = [];
    let n = 1;
    const stockNames = pantry.filter(p => p.inStock).map(p => p.name.toLowerCase().split(' ')[0]);
    weekPlan.forEach(d => {
      if (!d.mealId) return;
      const recipe = RECIPES.find(r => r.id === d.mealId);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const base = ing.toLowerCase().split(' ')[0];
        if (stockNames.includes(base)) return;
        if (!items.find(i => i.name.toLowerCase() === ing.toLowerCase())) {
          items.push({ id: 'g' + n++, name: ing, checked: false });
        }
      });
    });
    setGrocery(items);
  };

  if (!loaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-secondary)', fontSize: 14 }}>
      Loading your kitchen...
    </div>
  );

  // ─── Styles ────────────────────────────────────────────────────────────────

  const c = {
    wrap: { maxWidth: 480, margin: '0 auto', fontFamily: 'var(--font-sans)', background: 'var(--surface-0)', minHeight: '100vh' },
    topbar: { background: 'var(--surface-2)', borderBottom: '0.5px solid var(--border)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 },
    nav: { display: 'flex', background: 'var(--surface-2)', borderBottom: '0.5px solid var(--border)', position: 'sticky', top: 49, zIndex: 19 },
    navBtn: active => ({ flex: 1, padding: '9px 0', background: 'none', border: 'none', borderBottom: active ? '2px solid var(--fill-accent)' : '2px solid transparent', color: active ? 'var(--text-accent)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }),
    body: { padding: 16 },
    label: { fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 10 },
    card: { background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 },
    mealName: { fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', margin: '4px 0 8px' },
    metaRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 2 },
    meta: { fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 },
    tag: color => {
      const map = { green: ['var(--bg-success)', 'var(--text-success)'], blue: ['var(--bg-accent)', 'var(--text-accent)'], orange: ['var(--bg-warning)', 'var(--text-warning)'], gray: ['var(--surface-1)', 'var(--text-secondary)'] };
      const [bg, col] = map[color] || map.gray;
      return { fontSize: 11, padding: '2px 8px', borderRadius: 20, background: bg, color: col };
    },
    btnRow: { display: 'flex', gap: 8, marginTop: 12 },
    btn: (variant) => {
      if (variant === 'primary') return { flex: 1, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: 'var(--bg-accent)', color: 'var(--text-accent)', border: '0.5px solid var(--border-accent)' };
      if (variant === 'secondary') return { flex: 1, fontSize: 12, padding: '7px 12px', borderRadius: 8, cursor: 'pointer', background: 'var(--surface-1)', color: 'var(--text-primary)', border: '0.5px solid var(--border-strong)' };
      if (variant === 'full') return { width: '100%', fontSize: 13, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', background: 'var(--bg-accent)', color: 'var(--text-accent)', border: '0.5px solid var(--border-accent)' };
      return {};
    },
    input: { width: '100%', fontSize: 14, padding: '8px 12px', borderRadius: 8, border: '0.5px solid var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' },
    check: checked => ({ width: 22, height: 22, borderRadius: '50%', border: checked ? 'none' : '0.5px solid var(--border-strong)', background: checked ? 'var(--fill-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }),
    row: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid var(--border)' },
    rowLast: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' },
    aiBar: { background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 },
    empty: { textAlign: 'center', padding: '32px 16px' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0 0' },
    sheet: { background: 'var(--surface-2)', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480, maxHeight: '88vh', overflowY: 'auto', padding: '0 20px 32px' },
    handle: { width: 36, height: 4, borderRadius: 2, background: 'var(--border-strong)', margin: '12px auto 16px' },
    sheetHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingTop: 4 },
    step: { display: 'flex', gap: 12, marginBottom: 12 },
    stepNum: { width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-accent)', color: 'var(--text-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, flexShrink: 0, marginTop: 1 },
    reminder: { background: 'var(--bg-warning)', border: '0.5px solid var(--border-warning)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  };

  // ─── Today Tab ─────────────────────────────────────────────────────────────

  const TodayTab = () => (
    <div style={c.body}>
      {tomorrowRecipe && (
        <div style={c.reminder}>
          <i className="ti ti-bell" style={{ fontSize: 18, color: 'var(--text-warning)', flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: 'var(--text-warning)', lineHeight: 1.4 }}>
            Tomorrow is <strong>{tomorrowRecipe.name}</strong> — get any frozen ingredients out of the freezer tonight!
          </div>
        </div>
      )}

      <div style={c.label}>Today — {todayName}</div>

      {todayRecipe ? (
        <div style={c.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dinner</span>
            <span style={c.tag(todayRecipe.isWeekend ? 'orange' : 'blue')}>{todayRecipe.tags[0]}</span>
          </div>
          <div style={c.mealName}>{todayRecipe.name}</div>
          <div style={c.metaRow}>
            <div style={c.meta}><i className="ti ti-clock" style={{ fontSize: 13 }} /> {todayRecipe.time}</div>
            <div style={c.meta}><i className="ti ti-chef-hat" style={{ fontSize: 13 }} /> {todayRecipe.difficulty}</div>
          </div>
          {todayPlan?.note && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{todayPlan.note}</div>}
          <div style={c.btnRow}>
            <button style={c.btn('primary')} onClick={() => setRecipeOpen(todayRecipe)}>View recipe</button>
            <button style={c.btn('secondary')} onClick={() => setAiOpen(true)}>Ask Claude ↗</button>
          </div>
        </div>
      ) : (
        <div style={{ ...c.card, ...c.empty }}>
          <i className="ti ti-tool-kitchen-2" style={{ fontSize: 32, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }} />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>No meal planned for today.</div>
          <button style={c.btn('primary')} onClick={() => setTab('week')}>Plan it in the week tab</button>
        </div>
      )}

      <div style={c.label}>Browse recipes</div>
      {RECIPES.slice(0, 4).map(r => (
        <div key={r.id} style={{ ...c.card, cursor: 'pointer' }} onClick={() => setRecipeOpen(r)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{r.time} · {r.difficulty}</div>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 16, color: 'var(--text-muted)' }} />
          </div>
        </div>
      ))}
      <button style={{ ...c.btn('full'), marginTop: 4 }} onClick={() => setTab('week')}>See all recipes in week planner</button>

      <div style={c.aiBar}>
        <i className="ti ti-sparkles" style={{ fontSize: 20, color: 'var(--text-accent)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Got a wildcard ingredient?</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tell Claude and get ideas</div>
        </div>
        <button style={{ ...c.btn('primary'), flex: 'none' }} onClick={() => setAiOpen(true)}>Chat ↗</button>
      </div>
    </div>
  );

  // ─── Week Tab ──────────────────────────────────────────────────────────────

  const WeekTab = () => {
    const today = new Date();
    return (
      <div style={c.body}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 16 }}>
          {DAYS.map((d, i) => {
            const dt = new Date(today);
            dt.setDate(today.getDate() - today.getDay() + i);
            const isToday = d === todayName;
            return (
              <div key={d} style={{ background: isToday ? 'var(--bg-accent)' : 'var(--surface-1)', border: '0.5px solid ' + (isToday ? 'var(--border-accent)' : 'var(--border)'), borderRadius: 8, padding: '6px 2px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: isToday ? 'var(--text-accent)' : 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: isToday ? 'var(--text-accent)' : 'var(--text-primary)', marginTop: 2 }}>{dt.getDate()}</div>
              </div>
            );
          })}
        </div>

        <div style={c.label}>This week's meals</div>
        {weekPlan.map(d => {
          const recipe = d.mealId ? RECIPES.find(r => r.id === d.mealId) : null;
          const isToday = d.day === todayName;
          return (
            <div key={d.day} style={{ ...c.card, borderColor: isToday ? 'var(--border-accent)' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: isToday ? 'var(--text-accent)' : 'var(--text-muted)', fontWeight: isToday ? 500 : 400 }}>
                  {d.day}{isToday ? ' — today' : ''}
                </span>
                {recipe && <span style={c.tag(recipe.isWeekend ? 'orange' : 'blue')}>{recipe.isWeekend ? 'Weekend' : 'Weekday'}</span>}
              </div>

              {recipe ? (
                <>
                  <div style={c.mealName}>{recipe.name}</div>
                  <div style={c.metaRow}>
                    <div style={c.meta}><i className="ti ti-clock" style={{ fontSize: 12 }} /> {recipe.time}</div>
                    <div style={c.meta}><i className="ti ti-chef-hat" style={{ fontSize: 12 }} /> {recipe.difficulty}</div>
                  </div>
                  {d.note && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{d.note}</div>}
                  <div style={c.btnRow}>
                    <button style={c.btn('primary')} onClick={() => setRecipeOpen(recipe)}>Recipe</button>
                    <select style={{ ...c.btn('secondary'), flex: 2 }} value={d.mealId || ''} onChange={e => updateWeekMeal(d.day, parseInt(e.target.value) || null)}>
                      <option value="">Change meal...</option>
                      {RECIPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      <option value="">Clear day</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{d.note || 'No meal planned'}</div>
                  <select style={c.input} value="" onChange={e => updateWeekMeal(d.day, parseInt(e.target.value))}>
                    <option value="">Pick a meal...</option>
                    {RECIPES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Pantry Tab ────────────────────────────────────────────────────────────

  const PantryTab = () => {
    const [newName, setNewName] = useState('');
    const [newCat, setNewCat] = useState('Spices');
    const categories = [...new Set(pantry.map(p => p.category))];

    return (
      <div style={c.body}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
          Tap to mark in or out of stock. The grocery auto-generator uses this to skip things you already have.
        </div>

        {categories.map(cat => (
          <div key={cat}>
            <div style={{ ...c.label, marginTop: 8 }}>{cat}</div>
            <div style={c.card}>
              {pantry.filter(p => p.category === cat).map((item, i, arr) => (
                <div key={item.id} style={i < arr.length - 1 ? c.row : c.rowLast}>
                  <div style={c.check(item.inStock)} onClick={() => togglePantry(item.id)}>
                    {item.inStock && <i className="ti ti-check" style={{ fontSize: 13, color: 'white' }} />}
                  </div>
                  <span style={{ flex: 1, fontSize: 14, color: item.inStock ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: item.inStock ? 'none' : 'line-through' }}>
                    {item.name}
                  </span>
                  <button onClick={() => removePantry(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                    <i className="ti ti-x" style={{ fontSize: 14 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ ...c.card, marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10 }}>Add new item</div>
          <input style={{ ...c.input, marginBottom: 8 }} placeholder="e.g. Smoked paprika" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && newName.trim() && (setPantry(p => [...p, { id: 'p' + Date.now(), name: newName.trim(), category: newCat, inStock: true }]), setNewName(''))} />
          <select style={{ ...c.input, marginBottom: 10 }} value={newCat} onChange={e => setNewCat(e.target.value)}>
            {['Spices', 'Sauces', 'Oils', 'Dairy', 'Other'].map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <button style={c.btn('full')} onClick={() => { if (newName.trim()) { setPantry(p => [...p, { id: 'p' + Date.now(), name: newName.trim(), category: newCat, inStock: true }]); setNewName(''); } }}>
            Add to pantry
          </button>
        </div>
      </div>
    );
  };

  // ─── Shop Tab ──────────────────────────────────────────────────────────────

  const ShopTab = () => {
    const [newItem, setNewItem] = useState('');
    const unchecked = grocery.filter(i => !i.checked);
    const checked = grocery.filter(i => i.checked);

    return (
      <div style={c.body}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={c.label}>Shopping list</div>
          <button style={{ ...c.btn('primary'), flex: 'none', padding: '5px 10px', fontSize: 11 }} onClick={generateGrocery}>
            Generate from week ↗
          </button>
        </div>

        {grocery.length === 0 ? (
          <div style={{ ...c.card, ...c.empty }}>
            <i className="ti ti-shopping-cart" style={{ fontSize: 32, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>No items yet. Generate from your week plan or add manually.</div>
            <button style={c.btn('primary')} onClick={generateGrocery}>Generate from week ↗</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              {unchecked.length} of {grocery.length} items remaining
            </div>

            {unchecked.length > 0 && (
              <div style={c.card}>
                {unchecked.map((item, i) => (
                  <div key={item.id} style={i < unchecked.length - 1 ? c.row : c.rowLast}>
                    <div style={c.check(false)} onClick={() => toggleGrocery(item.id)} />
                    <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{item.name}</span>
                    <button onClick={() => setGrocery(g => g.filter(i => i.id !== item.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                      <i className="ti ti-x" style={{ fontSize: 13 }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {checked.length > 0 && (
              <>
                <div style={{ ...c.label, marginTop: 8 }}>Got it ({checked.length})</div>
                <div style={c.card}>
                  {checked.map((item, i) => (
                    <div key={item.id} style={i < checked.length - 1 ? c.row : c.rowLast}>
                      <div style={c.check(true)} onClick={() => toggleGrocery(item.id)}>
                        <i className="ti ti-check" style={{ fontSize: 13, color: 'white' }} />
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
                <button style={{ ...c.btn('secondary'), width: '100%', marginTop: 4 }} onClick={() => setGrocery(g => g.filter(i => !i.checked))}>
                  Clear checked items
                </button>
              </>
            )}
          </>
        )}

        <div style={{ ...c.card, marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Add item manually</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...c.input, flex: 1 }} placeholder="e.g. Mushrooms" value={newItem} onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && newItem.trim() && (setGrocery(g => [...g, { id: 'g' + Date.now(), name: newItem.trim(), checked: false }]), setNewItem(''))} />
            <button style={{ ...c.btn('primary'), flex: 'none', padding: '8px 14px' }}
              onClick={() => { if (newItem.trim()) { setGrocery(g => [...g, { id: 'g' + Date.now(), name: newItem.trim(), checked: false }]); setNewItem(''); } }}>
              Add
            </button>
          </div>
        </div>

        <div style={c.aiBar}>
          <i className="ti ti-sparkles" style={{ fontSize: 20, color: 'var(--text-accent)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Need help planning?</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ask Claude to plan your week</div>
          </div>
          <button style={{ ...c.btn('primary'), flex: 'none' }} onClick={() => setAiOpen(true)}>Ask ↗</button>
        </div>
      </div>
    );
  };

  // ─── Recipe Modal ──────────────────────────────────────────────────────────

  const RecipeModal = ({ recipe, onClose }) => (
    <div style={c.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={c.sheet}>
        <div style={c.handle} />
        <div style={c.sheetHeader}>
          <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)', paddingRight: 12 }}>{recipe.name}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, flexShrink: 0 }}>
            <i className="ti ti-x" style={{ fontSize: 20 }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={c.tag('blue')}>{recipe.time}</span>
          <span style={c.tag('green')}>{recipe.difficulty}</span>
          {recipe.tags.map(t => <span key={t} style={c.tag('gray')}>{t}</span>)}
        </div>

        <div style={c.label}>Ingredients</div>
        <div style={{ ...c.card, marginBottom: 16 }}>
          {recipe.ingredients.map((ing, i, arr) => (
            <div key={i} style={{ fontSize: 14, color: 'var(--text-primary)', padding: '7px 0', borderBottom: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', marginTop: 1 }}>·</span>
              {ing}
            </div>
          ))}
        </div>

        <div style={c.label}>How to cook</div>
        {recipe.steps.map((step, i) => (
          <div key={i} style={c.step}>
            <div style={c.stepNum}>{i + 1}</div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.55, paddingTop: 2 }}>{step}</div>
          </div>
        ))}

        <div style={c.btnRow}>
          <button style={c.btn('secondary')} onClick={() => { setAiOpen(true); onClose(); }}>Ask Claude about this ↗</button>
          <button style={c.btn('primary')} onClick={() => { updateWeekMeal(todayName, recipe.id); onClose(); }}>Cook tonight</button>
        </div>
      </div>
    </div>
  );

  // ─── AI Modal ──────────────────────────────────────────────────────────────

  const AIModal = ({ onClose }) => {
    const [msgs, setMsgs] = useState([
      { role: 'assistant', content: "Hey! What are you working with today? Tell me what's in your fridge, what you feel like eating, or anything else and I'll help you figure it out." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

    const pantryCtx = pantry.filter(p => p.inStock).map(p => p.name).join(', ');
    const weekCtx = weekPlan.map(d => { const r = d.mealId ? RECIPES.find(r => r.id === d.mealId) : null; return `${d.day}: ${r ? r.name : 'nothing planned'}`; }).join(' | ');

    const send = async () => {
      if (!input.trim() || loading) return;
      const userMsg = { role: 'user', content: input.trim() };
      setMsgs(m => [...m, userMsg]);
      setInput('');
      setLoading(true);
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1000,
            system: `You are a personal cooking assistant built into a meal planning app for Erjon, a young Albanian man living alone in Charlotte, NC.

ABOUT ERJON:
- Cooks for himself (1 person), beginner-intermediate cook
- Has a Ninja Dual Zone air fryer with Smart Finish (can cook 2 things at once!)
- Likes: chicken, beef, pork, shrimp, mushrooms, zucchini, potatoes, pasta, rice
- Does NOT like sweet food in main meals
- Likes some spice occasionally
- Batch cooks Mon/Wed for office lunches Tue/Thu
- Weekend = nicer meals, weekday = quick and easy
- Breakfast: 2 boiled eggs + banana every day
- Evening snack: yogurt + fruits + honey

PANTRY (in stock right now): ${pantryCtx}

THIS WEEK'S PLAN: ${weekCtx}

Be friendly, conversational, practical, and specific. No em dashes. Keep it short and direct.`,
            messages: [...msgs, userMsg].map(m => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        const reply = data.content?.[0]?.text || 'Something went wrong, try again!';
        setMsgs(m => [...m, { role: 'assistant', content: reply }]);
      } catch {
        setMsgs(m => [...m, { role: 'assistant', content: 'Something went wrong. Try again!' }]);
      }
      setLoading(false);
    };

    return (
      <div style={c.modal} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ ...c.sheet, display: 'flex', flexDirection: 'column', height: '82vh', padding: 0 }}>
          <div style={{ padding: '0 20px', flexShrink: 0 }}>
            <div style={c.handle} />
          </div>
          <div style={{ padding: '0 20px 12px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>Ask Claude</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Knows your pantry and this week's plan</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
              <i className="ti ti-x" style={{ fontSize: 20 }} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', lineHeight: 1.5, fontSize: 14,
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? 'var(--fill-accent)' : 'var(--surface-1)',
                  color: m.role === 'user' ? 'var(--on-accent)' : 'var(--text-primary)',
                  border: m.role === 'user' ? 'none' : '0.5px solid var(--border)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 2px', background: 'var(--surface-1)', border: '0.5px solid var(--border)', fontSize: 14, color: 'var(--text-muted)' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              ref={inputRef}
              style={{ ...c.input, flex: 1 }}
              placeholder="What do you have? What are you feeling?"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button style={{ ...c.btn('primary'), flex: 'none', padding: '8px 14px' }} onClick={send} disabled={loading}>
              <i className="ti ti-send" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const navItems = [
    { id: 'today', label: 'Today', icon: 'ti-home' },
    { id: 'week', label: 'Week', icon: 'ti-calendar' },
    { id: 'pantry', label: 'Pantry', icon: 'ti-basket' },
    { id: 'shop', label: 'Shop', icon: 'ti-shopping-cart' },
  ];

  return (
    <div style={c.wrap}>
      <div style={c.topbar}>
        <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-primary)' }}>What's cooking</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {todayName}, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div style={c.nav}>
        {navItems.map(item => (
          <button key={item.id} style={c.navBtn(tab === item.id)} onClick={() => setTab(item.id)}>
            <i className={`ti ${item.icon}`} style={{ fontSize: 18 }} />
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'today' && <TodayTab />}
      {tab === 'week' && <WeekTab />}
      {tab === 'pantry' && <PantryTab />}
      {tab === 'shop' && <ShopTab />}

      {recipeOpen && <RecipeModal recipe={recipeOpen} onClose={() => setRecipeOpen(null)} />}
      {aiOpen && <AIModal onClose={() => setAiOpen(false)} />}
    </div>
  );
}
