import assert from "node:assert/strict";
import {
  calculateFleetImpact,
  impactDefaults,
  fleetSettingsFromQuery,
  fleetEnquiryLink,
  fleetEnquiryMessage,
} from "../src/impact-model.mjs";
import { finderChoices, finderModel } from "../src/finder.mjs";

const base = calculateFleetImpact(impactDefaults);
assert.equal(base.distance, 600000);
assert.equal(base.fuel, 24000);
assert.ok(Math.abs(base.tonnes - 56.3447287034) < 0.000001);
assert.equal(calculateFleetImpact({ ...impactDefaults, fleet: 1 }).fuel, 960);
assert.equal(
  calculateFleetImpact({ ...impactDefaults, fleet: 500 }).fuel,
  480000,
);
assert.equal(
  calculateFleetImpact({ ...impactDefaults, daily: 160 }).fuel,
  48000,
);
assert.equal(
  calculateFleetImpact({ ...impactDefaults, efficiency: 50 }).fuel,
  12000,
);
assert.equal(
  calculateFleetImpact({ ...impactDefaults, fuel: "diesel" }).fuel,
  base.fuel,
);
assert.ok(
  calculateFleetImpact({ ...impactDefaults, fuel: "diesel" }).co2 > base.co2,
);
for (const invalid of [
  { fleet: 0 },
  { fleet: 501 },
  { fleet: 1.5 },
  { daily: 0 },
  { daily: 301 },
  { days: 0 },
  { days: 366 },
  { efficiency: 0 },
  { efficiency: Infinity },
  { fleet: NaN },
  { fuel: "cng" },
  { fuel: "__proto__" },
]) {
  assert.equal(calculateFleetImpact({ ...impactDefaults, ...invalid }), null);
}
const query = new URL(fleetEnquiryLink(impactDefaults), "https://example.test")
  .searchParams;
assert.deepEqual(fleetSettingsFromQuery(query), impactDefaults);
assert.equal(
  fleetSettingsFromQuery(
    new URLSearchParams("fleet=0&daily=80&days=300&efficiency=25&fuel=petrol"),
  ),
  null,
);
assert.equal(
  fleetSettingsFromQuery(
    new URLSearchParams(
      "fleet=25&daily=80&days=300&efficiency=25&fuel=<script>",
    ),
  ),
  null,
);
assert.match(fleetEnquiryMessage(impactDefaults), /25 electric vehicles/);
assert.match(fleetEnquiryMessage(impactDefaults), /80 km per vehicle per day/);
let matches = 0;
for (const [work, choice] of Object.entries(finderChoices)) {
  for (const [need, , image] of choice.needs) {
    assert.equal(finderModel(work, need).image, image);
    matches++;
  }
}
assert.equal(matches, 9);
assert.equal(finderModel("goods", "not-a-setup"), null);
console.log(
  "PASS: fuel/CO₂ arithmetic, input boundaries, enquiry validation and nine vehicle finder matches.",
);
