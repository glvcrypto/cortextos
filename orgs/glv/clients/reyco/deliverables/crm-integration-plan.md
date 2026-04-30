# Reyco CRM Integration Plan
_Triage item #20 — authored by dev agent 2026-04-20_

## Overview

Wire WordPress forms → Supabase `portal_leads` table so every contact, notify-me, and financing enquiry appears in the CRM at `crm.reycomarine.com` automatically. WC/ecommerce checkout wiring is parked (see below).

---

## Forms Inventory

| Form | File | Current behaviour | Data collected |
|------|------|-------------------|----------------|
| Contact | `page-templates/contact.php` | wp_mail to parts.reycomarine@gmail.com | name, email, phone, interest, message |
| Notify Me | `inc/notify-me.php` | AJAX → CPT + wp_mail | name, email, phone, product_id, product_title, product_sku |
| Financing Apply | `inc/financing-apply-handler.php` | admin_post → email + WP options store | full application (30 fields) |

No standalone contact handler existed — form is inline in the template.

---

## CRM Schema (portal_leads)

Confirmed from `glvcrypto/client-site-template` seed data and hooks:

```
portal_leads:
  id                  uuid PK default gen_random_uuid()
  name                text
  email               text (nullable)
  phone               text (nullable)
  lead_type           text  — 'contact' | 'quote_request' | 'financing' | 'service_request' | 'trade_in'
  source              text  — 'website' (for all WP-originated leads)
  status              text  — 'new' (default for all inbound)
  message             text
  landing_page        text
  response_time_minutes integer (nullable)
  created_at          timestamptz
```

---

## Integration Strategy

**Direct Supabase REST API** via `wp_remote_post()` from PHP. No custom Edge Function needed.

Endpoint: `https://rotcgmrxoosyoruzzxad.supabase.co/rest/v1/portal_leads`

Headers:
- `apikey: {REYCO_SUPABASE_ANON_KEY}`
- `Authorization: Bearer {REYCO_SUPABASE_ANON_KEY}`
- `Content-Type: application/json`
- `Prefer: return=minimal`

Fails gracefully (logs to error_log, never breaks form flow).

---

## Field Mapping

### Contact form → portal_leads
| WP field | CRM field | Value |
|----------|-----------|-------|
| contact_name | name | direct |
| contact_email | email | direct |
| contact_phone | phone | direct |
| contact_interest | — | prepended to message |
| contact_message | message | "Interest: {interest} — {message}" |
| — | lead_type | 'contact' |
| — | source | 'website' |
| — | status | 'new' |
| — | landing_page | '/contact/' |

### Notify Me → portal_leads
| WP field | CRM field | Value |
|----------|-----------|-------|
| notify_name | name | direct |
| notify_email | email | direct |
| notify_phone | phone | direct |
| product_title + sku | message | "Notify when available: {title} (SKU: {sku})" |
| — | lead_type | 'quote_request' |
| — | source | 'website' |
| — | status | 'new' |
| — | landing_page | product permalink |

### Financing Application → portal_leads
| WP field | CRM field | Value |
|----------|-----------|-------|
| first_name + last_name | name | direct |
| email | email | direct |
| phone | phone | direct |
| product_type, product_model, product_price, down_payment, term | message | summary string |
| — | lead_type | 'financing' |
| — | source | 'website' |
| — | status | 'new' |
| — | landing_page | '/financing/apply/' |

---

## BUILT (shipped in feat/crm-integration PR)

- `inc/crm-integration.php` — `reyco_crm_push_lead()` helper + constants check
- `page-templates/contact.php` — pushes to CRM after wp_mail (additive, inline)
- `inc/notify-me.php` — pushes to CRM after existing CPT create + wp_mail
- `inc/financing-apply-handler.php` — pushes to CRM after existing email + WP options store
- `functions.php` — require_once for crm-integration.php

---

## PARKED — requires user decisions

| Item | Why parked | What user needs to decide |
|------|------------|---------------------------|
| **WC checkout → store_orders** | store_orders table has payment/shipping/tax model — needs user to confirm product data model and whether WP is the source of truth or Lightspeed is | Confirm if WP checkout is live path or just catalogue display |
| **Service booking form** | No booking form exists in WP yet; service_catalogue in Supabase needs setup first | Build service booking UI as a separate ticket |
| **SUPABASE_ANON_KEY in wp-config** | Not in repo (blank .env.example). User must add 2 constants to wp-config.php | See below |

---

## Required User Action (before PR can be activated)

Add to `wp-config.php` on the SiteGround server (via SSH or File Manager):

```php
define( 'REYCO_SUPABASE_URL', 'https://rotcgmrxoosyoruzzxad.supabase.co' );
define( 'REYCO_SUPABASE_ANON_KEY', '<your-anon-key-from-crm/.env>' );
```

**The code gracefully no-ops if these constants are missing** — forms still email and save to WP options as before. The CRM push is purely additive.

---

## Open Question: RLS Policy on portal_leads

The Supabase template's `service_bookings` table has `"Anyone can insert bookings"` RLS policy. If `portal_leads` has a similar anon-insert policy, the anon key is sufficient. If not, a Supabase service-role key (stored in wp-config, never committed to git) would be needed instead. **Verify in Supabase dashboard before activating.**

_If RLS blocks anon insert: swap `REYCO_SUPABASE_ANON_KEY` for `REYCO_SUPABASE_SERVICE_KEY` in wp-config — no code change required._
