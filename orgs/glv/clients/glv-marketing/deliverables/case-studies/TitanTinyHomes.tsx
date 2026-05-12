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
  Smartphone,
  Home,
  Layers,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Target,
} from "lucide-react";

const seo = {
  title: "Titan Tiny Homes Case Study | GLV Marketing",
  description:
    "How GLV Marketing built Titan Tiny Homes' production WordPress site from scratch, structuring a modular home catalogue, mobile-first design, and organic discovery architecture for a brand-new business entering a competitive market.",
  canonical: "https://glvmarketing.ca/case-studies/titan-tiny-homes",
};

const tags = ["WordPress Development", "Service Catalogue", "Mobile-First", "Local SEO"];

const challenges = [
  {
    icon: Globe,
    title: "Starting from Zero",
    desc: "Titan Tiny Homes launched as a brand-new business with no web presence and no Google footprint. Every customer and every lead had to come from a standing start.",
  },
  {
    icon: Search,
    title: "A Competitive Search Landscape",
    desc: "Tiny home and modular build searches are dominated by established players. Titan needed a site built for organic discovery, not a brochure that would sit unfound.",
  },
  {
    icon: Layers,
    title: "Complex Offering to Organize",
    desc: "Tiny homes, modular builds, floor plans, custom options, and services needed clear structure. Buyers have to understand the offering before they will ever make contact.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Buyers",
    desc: "Homebuyers research on their phones. A site that did not perform on mobile was a site that would not convert.",
  },
];

const solutions = [
  {
    icon: Home,
    title: "Custom WordPress Build",
    desc: "Full production site built on WordPress. Mobile-responsive from the ground up, fast load times, and structured for the kind of browsing behaviour that leads to an inquiry, not a bounce.",
  },
  {
    icon: Layers,
    title: "Structured Product + Service Catalogue",
    desc: "Titan's full offering organized into a clean catalogue: tiny home models, modular builds, floor plan options, and services. Built so buyers can find exactly what they are looking for, and understand what makes Titan different.",
  },
  {
    icon: Target,
    title: "Organic Discovery Architecture",
    desc: "On-page SEO configuration across every product and service page. Meta descriptions, title tags, schema markup, and local targeting, built in at launch so the site starts earning search visibility from day one, not after the fact.",
  },
  {
    icon: TrendingUp,
    title: "Brand-New Business Launch",
    desc: "Zero to live: Google-indexed, findable, and ready to receive customers from the moment the domain went public. No existing traffic to protect, no technical debt to inherit. A clean foundation built to grow.",
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
    label: "Catalogue structure",
    value: "Full offering",
    sub: "Models, floor plans, services, all organized",
    icon: Layers,
  },
  {
    label: "Organic discovery",
    value: "Built in",
    sub: "On-page SEO configured at launch",
    icon: Search,
  },
  {
    label: "Mobile performance",
    value: "Responsive",
    sub: "Optimized for how buyers actually browse",
    icon: Smartphone,
  },
  {
    label: "Organic lead pull",
    value: "Active",
    sub: "Site drives real customer inquiries through search",
    icon: TrendingUp,
  },
];

const TitanTinyHomes = () => (
  <Layout>
    <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

    {/* Hero */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "Titan Tiny Homes" },
          ]}
        />
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Titan <span className="text-gradient">Tiny Homes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            How GLV Marketing built a production WordPress site from scratch for a brand-new modular home builder, structured for organic discovery and designed to pull in real customers from a standing start.
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
            { label: "Industry", value: "Modular & Tiny Homes" },
            { label: "Location", value: "Northern Ontario" },
            { label: "Website", value: "titantinyhomes.ca", link: true },
            { label: "Engagement", value: "2025 to Present" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
              {item.link ? (
                <a
                  href="https://titantinyhomes.ca"
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

    {/* The Challenge */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">The Challenge</h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mb-8">
            Titan Tiny Homes entered the market as a brand-new business with a strong product and no digital presence. The challenge was not fixing a broken website. It was building one that could compete for attention from day one:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {challenges.map((c) => (
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
            A brand-new business, online and earning organic attention from launch.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

    {/* Key Takeaway */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Key Takeaway</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A strong product is not enough if no one can find it. GLV Marketing gave Titan Tiny Homes the digital foundation their build quality deserved: a site that organizes their offering clearly, performs on every device, and pulls in real customers through organic search. Built from scratch, built to last.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding">
      <div className="container max-w-2xl text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to build your business online?</h2>
          <p className="text-muted-foreground mb-8">
            Let's build a site that earns customers, just like we did for Titan Tiny Homes.
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

export default TitanTinyHomes;
