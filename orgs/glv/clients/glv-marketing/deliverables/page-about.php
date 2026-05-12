<?php get_header(); ?>

<section class="py-12 md:py-16">
    <div class="container max-w-4xl">

        <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="hover:text-primary transition-colors">Home</a>
            <span>&rsaquo;</span>
            <span class="text-foreground">About</span>
        </nav>

        <div class="glv-animate-in">
            <div class="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sault Ste. Marie, Ontario</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-heading font-bold mb-6">
                Built in the Sault.<br>
                <span class="text-gradient">Built for Growth.</span>
            </h1>
            <p class="text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
                GLV Marketing is a locally owned marketing agency in Northern Ontario.
                We help small and medium businesses grow online using smart tools
                and modern marketing. Check out our
                <a href="<?php echo esc_url(home_url('/services')); ?>" class="text-primary hover:underline">services</a> or see our
                <a href="<?php echo esc_url(home_url('/case-studies')); ?>" class="text-primary hover:underline">case studies</a> to learn how we've helped businesses like yours.
            </p>
        </div>
    </div>
</section>

<!-- Mission / Values -->
<section class="section-padding bg-card border-y border-border">
    <div class="container max-w-4xl">
        <div class="grid md:grid-cols-3 gap-6 glv-animate-in">
            <div class="glass rounded-lg p-6">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 class="font-heading font-semibold text-foreground mb-2">Locally Rooted</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">We live and work in Sault Ste. Marie. We understand the local market, the challenges, and the opportunities better than anyone from away.</p>
            </div>
            <div class="glass rounded-lg p-6">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 class="font-heading font-semibold text-foreground mb-2">Results First</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">Every decision we make is tied to a measurable outcome. We track, optimize, and report — no vanity metrics, just real business growth.</p>
            </div>
            <div class="glass rounded-lg p-6">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
                <h3 class="font-heading font-semibold text-foreground mb-2">AI-Powered Edge</h3>
                <p class="text-sm text-muted-foreground leading-relaxed">We give small businesses access to the same AI tools that enterprise companies use — levelling the playing field for local operators.</p>
            </div>
        </div>
    </div>
</section>

<!-- Team -->
<section class="section-padding">
    <div class="container max-w-4xl">
        <div class="mb-10 glv-animate-in">
            <h2 class="text-2xl md:text-3xl font-heading font-bold mb-2">Meet the Team</h2>
            <p class="text-muted-foreground">The people behind the strategy, the builds, and the results.</p>
        </div>
        <div id="glv-team-grid" class="glv-animate-in">
            <div class="rounded-xl border border-border/50 bg-card p-6 flex flex-col" id="glv-team-card">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 rounded-full bg-muted shrink-0 overflow-hidden">
                        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/aiden-glave.jpg'); ?>"
                             alt="Aiden Glave"
                             class="w-full h-full object-cover" style="object-position: center 30%;">
                    </div>
                    <div>
                        <h3 class="text-xl font-heading font-bold text-foreground">Aiden Glave</h3>
                        <p class="text-sm text-primary font-medium">CEO, Chief Executive Officer</p>
                    </div>
                </div>
                <p class="text-muted-foreground leading-relaxed text-sm">
                    Aiden Glave is the founder and lead strategist behind GLV Marketing. With a background blending hands-on technical execution and performance-driven marketing, he approaches every project as a systems problem first, ensuring branding, websites, advertising, and automation all work together rather than in isolation.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section-padding bg-card border-t border-border">
    <div class="container max-w-2xl text-center glv-animate-in">
        <h2 class="text-2xl md:text-3xl font-heading font-bold mb-4">Ready to Grow?</h2>
        <p class="text-muted-foreground mb-8">Book a free 30-minute consultation and let's talk about your business goals.</p>
        <a href="<?php echo esc_url(home_url('/contact')); ?>"
           class="inline-flex items-center gap-2 rounded-md font-medium px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg glow-red">
            Book a Free Consultation
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
    </div>
</section>

<style>
#glv-team-grid {
    display: flex;
    justify-content: center;
}
#glv-team-card {
    width: 100%;
    max-width: 580px;
}
</style>

<?php get_footer(); ?>
