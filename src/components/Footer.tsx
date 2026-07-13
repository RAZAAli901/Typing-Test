export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-light">
          TypeMaster Suite Web v1.0 | Rebuilt from C++ CLI with Passion & Precision
        </p>
        <p className="mt-1 text-[10px] text-slate-600">
          Scoring logic uses Net WPM formula: (Gross WPM) - (Mistakes / timeInMinutes).
        </p>
      </div>
    </footer>
  );
}
