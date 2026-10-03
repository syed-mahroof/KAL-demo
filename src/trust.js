import { motionTiming } from "./motion.js";

const strip = document.querySelector(".trust-strip");
if (strip) {
  const slots = [...strip.querySelectorAll("[data-trust-slot]")];
  const facts = [...strip.querySelectorAll("[data-trust-item]")];
  const button = strip.querySelector("[data-trust-pause]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const visible = [0, 1, 2];
  let nextFact = 3,
    nextSlot = 0,
    timer,
    transitionTimer,
    inView = false,
    hovered = false;
  let paused = reducedMotion.matches,
    pauseIntent;
  button.hidden = false;
  function cancelTransition() {
    clearTimeout(transitionTimer);
    slots.forEach((slot) => slot.classList.remove("is-changing"));
  }
  function schedule() {
    clearTimeout(timer);
    if (
      paused ||
      reducedMotion.matches ||
      !inView ||
      hovered ||
      document.hidden
    )
      return;
    timer = setTimeout(rotate, 6000);
  }
  function rotate() {
    if (Date.now() - motionTiming.hero < 1300) {
      timer = setTimeout(rotate, 1500);
      return;
    }
    while (visible.includes(nextFact)) nextFact = (nextFact + 1) % facts.length;
    const slotIndex = nextSlot,
      factIndex = nextFact;
    const slot = slots[slotIndex];
    motionTiming.trust = Date.now();
    slot.classList.add("is-changing");
    transitionTimer = setTimeout(() => {
      slot
        .querySelector(".trust-content")
        .replaceChildren(facts[factIndex].content.cloneNode(true));
      visible[slotIndex] = factIndex;
      slot.classList.remove("is-changing");
      nextFact = (factIndex + 1) % facts.length;
      nextSlot = (slotIndex + 1) % slots.length;
      schedule();
    }, 180);
  }
  function setPaused(value) {
    paused = value;
    cancelTransition();
    button.disabled = reducedMotion.matches;
    button.setAttribute(
      "aria-pressed",
      String(paused || reducedMotion.matches),
    );
    button.querySelector("span").textContent = reducedMotion.matches
      ? "Motion reduced"
      : paused
        ? "Resume highlights"
        : "Pause highlights";
    button
      .querySelector("svg path")
      .setAttribute("d", paused ? "m9 5 10 7-10 7Z" : "M8 5v14M16 5v14");
    schedule();
  }
  button.addEventListener("pointerdown", () => {
    pauseIntent = !paused;
  });
  button.addEventListener("pointercancel", () => {
    pauseIntent = undefined;
  });
  button.addEventListener("click", () => {
    setPaused(pauseIntent ?? !paused);
    pauseIntent = undefined;
  });
  strip.addEventListener("focusin", () => setPaused(true));
  strip.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovered = true;
      cancelTransition();
      schedule();
    }
  });
  strip.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      hovered = false;
      schedule();
    }
  });
  document.addEventListener("visibilitychange", () => {
    cancelTransition();
    schedule();
  });
  reducedMotion.addEventListener("change", () => setPaused(true));
  if ("IntersectionObserver" in window)
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) cancelTransition();
        schedule();
      },
      { threshold: 0.5 },
    ).observe(strip);
  else inView = true;
  setPaused(paused);
}
