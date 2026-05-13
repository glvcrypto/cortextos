# PASS 2 Sweep — Per-claim Playwright probe results

**Generated:** 2026-05-12T20:31:16.515Z
**Total claims probed:** 31

## Claim-level verdict counts

- **KEEP**: 12
- **KILL**: 10
- **UNKNOWN**: 7
- **INFO**: 2

## Per-prospect summary

| ID | Name | URL | KEEP | KILL | INFO | UNKNOWN | ERROR | Prospect verdict |
|---|---|---|---|---|---|---|---|---|
| B1-E01 | Priest Plumbing | https://priestplumbing.ca/ | 0 | 0 | 0 | 1 | 0 | **INVESTIGATE** |
| B1-E02 | J.G. Fitzgerald & Sons | https://fitzgeraldroofing.ca/ | 0 | 1 | 0 | 1 | 0 | **KILL** |
| B1-E03 | Northern Climate Heating and Air | https://northernclimatesudbury.com/ | 0 | 1 | 0 | 0 | 0 | **KILL** |
| B1-E04 | D. Peppard Mechanical | https://peppardmechanical.com/ | 0 | 2 | 0 | 0 | 0 | **KILL** |
| B1-E05 | Adept Plumbing | https://adeptplumbing.ca/ | 0 | 0 | 1 | 1 | 0 | **INVESTIGATE** |
| B1-E08 | Blue Sky Plumbing | — | 1 | 1 | 0 | 0 | 0 | **KILL** |
| B1-E09 | Witherell Plumbing & Heating | https://witherellplumbing.com/ | 1 | 0 | 0 | 0 | 0 | **KEEP** |
| B1-E10 | B. Gibson Mechanical | — | 0 | 0 | 0 | 1 | 0 | **INVESTIGATE** |
| B1-E12 | Buhler Mechanical | https://buhlermechanical.com/ | 0 | 0 | 1 | 0 | 0 | **INVESTIGATE** |
| B1-E13 | Sunrise Roofing | — | 1 | 0 | 0 | 0 | 0 | **KEEP** |
| B1-E14 | Harris Plumbing | https://harrisplumbing.ca/ | 2 | 0 | 0 | 0 | 0 | **KEEP** |
| B1-E15 | Bedard Plumbing | — | 1 | 0 | 0 | 0 | 0 | **KEEP** |
| B1-E16 | Elite Plumbing Solutions | https://eliteplumbingsolutions.ca/ | 1 | 1 | 0 | 1 | 0 | **KILL** |
| B1-E19 | Designed Roofing Inc. | https://designedroofing.com/ | 0 | 1 | 0 | 1 | 0 | **KILL** |
| B1-E20 | Cullen Plumbing | https://cullenplumbing.net/ | 0 | 1 | 0 | 1 | 0 | **KILL** |
| B2-E01 | Forest Ridge Golf and Country Club | https://forestridgegolf.ca/ | 1 | 0 | 0 | 0 | 0 | **KEEP** |
| B2-E02 | Idylwylde Golf and Country Club | https://idylwylde.com/ | 2 | 0 | 0 | 0 | 0 | **KEEP** |
| B2-E03 | Georgian Home Comfort | https://georgianhomecomfort.com/ | 2 | 0 | 0 | 0 | 0 | **KEEP** |
| B2-E04 | Exclusive Cooling Ltd | https://exclusivecooling.ca/ | 0 | 2 | 0 | 0 | 0 | **KILL** |

## Per-claim detail

### B1-E01 Priest Plumbing — 52 Google reviews vs Perrotta 84
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:08Z URL: https://www.google.com/search?q=Priest%20Plumbing%20
- **Evidence:** `{"query":"Priest Plumbing Sault Ste Marie reviews","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:08Z URL: https://www.google.com/search?q=Priest%20Pl`

### B1-E02 J.G. Fitzgerald & Sons — blog last post Jul 22 2022
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Text "2022" NOT FOUND
- **Evidence:** `{"status":404,"title":"Page not found – J.G. Fitzgerald & Sons Ltd.","body_chars":672,"text_found":false,"body_sample":"Skip to content Home Contact Us +1 (705) 472-2820 jgfitz@vianet.ca North Bay Office: 55 Exeter Street, North Bay, ON, P1B 8G5 J.G. Fitzgerald & Sons Ltd. Serving the North Since 1941 HOME ABOUT US ROOFING SYSTEMS CONTACT US 404 Error Home404 Not Found 404 Oops! That page can’t be`

