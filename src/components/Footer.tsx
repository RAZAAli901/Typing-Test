export default function Footer() {
  return (
    <footer className="mt-auto border-t border-crt-dim/40 bg-[#060606]/90 py-6 text-center text-xs text-crt-dim font-vt323 tracking-wider uppercase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-bold">
          TypeMaster Suite Web v1.0 | Rebuilt from C++ CLI with Passion & Precision
        </p>
        <p className="mt-1 text-[10px] text-crt-dim/60">
          Scoring logic uses Net WPM formula: (Gross WPM) - (Mistakes / timeInMinutes).
        </p>
      </div>
    </footer>
  );
}
