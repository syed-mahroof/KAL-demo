import {
  calculateFleetImpact,
  impactNumber,
  impactLimits,
  fleetEnquiryLink,
} from "./impact-model.mjs";

const calculator = document.querySelector("[data-impact]");
if (calculator) {
  const controls = calculator.querySelector("[data-impact-controls]");
  const fleet = calculator.querySelector('[name="fleet"]');
  const daily = calculator.querySelector('[name="daily"]');
  const slider = calculator.querySelector("[data-impact-range]");
  const status = calculator.querySelector("[data-impact-status]");
  let announcement;
  function update() {
    const settings = Object.fromEntries(
      [...controls.querySelectorAll("[data-impact-input]")].map((input) => [
        input.name,
        input.name === "fuel"
          ? input.value
          : input.value.trim()
            ? Number(input.value)
            : NaN,
      ]),
    );
    const estimate = calculateFleetImpact(settings);
    for (const input of controls.querySelectorAll("[data-impact-input]")) {
      if (input.name === "fuel") continue;
      const [min, max] = impactLimits[input.name];
      input.setAttribute(
        "aria-invalid",
        String(
          !Number.isFinite(settings[input.name]) ||
            settings[input.name] < min ||
            settings[input.name] > max ||
            !input.validity.valid,
        ),
      );
    }
    calculator.querySelector("[data-impact-error]").hidden = !!estimate;
    if (
      Number.isFinite(settings.fleet) &&
      settings.fleet >= 1 &&
      settings.fleet <= 500
    )
      slider.value = settings.fleet;
    slider.setAttribute(
      "aria-valuetext",
      `${slider.value} ${Number(slider.value) === 1 ? "vehicle" : "vehicles"}`,
    );
    slider.style.setProperty(
      "--range-progress",
      `${((Number(slider.value) - 1) / 499) * 100}%`,
    );
    daily.style.setProperty(
      "--range-progress",
      `${((Number(daily.value) - 10) / 290) * 100}%`,
    );
    daily.setAttribute(
      "aria-valuetext",
      `${daily.value} kilometres per vehicle per day`,
    );
    calculator.querySelector("[data-impact-daily]").textContent =
      `${daily.value} km`;
    calculator
      .querySelectorAll("[data-daily-preset]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(Number(button.dataset.dailyPreset) === settings.daily),
        ),
      );
    calculator
      .querySelectorAll("[data-impact-value]")
      .forEach(
        (output) =>
          (output.textContent = estimate
            ? impactNumber(
                estimate[output.dataset.impactValue],
                output.dataset.impactValue === "tonnes" ? 1 : 0,
              )
            : "—"),
      );
    calculator.querySelector("[data-impact-gauge-count]").textContent = estimate
      ? settings.fleet
      : "—";
    calculator
      .querySelector("[data-impact-gauge]")
      .setAttribute(
        "stroke-dasharray",
        `${estimate ? settings.fleet / 5 : 0} 100`,
      );
    calculator
      .querySelector("[data-impact-fuel-fill]")
      .style.setProperty(
        "--fuel-fill",
        `${estimate ? settings.fleet / 5 : 0}%`,
      );
    calculator.querySelector("[data-impact-scenario]").textContent = estimate
      ? `${settings.fleet} vehicles · ${settings.daily} km/day · ${settings.days} days/year\n${settings.fuel === "petrol" ? "Petrol" : "Diesel"} comparison · ${settings.efficiency} km/L`
      : "Adjust your inputs to calculate this fleet.";
    calculator.querySelector("[data-impact-enquire]").href =
      fleetEnquiryLink(settings);
    calculator.querySelector('[data-fleet-step="-1"]').disabled =
      estimate && settings.fleet === 1;
    calculator.querySelector('[data-fleet-step="1"]').disabled =
      estimate && settings.fleet === 500;
    clearTimeout(announcement);
    announcement = setTimeout(() => {
      status.textContent = estimate
        ? `${settings.fleet} vehicles: estimated ${impactNumber(estimate.tonnes, 1)} tonnes of tailpipe CO2 avoided and ${impactNumber(estimate.fuel)} litres of fuel displaced per year.`
        : "Check the displayed input ranges to calculate your fleet.";
    }, 350);
  }
  slider.addEventListener("input", () => {
    fleet.value = slider.value;
    update();
  });
  controls.addEventListener("input", (event) => {
    if (event.target.matches("[data-impact-input]")) update();
  });
  calculator.querySelectorAll("[data-fleet-step]").forEach((button) =>
    button.addEventListener("click", () => {
      const current = Number(fleet.value);
      fleet.value = Math.min(
        500,
        Math.max(
          1,
          (Number.isFinite(current)
            ? Math.round(current)
            : Number(slider.value)) + Number(button.dataset.fleetStep),
        ),
      );
      update();
    }),
  );
  calculator.querySelectorAll("[data-daily-preset]").forEach((button) =>
    button.addEventListener("click", () => {
      daily.value = button.dataset.dailyPreset;
      update();
    }),
  );
  controls.disabled = false;
  update();
}
