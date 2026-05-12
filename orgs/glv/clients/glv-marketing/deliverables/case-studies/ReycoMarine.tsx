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
  Store,
  ShieldCheck,
  Layout as LayoutIcon,
  Target,
  Code,
  FileText,
  Quote,
  Star,
  ExternalLink,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

// ─── DRAFT — Awaiting Aiden QC ───────────────────────────────────────────────
// Flags:
//   [FLAG-1] Casey quote: none on file — placeholder below, must be replaced before publish
//   [FLAG-2] GSC traffic/rankings: baseline snapshot taken May 7; live impressions/clicks
//             not yet available. Request May 6-12 GSC performance export from Aiden to update
//             the target keywords table with real position + CTR data.
//   [FLAG-3] GBP: not confirmed by SEO — verify GBP setup status before citing as deliverable
// ─────────────────────────────────────────────────────────────────────────────

const seo = {
  title: "Reyco Marine Case Study | GLV Marketing",
  description:
    "How GLV Marketing built Reyco Marine's production website, completed a pre-launch security audit, and activated a 62-funnel SEO retainer to grow Northern Ontario's premier marine and outdoor power dealer online.",
  canonical: "https://glvmarketing.ca/case-studies/reyco-marine",
};

const tags = ["WordPress Development", "WooCommerce", "Local SEO", "Security Audit", "Content Strategy"];

const challenges = [
  {
    icon: Globe,
    title: "No Customer-Facing Website",
    desc: "Reyco operated through an internal staging subdomain. Customers had no online destination to browse inventory, book service, or research their 11 authorized brands.",
  },
  {
    icon: Search,
    title: "Zero Search Visibility",
    desc: "With no indexed production site, Reyco was invisible to buyers searching for marine service, Mercury dealers, or outdoor power equipment in Northern Ontario.",
  },
  {
    icon: Store,
    title: "Complex Product Catalogue",
    desc: "11 authorized brands across marine, lawn, snow, and ATV/UTV — plus seasonal services and parts — required a structured WooCommerce architecture, not a basic brochure site.",
  },
  {
    icon: ShieldCheck,
    title: "Security Before Scale",
    desc: "Launching a WooCommerce store without a pre-launch security review risked exposing the business to known vulnerabilities on day one.",
  },
];

const solutions = [
  {
    icon: LayoutIcon,
    title: "WordPress + WooCommerce Build",
    desc: "Full production site built on WordPress with WooCommerce. Structured around 11 authorized brands — Echo, Princecraft, R&J, Toro, Mercury, EZGO, Cub Cadet, Minn Kota, Cannon, Humminbird, and Hisun — plus service categories covering marine, small engine, lawn, snow, and ATV/UTV. Canadian English throughout, mobile-responsive, fast load times on SiteGround hosting.",
  },
  {
    icon: ShieldCheck,
    title: "Pre-Launch Security Audit",
    desc: "Independent Tier 0 security review before public launch. All findings documented and remediated prior to cutover. Site cleared for production deployment — protecting the business and its customers from day one.",
  },
  {
    icon: Code,
    title: "Domain Migration",
    desc: "Clean cutover from the internal staging environment (reyco.glvmarketing.ca) to the production domain (reycomarine.com) on May 6, 2026. Redirect structure preserved any early crawl signal and prevented split-authority issues.",
  },
  {
    icon: Target,
    title: "SEO Foundation",
    desc: "Keyword research targeting Northern Ontario marine, small engine, and outdoor power searches. On-page optimisation across all product and service pages — including brand, category, and location targeting. 62 content funnels designed and staged for monthly deployment.",
  },
  {
    icon: FileText,
    title: "SEO Audit + Content Architecture",
    desc: "586-page SEO audit completed across the full site. 196 product meta descriptions and 160 product alt-text entries written and deployed (A1 and A2 batches). LocalBusiness schema deployed site-wide. 12-month blog calendar produced (96 posts) across key service and brand topics. LSA eligibility brief prepared — Reyco qualifies for Local Services Ads in marine, small engine, and outdoor power categories.",
  },
  {
    icon: TrendingUp,
    title: "Monthly SEO Retainer",
    desc: "Ongoing engagement activated May 2026. Monthly content deployments across 62 staged funnels, technical health monitoring, and quarterly strategy reviews — compounding organic reach month over month as the GSC baseline matures.",
  },
];

