import { motionTiming } from "./motion.js";

const carousel = document.querySelector(".hero-carousel");
if (carousel) {
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const pauseButton = carousel.querySelector("[data-carousel-pause]");
  const status = carousel.querySelector("[data-carousel-status]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0,
    timer,
    request = 0,
    transitions = [],
    gesture,
    pauseIntent;
  let paused = reducedMotion.matches,
    inView = true,
    hovered = false;
  carousel.querySelector(".hero-controls").hidden = false;
  slides.forEach((slide, i) => {
    slide.hidden = false;
    slide.inert = i !== 0;
    slide.setAttribute("aria-hidden", String(i !== 0));
    slide.toggleAttribute("data-active", i === 0);
  });

  function schedule() {
    clearTimeout(timer);
    if (
      paused ||
      reducedMotion.matches ||
      !inView ||
      hovered ||
      document.hidden ||
      gesture
    )
      return;
    timer = setTimeout(function advance() {
      if (Date.now() - motionTiming.trust < 1200) {
        timer = setTimeout(advance, 1400);
      } else show(current + 1);
    }, 7000);
  }
  function setPaused(value) {
    paused = value;
    pauseButton.disabled = reducedMotion.matches;
    pauseButton.setAttribute(
      "aria-pressed",
      String(paused || reducedMotion.matches),
    );
    pauseButton.querySelector("span").textContent = reducedMotion.matches
      ? "Motion reduced"
      : paused
        ? "Resume slideshow"
        : "Pause slideshow";
    pauseButton
      .querySelector("[data-motion-symbol]")
      .setAttribute("d", paused ? "m9 5 10 7-10 7Z" : "M8 5v14M16 5v14");
    schedule();
  }
  async function show(index, manual = false) {
    if (manual && carousel.contains(document.activeElement)) setPaused(true);
    const next = (index + slides.length) % slides.length;
    const token = ++request;
    const slide = slides[next];
    slide.querySelectorAll("[data-srcset]").forEach((source) => {
      source.srcset = source.dataset.srcset;
      source.removeAttribute("data-srcset");
    });
    const img = slide.querySelector("img");
    if (img.dataset.src) {
      img.loading = "eager";
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      await img.decode().catch(() => {});
    }
    if (token !== request) return;
    if (
      !manual &&
      (paused || reducedMotion.matches || !inView || hovered || document.hidden)
    )
      return;
    const previous = slides[current];
    const direction = index > current ? 1 : -1;
    transitions.forEach((animation) => animation.cancel());
    transitions = [];
    slides.forEach((item) => item.removeAttribute("data-leaving"));
    const changed = next !== current;
    current = next;
    motionTiming.hero = Date.now();
    slides.forEach((item, i) => {
      item.inert = i !== current;
      item.setAttribute("aria-hidden", String(i !== current));
      item.toggleAttribute("data-active", i === current);
    });
    if (changed && !reducedMotion.matches) {
      previous.setAttribute("data-leaving", "");
      const options = {
        duration: 850,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      };
      transitions = [
        previous.animate(
          [
            { transform: "translateX(0)" },
            { transform: `translateX(${-direction * 100}%)` },
          ],
          options,
        ),
        slide.animate(
          [
            { transform: `translateX(${direction * 100}%)` },
            { transform: "translateX(0)" },
          ],
          options,
        ),
      ];
      Promise.all(transitions.map((animation) => animation.finished))
        .then(() => {
          if (token === request) previous.removeAttribute("data-leaving");
        })
        .catch(() => {});
    }
    if (manual) status.textContent = slide.getAttribute("aria-label");
    schedule();
  }
  pauseButton.addEventListener("pointerdown", () => {
    pauseIntent = !paused;
  });
  pauseButton.addEventListener("pointercancel", () => {
    pauseIntent = undefined;
  });
  pauseButton.addEventListener("click", () => {
    setPaused(pauseIntent ?? !paused);
    pauseIntent = undefined;
  });
  carousel.addEventListener("focusin", () => setPaused(true));
  carousel.addEventListener("pointerover", (event) => {
    if (event.pointerType === "mouse") {
      hovered = Boolean(event.target.closest("a,button"));
      schedule();
    }
  });
  carousel.addEventListener("pointerout", (event) => {
    if (event.pointerType === "mouse") {
      hovered = Boolean(
        event.relatedTarget?.closest?.(
          ".hero-carousel a,.hero-carousel button",
        ),
      );
      schedule();
    }
  });
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    show(current + (event.key === "ArrowRight" ? 1 : -1), true);
  });
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || event.target.closest("a,button"))
      return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    schedule();
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x,
      dy = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
      show(current + (dx < 0 ? 1 : -1), true);
    else schedule();
  });
  carousel.addEventListener("pointercancel", () => {
    gesture = undefined;
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => {
    transitions.forEach((animation) => animation.cancel());
    transitions = [];
    slides.forEach((slide) => slide.removeAttribute("data-leaving"));
    setPaused(true);
  });
  if ("IntersectionObserver" in window)
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.25 },
    ).observe(carousel);
  setPaused(paused);
}