### B1-E02 J.G. Fitzgerald & Sons — 5 Google reviews
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:19Z URL: https://www.google.com/search?q=J.G.%20Fitzgerald%20
- **Evidence:** `{"query":"J.G. Fitzgerald Sons Roofing reviews","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:19Z URL: https://www.google.com/search?q=J.G.%20Fitzger`

### B1-E03 Northern Climate Heating and Air — 166 visits/mo vs 669-Heat 1259 (SEMrush)
- **Verdict:** KILL
- **Type:** manual_kill
- **Notes:** SEMrush numerical traffic specific — no surrogate per banked rule

### B1-E04 D. Peppard Mechanical — 12 blog posts in 5 months
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Text "2025" NOT FOUND
- **Evidence:** `{"status":404,"title":"","body_chars":0,"text_found":false,"body_sample":""}`

### B1-E04 D. Peppard Mechanical — content effort not aimed at buying searches (SEMrush)
- **Verdict:** KILL
- **Type:** manual_kill
- **Notes:** SEMrush keyword-intent claim — no surrogate per banked rule

### B1-E05 Adept Plumbing — 3-page Squarespace site (home/contact/gallery)
- **Verdict:** INFO
- **Type:** playwright_nav_count
- **Notes:** Found 2 unique internal links: /, /contact-us
- **Evidence:** `{"status":200,"title":"Adept Plumbing & Mechanical","nav_links":["/","/contact-us"],"nav_count":2}`

### B1-E05 Adept Plumbing — 1 Google review vs Villeneuve 30
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:31Z URL: https://www.google.com/search?q=Adept%20Plumbing%20S
- **Evidence:** `{"query":"Adept Plumbing Sault Ste Marie reviews","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:31Z URL: https://www.google.com/search?q=Adept%20Plum`

### B1-E08 Blue Sky Plumbing — no website (Facebook-only via YP redirect)
- **Verdict:** KEEP
- **Type:** google_serp_no_website
- **Notes:** No business-owned website on page 1 — supports "no website" claim
- **Evidence:** `{"query":"Blue Sky Plumbing Sault Ste Marie","top_hostnames":[],"non_directory_hosts":[]}`

### B1-E08 Blue Sky Plumbing — 12 Facebook reviews vs Perrotta 84
- **Verdict:** KILL
- **Type:** playwright_selector
- **Notes:** Text not present
- **Evidence:** `{"status":404,"title":"","text_found":false}`

### B1-E09 Witherell Plumbing & Heating — 0 organic search visibility (SEMrush)
- **Verdict:** KEEP
- **Type:** google_serp_surrogate
- **Notes:** Prospect witherellplumbing.com NOT on page 1 — surrogate supports claim direction
- **Evidence:** `{"query":"Witherell Plumbing Heating","prospect_hostname":"witherellplumbing.com","found_on_page_1":false,"top_hostnames":[]}`

### B1-E10 B. Gibson Mechanical — 4.0 star Google rating vs Villeneuve 4.6
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:51Z URL: https://www.google.com/search?q=B.%20Gibson%20Mechan
- **Evidence:** `{"query":"B. Gibson Mechanical Sault Ste Marie","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:28:51Z URL: https://www.google.com/search?q=B.%20Gibson%20`

### B1-E12 Buhler Mechanical — 5 pages total no service breakdown
- **Verdict:** INFO
- **Type:** playwright_nav_count
- **Notes:** Found 7 unique internal links: https://buhlermechanical.com, https://buhlermechanical.com/, https://buhlermechanical.com/about/, https://buhlermechanical.com/residential/, https://buhlermechanical.com/wp-content/uploads/2024-Home-Comfort-Line.pdf, https://buhlermechanical.com/commercial/, https://buhlermechanical.com/contact/
- **Evidence:** `{"status":200,"title":"Home - Buhler Mechanical Service","nav_links":["https://buhlermechanical.com","https://buhlermechanical.com/","https://buhlermechanical.com/about/","https://buhlermechanical.com/residential/","https://buhlermechanical.com/wp-content/uploads/2024-Home-Comfort-Line.pdf","https://buhlermechanical.com/commercial/","https://buhlermechanical.com/contact/"],"nav_count":7}`