// Launch milestones — verified with SEO agent May 12, 2026
// [FLAG-2] Supplement with GSC traffic data once Aiden exports May 6-12 performance report
const milestones = [
  {
    label: "Production site launched",
    value: "May 6, 2026",
    sub: "reycomarine.com — live on SiteGround",
    icon: CheckCircle,
  },
  {
    label: "Product SEO deployed",
    value: "356 assets",
    sub: "196 meta descriptions + 160 alt-text entries",
    icon: FileText,
  },
  {
    label: "Content funnels staged",
    value: "62",
    sub: "Ready for monthly deployment",
    icon: TrendingUp,
  },
  {
    label: "Pages audited",
    value: "586",
    sub: "Full-site SEO audit completed",
    icon: Search,
  },
  {
    label: "Pre-launch security",
    value: "Cleared",
    sub: "Tier 0 audit — all findings remediated",
    icon: ShieldCheck,
  },
  {
    label: "Blog calendar",
    value: "96 posts",
    sub: "12-month content plan — ready to deploy",
    icon: Store,
  },
];

// Target keywords — will be replaced with ranking data once GSC baseline lands [FLAG-2]
const targetKeywords = [
  { keyword: "reyco marine sault ste marie", status: "Targeting" },
  { keyword: "mercury outboard dealer northern ontario", status: "Targeting" },
  { keyword: "marine service sault ste marie", status: "Targeting" },
  { keyword: "toro lawn mower dealer ssm", status: "Targeting" },
  { keyword: "small engine repair sault ste marie", status: "Targeting" },
];

const ReycoMarine = () => (
  <Layout>
    <SEOHead title={seo.title} description={seo.description} canonical={seo.canonical} />

    {/* Hero */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Case Studies", href: "/case-studies" },
            { label: "Reyco Marine" },
          ]}
        />
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Reyco <span className="text-gradient">Marine</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            How GLV Marketing built a production WooCommerce site, ran a pre-launch security audit, and activated a 62-funnel SEO retainer for Northern Ontario's premier marine and outdoor power dealer.
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
            { label: "Industry", value: "Marine & Outdoor Power" },
            { label: "Location", value: "Sault Ste. Marie, Ontario" },
            { label: "Website", value: "reycomarine.com", link: true },
            { label: "Engagement", value: "2026 – Present" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
              {item.link ? (
                <a
                  href="https://reycomarine.com"
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
            Reyco Marine is a Sault Ste. Marie institution — a full-service dealer for marine, lawn, snow, and ATV/UTV equipment, with an in-house service team and an authorized parts department. Despite a strong local reputation, they faced a significant gap online:
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

    {/* What We Did */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8">What We Did</h2>
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

    {/* Results — Launch Milestones */}
    <section className="section-padding">
      <div className="container max-w-4xl">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-center">The Results</h2>
          <p className="text-muted-foreground text-center mb-10">
            Launch milestones — May 2026. Organic traffic data updates as GSC baseline establishes.
          </p>

          {/* Milestone Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
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

          {/* Target Keywords */}
          <h3 className="font-heading font-bold text-lg mb-2 text-center">Target Keywords</h3>
          <p className="text-muted-foreground text-sm text-center mb-4">
            Ranking data will appear here as GSC baseline establishes (~28 days post-launch).
          </p>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Keyword</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {targetKeywords.map((k) => (
                  <tr key={k.keyword} className="border-b border-border/30 last:border-0">
                    <td className="p-3 font-medium">{k.keyword}</td>
                    <td className="p-3 text-center">
                      <Badge variant="secondary" className="text-[10px]">{k.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Testimonial — [FLAG-1] No Casey quote on file. Replace placeholder before publishing. */}
    <section className="section-padding bg-primary/5 border-y border-primary/10">
      <div className="container max-w-3xl text-center">
        <AnimatedSection>
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} className="text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <Quote className="mx-auto text-primary/30 mb-4" size={40} />
          {/* [FLAG-1] PLACEHOLDER — replace with Casey's actual quote before publishing */}
          <blockquote className="text-lg md:text-xl font-heading italic text-foreground/90 mb-6 leading-relaxed">
            "[Quote from Casey — pending. Confirm with Aiden before publishing.]"
          </blockquote>
          <p className="text-muted-foreground font-medium">- Casey, Owner, Reyco Marine</p>
        </AnimatedSection>
      </div>
    </section>

    {/* Key Takeaway */}
    <section className="section-padding">
      <div className="container max-w-3xl text-center">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Key Takeaway</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Reyco Marine had the reputation and the inventory. What they needed was a digital foundation worthy of both. By launching a production WooCommerce site with a clean security record, a structured content architecture, and 62 organic funnels already staged, GLV Marketing positioned Reyco to compound search visibility month over month — not start from scratch after launch.
          </p>
        </AnimatedSection>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-card border-y border-border">
      <div className="container max-w-2xl text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to grow your business online?</h2>
          <p className="text-muted-foreground mb-8">
            Let's build a strategy that works for you, just like we did for Reyco Marine.
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

export default ReycoMarine;
