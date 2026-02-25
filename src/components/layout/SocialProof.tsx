import Image from "next/image";

export function SocialProof() {
  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-20 text-center">
          <div className="flex flex-col gap-2">
            <dt className="text-4xl font-extrabold text-foreground">5,000+</dt>
            <dd className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Developers Enrolled
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-4xl font-extrabold text-foreground">15+</dt>
            <dd className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Solana Courses
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-4xl font-extrabold text-foreground">$2M+</dt>
            <dd className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Bounties Earned
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-4xl font-extrabold text-foreground">24/7</dt>
            <dd className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Community Support
            </dd>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-8">
            Trusted by leading ecosystem partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos - In a real app we'd use Image component or SVGs */}
            <div className="text-2xl font-bold tracking-tighter">SOLANA</div>
            <div className="text-2xl font-bold tracking-tighter">PHANTOM</div>
            <div className="text-2xl font-bold tracking-tighter">METAPLEX</div>
            <div className="text-2xl font-bold tracking-tighter">TENSOR</div>
            <div className="text-2xl font-bold tracking-tighter">JUPITER</div>
          </div>
        </div>

        {/* Quick Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Superteam BR courses took me from Zero to shipping my first program in 2 weeks. The community is unmatched.",
              author: "Felipe S.",
              role: "Solana Dev",
            },
            {
              quote:
                "The best place to learn Rust contextually for Solana. The bite-sized tutorials and XP system kept me hooked.",
              author: "Maria G.",
              role: "Frontend to Web3",
            },
            {
              quote:
                "Through the platform's bounties, I was able to quit my day job and go full-time crypto. Life changing.",
              author: "Lucas P.",
              role: "Freelance Dev",
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 rounded-2xl bg-surface-alt/30 border border-border"
            >
              <p className="text-muted-foreground italic mb-6">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-primary">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
