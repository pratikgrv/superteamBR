import { LayoutDashboard, Lock, Globe, Gauge } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Optimized for speed. Experience sub-second load times and seamless interactions.",
      icon: Gauge,
    },
    {
      title: "Bank-grade Security",
      description: "Your data is encrypted at rest and in transit. We take your security seriously.",
      icon: Lock,
    },
    {
      title: "Global Edge Network",
      description: "Deployed across 150+ edge nodes to ensure low latency for all users worldwide.",
      icon: Globe,
    },
    {
      title: "Intuitive Dashboard",
      description: "Control everything from a single, easy-to-use dashboard that requires no training.",
      icon: LayoutDashboard,
    }
  ];

  return (
    <section className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Platform Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to scale
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform provides all the tools you need to succeed in one place. Focus on your business, not infrastructure.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-all text-card-foreground">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}