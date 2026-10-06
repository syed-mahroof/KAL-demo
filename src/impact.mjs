import {
  impactDefaults,
  calculateFleetImpact,
  impactNumber,
  fleetEnquiryLink,
  impactSources,
} from "./impact-model.mjs";

export function impactSection(icon) {
  const estimate = calculateFleetImpact(impactDefaults);
  return /* HTML */ `<section
    class="section impact-section"
    id="fleet-impact"
    aria-labelledby="impact-title"
    data-impact
  >
    <div class="container">
      <div class="section-heading impact-heading">
        <div>
          <span class="eyebrow"
            >A different drive. A measurable difference.</span
          >
          <h2 id="impact-title">Small vehicles.<br />Collective impact.</h2>
        </div>
        <p class="section-intro">
          What could your fleet change?<br />Move the rickshaw. Explore a year
          of electric travel.
        </p>
      </div>
      <div class="impact-grid">
        <div class="impact-workbench">
          <fieldset class="impact-controls" data-impact-controls disabled>
            <legend class="sr-only">Your fleet and driving assumptions</legend>
            <div class="impact-fleet-heading">
              <div>
                <label for="impact-fleet">Vehicles in your fleet</label>
                <div class="impact-fleet-count">
                  <input
                    id="impact-fleet"
                    name="fleet"
                    type="number"
                    inputmode="numeric"
                    min="1"
                    max="500"
                    step="1"
                    value="25"
                    aria-describedby="impact-fleet-help"
                    data-impact-input
                  /><span>vehicles</span>
                </div>
              </div>
              <div class="impact-stepper">
                <button
                  type="button"
                  data-fleet-step="-1"
                  aria-label="Remove one fleet vehicle"
                >
                  −</button
                ><button
                  type="button"
                  data-fleet-step="1"
                  aria-label="Add one fleet vehicle"
                >
                  +
                </button>
              </div>
            </div>
            <label for="impact-fleet-range" class="sr-only"
              >Fleet size slider</label
            >
            <div class="impact-road">
              <input
                type="range"
                id="impact-fleet-range"
                min="1"
                max="500"
                step="1"
                value="25"
                aria-describedby="impact-fleet-help"
                aria-valuetext="25 vehicles"
                data-impact-range
              />
            </div>
            <div class="impact-road-limits">
              <span>1 vehicle</span><span>500 vehicles</span>
            </div>
            <p class="impact-help" id="impact-fleet-help">
              Drag the rickshaw, tap the road, or use arrow keys.
            </p>
            <div class="impact-route-heading">
              <label for="impact-daily">Distance per vehicle, per day</label
              ><output for="impact-daily" data-impact-daily
                >${impactDefaults.daily} km</output
              >
            </div>
            <div
              class="impact-presets"
              role="group"
              aria-label="Daily distance presets"
            >
              <button type="button" data-daily-preset="40" aria-pressed="false">
                40 km</button
              ><button type="button" data-daily-preset="80" aria-pressed="true">
                80 km</button
              ><button
                type="button"
                data-daily-preset="120"
                aria-pressed="false"
              >
                120 km
              </button>
            </div>
            <input
              type="range"
              class="impact-distance-range"
              id="impact-daily"
              name="daily"
              min="10"
              max="300"
              step="5"
              value="80"
              aria-valuetext="80 kilometres per vehicle per day"
              data-impact-input
            />
            <details class="impact-assumptions">
              <summary>
                Adjust your driving assumptions ${icon("chevron")}
              </summary>
              <div class="impact-assumption-fields">
                <div>
                  <label for="impact-fuel">Current fuel</label
                  ><select id="impact-fuel" name="fuel" data-impact-input>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
                <div>
                  <label for="impact-days">Operating days / year</label
                  ><input
                    type="number"
                    id="impact-days"
                    name="days"
                    min="1"
                    max="365"
                    step="1"
                    value="300"
                    inputmode="numeric"
                    data-impact-input
                  /><span>1–365 days</span>
                </div>
                <div>
                  <label for="impact-efficiency">Current fuel economy</label>
                  <div class="impact-input-unit">
                    <input
                      type="number"
                      id="impact-efficiency"
                      name="efficiency"
                      min="5"
                      max="60"
                      step="any"
                      value="25"
                      inputmode="decimal"
                      data-impact-input
                    /><span>km/L</span>
                  </div>
                  <span>5–60 km/L</span>
                </div>
              </div>
            </details>
            <p class="impact-error" data-impact-error role="status" hidden>
              Check your inputs. Use 1–500 vehicles, 1–365 days and 5–60 km/L.
            </p>
          </fieldset>
          <noscript
            ><p class="impact-help">
              This shows the default example. Enable JavaScript to adjust the
              estimate.
            </p></noscript
          >
          <div class="impact-scenario">
            <span class="impact-scenario-icon" aria-hidden="true"
              >${icon("bolt")}</span
            >
            <p data-impact-scenario>
              25 vehicles · 80 km/day · 300 days/year<br />Petrol comparison ·
              25 km/L
            </p>
          </div>
          <a
            class="button impact-enquire"
            href="${fleetEnquiryLink(impactDefaults)}"
            data-impact-enquire
            >Discuss this fleet ${icon("external")}</a
          >
        </div>
        <div
          class="impact-results"
          aria-label="Estimated annual fleet comparison"
        >
          <article class="impact-result impact-result-co2">
            <div class="impact-fleet-gauge" aria-hidden="true">
              <svg viewBox="0 0 112 112">
                <circle class="impact-gauge-base" cx="56" cy="56" r="46" />
                <circle
                  class="impact-gauge-fill"
                  cx="56"
                  cy="56"
                  r="46"
                  pathLength="100"
                  stroke-dasharray="5 100"
                  data-impact-gauge
                /></svg
              ><span
                ><strong data-impact-gauge-count>25</strong
                ><small>of 500<br />vehicles</small></span
              >
            </div>
            <div>
              <span class="impact-result-kicker">Estimated each year</span>
              <p class="impact-stat-value">
                <strong data-impact-value="tonnes"
                  >${impactNumber(estimate.tonnes, 1)}</strong
                ><span>t CO₂</span>
              </p>
              <h3>Tailpipe CO₂ avoided</h3>
              <p class="impact-result-note">
                From replacing the same petrol or diesel travel with electric
                vehicles.
              </p>
            </div>
          </article>
          <div class="impact-secondary-results">
            <article class="impact-result">
              <span class="impact-result-icon" aria-hidden="true"
                >${icon("bolt")}</span
              >
              <p class="impact-stat-value">
                <strong data-impact-value="fuel"
                  >${impactNumber(estimate.fuel)}</strong
                >
              </p>
              <h3>Litres of fuel displaced / year</h3>
              <div class="impact-fuel-track" aria-hidden="true">
                <span data-impact-fuel-fill></span>
              </div>
              <p class="impact-result-note">
                Petrol or diesel use replaced by charging.
              </p>
            </article>
            <article class="impact-result">
              <span class="impact-result-icon" aria-hidden="true"
                >${icon("ruler")}</span
              >
              <p class="impact-stat-value">
                <strong data-impact-value="distance"
                  >${impactNumber(estimate.distance)}</strong
                >
              </p>
              <h3>Kilometres electrified / year</h3>
              <div class="impact-distance-motif" aria-hidden="true">
                <img
                  src="/images/neem-g-cutout.webp"
                  width="1100"
                  height="1100"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p class="impact-result-note">
                Plan the right vehicle and charging with KAL.
              </p>
            </article>
          </div>
          <p class="impact-boundary">
            An illustrative <strong>tailpipe-only estimate</strong>. Electricity
            generation, vehicle and battery production are excluded. This is not
            a total carbon-footprint or cost-savings calculation.
          </p>
        </div>
      </div>
      <details class="impact-method">
        <summary>How this estimate works ${icon("chevron")}</summary>
        <div>
          <p>
            Annual distance = vehicles × daily kilometres × operating days. Fuel
            displaced = annual distance ÷ current fuel economy. Tailpipe CO₂
            avoided = fuel displaced × the selected fuel’s CO₂ factor.
          </p>
          <p>
            Average factors: petrol ≈ 2.348 kg CO₂/L; diesel ≈ 2.689 kg CO₂/L,
            converted from US EPA gallon factors. Fuel composition and
            real-world driving vary. Defaults are editable examples, not KAL
            vehicle performance claims.
          </p>
          <a
            href="${impactSources.fuel}"
            target="_blank"
            rel="noopener noreferrer"
            >US EPA: fuel factors and electric-vehicle tailpipe emissions
            ${icon("external")}</a
          >
        </div>
      </details>
      <p
        class="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-impact-status
      ></p>
    </div>
  </section>`;
}