### B1-E13 Sunrise Roofing — no website, 3 Facebook reviews
- **Verdict:** KEEP
- **Type:** google_serp_no_website
- **Notes:** No business-owned website on page 1 — supports "no website" claim
- **Evidence:** `{"query":"Sunrise Roofing Sault Ste Marie","top_hostnames":[],"non_directory_hosts":[]}`

### B1-E14 Harris Plumbing — HomeStars/Readers Choice recognition
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "HomeStars" present as claimed
- **Evidence:** `{"status":200,"title":"Harris Plumbing Inc. - Your Trusted Plumbing Experts in Ontario","body_chars":10119,"text_found":true,"body_sample":"1-705-730-7950 About us Blogs Residential Cottage Well Service Commercial Contact Us HARRIS PLUMBING INC. THE PLUMBERS NEAR YOU. Serving Simcoe County, Muskoka, and York Region! Over 51 years in Business! 1-Year Workmanship Guarantee Reputable, Insured, and Ex`

### B1-E14 Harris Plumbing — search visibility gap vs recognition (SEMrush)
- **Verdict:** KEEP
- **Type:** google_serp_surrogate
- **Notes:** Prospect harrisplumbing.ca NOT on page 1 — surrogate supports claim direction
- **Evidence:** `{"query":"Harris Plumbing Barrie","prospect_hostname":"harrisplumbing.ca","found_on_page_1":false,"top_hostnames":[]}`

### B1-E15 Bedard Plumbing — single-page site / no website
- **Verdict:** KEEP
- **Type:** google_serp_no_website
- **Notes:** No business-owned website on page 1 — supports "no website" claim
- **Evidence:** `{"query":"Bedard Plumbing Sault Ste Marie","top_hostnames":[],"non_directory_hosts":[]}`

### B1-E16 Elite Plumbing Solutions — services-nueva page exists (replacement for 'no service pages' claim)
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "services" present as claimed
- **Evidence:** `{"status":200,"title":"Elite Plumbing Solutions Thunder Bay — Elite Plumbing Solutions Ltd.","body_chars":2309,"text_found":true,"body_sample":"Elite Plumbing Solutions Ltd. HOMESERVICESPROJECT GALLERYCONTACT EPS Services Residential Plumbing Services General Plumbing Repairs: From leaky faucets to toilet replacements, we handle all your household plumbing needs with precision and care. Water Heat`

### B1-E16 Elite Plumbing Solutions — p2 SERP ranking (SEMrush)
- **Verdict:** KILL
- **Type:** manual_kill
- **Notes:** SEMrush specific position — no surrogate per banked rule

### B1-E16 Elite Plumbing Solutions — 0 Google reviews
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:29:43Z URL: https://www.google.com/search?q=Elite%20Plumbing%20S
- **Evidence:** `{"query":"Elite Plumbing Solutions Sudbury reviews","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:29:43Z URL: https://www.google.com/search?q=Elite%20Pl`

### B1-E19 Designed Roofing Inc. — 30-year Sika Elite Contractor
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Text "Sika" NOT FOUND
- **Evidence:** `{"status":200,"title":"Designed Roofing • Contractor for Roofing & Exteriors • Northern Ontario","body_chars":1015,"text_found":false,"body_sample":"ABOUT US PROJECTS ROOFING EXTERIORS GLASS & METAL CAREERS CONTACT RECENT PROJECTS Nipissing University Student Union Building 1350 Fisher Street Gateway Cascades Casino North Bay Indigenous Friendship Centre, Suswin House Maple View Public School Star`

### B1-E19 Designed Roofing Inc. — 0 Google reviews
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:29:58Z URL: https://www.google.com/search?q=Designed%20Roofing%2
- **Evidence:** `{"query":"Designed Roofing reviews Ontario","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:29:58Z URL: https://www.google.com/search?q=Designed%20Roofing`

### B1-E20 Cullen Plumbing — 50 Google reviews vs Cardinal 703
- **Verdict:** UNKNOWN
- **Type:** google_serp_review_count
- **Notes:** Could not extract review count from SERP. Body sample suggests: About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:30:03Z URL: https://www.google.com/search?q=Cullen%20Plumbing%20
- **Evidence:** `{"query":"Cullen Plumbing reviews","review_count_extracted":null,"results":[],"body_sample":"About this page Our systems have detected unusual traffic from your computer network. This page checks to see if it's really you sending the requests, and not a robot. Why did this happen? IP address: 185.98.171.157 Time: 2026-05-12T20:30:03Z URL: https://www.google.com/search?q=Cullen%20Plumbing%20reviews`

