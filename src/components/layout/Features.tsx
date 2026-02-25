import { Code2, Cpu, Trophy, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Learn Rust & Solana",
      description:
        "Master the core concepts of building on Solana through interactive, step-by-step courses designed for all levels.",
      icon: Code2,
    },
    {
      title: "Earn XP and Level Up",
      description:
        "Complete modules, solve challenges, and climb the Superteam BR leaderboard. Showcase your on-chain expertise.",
      icon: Trophy,
    },
    {
      title: "Build Real Projects",
      description:
        "Don't just read documentation. Write code, ship smart contracts, and build dApps that actually matter.",
      icon: Cpu,
    },
    {
      title: "Join the Elite Community",
      description:
        "Connect with top Brazilian developers, find co-founders, and get access to exclusive bounties and grants.",
      icon: Users,
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-surface-alt/50 border-y border-border/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-primary mb-2 uppercase tracking-wide">
            Why Superteam BR?
          </h2>
          <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to become a 10x Solana Developer.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="relative flex flex-col gap-6 p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-7 text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
