<?php get_header(); ?>

<!-- Hero -->
<section class="relative min-h-[60vh] md:min-h-[90vh] flex items-center overflow-hidden">
    <video autoplay muted loop playsinline
           poster="<?php echo esc_url(get_template_directory_uri() . '/assets/hero-bg.jpg'); ?>"
           class="absolute inset-0 w-full h-full object-cover object-center">
        <source src="<?php echo esc_url(get_template_directory_uri() . '/assets/hero-bg.mp4'); ?>" type="video/mp4">
    </video>
    <div class="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-background via-background/95 to-background/60"></div>

    <div class="container relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center py-8 md:py-0">
        <div>
            <div class="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 glv-animate-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sault Ste. Marie, Ontario</span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4 md:mb-6 glv-animate-in" style="animation-delay:100ms">
                More Customers.<br>
                More Sales.<br>
                <span class="text-gradient">More Growth.</span>
            </h1>

            <p class="text-base md:text-lg text-muted-foreground max-w-lg mb-6 md:mb-8 leading-relaxed glv-animate-in" style="animation-delay:200ms">
                We help local businesses get more customers using smart
                technology and modern marketing. Our tools do the hard work
                so you can focus on what you do best.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 glv-animate-in" style="animation-delay:300ms">
                <a href="<?php echo esc_url(home_url('/contact')); ?>"
                   class="inline-flex items-center justify-center gap-2 rounded-md font-medium px-8 py-4 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg glow-red w-full sm:w-auto">
                    Book a Consultation
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a href="<?php echo esc_url(home_url('/services')); ?>"
                   class="inline-flex items-center justify-center rounded-md font-medium px-8 py-4 text-base border border-primary text-primary bg-transparent hover:bg-primary/10 transition-colors w-full sm:w-auto">
                    Our Services
                </a>
            </div>
        </div>

        <!-- Lead form (desktop only) -->
        <div class="hidden lg:block glv-animate-in" style="animation-delay:400ms">
            <div class="glass rounded-lg p-6 md:p-8 max-w-md mx-auto">
                <h2 class="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">Get a Free Strategy Call</h2>
                <p class="text-sm text-muted-foreground mb-6">Tell us about your business and we'll show you exactly how to get more customers.</p>
                <?php echo do_shortcode('[contact-form-7 id="42" title="GLV Lead Capture"]'); ?>
            </div>
        </div>
    </div>
</section>

<!-- Trusted By -->
<section class="py-6 md:py-8 bg-muted/50 border-y border-border">
    <div class="container">
        <div class="flex flex-col items-center justify-center gap-4 glv-animate-in">
            <p class="text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-wider">
                Trusted by Northern Ontario businesses
            </p>
            <div class="flex items-center gap-6 sm:gap-10">
                <a href="<?php echo esc_url(home_url('/case-studies/titan-tiny-homes')); ?>">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/titan-tiny-homes-logo.png'); ?>"
                         alt="Titan Tiny Homes"
                         class="h-12 sm:h-16 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity">
                </a>
                <a href="<?php echo esc_url(home_url('/case-studies/fusion-financial')); ?>">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/fusion-financial-logo.png'); ?>"
                         alt="Fusion Financial"
                         class="h-12 sm:h-16 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity">
                </a>
                <a href="<?php echo esc_url(home_url('/case-studies/reyco-marine')); ?>">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/reyco-marine-logo-white-h.png'); ?>"
                         alt="Reyco Marine"
                         class="h-10 sm:h-14 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity">
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Services -->
<section class="section-padding">
    <div class="container">
        <div class="text-center mb-8 md:mb-16 glv-animate-in">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
                Tools That <span class="text-gradient">Grow Your Business</span>
            </h2>
            <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                We don't just run ads. We build a complete online system that
                brings in customers, saves you time, and helps your business grow.
            </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            <a href="<?php echo esc_url(home_url('/services/automation')); ?>" class="block h-full glv-animate-in" style="animation-delay:0ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">AI Automation &amp; Systems</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Let smart tools handle boring, repetitive tasks so you can save time and get more done.</p>
                </div>
            </a>

            <a href="<?php echo esc_url(home_url('/services/geo')); ?>" class="block h-full glv-animate-in" style="animation-delay:100ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">Search &amp; Discovery</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Dominate Google, Maps, and AI assistants like ChatGPT so customers always find you first.</p>
                </div>
            </a>

            <a href="<?php echo esc_url(home_url('/services/paid-advertising')); ?>" class="block h-full glv-animate-in" style="animation-delay:200ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m3 11 19-9-9 19-2-8-8-2z"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">Paid Ads</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Run ads on social media that reach the right people and bring real customers to your door.</p>
                </div>
            </a>

            <a href="<?php echo esc_url(home_url('/services/website-design')); ?>" class="block h-full glv-animate-in" style="animation-delay:300ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">Website Design &amp; Management</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Get a fast, good-looking website that works great on phones and helps people find you online.</p>
                </div>
            </a>

            <a href="<?php echo esc_url(home_url('/services/marketing')); ?>" class="block h-full glv-animate-in" style="animation-delay:400ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">Marketing &amp; Lead Gen</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Expert strategy, done-for-you campaigns, and smart follow-ups that turn visitors into customers.</p>
                </div>
            </a>

            <a href="<?php echo esc_url(home_url('/services/custom-ai')); ?>" class="block h-full glv-animate-in" style="animation-delay:500ms">
                <div class="group glass rounded-lg p-5 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 hover:glow-red h-full flex flex-col">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-foreground mb-3">Custom AI Solutions</h3>
                    <p class="text-muted-foreground text-sm leading-relaxed">Purpose-built AI chatbots, agents, and industry-specific tools tailored to your business.</p>
                </div>
            </a>

        </div>
    </div>