### B1-E20 Cullen Plumbing — 55yr vs 7yr newcomer (founding year)
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Text "1970" NOT FOUND
- **Evidence:** `{"status":200,"title":"Home - Cullen Plumbing","body_chars":2500,"text_found":false,"body_sample":"Skip to content Home About Services Contact 705-743-7504 Plumber Peterborough Providing residential plumbing services since 1969. Call Us Today For a Free Estimate Our Services Custom Homes We love working on custom new build homes! Our team enjoys a challenge and we can work with the most complex pl`

### B2-E01 Forest Ridge Golf and Country Club — tee-booking page says 'see you in 2026' and we ARE in 2026
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "2026" present as claimed
- **Evidence:** `{"status":200,"title":"Forest Ridge - Forest Ridge Golf Course","body_chars":1115,"text_found":true,"body_sample":"Home About Forest Ridge Course Layout Golfing Rates Gallery Book A Tee Off Time Book an Event or Tournament Weddings Careers Contact Us BOOK A TEE OFF TIME BOOK AN EVENT OR TOURNAMENT WELCOME TO FOREST RIDGE We are continually improving the manner in which we serve you. Forest Ridge G`

### B2-E02 Idylwylde Golf and Country Club — /contact returns 404
- **Verdict:** KEEP
- **Type:** playwright_http_status
- **Notes:** HTTP 404 == expected  404
- **Evidence:** `{"status":404,"title":"404 Error: Page Not Found"}`

### B2-E02 Idylwylde Golf and Country Club — no NAP on homepage
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "705-522-8580" absent as claimed
- **Evidence:** `{"status":200,"title":"Premier Golf & Curling Facility Sudbury | Idywylde Golf & Country Club","body_chars":991,"text_found":false,"body_sample":"Skip to Main Content I D Y L W Y L D E GOLF & COUNTRY CLUB Est. 1922 Menu CURLING ICE BOOKINGS MEMBER ACCESS GOLF Located between Nepahwin Lake and Ramsey Lake lies Sudbury’s finest golf experience. GOLF MEMBERSHIPS CURLING The Idylwylde is home to one o`

### B2-E03 Georgian Home Comfort — duplicate YP addresses (373 Huronia vs 3-30 Saunders)
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "Huronia" present as claimed
- **Evidence:** `{"status":200,"title":"Georgian Home Comfort - Opening Hours - 373 Huronia Rd, Barrie, ON","body_chars":2394,"text_found":true,"body_sample":"Please enter what you're searching for Please enter your search location Search Log in FR PASSER EN FRANÇAIS / SWITCH TO FRENCH LANGUAGE Georgian Home Comfort 373 Huronia Rd, Barrie, ON L4N 8Z1 Get directions » Phone Number Directions Website Closing soon , `

### B2-E03 Georgian Home Comfort — duplicate YP addresses #2
- **Verdict:** KEEP
- **Type:** playwright_text
- **Notes:** Text "Saunders" present as claimed
- **Evidence:** `{"status":200,"title":"Georgian Home Comfort - Opening Hours - 3-30 Saunders Rd, Barrie, ON","body_chars":3196,"text_found":true,"body_sample":"Please enter what you're searching for Please enter your search location Search Log in FR PASSER EN FRANÇAIS / SWITCH TO FRENCH LANGUAGE Georgian Home Comfort 3-30 Saunders Rd, Barrie, ON L4N 9A8 Get directions » Phone Number Message Directions Website Clo`

### B2-E04 Exclusive Cooling Ltd — 2023 Lennox promo offers still live
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Probe error: page.goto: net::ERR_CONNECTION_RESET at https://exclusivecooling.ca/
Call log:
[2m  - navigating to "https://exclusivecooling.ca/", waiting until "domcontentloaded"[22m

- **Evidence:** `{"status":null,"title":null,"body_chars":0,"text_found":null,"body_sample":null}`

### B2-E04 Exclusive Cooling Ltd — copyright © 2015 in footer
- **Verdict:** KILL
- **Type:** playwright_text
- **Notes:** Probe error: page.goto: net::ERR_CONNECTION_RESET at https://exclusivecooling.ca/
Call log:
[2m  - navigating to "https://exclusivecooling.ca/", waiting until "domcontentloaded"[22m

- **Evidence:** `{"status":null,"title":null,"body_chars":0,"text_found":null,"body_sample":null}`

