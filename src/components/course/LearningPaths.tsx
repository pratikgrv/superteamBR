"use client";

import { ArrowRight, Code, Hexagon, Trophy } from "lucide-react";
import { memo } from "react";

export const LearningPaths = memo(function LearningPaths() {
  const paths = [
    {
      id: "path-1",
      title: "Solana Bootcamp",
      description:
        "From beginner to building fullstack dApps. Step-by-step curriculum.",
      icon: <Hexagon className="w-8 h-8 text-indigo-400" />,
      color: "from-indigo-500/10 to-purple-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      id: "path-2",
      title: "DeFi Architect",
      description:
        "Master AMMs, lending protocols, and complex tokenomics on Solana.",
      icon: <Trophy className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: "path-3",
      title: "Smart Contract Auditing",
      description:
        "Learn how to find and fix common vulnerabilities in Anchor programs.",
      icon: <Code className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Curated Learning Paths
          </h2>
          <p className="text-muted-foreground mt-1">
            Structured curriculum to help you reach your goals faster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paths.map((path) => (
          <div
            key={path.id}
            className={`relative overflow-hidden rounded-2xl border ${path.borderColor} bg-linear-to-br ${path.color} p-6 transition-all hover:shadow-md hover:-translate-y-1 group cursor-pointer`}
          >
            <div className="mb-4 inline-flex rounded-xl bg-background/80 p-3 shadow-sm backdrop-blur-sm">
              {path.icon}
            </div>

            <h3 className="text-xl font-bold mb-2">{path.title}</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-[90%]">
              {path.description}
            </p>

            <div className="flex items-center font-medium text-primary text-sm mt-auto group-hover:underline">
              Start this path{" "}
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
