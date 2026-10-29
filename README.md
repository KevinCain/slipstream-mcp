# Slipstream MCP server

Slipstream connects AI apps to a short-term rental host's own data: bookings,
occupancy, forecasts, reviews and owner payouts from Hospitable, OwnerRez or an
Airbnb account connected through Hospitable Connect. Every tool is read-only,
and every figure comes with a link to the Slipstream page it came from.

This repository holds the server's public metadata and test prompts. The
server itself is hosted; there is nothing to install or run.

- **Server URL:** `https://slipstream.rentals/api/ask/mcp` (streamable HTTP)
- **Sign-in:** OAuth with a Slipstream account (trial or paid). Co-host and
  manager accounts can connect; owner accounts can't yet.
- **Registry name:** `rentals.slipstream/slipstream` ([`server.json`](server.json))
- **Product page:** https://slipstream.rentals/integrations/claude?ref=github

## Add it

**Claude:** open [Slipstream in Claude's connector directory](https://claude.ai/directory/slipstream)
and choose Connect. Or, in Claude, open Customize → Connectors → Add custom
connector, and paste the server URL.

**Claude Code:**

```sh
claude mcp add --transport http slipstream https://slipstream.rentals/api/ask/mcp
```

Any MCP client that supports remote servers with OAuth sign-in can connect the
same way. `initialize` and `tools/list` answer without a login, so you can see
the tools first; every `tools/call` needs a signed-in account.

## Tools

| Tool | What it reads |
|---|---|
| `get_data_status` | How fresh the data is: when the last full sync with the PMS completed, and whether its bookings and reviews fetched cleanly. |
| `list_properties` | The properties this viewer can see, with their ids. |
| `get_goals` | The host's goals: each goal's sentence, current reading, target and gap. |
| `get_next_moves` | The ranked list of moves that matter most now: money errors first, then open nights, then Top Priorities, then goals. |
| `get_reservations_summary` | Booked stays grouped by check-in month, by channel, or by property: count, nights, revenue and average lead time (days from booking to check-in), then cancelled bookings and their revenue over the same span and groups. |
| `get_occupancy` | Occupancy for one or more calendar months, per property and for the portfolio: nights booked within those months (stays crossing a month's edge counted only for their nights inside it), nights in the period, and the open nights left. |
| `get_open_nights` | Unbooked nights right after a checkout in the next 14 days, per property, ranked by what they could earn (nights × recent nightly rate), with the minimum stay that limits selling them. |
| `get_listing_settings` | The pricing and availability settings last read from the PMS for each property: base and weekend nightly price, minimum stay, preparation time, cleaning fee per channel, and settings changes in the last 90 days. |
| `get_forecast` | Expected revenue for months from now on, with what is booked, what usually still comes in, the same month last year, the range, and how often that range held in past forecasts. |
| `get_metric` | One named metric for each property (or one property). |
| `get_recipe_output` | The latest stored outputs of a docked recipe (Top Priorities, Booking Pace Sentinel, The Pricing Oracle, The Maintenance Prophet, Reviews Owed, Fee Gaps and the rest) for each property, with when each was computed and what data the recipe reads. |
| `get_review_summary` | Reviews per property: share of eligible stays reviewed (with its 95% range and how it compares with the account), stays still owed a review, the rating trend, and the complaint group costing the most stars. |
| `get_review_categories` | Reviews by category per property (cleanliness, broken items, noise, check-in, Wi-Fi, value and the rest): the stars per rated review that guests' complaints about each category cost, how many reviews complain about it and how many praise it, plus the categories guests praise most. |
| `get_listing_highlights` | What one property offers that a listing title or description could lead with: bedrooms, guests it sleeps, property type and town; its most valuable amenities; amenities it has that the listing text never mentions or mentions only in passing; and what guests praise most in reviews. |
| `get_money_checks` | Money correctness per property: bookings missing a fee the property normally charges, double bookings and duplicate records, open owner incidents (refunds and over-limit charges), whether an owner split is set, and whether statements are on file for reconciliation. |
| `get_owner_payouts` | What owners earn. |
| `get_cost_per_stay` | Consumables (supplies) and housekeeping cost per stay per property, from the owner statements on file: the latest month's figure over a trailing three months, the usual figure lately, whether the latest month is a spike against the property's own history, and the published range for comparison. |
| `check_statement_month` | One month's owner statement against the bookings, per property: how many bookings the statement lists, statement lines for bookings the PMS doesn't have, that month's bookings missing from the statement, bookings whose rent differs between the two, and open guest refunds from that month and whether the statement carries them. |
| `explain_value` | How a docked recipe computed one output for one property: each step in order, with its value and what it reads. |
| `track_record` | What has been checked against outcomes: each recipe's matured predictions and how many held, the changes this host logged with how each was scored, and the recipe forecasts being tracked against what happens. |
| `open_draft` | Open the repeat-guest offer for a property: past guests whose reviews said they'd return, matched to an email, with a draft offer the host edits and sends from the property page. |
| `describe_recipe` | How a docked recipe works, without running it: each step in order, what it does, the steps it reads from, and the stored fields and data sources it reads. |
| `check_statement_against_bookings` | Check an owner statement the user pasted or attached (from a property manager or co-host) against this account's own bookings for that property. |

## What it never does

- It can't change a listing, a price or a setting, and it can't send messages.
- Guest names, emails and phone numbers are never returned.
- Reads cost nothing in Slipstream credits.
- Settings → Connected AI apps in Slipstream lists each connection, when it
  was last used and what it read, with a Disconnect button. Calls are logged
  for 90 days.

## Test prompts

[`prompts.md`](prompts.md) is the set used to check that a model picks the
right tool from these descriptions, including requests it should decline.

## Contact

concierge@slipstream.rentals
