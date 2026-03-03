import { Building2, Command, Eclipse, Hexagon, Sparkles } from 'lucide-react';

export default function PartnerLogos() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 border-t border-b bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm font-medium tracking-tight text-muted-foreground uppercase">
            Trusted by the world's most innovative teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Command className="h-6 w-6" />
              <span>Acme Corp</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Eclipse className="h-6 w-6" />
              <span>Globex</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-6 w-6" />
              <span>Soylent</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xl font-bold">
              <Hexagon className="h-6 w-6" />
              <span>Initech</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xl font-bold">
              <Building2 className="h-6 w-6" />
              <span>Umbrella</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}