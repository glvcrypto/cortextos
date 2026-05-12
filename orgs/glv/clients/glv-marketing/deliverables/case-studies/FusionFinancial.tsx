import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  Search,
  ShieldCheck,
  Layout as LayoutIcon,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Users,
  Star,
} from "lucide-react";

const seo = {
  title: "Fusion Financial Case Study | GLV Marketing",
  description:
    "How GLV Marketing built Fusion Financial's production WordPress site from the ground up and continues to manage it as an active client, delivering 20+ organic leads through search.",
  canonical: "https://glvmarketing.ca/case-studies/fusion-financial",
};

const tags = ["WordPress Development", "Ongoing Management", "Local SEO", "Financial Services"];

const scope = [
  {
    icon: Globe,
    title: "Brand-New Business, No Web Presence",
    desc: "Fusion Financial launched with no existing website and no Google footprint. The site needed to establish credibility and capture organic search traffic from day one.",
  },
  {
    icon: ShieldCheck,
    title: "Regulated Industry Messaging",
    desc: "Financial services copy requires careful, compliant positioning. Every page had to build trust clearly while staying within the bounds of what a financial advisory firm can claim.",
  },
  {
    icon: Users,
    title: "Turning Visitors into Leads",
    desc: "A financial services site lives or dies on trust signals. Structure, copy, and calls to action all had to work together to move a visitor from curious to ready to book.",
  },
  {
    icon: Search,
    title: "Local Search Competition",
    desc: "Breaking into local search results for financial services in a new market requires more than a good-looking site. The architecture had to be built for discovery from the start.",
  },
];

const solutions = [
  {
    icon: LayoutIcon,
    title: "Custom WordPress Build",
    desc: "Full production site built on WordPress. Clean layout, trust-forward design, and copy structured around the questions financial services prospects actually ask. Mobile-responsive and fast.",
  },
  {
    icon: ShieldCheck,
    title: "Financial Services Positioning",
    desc: "Page copy written to build confidence and credibility without overreaching. Service pages, about content, and calls to action all calibrated for how financial advisory clients make decisions.",
  },
  {
    icon: Search,
    title: "On-Page SEO Configuration",
    desc: "Keyword research and on-page optimisation across every service page. Meta descriptions, title tags, schema markup, and local targeting, all built in at launch. LocalBusiness schema deployed site-wide.",
  },
  {
    icon: TrendingUp,
    title: "Organic Lead Generation",
    desc: "20+ organic leads delivered through search since launch. Fusion Financial's site earns inbound inquiries without paid traffic, through the organic foundation GLV built and continues to maintain.",
  },
];

const maintenance = [
  {
    icon: RefreshCw,
    title: "Ongoing Site Management",
    desc: "Fusion Financial is an active GLV client. GLV handles ongoing WordPress maintenance, plugin updates, security monitoring, and technical health checks so the Fusion team stays focused on clients, not their website.",
  },
  {
    icon: Star,
    title: "Content and Strategy Updates",
    desc: "As Fusion Financial's service offering evolves, GLV updates page content, adds new service pages, and adjusts on-page SEO targeting to keep the site aligned with how the business actually operates.",
  },
  {
    icon: Users,
    title: "Active Relationship",
    desc: "This is not a one-and-done engagement. GLV is Fusion Financial's ongoing web partner, present for changes big and small, and invested in how the site performs over the long term.",
  },
];

const milestones = [
  {
    label: "Production site launched",
    value: "From scratch",
    sub: "Brand-new business, zero to live",
    icon: CheckCircle,
  },
  {
    label: "Organic leads delivered",
    value: "20+",
    sub: "Through search, no paid traffic required",
    icon: TrendingUp,
  },
  {
    label: "Ongoing management",
    value: "Active",
    sub: "GLV maintains the site as a long-term partner",
    icon: RefreshCw,
  },
  {
    label: "Local SEO",
    value: "Configured",
    sub: "On-page optimisation built in at launch",
    icon: Search,
  },
];

const FusionFinancial = () => (
  <Layout>
    <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

    {/* Hero */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "Fusion Financial" },
          ]}
        />
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Fusion <span className="text-gradient">Financial</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            How GLV Marketing built Fusion Financial's production WordPress site from the ground up and continues to manage it as an active partner, delivering organic leads and keeping the site performing as the business grows.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Client Overview Bar */}
    <section className="border-y border-border bg-card">
      <div className="container max-w-4xl py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Industry", value: "Financial Services" },
            { label: "Location", value: "Northern Ontario" },
            { label: "Website", value: "fusionfinancial.ca", link: true },
            { label: "Engagement", value: "2024 to Present" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
              {item.link ? (
                <a
                  href="https://fusionfinancial.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                >
                  {item.value} <ExternalLink size={12} />
                </a>
              ) : (
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Scope of Work */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">What the Site Needed to Do</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
            Fusion Financial came to GLV as a brand-new business ready to launch. The website had to do several things at once:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {scope.map((c) => (
              <div
                key={c.title}
                className="rounded-xl border border-border/50 bg-card p-5 flex gap-4"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <c.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm mb-1">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* What We Built */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8">What We Built</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {solutions.map((s, i) => (
                <div key={s.title} className="flex gap-5 relative">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10 relative">
                    <s.icon className="text-primary" size={18} />
                  </div>
                  <div className="pb-2">
                    <p className="text-[10px] uppercase tracking-wider text-primary/60 mb-1">Step {i + 1}</p>
                    <h3 className="font-heading font-bold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Results */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-center">The Results</h2>
          <p className="text-muted-foreground text-center mb-10">
            Organic leads through search, and a site that keeps performing month over month.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <div key={m.label} className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                    <m.icon className="text-primary" size={16} />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-tight">
                    {m.label}
                  </p>
                </div>
                <p className="text-foreground font-bold text-xl mb-1">{m.value}</p>
                <p className="text-muted-foreground text-xs">{m.sub}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* What We've Maintained */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">What We Have Maintained</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
            The build was the beginning. Fusion Financial is an active GLV client, and the ongoing work is what keeps the site performing:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {maintenance.map((m) => (
              <div
                key={m.title}
                className="rounded-xl border border-border/50 bg-background p-5 flex gap-4"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <m.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm mb-1">{m.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Key Takeaway */}
    <section className="section-padding">
      <div className="container max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Key Takeaway</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Fusion Financial did not need a flashy website. They needed one that builds trust, shows up in search, and keeps working. GLV built it, and GLV keeps it running. That ongoing relationship is what separates a site that peaks at launch from one that compounds over time.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-2xl text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-heading font-bold mb-4">Looking for a long-term web partner?</h2>
          <p className="text-muted-foreground mb-8">
            We build and maintain sites for businesses that want results over the long haul, just like we do for Fusion Financial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Book a Free Consultation <ArrowRight size={18} />
              </Button>
            </Link>
            <Link
              to="/case-studies"
              className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              See More Case Studies <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </Layout>
);

export default FusionFinancial;
