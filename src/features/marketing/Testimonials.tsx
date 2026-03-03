import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechFlow",
      content: "This platform has completely transformed how our engineering team ships code. We've seen a 40% increase in deployment velocity since making the switch.",
      initials: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Lead Designer at Studio",
      content: "The attention to detail and user experience is unmatched. It's rare to find a tool that is both extremely powerful and a joy to use daily.",
      initials: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Founder at SparkStart",
      content: "As a startup founder, I needed something reliable that would scale with us. This exceeded all expectations and the support team is incredible.",
      initials: "ER"
    }
  ];

  return (
    <section className="w-full py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by builders
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Don't just take our word for it. Here's what our customers have to say about their experience.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="flex flex-col space-y-6 rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground flex-1 italic">"{testimonial.content}"</p>
              <div className="flex items-center space-x-4 pt-4 border-t border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}