<?php
/**
 * GLV Marketing Theme Functions
 */

defined('ABSPATH') || exit;

// ── Theme Setup ──────────────────────────────────────────────
function glv_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption']);
    add_theme_support('custom-logo');

    register_nav_menus([
        'primary' => __('Primary Navigation', 'glv-marketing'),
        'footer'  => __('Footer Navigation', 'glv-marketing'),
    ]);
}
add_action('after_setup_theme', 'glv_theme_setup');

// ── Enqueue Assets ───────────────────────────────────────────
function glv_enqueue_assets() {
    $ver = '1.0.0';

    // Production CSS bundle from Vite build
    wp_enqueue_style('glv-app', get_template_directory_uri() . '/assets/app.css', [], $ver);
    wp_enqueue_style('glv-cf7-styles', get_template_directory_uri() . '/assets/cf7-styles.css', ['glv-app'], $ver);

    // Google Fonts: Outfit + Inter
    wp_enqueue_style('glv-fonts',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap',
        [], null
    );

    // Theme JS (nav dropdown, scroll animations, cookie consent)
    wp_enqueue_script('glv-app', get_template_directory_uri() . '/assets/app.js', [], $ver, true);

    // Contact form 7 already enqueues its own scripts
}
add_action('wp_enqueue_scripts', 'glv_enqueue_assets');

// ── CSS Variables (design tokens) ────────────────────────────
function glv_css_variables() {
    ?>
    <style>
    :root {
        --background: 0 0% 5%;
        --foreground: 0 0% 95%;
        --card: 0 0% 8%;
        --card-foreground: 0 0% 95%;
        --popover: 0 0% 8%;
        --popover-foreground: 0 0% 95%;
        --primary: 0 72% 42%;
        --primary-foreground: 0 0% 100%;
        --secondary: 0 0% 14%;
        --secondary-foreground: 0 0% 85%;
        --muted: 0 0% 12%;
        --muted-foreground: 0 0% 55%;
        --accent: 0 0% 18%;
        --accent-foreground: 0 0% 90%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 100%;
        --border: 0 0% 16%;
        --input: 0 0% 16%;
        --ring: 0 72% 42%;
        --radius: 0.5rem;
        --silver: 0 0% 75%;
        --silver-foreground: 0 0% 20%;
    }
    * { border-color: hsl(var(--border)); box-sizing: border-box; }
    body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; margin: 0; }
    h1,h2,h3,h4,h5,h6 { font-family: 'Outfit', sans-serif; }
    </style>
    <?php
}
add_action('wp_head', 'glv_css_variables', 1);

// ── Custom Post Types ─────────────────────────────────────────
function glv_register_post_types() {
    // Case Studies
    register_post_type('case_study', [
        'labels' => [
            'name'          => 'Case Studies',
            'singular_name' => 'Case Study',
            'add_new_item'  => 'Add New Case Study',
            'edit_item'     => 'Edit Case Study',
        ],
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => ['slug' => 'case-study-archive'],
        'supports'    => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'show_in_rest' => true,
        'menu_icon'   => 'dashicons-portfolio',
    ]);
}
add_action('init', 'glv_register_post_types');

// ── Case Study meta — REST access ────────────────────────────
foreach ([
    '_glv_cs_subtitle', '_glv_cs_tags', '_glv_cs_industry', '_glv_cs_location',
    '_glv_cs_website', '_glv_cs_website_url', '_glv_cs_engagement',
    '_glv_cs_challenge_heading', '_glv_cs_challenge_intro', '_glv_cs_challenges',
    '_glv_cs_solutions_heading', '_glv_cs_solutions',
    '_glv_cs_results_intro', '_glv_cs_milestones',
    '_glv_cs_maintenance_heading', '_glv_cs_maintenance_intro', '_glv_cs_maintenance',
    '_glv_cs_key_takeaway', '_glv_cs_cta_heading', '_glv_cs_cta_body',
] as $_glv_cs_key) {
    register_meta('post', $_glv_cs_key, [
        'object_subtype' => 'page',
        'type'           => 'string',
        'single'         => true,
        'show_in_rest'   => true,
        'auth_callback'  => fn() => current_user_can('edit_posts'),
    ]);
}
unset($_glv_cs_key);

// ── Slug-based page template routing ─────────────────────────
function glv_page_template($template) {
    if (is_singular('post')) {
        $t = locate_template('single.php');
        return $t ?: $template;
    }
    if (is_home() || is_archive()) {
        $t = locate_template('archive.php');
        return $t ?: $template;
    }
    if (is_page()) {
        $slug = get_post_field('post_name', get_the_ID());
        $slug_template = locate_template("page-{$slug}.php");
        if ($slug_template) return $slug_template;
    }
    return $template;
}
add_filter('template_include', 'glv_page_template');

// ── Blog post category ───────────────────────────────────────
function glv_set_blog_defaults($post_id) {
    if (get_post_type($post_id) !== 'post') return;
    // Ensure posts show in blog archive
}

// ── CF7 redirect to contact page on success ──────────────────
add_filter('wpcf7_form_elements', function($html) {
    return $html;
});

// ── Excerpt length ───────────────────────────────────────────
add_filter('excerpt_length', fn() => 30);
add_filter('excerpt_more', fn() => '…');

// ── Remove emoji scripts ─────────────────────────────────────
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// ── Disable XML-RPC ──────────────────────────────────────────
add_filter('xmlrpc_enabled', '__return_false');
