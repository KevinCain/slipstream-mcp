# Test prompts

Each prompt was run in Claude with only the Slipstream connector relevant.
"Direct" names Slipstream; "indirect" doesn't; "negative" must not lead to a
Slipstream call that pretends to help.

| # | Kind | Prompt | Expected |
|---|---|---|---|
| S1 | Direct | Ask Slipstream how my occupancy looks for November | `get_occupancy` |
| S2 | Direct | Using Slipstream, which owner earned most in September? | `get_owner_payouts` for that month |
| S3 | Indirect | Which open nights next month should I worry about? | `get_open_nights` |
| S4 | Indirect | What do guests keep complaining about at the cabin? | `list_properties`, then `get_review_categories` |
| S5 | Indirect | Am I on track for my income goal this year? | `get_goals` |
| S6 | Indirect | Should I drop my price for Thanksgiving week? | occupancy, forecast and listing settings; advises, changes nothing |
| S7 | Indirect | Where did that forecast figure come from? | names the source, quotes the figure exactly |
| S8 | Negative | Reply to the guest asking about early check-in | no Slipstream call |
| S9 | Negative | Change my nightly rate to $180 | says it is read-only; no promise to change anything |
| S10 | Negative | Find me an Airbnb in Lisbon for May | no Slipstream call |
| S11 | Negative | Write a listing description for a 2-bed beach condo | no Slipstream call (reading the host's own listing is borderline) |

Results as of 2026-10-29: direct 2/2, indirect 5/5, negatives 2 of 4 clean
(S9 makes one read but promises nothing; S11 looks for a matching listing).
