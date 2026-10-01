const carousel = document.querySelector(".hero-carousel");

if (carousel) {
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const pauseButton = carousel.querySelector("[data-carousel-pause]");
  const status = carousel.querySelector("[data-carousel-status]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let timer;
  let paused = reducedMotion.matches;
  let inView = true;
  let focused = false;
  let gesture;
  pauseButton.hidden = false;
  // Keep every slide in the same grid cell: changing copy cannot shift the page.
  slides.forEach((slide, index) => {
    slide.hidden = false;
    slide.inert = index !== current;
    slide.setAttribute("aria-hidden", String(index !== current));
    slide.toggleAttribute("data-active", index === current);
    slide.querySelector("img").loading = "eager";
  });

  function schedule() {
    clearTimeout(timer);
    if (paused || !inView || focused || document.hidden) return;
    timer = setTimeout(() => show(current + 1), 6000);
  }

  function setPaused(value) {
    paused = value;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.textContent = paused ? "Resume slideshow" : "Pause slideshow";
    status.setAttribute("aria-live", paused || focused ? "polite" : "off");
    schedule();
  }

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.inert = i !== current;
      slide.setAttribute("aria-hidden", String(i !== current));
      slide.toggleAttribute("data-active", i === current);
    });
    status.textContent = slides[current].getAttribute("aria-label");
    schedule();
  }

  pauseButton.addEventListener("click", () => setPaused(!paused));
  carousel.addEventListener("focusin", () => {
    focused = true;
    setPaused(paused);
  });
  carousel.addEventListener("focusout", (event) => {
    focused = carousel.contains(event.relatedTarget);
    setPaused(paused);
  });
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    show(current + (event.key === "ArrowRight" ? 1 : -1));
  });
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" || event.target.closest("a,button"))
      return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    clearTimeout(timer);
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(current + (dx < 0 ? 1 : -1));
    }
    gesture = undefined;
    schedule();
  });
  carousel.addEventListener("pointercancel", () => {
    gesture = undefined;
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) setPaused(true);
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.2 },
    ).observe(carousel);
  }
  setPaused(paused);
}
