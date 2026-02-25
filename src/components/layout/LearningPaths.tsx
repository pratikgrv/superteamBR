import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export function LearningPaths() {
  const paths = [
    {
      title: "Solana Fundamentals",
      description: "Learn the core concepts of accounts, programs, and PDA's.",
      progress: 100,
      color: "bg-success",
      modules: [
        { name: "Intro to Web3", completed: true },
        { name: "Cryptography basics", completed: true },
        { name: "Solana Account Model", completed: true },
      ],
    },
    {
      title: "Rust for Solana",
      description:
        "Master Rust concepts necessary for writing secure on-chain programs.",
      progress: 33,
      color: "bg-warning",
      modules: [
        { name: "Ownership & Borrowing", completed: true },
        { name: "Structs & Enums", completed: false },
        { name: "Anchor Framework Basics", completed: false },
      ],
    },
    {
      title: "Advanced dApp Development",
      description:
        "Build a full-stack Solana application with a React frontend.",
      progress: 0,
      color: "bg-muted-foreground",
      modules: [
        { name: "Wallet Adapter setup", completed: false },
        { name: "RPC interactions", completed: false },
        { name: "Shipping to Mainnet", completed: false },
      ],
    },
  ];

  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold leading-7 text-primary mb-2 uppercase tracking-wide">
              Structured Learning
            </h2>
            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Clear paths to mastery.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all paths <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {paths.map((path, idx) => (
            <div
              key={idx}
              className="flex flex-col p-8 rounded-2xl bg-card border border-border group hover:border-primary/50 transition-colors"
            >
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {path.title}
                </h3>
                <p className="text-sm text-muted-foreground h-10">
                  {path.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-foreground">Progress</span>
                  <span className="text-muted-foreground">
                    {path.progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className={`h-full ${path.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>

              {/* Modules List */}
              <div className="flex-1">
                <ul className="space-y-3">
                  {path.modules.map((module, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-3 text-sm">
                      {module.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                      )}
                      <span
                        className={
                          module.completed
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {module.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors ${
                    path.progress === 100
                      ? "bg-surface-alt text-foreground hover:bg-surface-alt/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {path.progress === 100
                    ? "Review Path"
                    : path.progress > 0
                      ? "Continue Learning"
                      : "Start Path"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
