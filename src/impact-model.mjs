// Tailpipe CO₂ only. EPA fuel-carbon factors, converted from US gallons to litres.
export const impactSources = {
  fuel: "https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle",
};
const litresPerUSGallon = 3.785411784;
export const fuelFactors = {
  petrol: 8.887 / litresPerUSGallon,
  diesel: 10.18 / litresPerUSGallon,
};
export const impactDefaults = {
  fleet: 25,
  daily: 80,
  days: 300,
  efficiency: 25,
  fuel: "petrol",
};
export const impactLimits = {
  fleet: [1, 500],
  daily: [10, 300],
  days: [1, 365],
  efficiency: [5, 60],
};
export const impactNumber = (value, decimals = 0) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: decimals }).format(
    value,
  );

export function calculateFleetImpact(settings) {
  if (!Object.hasOwn(fuelFactors, settings.fuel)) return null;
  for (const [key, [min, max]] of Object.entries(impactLimits)) {
    if (
      !Number.isFinite(settings[key]) ||
      settings[key] < min ||
      settings[key] > max
    )
      return null;
    if (key !== "efficiency" && !Number.isInteger(settings[key])) return null;
  }
  const distance = settings.fleet * settings.daily * settings.days;
  const fuel = distance / settings.efficiency;
  const co2 = fuel * fuelFactors[settings.fuel];
  return { distance, fuel, co2, tonnes: co2 / 1000 };
}

export function fleetEnquiryLink(settings) {
  if (!calculateFleetImpact(settings)) return "/contact/?purpose=fleet#enquiry";
  const params = new URLSearchParams({
    purpose: "fleet",
    fleet: settings.fleet,
    daily: settings.daily,
    days: settings.days,
    efficiency: settings.efficiency,
    fuel: settings.fuel,
  });
  return `/contact/?${params}#enquiry`;
}

export function fleetSettingsFromQuery(query) {
  const settings = { fuel: query.get("fuel") };
  for (const key of Object.keys(impactLimits)) {
    if (!query.has(key) || !query.get(key)?.trim()) return null;
    settings[key] = Number(query.get(key));
  }
  return calculateFleetImpact(settings) ? settings : null;
}

export function fleetEnquiryMessage(settings) {
  return `I would like to discuss ${settings.fleet} electric vehicles for a fleet travelling approximately ${settings.daily} km per vehicle per day, over ${settings.days} operating days per year.\n\nMy current ${settings.fuel} comparison assumes ${settings.efficiency} km per litre. Please advise on suitable KAL models, charging, current pricing and service support.`;
}
