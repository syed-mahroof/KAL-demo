# KAL interactive fleet and vehicle discovery

Implemented on 6 October 2026. This extends the existing layered vehicle presentation, mobile leadership portraits and model comparison journeys.

## Fleet impact calculator

[HeadGreen](https://www.headgreen.in/) supplied the interaction reference: a fleet slider beside annual climate and fuel outputs. The KAL version uses its own light teal design, an existing KAL rickshaw cutout as the native slider thumb, immediate consistent results, keyboard controls, a numeric fleet input and increment/decrement buttons. Distance presets and expandable driving assumptions make the estimate useful for different fleet scenarios. A fleet enquiry link carries only validated scenario numbers into a local enquiry draft.

The calculator estimates **avoided tailpipe CO₂ only**, alongside fuel displaced and kilometres electrified. It does not estimate net lifecycle emissions or financial savings. Electricity generation, vehicle manufacture and battery manufacture are excluded; the boundary remains visible beside the results. No solar charging, second-life manufacturing offset or tree equivalence claim was imported from the reference.

The [US EPA's vehicle emissions reference](https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle) gives 8.887 kg CO₂ per US gallon of gasoline and 10.18 kg per US gallon of diesel. Dividing by 3.785411784 litres per US gallon gives approximately 2.348 kg/L for petrol and 2.689 kg/L for diesel. The calculation uses the unrounded factors:

```
annual distance = vehicles × kilometres per vehicle per day × operating days
fuel displaced = annual distance ÷ comparison fuel efficiency (km/L)
tailpipe CO₂ avoided = fuel displaced × fuel carbon factor (kg/L)
```

Default example: 25 vehicles, 80 km per day, 300 operating days, 25 km/L petrol. This produces 600,000 km, 24,000 L and approximately 56.3 tonnes of tailpipe CO₂ per year. The example inputs are editable assumptions, not published KAL performance figures.

Allowed inputs: 1–500 vehicles, 10–300 km per day, 1–365 operating days and 5–60 km/L. Invalid inputs display a useful error and suppress estimates. Query parameters are validated before they can prefill an enquiry; no visitor contact details are included in the URL or stored by this feature.

The native range input supports touch, keyboard arrows, Home and End. Results are announced with a short debounce to avoid flooding screen readers during dragging. Motion respects reduced-motion preferences. Without JavaScript, the initial example remains readable, controls are disabled and a message explains how to enable editing.

## Guided vehicle finder

A compact expandable finder sits before the vehicle grid on the homepage and catalogue. Visitors choose passenger, goods or community use, then a specific application. The nine choices map to the nine existing KAL models. Each result includes the existing layered artwork, published buyer facts, a model link, comparison preselection and model-specific enquiry.

Suggestions are a discovery starting point. The interface asks visitors to confirm configuration, capacity and availability with KAL; it does not invent model capacities or assert that a suggested vehicle meets a visitor's operational requirements.

## Government identity

The existing official Government of Kerala emblem is now included beside the KAL logo in the shared header on all 18 pages. Both images retain their intrinsic proportions. Mobile sizes and the enlarged-text layout keep the identity, search and menu usable.

## Verification

Automated browser results and screenshots are saved in `audit/interactive-browser-results.json` and `audit/screenshots/interactive/regression/`. These checks run against the production build in Chromium; viewport emulation is not physical-device testing.

`npm run check:impact` verifies fuel/CO₂ arithmetic, input boundaries, fleet query validation and all nine finder mappings. The browser suite verifies route layouts, calculator controls, enquiry transfer, finder links, maximum-value layouts, enlarged text and the existing buying journeys.

The production build and static checks pass: 18 pages, unique metadata, one H1 per page and 937 internal asset/link checks. The calculator/finder arithmetic check passes. All 24 browser checks pass, including the 18-page matrix at 320, 375, 390, 768, 1024 and 1440 pixels, enlarged text at 320 and 1440 pixels, invalid calculator inputs, all nine suggestions and enquiry prefill. The calculator, finder and header screenshots were also inspected visually at mobile and desktop sizes.
