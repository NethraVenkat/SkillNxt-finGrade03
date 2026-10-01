import React, { useEffect, useRef, useState } from 'react';
import { LearnView } from './components/LearnView';
import { TopNav } from './components/TopNavigation';
import { Explore } from './pages/Explore';
import { Home } from './pages/Home';
import { LearningJourney } from './pages/LearningJourney';
import { Login } from './pages/Login';
import { Play } from './pages/Play';
import { useBlip } from './systems/audio';
/* ══════════════ AppShell + router ══════════════ */
class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={ err:null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err,info){ console.error("Money Quest error:", err, info); }
  render(){
    if (this.state.err) return (
      <div className="errbox"><div>
        <h2>Something went wrong on this page</h2>
        <p>The rest of the app still works — use the top navigation to continue.</p>
        <pre>{String(this.state.err && this.state.err.message || this.state.err)}</pre>
      </div></div>
    );
    return this.props.children;
  }
}

const routeFor = (view, scene) =>
  view === "home"    ? "#/" :
  view === "journey" ? "#/learn" :
  view === "scene"   ? "#/learn/" + (scene + 1) :
  "#/" + view;

function parseHash() {
  const raw = (window.location.hash || "#/").replace(/^#\/?/, "");
  const p = raw.split("/").filter(Boolean);
  if (!p.length) return { view:"home", scene:0 };
  if (p[0] === "learn") {
    if (p[1]) {
      const n = Math.min(18, Math.max(1, parseInt(p[1], 10) || 1));
      return { view:"scene", scene:n - 1 };
    }
    return { view:"journey", scene:0 };
  }
  if (p[0] === "play" || p[0] === "explore") return { view:p[0], scene:0 };
  return { view:"home", scene:0 };
}

function Shell() {
  const first = parseHash();
  const [view,setView]   = useState(first.view);
  const [scene,setScene] = useState(first.scene);
  /* bumps only when navigation should (re)mount the learn view — menu, journey, a
     typed or Back/Forward URL — never when the lesson itself moves on */
  const [mount,setMount] = useState(0);
  const cur = useRef(first);
  cur.current = { view, scene };
  const [flash,setFlash] = useState(0);
  /* dev-only: ?fs=1 opens in cinema mode, for visual QA */
  const [focusMode,setFocus] = useState(() => !!import.meta.env.DEV && /[?&]fs=1/.test(window.location.search));
  const [homeIntro,setHomeIntro] = useState(true);
  const [loginOpen,setLogin] = useState(false);
  const [completed,setCompleted] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("mq_progress") || "[]"); } catch (e) { return []; }
  });
  const markDone = i => setCompleted(c => (c.includes(i) ? c : [...c, i]));
  useEffect(() => {
    try { window.localStorage.setItem("mq_progress", JSON.stringify(completed)); } catch (e) {}
  }, [completed]);
  const rootRef = useRef(null);
  const blip = useBlip(true);

  useEffect(() => { const t = setTimeout(() => setHomeIntro(false), 160); return () => clearTimeout(t); }, []);

  /* keep the address bar and the view in step, both directions */
  useEffect(() => {
    const want = routeFor(view, scene);
    try { if (window.location.hash !== want) window.location.hash = want; } catch (e) {}
  }, [view, scene]);

  useEffect(() => {
    const onHash = () => {
      const r = parseHash();
      if (r.view === cur.current.view && r.scene === cur.current.scene) return;   /* our own hash write */
      setView(r.view); setScene(r.scene); setMount(m => m + 1);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (v, i) => {
    setFocus(false);
    if (typeof i === "number") setScene(i);
    setView(v);
    setMount(m => m + 1);
  };

  const nav = v => { go(v === "learn" ? "journey" : v); blip(v === "home" ? 560 : 720); };

  /* Home → Learn journey. Switches immediately; the flash is only decoration. */
  const start = () => { blip(880); setFlash(f => f + 1); go("journey"); };

  /* journey card → that scene */
  const openScene = i => { blip(900); setFlash(f => f + 1); go("scene", i); };

  const toggleFocus = () => { setFocus(f => !f); blip(660); };

  useEffect(() => {
    const k = e => { if (e.code === "Escape" && focusMode) setFocus(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [focusMode]);

  return (
    <div ref={rootRef} className={"shell" + (focusMode ? " focus-mode" : "")}>
      <TopNav view={view === "journey" || view === "scene" ? "learn" : view} onNav={nav}
        onFull={toggleFocus} onLogin={() => setLogin(true)}/>

      <ErrorBoundary key={view + "-" + mount}>
        {view === "home"    && <Home intro={homeIntro} entering={false} onStart={start}/>}
        {view === "journey" && <LearningJourney onOpen={openScene}/>}
        {view === "scene"   && <LearnView key={mount} startIndex={scene} focusMode={focusMode} completed={completed}
                                          onComplete={markDone} onIndex={setScene}
                                          onFocus={toggleFocus} onExit={() => { go("journey"); blip(520); }}/>}
        {view === "play"    && <Play blip={blip}/>}
        {view === "explore" && <Explore/>}
      </ErrorBoundary>

      {focusMode && (
        <button className="fsexit" onClick={toggleFocus} title="Exit fullscreen (Esc)" aria-label="Exit fullscreen"
          style={{position:"fixed"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>
        </button>
      )}
      {loginOpen && <Login onClose={() => setLogin(false)}/>}
      {flash > 0 && <div className="flash" key={flash}/>}
    </div>
  );
}

export { ErrorBoundary, Shell, parseHash, routeFor };

export default Shell;
