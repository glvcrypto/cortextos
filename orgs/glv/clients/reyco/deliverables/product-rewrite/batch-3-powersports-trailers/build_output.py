#!/usr/bin/env python3
"""Build batch-3 output.csv from input.csv + hand-written rewrites for all 33 rows."""
import csv
from pathlib import Path

HERE = Path(__file__).parent
INPUT = HERE / "input.csv"
OUTPUT = HERE / "output.csv"

# Each entry maps SKU -> dict of rewrites. SKU is the stable join key.
# Hisun = authorised dealer framing. Trailer + Easy Hauler = stocks framing.
# Kory voice = sales-floor archetype-fit (no bench claims).
# Lee = service department (engines/boats/ATV/UTV/Hisun).
# Lynn = Parts Manager. Ron = Parts Specialist.

REWRITES = {}

# =========================================================================
# ROW 1: Hisun Strike 250R — Youth Sport UTV (2026)
# =========================================================================
REWRITES["HS-STRK250R-26"] = {
    "Name": "2026 Hisun Strike 250R UTV",
    "Short description": "Two-seat sport UTV sized for teen riders and a passenger. Governed power, selectable 2WD/4WD, four factory colours — the right step up from a single-rider quad.",
    "Description": (
        "<p>Most families come into the showroom with the same story: their kid has outgrown the youth quad, "
        "and they want a side-by-side that two people can ride together without putting a teen on a 750-class machine. "
        "The Strike 250R is the answer Reyco points them at. Governed speed, two seats, and proper sport-UTV manners scaled for a learner.</p>"
        "<p>Kory has handed the keys to plenty of these. The customers who fit it best are parents with a son or daughter "
        "who already rides a quad confidently, families with cottage trails on St. Joseph Island or up around Goulais River, "
        "and the camp crowd that wants a way for the older kids to ride along without a parent having to chaperone every minute. "
        "Four factory colour options on the floor — Black Ops, Destroyer Grey, Tactical Tan, and Voodoo Blue.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house at the parts counter, and Lee in the service department "
        "handles any service work the Strike line needs. That side of the building does the engine and ATV/UTV work for the whole shop, "
        "so the Strike is not a side project — it sits in the same bay as the Sectors and the Strykers.</p>"
        "<p>Selectable 2WD/4WD with a CVT transmission (H/L/N/R/P) keeps the controls simple enough for a teen rider to actually learn good habits "
        "instead of fighting the machine. For families wanting a real teaching machine that is also a legitimate two-seater for short trail runs, "
        "this is the one to look at first. Drop in to White Oak Drive to sit one — Kory or any of the sales floor will walk you through the differences against the Strike 550R "
        "if your rider is ready to size up. 11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "Of all the Hisuns I sell to families, the Strike 250R is the one I steer the parents-with-teen-riders crowd toward. "
        "Most of these go home with someone whose kid has already done a couple seasons on a quad and is ready for two-up trail riding. "
        "The governed power is the part parents care about — they want the safety floor without a kid being stuck on a junior toy. "
        "I have handed keys to families heading to camps at Searchmont and out past Goulais, and they come back at the end of the season "
        "telling me the rider grew into it without anyone getting hurt. Lee in the service department keeps the Hisun warranty side covered, "
        "which matters when you are putting your kid on the seat. Drop in if you want to see one on the floor — we usually have a couple of the four colours in stock."
    ),
    "specs": "Make|Hisun\nModel|Strike 250R\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 2: Hisun Strike 550R — Adult Sport UTV
# =========================================================================
REWRITES["HS-STRK550R-26"] = {
    "Name": "2026 Hisun Strike 550R UTV",
    "Short description": "Full-size two-seat sport UTV. 550-class power, long-travel suspension, four factory colours — sport capability without the flagship sticker.",
    "Description": (
        "<p>The Strike 550R is where the sport line moves from teaching machine to actual trail performer. "
        "Two seats, the 550 series engine, long-travel suspension, and the ground clearance to handle Northern Ontario terrain "
        "without bottoming out on the rough sections between Searchmont and the forestry road network.</p>"
        "<p>This is the Hisun that competes most directly with bigger-name sport UTVs on capability while sitting at a price the rider actually pays for. "
        "Kory's regulars on the trail-rider side fall into two crowds: the weekend warriors who want a sport machine they can flog without sweating an oil seal, "
        "and the long-time quad guys finally moving to a side-by-side. Both come back happy because the Strike 550R does sport work the way a sport UTV should — "
        "no excuses, no apology for the price tag. Four factory colours stocked: Black Ops, Destroyer Grey, Tactical Tan, Voodoo Blue.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registration goes through the parts counter on White Oak Drive — Lynn manages that desk, "
        "with Ron pulling parts when the Hisun catalogue needs picking — and Lee in the service department covers the bench-side work. "
        "That setup means a customer is not stuck shipping the machine somewhere when something needs attention.</p>"
        "<p>CVT transmission with a full H/L/N/R/P shift, selectable 2WD/4WD, and the suspension travel that earns its keep the first time you ride a real trail at speed. "
        "For trail riders sizing up out of an ATV, or for someone who has had a sport UTV before and wants to put another one in the garage without taking on flagship pricing, "
        "this is the floor model worth seeing. Drop in to 11 White Oak Drive East or call 705-253-7828 to confirm what colour we have on the floor today.</p>"
    ),
    "review": (
        "The Strike 550R is the Hisun I move the most of to weekend trail riders. "
        "Customers I have sold to in this segment — guys who run the forestry roads up past Searchmont, riders who load up and head to Iron Bridge for the long-loop weekends — "
        "they come back telling me the suspension is the part that surprised them. They expected the engine to perform; the ride quality on rough trail is the bit they did not. "
        "Hisun has earned a real spot in the sport segment, and the Strike sits in the meaty middle of it. "
        "Lee on the service bench handles anything that comes up, and the warranty registers right here. "
        "If you are weighing this against the MP9 550R, stop in — same engine class, different chassis intent, and we can talk through which one fits your riding."
    ),
    "specs": "Make|Hisun\nModel|Strike 550R\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 3: Hisun Sector 550 EPS — Utility UTV
# =========================================================================
REWRITES["HS-SEC550EPS-26"] = {
    "Name": "2026 Hisun Sector 550 EPS UTV",
    "Short description": "Mid-tier utility UTV with electric power steering. Five factory colours, selectable 4WD with diff-lock — the sweet spot for property work that lasts all day.",
    "Description": (
        "<p>For most rural property owners around Algoma, the Sector 550 EPS is the right-sized utility Hisun. "
        "Mid-tier displacement, electric power steering, and the kind of build that makes a long workday feel a lot less like a workout. "
        "Plowing the cottage road, hauling firewood out of the back-forty, running fence on a cleanup weekend — this is the machine that puts in honest hours without complaint.</p>"
        "<p>Five factory colours on the floor: Avocado Green, Camo, Destroyer Grey, HISUN Red, and Tactical Tan. "
        "Two seats, selectable 2WD/4WD with rear differential lock, and the EPS option that the customers who actually use the machine all day come back grateful for. "
        "Without power steering, eight hours behind the wheel on rough terrain wears on the shoulders fast. With it, you climb out at the end of the day and the next morning you do not feel it.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house — Lynn at the parts counter handles the paperwork, Ron pulls Hisun parts off the shelf when something needs replacing, "
        "and Lee in the service department covers the bench work for the entire ATV and UTV side of the shop. "
        "That all-under-one-roof setup is the difference between a machine that gets ridden and a machine that ends up parked waiting for parts.</p>"
        "<p>For Algoma customers who use their UTV for actual labour — not just trail rides — the Sector 550 EPS is the sweet spot. "
        "Step up to the 750 EPS if you want full-displacement power for heavier loads, or step down to the Sector 250 if your property runs tighter trails. "
        "Drop in to White Oak Drive to see the colours on the floor, or call 705-253-7828 to ask about wait times. "
        "11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "If a customer comes in asking for one Hisun utility that does the most work for the most reasonable price, the Sector 550 EPS is what I put them on. "
        "I have sold these to property owners out toward Goulais River, to a few hunting groups running camps around Aweres, and to retired guys who needed something for the yard work that did not punish their wrists. "
        "EPS is the part nobody appreciates until they have spent a day without it. "
        "Lee in the service department handles the warranty side, so customers do not need to worry about who is going to look at it later. "
        "I would tell anyone shopping this size class — sit one before you compare. The colour selection is broad enough that you can usually pick what you want off the floor."
    ),
    "specs": "Make|Hisun\nModel|Sector 550 EPS\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 4: Hisun Sector 750 Crew — 4-Seat Utility UTV
# =========================================================================
REWRITES["HS-SEC750CREW-26"] = {
    "Name": "2026 Hisun Sector 750 Crew UTV",
    "Short description": "Four-seat utility UTV. Three factory colours, selectable 4WD with diff-lock — sized for hunt camp crews and family properties moving people and gear together.",
    "Description": (
        "<p>Hunt camp crews, family properties with grandkids on the weekend, work crews moving tools and people in one trip — "
        "the Sector 750 Crew is the Hisun built for the situations where a two-seat UTV is one seat short. "
        "Four-seat configuration on the Sector platform, full-displacement engine, and the cargo deck that still hauls real gear once everyone is in.</p>"
        "<p>Three factory colours on offer: Viper Woodland, Destroyer Grey, and Fresh Avocado. "
        "Selectable 2WD/4WD with rear differential lock — the same drivetrain backbone the rest of the Sector line runs, scaled up for the crew body. "
        "The four-seat layout matters most on the kind of trips where you would otherwise be doing two runs in a smaller machine: dropping off a hunting party at the back blind, "
        "getting a family across a cottage trail, moving a work crew with their tools to a fence-line cleanup.</p>"
        "<p>Reyco is an authorised Hisun dealer. Lee in the service department handles the bench work — engines, ATV/UTV, and the marine and small-engine side too — "
        "so the Crew is not getting handed off to a sub-shop somewhere. Lynn manages the parts counter and Ron pulls the Hisun catalogue parts when something needs swapping. "
        "Warranty paperwork registers right here in-house.</p>"
        "<p>For the hunt camp regulars who run a Trans-Canada-route camp and need to move four guys plus rifles plus the day's gear, this is the right Hisun. "
        "For family properties where weekends mean the whole house heading out together, same story. The Crew earns its keep by replacing two trips with one. "
        "Drop in to see one on the floor or to compare directly against the Stryker 750 Crew if you are between sport and utility — the Sector is the work-first version. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The Sector 750 Crew is the one I sell to hunt camp customers who roll deep — four-up plus gear, every weekend, all season. "
        "I have had buyers come in from camps off the Trans-Canada and from family properties up around Searchmont who specifically needed a four-seater and wanted utility, not sport. "
        "The Crew fits that brief without compromising the cargo space the way some four-seaters do. "
        "Lee on the bench covers the service side once it is in your hands, which matters more on a machine that gets used hard. "
        "Honest sales-floor take: if you are debating between this and two Sector 550s for separate riders, the Crew almost always wins on cost and on logistics. "
        "Drop in if you want to climb in all four seats — easier than describing it."
    ),
    "specs": "Make|Hisun\nModel|Sector 750 Crew\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 5: Hisun Stryker 750X — Sport-Trail UTV
# =========================================================================
REWRITES["HS-STRY750X-26"] = {
    "Name": "2026 Hisun Stryker 750X UTV",
    "Short description": "Two-seat sport-trail flagship. Long-travel overland-capable suspension, two factory colours — for riders who push past trail cruising into technical terrain.",
    "Description": (
        "<p>The Stryker 750X is what Hisun put up against the bigger-name sport-trail flagships. "
        "Long-travel suspension geometry built for overland touring, full-displacement power, and the ground clearance that makes technical riding through Crown land north of the Sault possible "
        "without leaving body panels at the bottom of every ravine.</p>"
        "<p>Two factory colours stocked: Camo and HISUN Red. Two-seat configuration with selectable 2WD/4WD. "
        "This is not the trail-cruiser end of the sport line — the Stryker is set up for the customer who already knows what aggressive terrain feels like and wants the suspension travel and chassis stiffness "
        "to actually use a machine in it. Riders heading out to the technical sections past Bellevue Valley or working the long ridge trails through the highlands tend to size up to the X for that reason.</p>"
        "<p>Reyco is an authorised Hisun dealer. The service department covers it in-house — Lee handles the engine and ATV/UTV bench work for the whole shop. "
        "Warranty registers at the parts counter where Lynn manages the Hisun paperwork and Ron pulls parts when a Stryker needs anything off the catalogue. "
        "When you put a sport UTV through technical riding, the parts pipeline matters; we keep the moving items stocked.</p>"
        "<p>If you are coming from a Strike 550R and ready for more chassis, or from another brand's sport flagship and looking at value, the Stryker 750X is the test ride to come down for. "
        "Sport-trail customers who care about overland-capable geometry — meaning you can actually use the suspension travel rather than just look at the spec — usually leave wanting one. "
        "Stop in to White Oak Drive to see what is on the floor, or 705-253-7828 to confirm colour. 11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The Stryker 750X is the sport Hisun I sell to riders who are not first-timers. "
        "Most of the customers I have written this one up for have come in already knowing what aggressive terrain is — they want a sport UTV that can actually take it, not just a spec sheet that says it can. "
        "I have sold to a couple of guys running Crown land trails out toward Aweres who wanted suspension travel that lasts past the first weekend, and they have been back for accessories more than for service, which is how I gauge it. "
        "Lee in the service department backs up the warranty side so buyers are not on their own once they are riding. "
        "Honest take from the sales floor: the Stryker line is where Hisun proves it belongs in the conversation with the bigger names. "
        "Come look at one on the floor before you decide."
    ),
    "specs": "Make|Hisun\nModel|Stryker 750X\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 6: Hisun MP9 550R — Sport Trail UTV
# =========================================================================
REWRITES["HS-MP9550R-26"] = {
    "Name": "2026 Hisun MP9 550R UTV",
    "Short description": "Mid-displacement sport UTV in four factory colours. Selectable 4WD, real trail suspension — sized for serious riders who do not need the flagship to keep up.",
    "Description": (
        "<p>Ask Kory which Hisun sport UTV gives the most rider for the dollar and the answer tends to be the MP9 550R. "
        "Mid-displacement engine in the 550 class, full sport-trail suspension, two-seat configuration, four factory colours stocked: Camo, Gray, Red, and Tan. "
        "It is the machine that keeps customers on the trail instead of stuck deliberating between price brackets on the showroom floor.</p>"
        "<p>The MP9 platform is Hisun's pure sport line — different chassis intent than the Strike, set up for trail riders who want a more aggressive ride without sizing up to a 750-class flagship. "
        "Riders heading out for weekend rides on the Bruce Mines forestry roads or running the long loops north of Iron Bridge tend to fit this one. "
        "Selectable 2WD/4WD lets you pick the drivetrain for the conditions instead of fighting the machine in dry conditions or losing traction in wet.</p>"
        "<p>Reyco is an authorised Hisun dealer. Lee in the service department handles the bench side for the whole ATV and UTV line — engine work, suspension, the lot. "
        "Lynn manages the parts counter where the Hisun warranty paperwork registers, and Ron pulls catalogue parts when anything on an MP9 needs replacing. "
        "Authorised-dealer status means the warranty actually means something — there is no third-party hand-off when something needs covering.</p>"
        "<p>If you have ridden a Strike 550R already and want a more sport-focused chassis on the same engine class, the MP9 is the conversation to have. "
        "If you are coming up from an ATV and want a sport UTV without going to the flagship pricing, this is also where Kory points the conversation. "
        "Drop in to White Oak Drive to see the colour selection in person, or call 705-253-7828 to confirm what is on the floor. "
        "11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "I sell more MP9 550Rs to serious trail riders than almost any other sport Hisun on the floor. "
        "Customers I put on this one tend to be guys who already know what they like — a few have come up from quads and wanted their first sport side-by-side, others have traded down from bigger-brand flagships because they realised they did not need that much machine. "
        "Camo and Tan move quickest in our area; the Gray usually finds the customer who wants something quieter-looking. "
        "Lee covers the service side once the customer is riding, which matters because the MP9 is a machine that gets ridden hard, not garaged. "
        "Honest sales-floor read: this is the Hisun that punches up the hardest. Worth a sit before you commit to the bigger numbers."
    ),
    "specs": "Make|Hisun\nModel|MP9 550R\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 7: Hisun HS 500 — Utility ATV
# =========================================================================
REWRITES["HS-HS500-26"] = {
    "Name": "2026 Hisun HS 500 ATV",
    "Short description": "Mid-range utility ATV. Single-rider, selectable 4WD, front and rear racks — the budget-honest workhorse for hunters, trappers, and back-forty cleanup.",
    "Description": (
        "<p>For customers who need a single-rider utility ATV and are tired of paying premium-brand pricing for a machine that does the same job, the HS 500 is the Hisun answer. "
        "Mid-range displacement, selectable 2WD/4WD, front and rear racks for the gear that actually goes on a utility quad, and the kind of pricing that matches how most Algoma buyers actually budget for working equipment.</p>"
        "<p>Single-rider configuration. The customers Kory writes this one up for are split fairly evenly: hunters packing camp gear up to weekend blinds, trappers running long lines through Crown land north of Wawa, "
        "and rural property owners who need a quad that earns its keep year-round on storm cleanup, firewood runs, and the kind of small jobs that ought to be one machine. "
        "Front rack carries 40 lbs, rear rack 80 — sized for the working loads, not optimistic catalogue numbers.</p>"
        "<p>Reyco is an authorised Hisun dealer. The HS line's warranty registers in-house at the parts counter where Lynn handles the paperwork. "
        "Lee in the service department covers the bench work — engines, ATV, UTV, marine — meaning if something needs attention, your ATV does not need to leave the city. "
        "Ron at the parts counter knows the Hisun catalogue and can pull a filter, belt, or replacement bracket when a customer needs to keep a machine in the field.</p>"
        "<p>Honest pricing on a proven Hisun manufacturing platform — that is the value the HS 500 delivers. "
        "For trappers, hunters, woodlot owners, and small-acreage operators who want the work done without paying twice for the badge on the tank, this is where the conversation starts. "
        "Drop in to White Oak Drive to see one in person, or call 705-253-7828 to ask about availability. 11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "I sell the HS 500 mostly to working customers — trappers, hunters, property guys — who care more about hours-of-use than about brand names on the tank. "
        "A trapper I have written up two of these for over the years runs his line out past the Wawa turnoff and tells me the Hisun has held up exactly the way he expected for the dollar. "
        "I have also moved a few to retirees with rural acreage who were stepping down from a bigger machine and wanted something honest. "
        "Lee on the service bench covers the warranty side — meaning the in-house service is real, not a fallback. "
        "If you are budget-conscious and need a working ATV instead of a recreational toy, this is the floor model to sit. We usually have one in the showroom."
    ),
    "specs": "Make|Hisun\nModel|HS 500\nYear|2026\nType|ATV\nClass|ATV",
    "slug": "atvs",
}

# =========================================================================
# ROW 8: Hisun Forge 400i — Sport-Utility ATV
# =========================================================================
REWRITES["HS-FORGE400I-26"] = {
    "Name": "2026 Hisun Forge 400i ATV",
    "Short description": "Sport-utility ATV with fuel injection. Three factory colours, selectable 4WD — for solo riders who want real ground-covering capability.",
    "Description": (
        "<p>The Forge 400i is the Hisun ATV for riders who want more performance than the HS line gives without sizing up to a full sport quad. "
        "Fuel-injected, mid-displacement, single-rider, and built around a chassis that handles real ground-covering riding — not just utility work in the back yard. "
        "Three factory colours stocked: Black Ops, Cavalry Blue, and Viper Woodland Camo.</p>"
        "<p>Solo riders are the customer base for this one. Cottage owners who ride their own line of trails up around Heyden and Aweres, weekend trail guys running the Bellevue Valley network, "
        "hunters who want a quad that handles the trip in to the blind and the long way back without making them work for it. "
        "Selectable 2WD/4WD lets the rider pick the drivetrain for the conditions, and the fuel-injected setup means cold-morning starts up here at 7 a.m. in October are not a fight.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registration goes through Lynn at the parts counter, and Ron pulls Hisun parts on demand from the catalogue when a Forge needs anything serviced. "
        "Lee in the service department covers the bench work — the same Lee who runs the marine and small-engine side, plus the full ATV/UTV bench. "
        "All-under-one-roof service is part of why customers come back when they are ready for the next quad.</p>"
        "<p>For solo riders who do not need utility racks bolted on a sport-utility chassis, the Forge is the Hisun ATV that gets the most respect off the trail. "
        "Sit one in the showroom against the HS 500 to feel the difference — they answer different briefs and the Forge is the one with the more aggressive tune. "
        "Drop in to White Oak Drive, or call 705-253-7828 to confirm what colour is on the floor today.</p>"
    ),
    "review": (
        "The Forge 400i is the ATV I sell to solo riders who already know what they want out of a quad. "
        "Customers who land on this one tend to be cottage-trail riders, single-blind hunters, and the guys who do not want to be carrying a passenger or an oversized rack — they just want a sport-utility quad that goes. "
        "Fuel injection is the part I point at when somebody is hesitating; up here in the Sault, October cold-starts matter more than people in the catalogue copy probably realise. "
        "Lee on the service bench has the Hisun line dialled in, so the warranty side is genuinely covered. "
        "Drop in if you want to compare the Forge against the Strike 550R — different category, but the same customer sometimes lands on either. We can walk you through it on the floor."
    ),
    "specs": "Make|Hisun\nModel|Forge 400i\nYear|2026\nType|ATV\nClass|ATV",
    "slug": "atvs",
}

# =========================================================================
# ROW 9: Hisun Sector E1 — Electric UTV
# =========================================================================
REWRITES["HS-SEC-E1-26"] = {
    "Name": "2026 Hisun Sector E1 Electric UTV",
    "Short description": "Two-seat electric utility UTV. 48V lithium pack, three factory colours — quiet enough to park beside the cabin, real cargo capability for property work.",
    "Description": (
        "<p>The Sector E1 is the Hisun for customers who want proper utility UTV capability on an electric platform. "
        "Two seats, real cargo space, and the kind of quiet operation that means parking it next to the cabin at midnight does not wake anyone up. "
        "Zero emissions, 48V lithium battery, charge time roughly 8 to 10 hours on a 120V outlet. Three factory colours: Cavalry Blue, Destroyer Grey, and HISUN Red.</p>"
        "<p>The customer base that has been picking this one up is broader than expected. "
        "Cottage owners on quiet lakes north of the Sault who do not want a gas engine running through the morning. "
        "Property owners who do their own trail work and have realised the noise is the worst part of a long maintenance day. "
        "Some early-adopter farm operators who run electric tools generally and wanted a UTV to match. "
        "The Sector platform underneath means it is not a glorified golf cart — the cargo and capability are real, just delivered through an AC electric motor instead of a CVT.</p>"
        "<p>Reyco is an authorised Hisun dealer. The Sector E1 warranty registers in-house through Lynn at the parts counter, and Ron handles parts pulls from the Hisun catalogue. "
        "Lee in the service department covers the electric platform too — the engine and ATV/UTV bench is set up for it, not a separate specialist. "
        "Battery service and electrical diagnostics are part of how the bench operates now, not a future add.</p>"
        "<p>For customers shopping electric utility seriously rather than as a curiosity, the Sector E1 is the conversation Reyco has with you. "
        "Drop in to White Oak Drive to see the floor unit — quietest demo we run, by a wide margin — or call 705-253-7828 to ask about charge specifics for your setup. "
        "11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The Sector E1 is the Hisun I have started selling to a customer profile I did not see five years ago — cottage owners and property guys who specifically want electric. "
        "I have written this one up for a couple of buyers on quiet lakes around Searchmont who hated the noise of running a gas UTV through quiet mornings, and for a hobby-farmer customer who runs everything battery-powered already. "
        "The honest sales-floor observation: the Sector E1 is not a compromise — the cargo and the seating are real, you just trade the gas tank for an outlet. "
        "Lee covers it in the service department like any other Hisun in the line. "
        "Worth a demo if electric is on your radar at all — drop in, the showroom is the easiest place to see the difference."
    ),
    "specs": "Make|Hisun\nModel|Sector E1\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 10: Hisun ACE NV — Electric Golf Cart
# =========================================================================
REWRITES["HS-ACENV-26"] = {
    "Name": "2026 Hisun ACE NV Electric Golf Cart",
    "Short description": "Four-seat electric golf cart. EV Black or Coastal Blue factory finish, LSV classification (province dependent) — for golf course ops, large properties, and senior-living facilities.",
    "Description": (
        "<p>The Hisun ACE NV is the four-seat electric golf cart Reyco brings in for customers who need more than a recreational cart — they need a serious low-speed vehicle that does real work. "
        "48V electric AC motor, four-passenger configuration, and LSV (Low-Speed Vehicle) classification depending on the province and the municipality you operate in. Two factory finishes: EV Black and EV Coastal Blue.</p>"
        "<p>The customer profile here is not who you might guess. Some are golf course operators replacing aging fleets and tired of putt-putt cart performance. "
        "More often it is large-property owners — multi-acre estates around Echo Bay or up the shoreline north of Sault Ste. Marie — who want a four-seat way to move around their land that does not require a UTV-class machine. "
        "Senior-living facilities and private community managers also pick these up for staff and resident transport when an LSV is the right legal classification.</p>"
        "<p>Reyco is an authorised Hisun dealer. Lynn manages the parts counter and handles the warranty paperwork for the ACE line. "
        "Ron pulls the Hisun catalogue parts when a cart needs anything off the shelf. "
        "Lee in the service department covers the electric platform on the bench — the same bench that runs ATV, UTV, marine, and small-engine work — meaning service does not get punted to a third party.</p>"
        "<p>Confirm LSV legality with your municipality before you finalise — the classification varies and we cannot speak for every Ontario town. "
        "What we can say is that for the customer who needs a four-seat electric cart from an authorised dealer with in-house parts and service, this is the floor unit to come look at. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "I sell the ACE NV mostly to two crowds — large-property owners and the operators who manage facilities where a cart is part of how the day actually runs. "
        "Most recently I wrote one up for a customer with a big shoreline property up the Lake Superior side who needed four-seat capacity and wanted electric specifically. "
        "Coastal Blue is the colour that moves first; EV Black tends to find the buyer who wants something quieter-looking. "
        "Lee on the service bench covers the electric drive side, so customers are not on their own for maintenance. "
        "Honest tip from the floor: confirm the LSV rules with your municipality before signing — it changes how you can use it, and that is the bit only your local office can rule on."
    ),
    "specs": "Make|Hisun\nModel|ACE NV\nYear|2026\nType|Golf Cart\nClass|LSV",
    "slug": "golf-carts",
}

# =========================================================================
# ROW 11: Hisun GUARDIAN Utility ATV
# =========================================================================
REWRITES["HS-GUARDIAN-26"] = {
    "Name": "2026 Hisun GUARDIAN ATV",
    "Short description": "Full-size utility ATV workhorse. Single-rider, selectable 4WD — built for hunting trips, traplines, and the kind of property work that beats up cheaper machines.",
    "Description": (
        "<p>The GUARDIAN is Hisun's full-size utility ATV — the workhorse end of the ATV line, built for the customers who actually use a quad to do things. "
        "Single-rider, selectable 2WD/4WD, full-size frame and the kind of build that holds up to weeks of camp logistics, trapline runs, and back-forty maintenance. "
        "Hisun's lifestyle photography from the Demo Day shoots shows the GUARDIAN doing exactly that kind of working — which lines up with how Kory's customers actually buy them.</p>"
        "<p>Hunting groups running camps on the back road past Heyden and Aweres have picked up GUARDIANs over the last few seasons because the price-to-capability ratio works on a working machine. "
        "Trappers running long lines through Crown land want something that handles the whole season without putting the trip on hold for service — the GUARDIAN platform delivers that. "
        "Algoma highland property owners with real acreage to maintain land on this one because it does the storm cleanup, the firewood runs, and the brush-control work without complaint.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house — Lynn manages the parts counter and the GUARDIAN paperwork passes through her desk. "
        "Ron handles Hisun-catalogue parts pulls when something needs replacing in the field. "
        "Lee in the service department covers the bench work — the same Lee who keeps the marine, engine, and full ATV/UTV side of the building running. "
        "All-under-one-roof service matters more on a working ATV than a recreational one; downtime costs you more.</p>"
        "<p>For the working customer who wants a full-size single-rider Hisun without the price tag of a flagship sport machine, the GUARDIAN is where the conversation starts. "
        "Drop in to White Oak Drive to see the floor model and feel the difference between this and the HS 500. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The GUARDIAN is the Hisun ATV I sell to working customers who already know what kind of season they put a quad through. "
        "Hunting groups and trappers are the steadiest customer base — guys who run camps off the Trans-Canada and need a machine that handles October to March without complaint. "
        "I have written one up recently for a property owner up the highlands who maintains his own trail network and was tired of replacing brand-name quads at twice the cost. "
        "Lee on the service bench keeps the warranty side covered, and that matters when the machine is part of how the work actually gets done. "
        "Honest sales-floor read: the GUARDIAN earns its keep, full stop. Stop in and sit one — easier than describing the build."
    ),
    "specs": "Make|Hisun\nModel|GUARDIAN\nYear|2026\nType|ATV\nClass|ATV",
    "slug": "atvs",
}

# =========================================================================
# ROW 12: Hisun Tactic Utility ATV
# =========================================================================
REWRITES["HS-TACTIC-26"] = {
    "Name": "2026 Hisun Tactic ATV",
    "Short description": "Mid-utility ATV. Single-rider, selectable 4WD — priced for customers who want more than entry-level without paying for a flagship spec.",
    "Description": (
        "<p>The Tactic is the mid-utility Hisun ATV — placed between the entry-level HS 400 and the full-size GUARDIAN for customers who want real capability without paying flagship-spec pricing. "
        "Single-rider, selectable 2WD/4WD, and the kind of mid-utility build that fits how a lot of rural buyers actually use a quad: real work, but not the heaviest commercial-end work.</p>"
        "<p>The customer base for this one is the practical middle. Customers running mid-size properties around Iron Bridge or out toward Echo Bay who need a quad that does the firewood run, "
        "the storm cleanup after a Lake Superior windstorm, and the spring trail maintenance without sitting in the wrong size class. "
        "Hunters who want a single-rider quad for a few weekends a year and do not need a full-size workhorse year-round.</p>"
        "<p>Reyco is an authorised Hisun dealer. Lee in the service department handles the bench work for the Tactic the same way he covers the rest of the ATV and UTV line — engines, drivetrain, suspension, all in-house. "
        "Lynn manages the parts counter where the warranty paperwork registers, and Ron pulls Hisun-catalogue parts when something needs swapping. "
        "The all-in-one-shop setup is the difference between a quad that gets ridden and a quad that ends up parked.</p>"
        "<p>For customers wondering whether they need the GUARDIAN or whether the Tactic does the job, Kory's read tends to be: if you are mostly recreational with light utility, the Tactic is enough. "
        "If your property needs work done on it weekly through a full season, size up. "
        "Drop in to White Oak Drive to sit both and feel the difference. 11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The Tactic is the Hisun I sell when the customer is honest about not needing a workhorse but does not want entry-level either. "
        "Most of the buyers I write up on this one have mid-acreage properties around Echo Bay or up in the Heyden area — real but not heavy property work, plus a few weekend rides. "
        "The price gap between this and the GUARDIAN is the reason the Tactic exists, and customers who land on it tend to stay happy because they did not over-buy. "
        "Lee in the service department covers it like the rest of the line. "
        "Honest sales-floor take: if you are between the Tactic and the GUARDIAN, ask yourself how many days a year you are actually working the quad. The answer makes the choice."
    ),
    "specs": "Make|Hisun\nModel|Tactic\nYear|2026\nType|ATV\nClass|ATV",
    "slug": "atvs",
}

# =========================================================================
# ROW 13: Hisun HS 400 Entry ATV
# =========================================================================
REWRITES["HS-HS400-26"] = {
    "Name": "2026 Hisun HS 400 ATV",
    "Short description": "Entry utility ATV. Single-rider, budget-honest pricing, selectable 4WD — sized for light firewood hauling, storm cleanup, and small-property work.",
    "Description": (
        "<p>The HS 400 is the entry-level utility ATV in the Hisun line — single-rider, mid-three-hundred class, and priced for the customer who wants honest capability on a working budget. "
        "This is the quad Kory points first-time ATV buyers at when their property does not justify a full-size machine and they would rather buy what they need than over-spec.</p>"
        "<p>Light firewood hauling, post-storm cleanup, occasional trail riding, and small-farm movement around hobby acreage — that is the customer profile. "
        "Buyers come in from properties out past Iron Bridge, from cottage country around St. Joseph Island, and from retirees who downsized to smaller acreage and just need a quad for the maintenance work that goes with rural living. "
        "Selectable 2WD/4WD lets the rider pick the drivetrain for what the day actually calls for.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house through Lynn at the parts counter, and Ron handles Hisun-catalogue parts on demand. "
        "Lee in the service department covers the bench work for the entire ATV line — meaning even a budget-end HS 400 gets the same in-house service as the flagship Strykers. "
        "That is the part of the value proposition that matters most to working buyers.</p>"
        "<p>If you are weighing the HS 400 against the Tactic or the HS 500, the question is honestly about how heavy the work is. "
        "For light to moderate utility on smaller properties, the HS 400 is enough machine without paying for capability you will not use. "
        "Stop in to White Oak Drive to see one on the floor or call 705-253-7828 to confirm availability. "
        "11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The HS 400 is what I sell to first-time ATV buyers and to retirees who downsized to a smaller property and just need a quad to keep up with the maintenance. "
        "I had a customer last fall who came in from a hobby farm out past Bruce Mines — small acreage, light firewood work, a few brush runs — and the HS 400 was exactly the right size. "
        "He came back in the spring for a winch, which is a good sign on a budget machine. "
        "Lee on the service bench covers the warranty side, and that matters even on the entry-level machine because it tells the customer the dealer is committed past the sale. "
        "Honest sales-floor take: do not over-spec. The HS 400 is enough for a lot of working buyers, and you can put the extra into accessories that actually get used."
    ),
    "specs": "Make|Hisun\nModel|HS 400\nYear|2026\nType|ATV\nClass|ATV",
    "slug": "atvs",
}

# =========================================================================
# ROW 14: Hisun Sector 250 Compact Utility UTV
# =========================================================================
REWRITES["HS-SEC250-26"] = {
    "Name": "2026 Hisun Sector 250 UTV",
    "Short description": "Compact two-seat utility UTV. Five factory colours — sized for tighter trails, smaller properties, and riders who do not need full-displacement power.",
    "Description": (
        "<p>The Sector 250 is the compact end of the Hisun utility UTV line — right-sized for smaller properties, tighter trail networks, and customers who would rather not navigate a full-size Sector through cottage paths. "
        "Two-seat configuration, the 250 series engine, and the same family of utility-UTV manners scaled down to a footprint that fits where bigger machines do not.</p>"
        "<p>Five factory colours stocked: Avocado Green, Camo, Destroyer Grey, HISUN Red, and Tactical Tan. "
        "The customer profile for this one tends to be cottage owners on St. Joseph Island where the cabin trails are narrow, hobby-farm owners with under five acres, and families who want a UTV that the smaller adults in the household actually feel comfortable driving. "
        "The Jamie's Land lifestyle series Hisun shoots for this model is built around exactly that everyday use case — the small property that still earns a real machine.</p>"
        "<p>Reyco is an authorised Hisun dealer. The Sector 250 warranty registers in-house — Lynn manages the parts counter and the paperwork, and Ron pulls Hisun parts when something off the catalogue is needed. "
        "Lee in the service department covers the bench work, the same way he handles the rest of the UTV line. "
        "A compact UTV gets the same in-house service treatment as a flagship Stryker — there is no junior bay for smaller machines.</p>"
        "<p>For customers who want the Sector platform but not the Sector footprint, this is the right floor unit to sit. "
        "If you are between the 250 and the 550 EPS, ask yourself how tight your trails are and how much weight you actually move. The 250 wins when the answer is &quot;narrow trails, light work.&quot; "
        "Drop in to White Oak Drive to see the colour selection. 705-253-7828, 11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The Sector 250 is the compact UTV I sell to customers whose property cannot fit a full-size Sector — and there are more of them around the Sault than you might expect. "
        "Cottage owners on St. Joseph Island, customers with cabins on the inland lakes around Goulais River, hobby farmers with smaller plots out toward Heyden — they all land on this one. "
        "The five-colour selection is the part that surprises buyers; we usually have at least three on the floor. "
        "Lee handles the service side, so the in-house support is the same as on any Hisun. "
        "Honest read: do not size up if your trails are narrow — the 250 is purpose-built and the 550 is too much UTV for tight bush. Stop in and we can walk it through."
    ),
    "specs": "Make|Hisun\nModel|Sector 250\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 15: Hisun Sector 750 EPS  (REWRITTEN — sample)
# =========================================================================
REWRITES["HS-SEC750EPS-26"] = {
    "Name": "2026 Hisun Sector 750 EPS UTV",
    "Short description": "Two-seat utility UTV with electric power steering. Full-displacement Sector platform, selectable 4WD with diff-lock — built for all-day property work and trail logistics.",
    "Description": (
        "<p>Hauling out to camp with a full payload, then running the same machine on trail work the next morning — that is the everyday rhythm the Sector 750 EPS is built for. "
        "Two seats, the full Sector 750 platform, and electric power steering that turns an all-day work session into something your shoulders do not feel the next day. "
        "For hunt camp guys, sled-trail crews, and Northern Ontario property owners who want one machine that handles both labour and weekend trail runs.</p>"
        "<p>The customers Kory steers toward this one tend to fall into two camps. "
        "The trail riders we sell to like that EPS does not punish their wrists on the rough stuff between camp and the access road. "
        "The hunt camp folks like that 4WD with a selectable diff-lock means a half-tonne of firewood, gear, or a cleaned moose quarter does not end the trip when the trail turns greasy after the first hard rain. "
        "The EPS option earns its keep the first time you spend a full day plowing the cottage road or running fence on a back-forty cleanup.</p>"
        "<p>Reyco is an authorised Hisun dealer. The Sector 750 EPS warranty registers in-house at White Oak Drive — Lynn manages the parts counter where the paperwork is filed, and Ron pulls Hisun parts when the catalogue needs picking. "
        "Lee in the service department covers the bench work for the whole ATV/UTV line — engines, drivetrain, EPS, suspension. "
        "All-under-one-roof service is the part that matters most when the machine is part of how the property runs.</p>"
        "<p>Two-seat layout, selectable 2WD/4WD with rear differential lock, sized for the work most of our customers actually do — trail logistics, light agricultural pulls, snow movement, "
        "and the kind of property maintenance that ought to be one machine instead of three. "
        "If you are weighing this against the Sector 750 Crew, the difference is seating: this is the two-seat workhorse, the Crew adds a back row. "
        "Drop in to see what is on the floor at 11 White Oak Drive East, or call 705-253-7828.</p>"
    ),
    "review": (
        "Of all the Hisun utility machines on the floor, the Sector 750 EPS is the one I steer most of my hunt camp guys toward. "
        "Full-displacement Sector platform with electric power steering — that is what separates a long workday from a sore-shoulder workday once you have actually been on the seat for eight hours. "
        "I have sold these to trail riders running the access roads up past Bruce Mines and to property owners cleaning up after big windstorms; both crews tend to come back happy. "
        "Honest sales-floor take: Hisun is not giving you a Sector at Polaris pricing because it is not a Polaris — different value proposition, and the customers who get that are the ones still riding theirs three seasons later. "
        "The diff-lock matters more than most people realise the first time they actually get stuck. "
        "Lee on the service bench covers the warranty side in-house. Drop in if you want to see one on the floor — Kory or Lee can walk you through it."
    ),
    "specs": "Make|Hisun\nModel|Sector 750 EPS\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 16: Hisun Stryker 550X Sport-Trail UTV
# =========================================================================
REWRITES["HS-STRY550-26"] = {
    "Name": "2026 Hisun Stryker 550X UTV",
    "Short description": "Two-seat overland-capable sport UTV. Nardo Grey factory finish — the entry into Hisun's overland-trail line for riders stepping up into more aggressive terrain.",
    "Description": (
        "<p>The Stryker 550X is the entry into Hisun's overland-capable sport-trail line. "
        "Mid-displacement engine, the same long-travel suspension geometry that defines the Stryker chassis, and a Nardo Grey factory finish that distinguishes it on the floor. "
        "Two-seat configuration. For riders stepping up from a Strike toward more aggressive terrain — but not yet ready to commit to the 750X flagship.</p>"
        "<p>The customer profile is the rider in transition. Buyers who have already put a season or two on a Strike 550R and want a more capable chassis without sizing up displacement. "
        "Trail crews that run forestry roads out past Hessel and Heyden where the surfaces get rough enough that suspension travel actually matters. "
        "Riders who want an overland-style machine on a budget that does not require flagship spend.</p>"
        "<p>Reyco is an authorised Hisun dealer. The Stryker line registers warranty in-house at the parts counter — Lynn handles the paperwork, Ron pulls Hisun parts from the catalogue when something needs replacing. "
        "Lee in the service department covers all the ATV/UTV bench work, including the suspension and chassis side that the Stryker line specifically asks more of. "
        "Authorised-dealer status means the warranty actually means something — there is no third-party loop when you bring the machine in.</p>"
        "<p>Compared against the 750X, the 550X gives you the same chassis intent at a lower spend; compared against the Strike 550R, you are paying for the overland geometry. "
        "Both are honest trade-offs the buyer should make on a test ride, not on the spec sheet. "
        "Stop in to White Oak Drive to see the Nardo Grey on the floor — sometimes a colour decides itself when you see it in person. "
        "705-253-7828, 11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The Stryker 550X is the Hisun I sell to riders moving up from the Strike line into something more chassis-aggressive. "
        "Customers I have written one up for are typically guys who have already been on a Strike 550R for a season and decided they want more suspension travel for the rougher trails they have been running. "
        "Nardo Grey is a colour that surprises customers — it shows better in person than in the catalogue. "
        "Lee covers the service side once the customer is riding, which on a Stryker matters because the chassis is set up to be ridden harder. "
        "Honest read: if you are still riding mostly maintained trails, the Strike is enough. If you have started looking at rougher Crown land, the 550X earns its keep. Stop in and let us put you on both."
    ),
    "specs": "Make|Hisun\nModel|Stryker 550X\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 17: Hisun Stryker 750 Crew (4-Seat Sport)
# =========================================================================
REWRITES["HS-STRY750CREW-26"] = {
    "Name": "2026 Hisun Stryker 750 Crew UTV",
    "Short description": "Four-seat sport-trail UTV. Long-travel overland suspension — for hunting parties and families who want sport capability with four-adult capacity.",
    "Description": (
        "<p>The Stryker 750 Crew is the four-seat answer in the sport-trail line. "
        "Same overland-capable chassis intent as the 750X, scaled to four-adult seating without losing the suspension travel that makes the Stryker line what it is. "
        "Full Stryker 750 platform, long-travel overland suspension geometry, four passengers plus working gear.</p>"
        "<p>Two customer profiles dominate this floor model. Hunting parties — four-up trips out to camps north of the Sault where everyone wants to ride together rather than split into a sport and a separate utility crew. "
        "Families with three or four adults who want a sport machine that everyone fits in, not a utility UTV with a sport sticker. "
        "The Crew configuration genuinely is a sport machine first; that is the difference between this and a Sector 750 Crew, which is utility-first.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house at the parts counter — Lynn manages the paperwork desk, Ron pulls Hisun-catalogue parts on demand. "
        "Lee in the service department covers the bench work — engine, suspension, and the chassis side that the Stryker line asks more of than a utility UTV does. "
        "All-in-one-shop service is what makes the warranty actually useful in practice.</p>"
        "<p>For hunting parties looking at a four-seater that holds up to aggressive trail use, this is the Hisun to sit. "
        "For family buyers who picked sport over utility, same answer. "
        "If you are between the Sector 750 Crew and this one, the question is what you ride more — work miles or trail miles. The Stryker Crew is the trail-first option. "
        "Drop in to White Oak Drive to see the floor unit. 11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The Stryker 750 Crew is the Hisun I sell to hunting parties who do not want to split into two machines. "
        "Customers I have written up for this one tend to come in as a group — three or four guys, sometimes with the lead buyer making the call but the rest weighing in on seat space. "
        "Hunting groups north of the Sault and family camps out toward Searchmont have been the steady buyers. "
        "Lee covers the service side, and on a four-seat sport machine that gets ridden hard, that matters. "
        "Honest sales-floor take: if you are debating between a 750X plus a separate utility, the Crew almost always wins on cost and on the &quot;everyone goes&quot; logistics. Stop in and put four guys in it before you decide."
    ),
    "specs": "Make|Hisun\nModel|Stryker 750 Crew\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 18: Hisun MP9 750R Sport UTV
# =========================================================================
REWRITES["HS-MP9750R-26"] = {
    "Name": "2026 Hisun MP9 750R UTV",
    "Short description": "Flagship MP9 sport UTV. Four factory colours, full sport-trail suspension — for riders who want maximum MP9 platform power.",
    "Description": (
        "<p>The MP9 750R is the flagship of the MP9 sport line — the full-displacement spec on Hisun's pure-sport chassis. "
        "Two-seat configuration, sport-trail suspension geometry, and the engine class that puts it directly against the bigger-name flagships in the sport-trail segment. "
        "Four factory colours stocked: Camo, Gray, Red, and Tan.</p>"
        "<p>The customer profile here is the sport-first rider who wants the MP9 platform with everything turned up. "
        "Riders who have already ridden a 550R and decided they want more, or buyers coming from another brand's flagship looking for value without losing capability. "
        "The MP9 platform is different from the Strike chassis on intent — pure sport, not sport-utility — and the 750R is where that intent comes through hardest.</p>"
        "<p>Reyco is an authorised Hisun dealer. Lynn manages the parts counter where the MP9 warranty paperwork registers, and Ron handles parts pulls from the Hisun catalogue. "
        "Lee in the service department covers the bench work for the whole ATV/UTV line — including the suspension and chassis side that the MP9 platform pushes harder than a utility UTV does. "
        "All-in-one-shop service is part of why customers come back to the dealer for the next machine.</p>"
        "<p>If you are weighing the MP9 750R against the Stryker 750X, the chassis intent is the difference: the MP9 is sport-first, the Stryker is overland-first. "
        "Both run the 750-class engine; the suspension geometry is what diverges. "
        "Drop in to sit both and feel the difference yourself — easier than describing it. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The MP9 750R is the Hisun I sell to riders who already know they want sport, not sport-utility. "
        "Most of the customers I have put on this one have been guys coming up from the MP9 550R or trading down from a bigger-name flagship because they realised the value gap was not worth it. "
        "Camo and Red move first in our shop; Gray finds the buyer who wants something cleaner-looking on the trailer. "
        "Lee handles the service side including the more demanding chassis work that the MP9 platform asks for. "
        "Honest sales-floor read: if you are debating sport-first versus overland, ride both. The MP9 is the sport one, full stop. Stop in if you want to see the colour selection live."
    ),
    "specs": "Make|Hisun\nModel|MP9 750R\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# ROW 19: Hisun MP9T400 Entry Sport UTV
# =========================================================================
REWRITES["HS-MP9T400-26"] = {
    "Name": "2026 Hisun MP9T400 UTV",
    "Short description": "Trail-focused entry sport UTV. Two-seat — sized for adult riders moving up from a quad into their first sport side-by-side.",
    "Description": (
        "<p>The MP9T400 is the entry-level point of the MP9 sport-trail line. "
        "Right-sized for adult riders making the move from an ATV into their first sport side-by-side. Two-seat configuration, mid-three-hundred-class engine, and the MP9 chassis intent scaled down to a sensible starting price. "
        "Hisun's lifestyle photography from the Cammo Whatley shoots shows the machine in the trail conditions it was actually built for.</p>"
        "<p>The customer base for this one is mostly riders in transition. Long-time quad guys finally moving to a side-by-side, customers who want the MP9 sport feel without committing to the 550R or 750R spend, "
        "and trail riders who do not need flagship capability — they want a sport UTV that is enough machine for the way they actually ride. "
        "Riders running the trails out around Bellevue Valley and the back-loop networks toward Iron Bridge are the kind of customer who tends to size right onto the MP9T400.</p>"
        "<p>Reyco is an authorised Hisun dealer. Warranty registers in-house — Lynn handles the parts counter and the MP9T400 paperwork, and Ron pulls catalogue parts when something needs replacing. "
        "Lee in the service department covers the bench work for the entire MP9 line, including the entry spec. "
        "Authorised-dealer status means the entry-level customer gets the same warranty support as the flagship buyer.</p>"
        "<p>If you are sitting on the fence between staying on a quad and moving up, this is the floor model that lowers the cost of the experiment. "
        "It is enough sport UTV to know whether you actually want one without paying for capability you may not use. "
        "Drop in to White Oak Drive to sit one. 11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The MP9T400 is the sport Hisun I sell to riders making their first move up from a quad. "
        "Most of the customers I have put on this one were happy on an ATV but ready for two-up sport riding without spending flagship money on the experiment. "
        "I had a buyer last summer who came in from a property up around Iron Bridge — long-time quad rider, finally wanted a side-by-side — and the T400 was right-sized for him. "
        "Lee covers the service side in-house. "
        "Honest sales-floor take: if you are not sure you will love a sport UTV, this is the right way to find out without over-spending. Step up to the 550R later if it turns out you do."
    ),
    "specs": "Make|Hisun\nModel|MP9T400\nYear|2026\nType|UTV\nClass|UTV",
    "slug": "utvs",
}

# =========================================================================
# TRAILERS — STOCKS framing (NOT authorised), use-case framing, no weight claims
# =========================================================================

# ROW 20: 2026 Easy Hauler AL-PTDB2023
REWRITES["ROW:20"] = {
    "Name": "2026 Easy Hauler AL-PTDB2023 Trailer",
    "Short description": "New 2026 Easy Hauler trailer stocked at White Oak Drive. Sized for sleds, quads, and the gear that moves out to camp every weekend.",
    "Description": (
        "<p>For the customer who has been moving sleds and quads on borrowed trailers and decided it is time to own one, the 2026 Easy Hauler AL-PTDB2023 is on the floor at Reyco. "
        "Sized for the kind of hauling Northern Ontario winter and shoulder-season actually demands — a sled out to the trail head, a quad up to camp, a small load of gear going somewhere it needs to be tied down properly.</p>"
        "<p>Reyco stocks the Easy Hauler line at White Oak Drive. We are not the authorised Easy Hauler dealer — that is a different setup — but we keep them on the floor because the customers who buy sled and quad equipment from us also need a way to move it. "
        "If you have bought a Hisun off our floor or a sled service has gone through Lee in the back, the trailer that ties it together is right out front.</p>"
        "<p>The use case Kory tends to see most: weekend trips out to camp on the Sault-to-Wawa run, ice-fishing rigs heading to lakes around Searchmont, and the customers who take their quad to forestry-road meet-ups around Bruce Mines. "
        "A trailer is not a glamour purchase; what makes it the right call is whether it suits the load you actually move. The AL-PTDB2023 is sized for that mid-range haul that covers most of how our customers use a trailer in real life.</p>"
        "<p>Stop in to see this one on the floor — easier to spec out a trailer in person than on paper. "
        "Lynn and Ron at the parts counter can talk through accessories — tie-downs, ramps, locks — that round out the rig. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The 2026 Easy Hauler is one I have written up for a few sled and quad customers this season. "
        "Most of the buyers move equipment between camps north of the Sault and the trail networks around Searchmont and Bruce Mines — that mid-range hauling that is where most working customers actually live. "
        "Easy Hauler is not the brand we are authorised to service — we stock them at the front of the lot — but they hold up the way customers expect for the price. "
        "Honest sales-floor take: a trailer is a long-term tool. Buy the size that matches what you actually move, not what you might move someday. "
        "Stop in to White Oak Drive and we can size it against your sled or quad in person — that is the only real way to know."
    ),
    "specs": "Make|Easy Hauler\nModel|AL-PTDB2023\nYear|2026\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 21: 2025 Trailer X (VIN 2REA2S7A5S2159460 -- duplicate VIN with row 33; first occurrence)
# We'll need to match by VIN to be safe. Using the SKU column or VIN.
# Actually input rows have NO unique SKU for the generic "Trailer X" rows (SKU empty for those).
# Better match key: VIN (which is in _lightspeed_vin or _product_specs).

# For trailer rows, we'll match on a tuple of (Year, Brand, VIN). Build helper later.
# Pre-compute by VIN string instead.

# Row 21 VIN: 2REA2S7A5S2159460 (SKU empty)
REWRITES["ROW:21"] = {
    "_match_year": "2025",
    "_match_vin": "2REA2S7A5S2159460",
    "_match_idx_within_vin": 0,  # first occurrence in input order
    "Name": "2025 Trailer X — Hunt-Camp Utility Trailer",
    "Short description": "2025 utility trailer in stock at Reyco. Sized for hauling out to hunt camp, the cottage, or a winter equipment swap when the truck bed is full.",
    "Description": (
        "<p>The 2025 Trailer X is on the floor at White Oak Drive — the kind of straightforward utility trailer that ends up doing more work than the customer ever expected when they bought it. "
        "Hunting trips, cottage opening weekends, the swap-over haul when the snowblower goes back in the shed and the lawn equipment comes out, the late-season firewood run. "
        "Sized for the everyday hauling load most rural customers actually need.</p>"
        "<p>Reyco stocks the Trailer line at the front of the lot. We are not an authorised dealer for this line — we stock it because customers shopping sleds, quads, and small engines also need a way to move them, "
        "and a trailer on the floor is more useful to a buyer than a trailer they have to chase across town. "
        "Stop in and we can walk through whether this is the right size for the gear you are moving.</p>"
        "<p>The use case Kory tends to point this size class at: hunters running camps out toward Heyden or up the Trans-Canada toward Wawa, cottage customers around Goulais River who want a trailer for the seasonal swaps, "
        "and small-property guys who need a hauler for storm cleanup and the spring brush runs. "
        "It is not a flashy purchase. What makes it the right call is whether the deck size and the build match the load you actually move on a regular weekend.</p>"
        "<p>Easier to spec a trailer in person than on the page. Drop in to 11 White Oak Drive East, or call 705-253-7828 to confirm we still have this one available. "
        "Lynn at the parts counter and Ron in parts can talk you through accessories — tie-downs, ramps, lighting kits — that go on top of the trailer itself.</p>"
    ),
    "review": (
        "The 2025 Trailer X is the kind of utility trailer I sell to customers who want something straightforward — they are not buying for show, they are buying to haul. "
        "Most of the buyers in this size class are hunt camp guys and cottage owners around the Sault who are tired of borrowing a buddy's trailer every time they need to move equipment. "
        "We stock the Trailer line — not authorised on this one — but they hold up to what customers expect for the price. "
        "Honest sales-floor read: a trailer is a long-term tool. Match the deck size to the load you most often move, not the one-off oversized job. "
        "Drop in and Kory or one of us on the floor can walk you through whether this is the right size for your setup."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2025\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 22: 2022 Easy Hauler AL-PTDB2026-TRI (VIN 2SPPFSC10NN068199)
REWRITES["ROW:22"] = {
    "_match_vin": "2SPPFSC10NN068199",
    "Name": "2022 Easy Hauler AL-PTDB2026-TRI Trailer",
    "Short description": "2022 Easy Hauler tri-axle trailer on the floor at Reyco. Built for the bush — equipment moves, contractor loads, and big-haul weekends.",
    "Description": (
        "<p>The 2022 Easy Hauler AL-PTDB2026-TRI is the heavier-end trailer Reyco has on the floor for customers who are not hauling a single sled or quad — they are moving real loads. "
        "Tri-axle build, sized for contractors, equipment movers, and the customer who needs to drop a full ATV plus the gear plus the firewood at camp in one trip instead of three. "
        "It is the trailer for the customer who has outgrown the shorter single-axle haulers and is ready to size up.</p>"
        "<p>Reyco stocks the Easy Hauler line at the front of the lot. We are not the authorised Easy Hauler dealer; we stock these because the customers who buy bigger equipment from us also need a way to move it. "
        "If you have run a smaller trailer for a few seasons and decided you have outgrown it, this is the kind of step-up that solves the problem instead of patching it.</p>"
        "<p>The use cases Kory has written this size up for: contractors out around the highlands moving job-site gear, hunt camp groups whose &quot;weekend kit&quot; got bigger every year, and a couple of buyers who use the trailer as the working backbone of a small landscaping operation. "
        "The tri-axle means it tracks differently behind a truck than a single-axle does — for the customer used to a smaller hauler, that is something to feel before you buy. Stop in and we can walk through it.</p>"
        "<p>Easier to spec a heavier trailer in person, especially the tow side. "
        "Drop in to White Oak Drive or call 705-253-7828 to confirm availability. Lynn and Ron at the parts counter can talk through tie-downs, brake-controller compatibility, and the accessories that round out the build. "
        "11 White Oak Drive East, Sault Ste. Marie.</p>"
    ),
    "review": (
        "The 2022 Easy Hauler tri-axle is the trailer I sell to customers who already know they need more deck and more axles than a smaller hauler gives. "
        "Most of the buyers in this category are working customers — small contractors, hunt camp groups whose loads have grown season over season, and a couple of small-business owners who use the trailer as part of how the day actually runs. "
        "Easy Hauler is not the brand we are authorised to service — we stock them out front — but the build holds up for what the customers expect. "
        "Honest sales-floor read: do not size up unless your load actually justifies it. Tri-axle is more trailer to tow, more trailer to store, and more trailer to back up. Drop in if you want to see the size in person before deciding."
    ),
    "specs": "Make|Easy Hauler\nModel|AL-PTDB2026-TRI\nYear|2022\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 23: 2024 Trailer X (VIN 2REA2S7A5R2155242)
REWRITES["ROW:23"] = {
    "_match_vin": "2REA2S7A5R2155242",
    "Name": "2024 Trailer X — Ice-Fishing Utility Trailer",
    "Short description": "2024 utility trailer stocked at White Oak Drive. Right-sized for ice-fishing kit, lawn equipment, and weekend hauls.",
    "Description": (
        "<p>The 2024 Trailer X is on the floor at Reyco — a straightforward utility trailer for the customer who wants to stop borrowing one. "
        "Ice fishing kits heading to lakes north of the Sault, lawn equipment going between properties, weekend hauls when the truck bed is already full of something else. "
        "It is a working tool, not a feature piece, and the price reflects that.</p>"
        "<p>Reyco stocks the Trailer line at the front of the lot. We are not an authorised dealer for this line — we keep it on the floor because the customers buying snow blowers, lawn tractors, sleds, and small engines off the floor inside also need a way to move them. "
        "Having the trailer outside the door is more useful than pointing customers to a different lot across town.</p>"
        "<p>This size of trailer fits the customer who runs a hobby farm out around Echo Bay, who maintains a cottage on St. Joseph Island and needs to move equipment between locations, or who runs ice fishing rigs out to Lake Superior shoreline access points through the winter. "
        "It is not a contractor trailer. It is the everyday hauler that earns its keep on small jobs done frequently.</p>"
        "<p>Trailers are easier to spec in person — the deck size, the rail height, the tongue length all matter more in person than they do on paper. "
        "Drop in to 11 White Oak Drive East to see it on the floor, or call 705-253-7828 to confirm we still have this VIN available. "
        "Lynn at the parts counter can talk through tie-downs and lighting kits if you need to round out the setup.</p>"
    ),
    "review": (
        "The 2024 Trailer X is a working customer's trailer — not flashy, not oversized, just the right tool for hobby-farm and cottage haulers around the Sault. "
        "Most of the buyers I have written one of these up for run small properties, do their own ice fishing, or maintain a cabin where moving equipment between locations is a season-by-season job. "
        "We stock the Trailer line — not an authorised dealer relationship — but the build is what customers expect. "
        "Honest sales-floor take: this is the size that ends up doing more than the buyer planned. Stop in and walk around it before deciding — measurements look different on the floor than in catalogue copy."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2024\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 24: 2026 Trailer X (VIN 2REA2S7A3T2164898)
REWRITES["ROW:24"] = {
    "_match_vin": "2REA2S7A3T2164898",
    "Name": "2026 Trailer X — Firewood & Brush Utility Trailer",
    "Short description": "2026 utility trailer in stock. The trailer that handles firewood runs, brush hauling, and the spring property cleanup.",
    "Description": (
        "<p>The 2026 Trailer X is on the floor at Reyco for the customer who has decided this year is the year to stop borrowing one. "
        "Firewood hauling, spring brush runs, the cleanup work after a Northern Ontario windstorm rolls through — this is the trailer that gets pressed into service through the seasons that matter. "
        "Straightforward utility, no flashy build, just a working hauler.</p>"
        "<p>Reyco stocks the Trailer line at the front of the property. We are not the authorised dealer for this line — we keep them in stock because the customers buying chainsaws, mowers, sleds, and small-engine equipment from us also need the way to move it. "
        "The trailer outside the door is more useful than the trailer that requires a separate trip across town to look at.</p>"
        "<p>This trailer fits the working rural customer — property owners around Searchmont and out toward Aweres, hobby-farm guys who do their own maintenance, and the customer with a wood lot who hauls firewood every weekend through the fall. "
        "Spring brush runs are the use case that comes up most often when Kory writes one of these up. The deck size handles the loads people actually move, not the catalogue maximum.</p>"
        "<p>Trailers are easier to spec when you can walk around them. "
        "Drop in to 11 White Oak Drive East, Sault Ste. Marie, or call 705-253-7828 to ask about availability. "
        "Lynn manages the parts counter and Ron handles parts pulls — between them they can talk through tie-downs, lighting kits, and the small accessories that finish out the rig.</p>"
    ),
    "review": (
        "The 2026 Trailer X is the size I sell to working customers who do firewood and brush runs more often than they do anything else. "
        "Most of the buyers I have written up on this size are property owners who are tired of asking a buddy for the trailer every weekend during fall woodlot season. "
        "We stock the Trailer line — not authorised — but they do the job for the price. "
        "Honest sales-floor read: this is a tool for the work you actually do, not the work you might do once. "
        "Stop in and walk around it before deciding. Easier to know whether the size fits in person than on the spec sheet."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2026\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 25: 2025 Trailer X (VIN 2REA2S7A5S2158650)
REWRITES["ROW:25"] = {
    "_match_vin": "2REA2S7A5S2158650",
    "Name": "2025 Trailer X — Sled-Hauling Utility Trailer",
    "Short description": "2025 utility trailer on the floor. Sized for sled hauling out to the trails or the spring boat-launch run.",
    "Description": (
        "<p>The 2025 Trailer X is the kind of mid-size utility trailer that gets used hardest in two specific seasons — winter, hauling sleds out to the trail networks, and spring, when the boat-launch run starts and the cottage equipment comes out of storage. "
        "Stocked at Reyco at the front of the property, available now for the customer who has been getting by with a borrowed one.</p>"
        "<p>Reyco stocks the Trailer line. We are not an authorised dealer for this brand — we keep them on the lot because the customers buying sleds, motors, fishing electronics, and small-engine equipment also need a way to move it. "
        "Having the trailer in stock at the front of the lot is more useful to a buyer than directing them somewhere else.</p>"
        "<p>The customer base for this size class tends to land on two crowds. Sled riders who run trails out toward Searchmont and the Stokely Creek network and want their own trailer instead of waiting on a buddy's. "
        "Boat owners up around Goulais River and the Sault waterfront who need to move a small boat or a kayak rig in the spring without imposing on a friend. "
        "It is the size class that does not over-buy; it is enough for the use cases most buyers actually run, no more.</p>"
        "<p>Drop in to White Oak Drive to walk around it — easier than measuring it on paper. "
        "Lynn at the parts counter can talk through tie-downs, ramp options, and the accessories that finish out the rig once the trailer itself is on the truck. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "review": (
        "The 2025 Trailer X in this size is the one I sell to customers who do not want to over-buy. "
        "Most of the buyers I have put on this trailer are sled riders or weekend boat-launch customers who want a trailer they own instead of borrowing one every season. "
        "We stock the line — no authorised relationship — but it does the job for the price. "
        "Honest sales-floor take: trailers are a long-game tool. Buy what fits the load you most often move, and skip the temptation to size up &quot;just in case.&quot; "
        "Drop in and we can sit it next to your tow vehicle in the lot to size it right."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2025\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 26: 2026 Trailer X (VIN 2REA2S7A4T216182)
REWRITES["ROW:26"] = {
    "_match_vin": "2REA2S7A4T216182",
    "Name": "2026 Trailer X — Cottage-Country Utility Trailer",
    "Short description": "2026 utility trailer stocked at Reyco. Made for cottage country — riding mowers, kayaks, and the swap-over haul each season.",
    "Description": (
        "<p>The 2026 Trailer X is on the floor for the cottage-country customer who finally decided to stop borrowing one. "
        "Riding mowers between properties, kayaks heading out to the inland lakes, the swap-over haul when summer equipment goes back into storage and the fall gear comes out — that is the everyday rhythm this trailer fits. "
        "Stocked at White Oak Drive, available now.</p>"
        "<p>Reyco stocks the Trailer line at the front of the lot. We are not an authorised dealer — we keep these in stock because the customers buying riding mowers, push mowers, snow blowers, and outdoor power equipment from us also need the way to move it between locations. "
        "Having the trailer ready out front means the buyer is not making two trips to two lots to put a complete setup together.</p>"
        "<p>The customer profile that lands on this size is the cottage and small-property crowd. "
        "Buyers up around Goulais River, customers maintaining a cabin on St. Joseph Island, hobby gardeners and small-farm owners around Aweres and the back-Sault network. "
        "It is not the contractor trailer. It is the everyday hauler that earns its keep through the small jobs done every weekend through the season.</p>"
        "<p>Easier to size a trailer in person than from the spec sheet — the rail height, the deck length, the tongue weight all read different in person. "
        "Drop in to 11 White Oak Drive East to walk around it, or call 705-253-7828 to ask about availability. "
        "Lynn at the parts counter can talk through tie-downs and the accessories that go on top of the trailer itself.</p>"
    ),
    "review": (
        "The 2026 Trailer X in this size sells most often to cottage-country customers who do their own equipment swaps every season. "
        "Most of the buyers are running properties around Goulais River, up toward Heyden, or out on the islands, and they have been borrowing or renting a trailer until they finally bought one. "
        "We stock the Trailer line — not authorised — but the build holds up to what the customers in this size class need. "
        "Honest sales-floor take: do not size up unless you have a specific load that calls for it. The everyday hauler is what works for everyday work. "
        "Stop in and walk around it before deciding — that is where the right answer comes from."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2026\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 27: 2025 Trailer X (the second occurrence of 2REA2S7A5S2159460 — same VIN as row 21)
# Let me re-check input. Row 21 and Row 27 both show VIN 2REA2S7A5S2159460. Need to handle.
# Use index-of-occurrence to disambiguate.
REWRITES["ROW:27"] = {
    "_match_year": "2025",
    "_match_vin": "2REA2S7A5S2159460",
    "_match_idx_within_vin": 1,  # second occurrence
    "Name": "2025 Trailer X — Property-Cleanup Utility Trailer",
    "Short description": "2025 utility trailer in stock at White Oak Drive. The dependable hauler for property cleanup, gear runs, and weekend camp logistics.",
    "Description": (
        "<p>The 2025 Trailer X on Reyco's floor is the kind of utility trailer that fits the customer who needs a working tool, not a hobby piece. "
        "Property cleanup runs, gear hauling between camps, and the weekend logistics when the truck bed is already loaded with something else — that is what this trailer is for. "
        "Available now at White Oak Drive.</p>"
        "<p>Reyco stocks the Trailer line at the front of the property. We are not the authorised dealer for this brand; we keep them in stock because the customers shopping at the front of the building also need the way to move what they buy. "
        "A trailer in stock is more useful than a trailer that requires a separate sourcing trip somewhere else.</p>"
        "<p>The buyers Kory tends to write this size up for are the working middle — property owners around Bruce Mines, customers maintaining family camps off the Trans-Canada toward Iron Bridge, and small-business owners who do their own equipment moves rather than contracting them out. "
        "It is the size class that earns its keep on the small jobs done frequently — not the heavy contractor jobs, but the weekend property work that adds up over a season.</p>"
        "<p>Trailers are a tool best sized in person. "
        "Drop in to 11 White Oak Drive East to walk around it, or call 705-253-7828 to confirm availability. "
        "Lynn at the parts counter and Ron in parts can talk through the accessories — tie-downs, ramps, lighting — that finish out the rig once you have the trailer itself spec'd.</p>"
    ),
    "review": (
        "The 2025 Trailer X in this size is the working customer's trailer — sold most often to property owners and weekend camp guys around the Sault. "
        "Most of the buyers I have written up are running mid-size rural properties or hunt camps, and they wanted a trailer they could keep at the property year-round instead of relocating one every weekend. "
        "We stock the line — not authorised here — but it holds up to the working use customers expect. "
        "Honest sales-floor read: a utility trailer is the kind of purchase that makes sense when you stop counting how many times a year you have borrowed one. "
        "Drop in and walk around it on the lot before deciding."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2025\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 28: 2024 Easy Hauler AL-1610B-YC (VIN 2SPBBSB17PN072082)
REWRITES["ROW:28"] = {
    "_match_vin": "2SPBBSB17PN072082",
    "Name": "2024 Easy Hauler AL-1610B-YC Trailer",
    "Short description": "2024 Easy Hauler trailer on the floor. Built for quad and small-equipment moves — the kind of trailer that earns its keep on every weekend run.",
    "Description": (
        "<p>The 2024 Easy Hauler AL-1610B-YC is on Reyco's floor for the customer ready to commit to a working trailer. "
        "Right-sized for quad moves, small-equipment hauling, and the everyday weekend runs where having your own trailer in the driveway is the difference between getting the job done and rescheduling. "
        "Easy Hauler builds these for that kind of work; we stock them at the front of our lot for the same reason.</p>"
        "<p>Reyco stocks the Easy Hauler catalogue at White Oak Drive. We are not the authorised Easy Hauler dealer — that is a different relationship — but we keep them on the floor because the customers buying quads, sleds, and small engines from us also need the way to move them. "
        "Having the trailer right out front means a complete setup walks out of the same dealership.</p>"
        "<p>The customer profile for this trailer is the everyday rural buyer. "
        "Quad owners running their machine to and from camp every weekend, small-equipment owners moving lawn tractors or compact gear between properties, and the buyer who finally decided that not owning a trailer was the bottleneck on every weekend project. "
        "Easy Hauler builds them in the size class that fits the way most working customers actually use a trailer — not the heavy-end contractor specs, the everyday-tool specs.</p>"
        "<p>Easier to size a trailer to your tow setup in person. "
        "Drop in to 11 White Oak Drive East to walk around it, or call 705-253-7828 to ask whether this VIN is still on the floor. "
        "Lynn manages the parts counter; she and Ron can talk through tie-downs, lock kits, and the accessories that complete the rig.</p>"
    ),
    "review": (
        "The 2024 Easy Hauler in this size is the trailer I sell to quad owners and small-equipment movers around the Sault. "
        "Most of the buyers are running camps off the highways toward Bruce Mines or Searchmont, and they have been getting by with a buddy's trailer until they decided to own one. "
        "Easy Hauler is not a brand we are authorised to service — we stock the catalogue at the front of the lot — but the build holds up to the working use the size is meant for. "
        "Honest sales-floor read: this is a buy-once, use-for-years tool. Pick the deck size that matches your most frequent load and stop worrying about it. "
        "Drop in and we can size it against your tow setup in the lot."
    ),
    "specs": "Make|Easy Hauler\nModel|AL-1610B-YC\nYear|2024\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 29: 2026 Trailer X (VIN 2REA2S7A8T2164962)
REWRITES["ROW:29"] = {
    "_match_vin": "2REA2S7A8T2164962",
    "Name": "2026 Trailer X — Lumber-Hauling Utility Trailer",
    "Short description": "2026 utility trailer stocked at Reyco. Sized for hauling lumber, building materials, and the spring shop overflow.",
    "Description": (
        "<p>The 2026 Trailer X on Reyco's floor is the kind of utility trailer that finds its work in the side projects — the lumber run for the deck repair, the building-material haul for the shed expansion, the spring overflow when the shop bench has sprouted projects through the winter. "
        "Stocked at White Oak Drive, available now for the customer ready to bring one home.</p>"
        "<p>Reyco stocks the Trailer line at the front of the property. We are not an authorised dealer for this brand — we keep them on the lot because the customers shopping equipment from us also need the way to move what they bring home. "
        "It is the simple practicality of stocking what the customer's day actually requires.</p>"
        "<p>The buyer profile for this size lands on the customer who has been planning the spring project list for months. "
        "Property owners around Echo Bay or up the highlands toward Heyden, hobby builders running side workshops, weekend handymen with multi-stage projects on properties around the Sault. "
        "It is not a contractor trailer; it is the size class that handles the building-material side of self-sufficient property ownership without requiring a heavier-duty rig.</p>"
        "<p>Drop in to 11 White Oak Drive East to walk around it — sizing matters more than spec sheets when the question is whether your tow vehicle is happy with the rig. "
        "705-253-7828 to ask about current availability. "
        "Lynn and Ron at the parts counter can talk through tie-downs, ramp options, and the small accessories that round out the build.</p>"
    ),
    "review": (
        "The 2026 Trailer X is the size I sell to customers who run side projects on their own properties — building, hauling, fixing, hauling again. "
        "Most of the buyers are property owners around the Sault who plan their spring around a trailer they did not own last year and are committing to this year. "
        "We stock the Trailer line — not authorised — but the build holds up for everyday-use buyers. "
        "Honest sales-floor read: trailers are not a glamour purchase, but a wrong-sized trailer is a year-round irritant. Get the size right and you forget about it. "
        "Drop in and we can match it against your tow vehicle on the lot."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2026\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 30: 2025 Easy Hauler 1250# PAINTED TRAILER 480 X 12B E-COAT (VIN 2SPBCSB18TN075970)
REWRITES["ROW:30"] = {
    "_match_vin": "2SPBCSB18TN075970",
    "Name": "2025 Easy Hauler 480 x 12B Trailer",
    "Short description": "2025 Easy Hauler painted trailer on the floor. E-coat finish for Northern Ontario weather — built to take road salt, slush, and four-season hauling.",
    "Description": (
        "<p>The 2025 Easy Hauler painted trailer on Reyco's floor is the build for the customer who tows year-round and does not want to fight rust the whole time. "
        "E-coat finish on the frame, factory-painted, built for the weather that Northern Ontario actually puts on a trailer between November and April. "
        "It is the trailer for the buyer who has watched a previous trailer corrode out from underneath and decided this time to start with the right finish.</p>"
        "<p>Reyco stocks the Easy Hauler catalogue at the front of the lot. We are not the authorised Easy Hauler dealer — that is a separate relationship — but we keep them on the floor because customers buying equipment from us through the seasons that hammer trailers also need the kind of trailer that holds up to it. "
        "Stocking the painted/E-coat builds is part of fitting the local market.</p>"
        "<p>The use case Kory has watched this size handle most often: customers who tow through winter to ice-fishing spots on the Lake Superior shoreline, road-salt-heavy daily drivers who need a trailer that survives a Trans-Canada commute, "
        "and buyers who learned the hard way that an unpainted bare-aluminum or untreated frame does not stay looking new for long up here. "
        "The E-coat is not a feature; it is what makes the trailer a long-term tool instead of a three-year disposable.</p>"
        "<p>Drop in to White Oak Drive to see the finish in person — paint and coatings read different on the lot than in catalogue copy. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828. "
        "Lynn at the parts counter and Ron in parts can talk through the accessories that round out the build for year-round use.</p>"
    ),
    "review": (
        "The 2025 Easy Hauler painted trailer is the one I sell to customers who tow year-round and want a finish that survives Northern Ontario winters. "
        "Most of the buyers are guys who have already had a trailer rust out on them and are not making the same call twice. "
        "Easy Hauler is not a brand we are authorised to service — we stock the catalogue out front — but the painted/E-coat builds are the right fit for the climate up here. "
        "Honest sales-floor take: do not skip the finish to save money. The road salt does not care about your budget, and a painted trailer outlasts an untreated one by years up here. "
        "Drop in to see the finish in person — easier to assess paint on the lot than off the catalogue page."
    ),
    "specs": "Make|Easy Hauler\nModel|480 x 12B\nYear|2025\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 31: 2026 Trailer X (VIN 2REA2S7A2T2164228)
REWRITES["ROW:31"] = {
    "_match_vin": "2REA2S7A2T2164228",
    "Name": "2026 Trailer X — Kayak & Small-Boat Utility Trailer",
    "Short description": "2026 utility trailer stocked at Reyco. Sized for the boat-launch run, kayak weekends, and shoulder-season equipment moves.",
    "Description": (
        "<p>The 2026 Trailer X on Reyco's floor is the trailer that earns its keep through shoulder season — May boat launches, June kayak weekends, the equipment shuffle each spring when winter gear comes out and summer gear goes in. "
        "It is not a winter-only or a summer-only trailer; it is the everyday hauler that most rural Sault customers actually use most weekends through six months of the year.</p>"
        "<p>Reyco stocks the Trailer line at White Oak Drive. We are not an authorised dealer for this brand — we stock them at the front of the lot because the customers shopping for the gear inside also need the way to move it. "
        "A trailer in stock at the same lot as the gear it is moving is a practical answer to a practical question.</p>"
        "<p>This size lands on a specific buyer profile. Boat and kayak owners on the inland lakes north of the Sault — Goulais Lake, Bellevue Valley, the chain of smaller lakes — who do not want a full-size boat trailer but want something proper for the smaller craft. "
        "Customers running summer cottages on the islands. Shoulder-season campers who pack a small cargo trailer for spring trips out to Crown land. "
        "It is a versatile size; that is why it does not sit on the floor long once it is the right size for the customer.</p>"
        "<p>Drop in to 11 White Oak Drive East to walk around it. "
        "Trailer sizing reads better on the lot — the deck length, rail height, and tongue weight all matter more in person than they do on paper. "
        "705-253-7828 to ask about availability. Lynn manages the parts counter, and she or Ron can run through accessories to round out the rig.</p>"
    ),
    "review": (
        "The 2026 Trailer X in this size is the shoulder-season trailer I sell most often. "
        "Customers I have written it up for include kayak owners running the inland lakes and small-boat owners who did not want a full-size boat trailer for a small craft. "
        "We stock the Trailer line — not authorised — and the build does the job for the price. "
        "Honest sales-floor take: think about how many weekends a year you actually use a trailer, and buy the size that fits the most common load. The right-sized trailer disappears into the day; the wrong-sized one is always slightly in the way. "
        "Drop in and we can size it against your tow setup in the lot."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2026\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 32: 2024 Trailer X (VIN 2REA2S7A5R2155242 — wait this is duplicate of Row 23! Let me re-check.)
# Actually looking at python output: Row 23 VIN ends "5R2155242". Row 32 input shows VIN ends "5R2155242" too — DUPLICATE.
# This is an idx-disambiguation case. Let me use idx.
REWRITES["ROW:32"] = {
    "_match_year": "2024",
    "_match_vin": "2REA2S7A5R2155242",
    "_match_idx_within_vin": 1,  # second occurrence
    "Name": "2024 Trailer X — Dump-Run Utility Trailer",
    "Short description": "2024 utility trailer in stock. The trailer that gets pressed into duty for cottage opening, dump runs, and weekend hauls when the truck bed is full.",
    "Description": (
        "<p>The 2024 Trailer X on Reyco's floor is the second-tier work trailer — the one that gets pressed into duty when the truck bed is already loaded and there is still gear to move. "
        "Cottage opening runs in May, dump runs in September, the in-between hauls all year long. "
        "It is the everyday utility trailer that sits in the driveway most of the time and earns its keep on the days the buyer needs it.</p>"
        "<p>Reyco stocks the Trailer line at the front of the property. We are not an authorised dealer for this line — we keep them in stock because the customer who buys mowers, blowers, sleds, and small engines from us also needs the way to move them. "
        "Putting the trailer at the front of the lot is just practical for how customers shop.</p>"
        "<p>This size fits a particular customer: the cottage opener, the seasonal swap-over guy, the buyer who runs dump and brush trips through fall and spring. "
        "Customers around Echo Bay, up the Trans-Canada toward Wawa, and on the islands tend to be the steady buyer profile. "
        "It is the trailer that gets bought once and used for years, not the trailer that gets upgraded every season.</p>"
        "<p>Drop in to White Oak Drive to walk around it — the size and rail height read better on the lot than off the page. "
        "11 White Oak Drive East, Sault Ste. Marie. 705-253-7828 to ask about availability. "
        "Lynn at the parts counter handles the accessory side; tie-downs, ramps, and lighting kits all live at the same desk.</p>"
    ),
    "review": (
        "The 2024 Trailer X is the everyday hauler I sell to cottage and small-property customers around the Sault. "
        "Most of the buyers are guys who have a truck for the daily work and a trailer for the days when the truck is not enough. "
        "We stock the Trailer line — not authorised — and the build is what the price suggests. "
        "Honest sales-floor read: this is the trailer for the second-tier hauling job, not the primary one. If your every-weekend load is bigger, size up to a heavier hauler. "
        "Drop in and we can sit it against your tow vehicle on the lot to size it right."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2024\nType|Trailer\nClass|T",
    "slug": "trailers",
}

# ROW 33: 2025 Trailer X (VIN 2REA2S7A5S2159460 — third occurrence! Triplicate.)
# Actually let me re-check. Row 21 = 2REA2S7A5S2159460. Row 27 = 2REA2S7A5S2159460. Row 33 = 2REA2S7A5S2159460.
# Three rows share that VIN. Bookkeeping by idx.
REWRITES["ROW:33"] = {
    "_match_year": "2025",
    "_match_vin": "2REA2S7A5S2159460",
    "_match_idx_within_vin": 2,  # third occurrence
    "Name": "2025 Trailer X — All-Season Utility Trailer",
    "Short description": "2025 utility trailer on the floor at White Oak Drive. Built for the everyday haul — sled, quad, mower, or whatever the season throws at it.",
    "Description": (
        "<p>The 2025 Trailer X on Reyco's floor is the all-season utility trailer for the customer who refuses to own three different trailers for three different jobs. "
        "Sled in winter, quad in shoulder season, mower or kayak through summer, brush and firewood through fall — that is the rotation this trailer is built to handle. "
        "Stocked at the front of the lot, available now for the customer who has been making do without one for too long.</p>"
        "<p>Reyco stocks the Trailer line at White Oak Drive. We are not the authorised dealer for this brand; we keep them on the lot because the customers buying year-round equipment from us — sleds, quads, mowers, blowers — also need the year-round trailer that moves all of it. "
        "One trailer that handles the rotation is more useful than three single-purpose ones for most rural buyers around the Sault.</p>"
        "<p>The customer profile is the multi-season rural property owner. "
        "Buyers around Goulais River, Bruce Mines, Searchmont, Iron Bridge, and out on the islands who run different gear through different seasons and need a trailer that takes whatever load the calendar calls for. "
        "It is not a specialist trailer; it is the generalist that does most of the jobs well enough that you stop thinking about it and just use it.</p>"
        "<p>Easier to size a trailer in person. Drop in to 11 White Oak Drive East to walk around it, or call 705-253-7828 to confirm this one is still available. "
        "Lynn at the parts counter and Ron in parts can talk through the accessories — tie-downs, ramps, lighting kits, lock kits — that cover whatever the seasonal load calls for.</p>"
    ),
    "review": (
        "The 2025 Trailer X in this size is the all-season trailer I sell to customers who refuse to own three different ones. "
        "Most of the buyers are multi-season property owners — sleds in winter, quads and mowers through the warm months, brush and firewood in the fall — and they want one trailer that handles the rotation. "
        "We stock the Trailer line — not authorised — but the build does the everyday work the size is meant for. "
        "Honest sales-floor take: a generalist trailer is the right answer for most rural buyers. Specialist trailers make sense only when you have one specific load you do over and over. "
        "Drop in and we can sit it against your tow setup in the lot to size it right."
    ),
    "specs": "Make|Trailer\nModel|X\nYear|2025\nType|Trailer\nClass|T",
    "slug": "trailers",
}


# ============================================================================
# CSV processing
# ============================================================================

# Per-row extension paragraphs (each unique) — appended to descriptions to clear 300w.
EXTRAS = {
    "HS-STRK250R-26": (
        "<p>Trade-in conversation is open if you are coming off a youth quad — Lynn at the parts counter starts those, and we can take a look at what your rider is graduating from. "
        "Accessory bundle worth asking about: a half-windshield, a set of teen-fit safety harnesses, and a basic rear cargo box for the family-camp use case.</p>"
    ),
    "HS-STRK550R-26": (
        "<p>Common accessory adds for the Strike 550R: a full windshield for shoulder-season trail rides, a winch-bumper combo for rougher Crown-land riding, and a basic rear-rack mount. "
        "Ron at the parts counter knows which ones fit factory and which ones add up at install — worth asking before ordering blind.</p>"
    ),
    "HS-SEC550EPS-26": (
        "<p>Trade-in talk is open if you are stepping up from a quad or off a smaller Sector — Lynn handles intake at the parts counter. "
        "Accessory adds worth a look on this one: a winch for plow-blade compatibility, a windshield for shoulder-season comfort, and the EPS-line factory add-ons that fit cleanly off the Hisun catalogue.</p>"
    ),
    "HS-SEC750CREW-26": (
        "<p>Worth asking about on the floor: cargo bed extensions, four-up safety harnesses, and the family of factory accessories Hisun ships for the Crew chassis. "
        "Trade-in chat is open with Lynn at the parts counter if you are stepping up from a two-seat utility — bring the smaller machine in for an honest read on what it is worth toward the upgrade.</p>"
    ),
    "HS-STRY750X-26": (
        "<p>Accessories that come up most often on Stryker 750X writeups: a winch for technical-trail recovery, a full skid-plate kit for protection on aggressive terrain, and uprated lighting for low-visibility runs. "
        "Ron handles those parts pulls. Trade-in conversation is open if you are coming off another sport flagship — bring it in and we can size up the value honestly.</p>"
    ),
    "HS-MP9550R-26": (
        "<p>Common accessory packages on the MP9 550R: half-windshield kits for shoulder-season comfort, factory-fit roof panels for rain protection, and the MP9-line rack mounts that bolt on without aftermarket guesswork. "
        "Ron at the parts counter handles the catalogue pulls; ask before ordering anything aftermarket so you do not pay twice for fitment.</p>"
    ),
    "HS-HS500-26": (
        "<p>Common accessory adds for the HS 500: front winch for trapline recovery, a basic gun rack for the hunting customer, and an oversized rear cargo box for the buyer using it as the working hauler on the property. "
        "Ron pulls the Hisun catalogue parts; Lynn manages the orders. Worth asking about a winch package before you walk out — it pays for itself the first time the trail goes wrong.</p>"
    ),
    "HS-FORGE400I-26": (
        "<p>Accessory bundle worth a conversation on the Forge: handguards for late-season cold riding, a winch package for solo-rider recovery, and the Forge-line storage adds that fit factory mount points without aftermarket guessing. "
        "Lynn manages the parts orders; Ron pulls them off the Hisun catalogue. Stop in before ordering anything aftermarket — fitment matters more than people realise.</p>"
    ),
    "HS-SEC-E1-26": (
        "<p>Common questions on the Sector E1 from buyers seriously evaluating electric: charge time on a 240V circuit if you have shop power, range under load, and battery service intervals. "
        "Lee on the bench has the answers; come prepared with your use-case specifics and we can give you straight numbers rather than catalogue copy. Worth a demo ride at the showroom — quietest one we run.</p>"
    ),
    "HS-ACENV-26": (
        "<p>Common accessory packages on the ACE NV: factory canopy upgrades, road-package lighting kits for LSV-classified use, and golf-bag storage frames for the course-fleet buyer. "
        "Ron handles the parts catalogue pulls. Worth confirming with your municipality before finalising — the LSV rules are local-specific and we cannot speak for every Ontario town on classification.</p>"
    ),
    "HS-GUARDIAN-26": (
        "<p>Accessory adds that come up most on GUARDIAN writeups: front winch with steel cable for trapline use, a heavy-duty gun rack, and the GUARDIAN-line storage boxes for working customers who carry tools through the season. "
        "Lynn handles the orders; Ron pulls Hisun parts off the catalogue. Stop in before committing to aftermarket — factory-fit gear holds up better in the conditions a working ATV gets pushed through.</p>"
    ),
    "HS-TACTIC-26": (
        "<p>Worth asking about on the floor: a winch package, hand-guard kit for shoulder-season cold, and a basic cargo-box add-on for the customer using it as a property tool. "
        "Lynn manages parts orders, Ron handles the Hisun catalogue pulls. Trade-in conversation is open if you are stepping up from an entry quad — bring it in for an honest valuation.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "HS-HS400-26": (
        "<p>Accessory bundle that makes sense on the HS 400: a basic winch for property recovery, a rear cargo box for firewood loading, and a half-windshield for shoulder-season riding. "
        "Lynn at the parts counter handles orders; Ron pulls Hisun catalogue parts when needed. Trade-in conversation is open with Lynn at the parts counter if you are coming off another entry quad.</p>"
    ),
    "HS-SEC250-26": (
        "<p>Accessory packages worth a conversation on the Sector 250: a compact-fit windshield, a smaller-bed cargo box that fits the Sector platform, and the trailer-hitch mount that turns it into a working hauler for cottage trail use. "
        "Lynn manages parts orders; Ron pulls the Hisun catalogue. Trade-in talk is open if you are stepping over from a quad.</p>"
    ),
    "HS-SEC750EPS-26": (
        ""  # already 337w — no extension needed
    ),
    "HS-STRY550-26": (
        "<p>Common accessory adds on the Stryker 550X: a full skid-plate kit for trail protection, a winch for recovery, and uprated suspension components for buyers who push the chassis hard. "
        "Lynn at the parts counter handles the Hisun-catalogue orders; Ron pulls parts as needed. Trade-in conversation is open if you are coming up from a Strike or off another sport UTV.</p>"
    ),
    "HS-STRY750CREW-26": (
        "<p>Accessory packages that come up on Stryker 750 Crew writeups: full-cab enclosures for shoulder-season riding, four-up harnesses, and a rear-rack cargo solution that does not interfere with the back row. "
        "Ron handles parts catalogue pulls. Trade-in is open if you are stepping up from a two-seat sport — Lynn at the parts counter starts the conversation.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "HS-MP9750R-26": (
        "<p>Common accessory adds on the MP9 750R: full skid-plate kits, winch packages, uprated suspension components for sport-aggressive riders, and the MP9-line factory storage solutions. "
        "Ron pulls the Hisun catalogue parts; Lynn manages the orders. Worth asking before going aftermarket — factory-fit gear holds up better through the kind of riding the 750R gets put through.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "HS-MP9T400-26": (
        "<p>Common accessory adds on the MP9T400: half-windshield for shoulder-season trail comfort, a basic rear-rack solution, and a winch package for solo-rider recovery. "
        "Lynn manages parts orders; Ron handles the Hisun catalogue pulls. Trade-in conversation is open if you are coming off a quad you have ridden into the ground — bring it in for an honest read.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    # Trailers
    "ROW:20": (
        "<p>Worth a conversation on the floor: trailer locks for camp-storage security, factory-fit ramp options, and lighting kits for night-haul setups. "
        "Lynn manages the trailer orders. Trade-in talk is open if you are coming off a smaller hauler — we will give you an honest read on what your existing trailer is worth toward the upgrade.</p>"
    ),
    "ROW:21": (
        "<p>Worth asking about: trailer-jack upgrades, locking hitch couplers, and lighting accessories that make the trailer safer to back up at dusk. "
        "Lynn manages the parts orders. Stop in any weekday between 8 and 5 — Saturday hours are shorter, so call ahead if the weekend is the only window.</p>"
    ),
    "ROW:22": (
        "<p>Common accessory adds on tri-axle trailers: brake-controller-compatible wiring, locking storage boxes, and ramp-extension kits. "
        "Lynn manages the orders; Ron in parts handles the smaller catalogue pulls. Worth asking about brake-controller setup before towing for the first time — heavier trailers behave differently.</p>"
    ),
    "ROW:23": (
        "<p>Accessory adds worth a conversation: trailer locks for cottage-storage security, replacement-grade tie-down anchors, and basic LED lighting kits for low-light hauling. "
        "Lynn manages the parts orders. Stop in to see this trailer in person — White Oak Drive lot, around the side from the showroom entrance.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:24": (
        "<p>Common accessory adds for working trailers: trailer-tie kits, ramp-grade traction strips, and basic locking tongue couplers for security at the property. "
        "Lynn manages the parts orders. Worth a stop on the floor before deciding — the deck dimensions read different in person than in catalogue copy.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:25": (
        "<p>Common accessory adds on trailers in this size class: locking hitch couplers, ramp-grade anti-slip strips, and replacement-grade tie-down rings. "
        "Lynn handles the orders. Stop in to White Oak Drive any weekday — easier to size in person than from catalogue copy.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:26": (
        "<p>Worth a conversation on accessories: locking tongue couplers, replacement tie-down rings, ramp-grade anti-slip strips, and basic LED lighting for shoulder-season early-morning hauls. "
        "Lynn manages the trailer parts orders. Trade-in talk is open if you have a smaller trailer you are sizing up from.</p>"
    ),
    "ROW:27": (
        "<p>Common accessory adds: locking hitch couplers, basic LED lighting kits, replacement tie-down anchors, and ramp-grade traction strips. "
        "Lynn manages the orders. Stop in to White Oak Drive on a weekday — easier to size against your tow setup with the trailer right in front of you.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:28": (
        "<p>Common accessory adds on Easy Hauler quad trailers: replacement-grade tie-down anchors, ramp-grade anti-slip strips, and basic LED lighting kits. "
        "Lynn manages parts orders. Stop in any weekday — easier to size against your quad and tow setup with the trailer in front of you.</p>"
    ),
    "ROW:29": (
        "<p>Accessory adds worth thinking about: trailer locks, locking hitch couplers, replacement tie-down rings, and an LED lighting upgrade if you are towing in low light. "
        "Lynn handles the orders. Worth a walk-around in the lot before deciding — sizing matters more than spec sheets when the question is whether your tow vehicle is happy with the rig.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:30": (
        "<p>Common accessory adds on a trailer this is built to last: locking hitch couplers, all-weather tie-downs, and LED-grade lighting that survives the conditions the painted frame is built for. "
        "Lynn manages the orders. Worth asking about long-term maintenance schedules at the parts counter — a painted trailer with a maintained finish lasts the way the buyer expects it to.</p>"
    ),
    "ROW:31": (
        "<p>Worth a conversation on accessories: shoulder-season lighting upgrades, locking hitch couplers, replacement tie-down anchors, and ramp-grade traction strips. "
        "Lynn manages the parts orders. Trade-in conversation is open if you are coming off a smaller trailer — bring it in and we can give you an honest read.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:32": (
        "<p>Accessory adds that come up on second-tier work trailers: locking tongue couplers, replacement-grade tie-down rings, basic LED lighting kits for shoulder-season towing. "
        "Lynn manages the orders. Worth a stop on the lot to see it in person before deciding — measurements look different on the floor.</p>"
        "<p>11 White Oak Drive East, Sault Ste. Marie. 705-253-7828.</p>"
    ),
    "ROW:33": (
        "<p>Common accessory adds on all-season trailers: locking hitch couplers, weather-resistant tie-down anchors, ramp-grade anti-slip strips, and LED lighting that handles the cold mornings. "
        "Lynn manages the orders. Trade-in conversation is open if you are coming off a smaller trailer — Lynn at the parts counter handles the intake and gives you an honest valuation.</p>"
    ),
}


def append_extra(desc, key):
    extra = EXTRAS.get(key, "")
    if not extra:
        return desc
    # Insert before last </p>'s closing — actually just append after the last </p>.
    return desc + extra


def find_rewrite(row, row_idx):
    """Match by SKU (Hisun) or by row position (trailers)."""
    sku = (row.get("SKU") or "").strip()
    if sku and sku in REWRITES:
        return sku
    pos_key = f"ROW:{row_idx}"
    if pos_key in REWRITES:
        return pos_key
    return None


def main():
    with INPUT.open("r", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    # Add the new column at the end
    out_fieldnames = list(fieldnames) + ["Reyco Category Slug"]

    output_rows = []

    for i, row in enumerate(rows, start=1):
        rw_key = find_rewrite(row, i)
        if rw_key is None:
            print(f"WARNING: row {i} ({row.get('Name','')}) — no rewrite found")
            output_rows.append({**row, "Reyco Category Slug": ""})
            continue
        rw = REWRITES[rw_key]

        new_row = dict(row)
        new_row["Name"] = rw["Name"]
        new_row["Short description"] = rw["Short description"]
        new_row["Description"] = append_extra(rw["Description"], rw_key)
        new_row["Meta: _product_expert_id"] = "8"
        new_row["Meta: _product_expert_review"] = rw["review"]
        new_row["Meta: _product_specs"] = rw["specs"]
        new_row["Reyco Category Slug"] = rw["slug"]
        output_rows.append(new_row)

    with OUTPUT.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)

    # Verify
    matched = sum(1 for r in output_rows if r.get("Reyco Category Slug"))
    print(f"Matched: {matched}/{len(rows)}")
    print(f"Output: {OUTPUT}")
    if matched != len(rows):
        for i, r in enumerate(output_rows, 1):
            if not r.get("Reyco Category Slug"):
                print(f"  UNMATCHED row {i}: {r.get('Name','')[:60]} VIN={r.get('Meta: _lightspeed_vin','')[:20]}")


if __name__ == "__main__":
    main()
