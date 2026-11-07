import Link from "next/link";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/8bit/card";
import { Badge } from "@/components/ui/8bit/badge";
import { TYPING_MODES } from "@/content/modes";

export default function Home() {
  const modes = TYPING_MODES;

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-8 md:py-12 font-vt323 text-lg text-crt-dim select-none">
      {/* Hero Section */}
      <section className="text-center max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 text-crt-dim text-xs font-bold tracking-widest uppercase font-mono">
          <span className="w-2 h-2 rounded-full bg-crt-primary animate-pulse shadow-[0_0_5px_var(--color-crt-primary)]"></span>
          [REBUILT FROM CLI TO NEXT.JS]
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-widest text-crt-primary drop-shadow-[0_0_6px_var(--color-crt-primary)] uppercase leading-tight font-vt323">
          Master Your Typing Speed on TypeMaster Web
        </h1>
        <p className="text-lg md:text-xl text-crt-dim font-bold tracking-wider uppercase font-vt323">
          Experience real-time keystroke scanning, character color-coding, in-app synthesized audio feedback, and detailed performance curves linked to our global Supabase PostgreSQL leaderboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 font-vt323 text-lg">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/play">
              Start Typing ⚡
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/leaderboard">
              View Leaderboards 🏆
            </Link>
          </Button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl font-vt323 text-lg">
        <Card>
          <Icon name="mic" className="text-crt-primary" size={32} />
          <CardTitle>Live Feedback HUD</CardTitle>
          <CardDescription>
            Monitor speed (Gross & Net WPM), accuracy percentage, and elapsed stopwatch time in real-time on every keystroke.
          </CardDescription>
        </Card>

        <Card>
          <Icon name="speaker" className="text-crt-primary" size={32} />
          <CardTitle>Synthesized Audio</CardTitle>
          <CardDescription>
            Zero asset load times! Audio cues are dynamically synthesized via the Web Audio API for tactile typewriter sounds.
          </CardDescription>
        </Card>

        <Card>
          <Icon name="chart" className="text-crt-primary" size={32} />
          <CardTitle>SVG Performance Curves</CardTitle>
          <CardDescription>
            Get an instant visual dashboard of your typing stability with an SVG-generated speed and accuracy timeline graph.
          </CardDescription>
        </Card>
      </section>

      {/* Typing Modes Showcase */}
      <section className="w-full max-w-6xl space-y-8 font-vt323 text-lg">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-crt-primary uppercase drop-shadow-[0_0_5px_var(--color-crt-primary)]">
            8 Specialized Typing Modes
          </h2>
          <p className="text-crt-dim font-bold tracking-widest uppercase text-sm md:text-base">
            Choose from 7 built-in benchmark modes plus 1 custom practice mode to refine your keyboard mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map((m) => (
            <Card
              key={m.id}
              className="border-crt-dim/40 hover:border-crt-primary hover:scale-[1.02] flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name={m.icon} className="text-crt-primary group-hover:text-white transition-all duration-300" size={24} />
                  <h4 className="text-lg font-bold text-crt-primary group-hover:text-white transition-colors uppercase">
                    {m.name}
                  </h4>
                </div>
                <p className="text-sm text-crt-dim/75 leading-relaxed uppercase">
                  {m.desc}
                </p>
              </div>
              <CardFooter className="pt-4 border-t-0 p-0">
                <Badge variant="default">
                  <span className="w-1.5 h-1.5 rounded-full bg-crt-primary animate-pulse shadow-[0_0_4px_var(--color-crt-primary)]"></span>
                  <span>{m.isCustom ? "[CUSTOM TXT]" : "[LDR ACTIVE]"}</span>
                </Badge>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/play?mode=${m.id}`}>
                    [CONFIGURE &rarr;]
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Training Guides */}
      <section className="w-full max-w-6xl space-y-6 font-mono text-xs md:text-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-crt-border/60 pb-3">
          <div>
            <span className="text-[10px] tracking-widest text-crt-dim uppercase">[KNOWLEDGE BASE]</span>
            <h2 className="text-xl md:text-2xl font-bold text-crt-primary">Featured Training Guides</h2>
          </div>
          <Link
            href="/learn"
            className="text-crt-primary hover:underline font-semibold flex items-center gap-1 text-xs"
          >
            <span>Explore All 18 Guides &amp; Glossary</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/learn/how-to-improve-typing-speed"
            className="p-4 border border-crt-border/70 rounded bg-crt-black/40 hover:border-crt-primary transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-[10px] text-crt-dim mb-1">TECHNIQUE</div>
              <h3 className="font-bold text-crt-primary group-hover:text-crt-accent text-sm">
                How to Improve Typing Speed
              </h3>
              <p className="mt-1 text-crt-dim text-xs line-clamp-2">
                Motor chunking, deliberate practice drills, and rhythm control.
              </p>
            </div>
            <span className="mt-3 text-crt-primary text-xs font-semibold group-hover:underline">
              Read Guide &rarr;
            </span>
          </Link>

          <Link
            href="/learn/touch-typing-for-beginners"
            className="p-4 border border-crt-border/70 rounded bg-crt-black/40 hover:border-crt-primary transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-[10px] text-crt-dim mb-1">FUNDAMENTALS</div>
              <h3 className="font-bold text-crt-primary group-hover:text-crt-accent text-sm">
                Touch Typing for Beginners
              </h3>
              <p className="mt-1 text-crt-dim text-xs line-clamp-2">
                Learn finger assignment, home row anchors, and blind navigation.
              </p>
            </div>
            <span className="mt-3 text-crt-primary text-xs font-semibold group-hover:underline">
              Read Guide &rarr;
            </span>
          </Link>

          <Link
            href="/learn/typing-accuracy-vs-speed"
            className="p-4 border border-crt-border/70 rounded bg-crt-black/40 hover:border-crt-primary transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-[10px] text-crt-dim mb-1">MOTOR CONTROL</div>
              <h3 className="font-bold text-crt-primary group-hover:text-crt-accent text-sm">
                Accuracy vs Speed
              </h3>
              <p className="mt-1 text-crt-dim text-xs line-clamp-2">
                The true cost of typos, backspace recovery, and the 98% rule.
              </p>
            </div>
            <span className="mt-3 text-crt-primary text-xs font-semibold group-hover:underline">
              Read Guide &rarr;
            </span>
          </Link>

          <Link
            href="/learn/typing-numbers-and-symbols"
            className="p-4 border border-crt-border/70 rounded bg-crt-black/40 hover:border-crt-primary transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="text-[10px] text-crt-dim mb-1">ADVANCED</div>
              <h3 className="font-bold text-crt-primary group-hover:text-crt-accent text-sm">
                Numbers &amp; Symbols
              </h3>
              <p className="mt-1 text-crt-dim text-xs line-clamp-2">
                Master the top number row, shift keys, and programming symbols.
              </p>
            </div>
            <span className="mt-3 text-crt-primary text-xs font-semibold group-hover:underline">
              Read Guide &rarr;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