</section>

<!-- Stats Bar -->
<section class="py-10 md:py-16 bg-card border-y border-border">
    <div class="container">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-center glv-animate-in">
            <div>
                <p class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-1 md:mb-2">2</p>
                <p class="text-xs sm:text-sm text-muted-foreground">Clients Served</p>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-1 md:mb-2">360%</p>
                <p class="text-xs sm:text-sm text-muted-foreground">Average Traffic Growth</p>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-1 md:mb-2">16+</p>
                <p class="text-xs sm:text-sm text-muted-foreground">Keywords in Google Top 10</p>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-primary mb-1 md:mb-2">0</p>
                <p class="text-xs sm:text-sm text-muted-foreground">Templates. Every Build Is Custom.</p>
            </div>
        </div>
    </div>
</section>

<!-- Testimonials -->
<section class="section-padding">
    <div class="container">
        <div class="text-center mb-8 md:mb-12 glv-animate-in">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
                What Our Clients <span class="text-gradient">Say</span>
            </h2>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

            <div class="glass rounded-lg p-5 sm:p-6 md:p-8 h-full flex flex-col glv-animate-in" style="animation-delay:0ms">
                <div class="flex gap-0.5 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2" class="fill-yellow-500 text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <blockquote class="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic">
                    "Working with Aiden &amp; his team is an absolute pleasure. They are very creative, accessible, experienced, and professional. Also staying on top of all updates with the website. Thank you GLV for all of your support."
                </blockquote>
                <div>
                    <p class="font-heading font-semibold text-foreground">Joseph</p>
                    <a href="<?php echo esc_url(home_url('/case-studies/titan-tiny-homes')); ?>" class="text-xs text-primary hover:underline transition-colors">Titan Tiny Homes →</a>
                </div>
            </div>

            <div class="glass rounded-lg p-5 sm:p-6 md:p-8 h-full flex flex-col glv-animate-in" style="animation-delay:100ms">
                <div class="flex gap-0.5 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <blockquote class="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic">
                    "An absolute game-changer. They took the time to truly understand my brand, my goals, and my target audience. Every campaign felt intentional and well-executed, and the results spoke for themselves. I saw noticeable growth in engagement, stronger brand positioning, and a real impact on leads and sales."
                </blockquote>
                <div>
                    <p class="font-heading font-semibold text-foreground">Tony</p>
                    <a href="<?php echo esc_url(home_url('/case-studies/fusion-financial')); ?>" class="text-xs text-primary hover:underline transition-colors">Fusion Financial →</a>
                </div>
            </div>

            <div class="glass rounded-lg p-5 sm:p-6 md:p-8 h-full flex flex-col glv-animate-in" style="animation-delay:200ms">
                <div class="flex gap-0.5 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <blockquote class="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic">
                    "If you're looking for someone who is talented, reliable, and truly exceptional at what they do, I highly recommend working with them. Amazing experience from start to finish."
                </blockquote>
                <div>
                    <p class="font-heading font-semibold text-foreground">Justin</p>
                    <a href="<?php echo esc_url(home_url('/case-studies/fusion-financial')); ?>" class="text-xs text-primary hover:underline transition-colors">Fusion Financial →</a>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Why GLV -->
<section class="section-padding bg-card border-y border-border">
    <div class="container max-w-3xl">
        <div class="glv-animate-in">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4 sm:mb-6">
                Why Local Businesses Choose <span class="text-gradient">GLV Marketing</span>
            </h2>
            <div class="space-y-4 sm:space-y-6">
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                        <h3 class="font-heading font-semibold text-foreground mb-1">Locally Owned &amp; Operated</h3>
                        <p class="text-muted-foreground text-sm leading-relaxed">We live and work right here in Sault Ste. Marie. We know this area because it's our home too.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    </div>
                    <div>
                        <h3 class="font-heading font-semibold text-foreground mb-1">Focused on Results</h3>
                        <p class="text-muted-foreground text-sm leading-relaxed">Everything we do is meant to bring you more customers and more money; not just likes and views.</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                    </div>
                    <div>
                        <h3 class="font-heading font-semibold text-foreground mb-1">Smart Technology</h3>
                        <p class="text-muted-foreground text-sm leading-relaxed">We use AI tools to give your small business the same power that big companies have.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
