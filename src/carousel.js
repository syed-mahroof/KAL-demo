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
  let hovered = false;
  let gesture;
  pauseButton.hidden = false;

  function schedule() {
    clearTimeout(timer);
    if (paused || !inView || hovered || document.hidden) return;
    timer = setTimeout(() => show(current + 1), 8000);
  }

  function setPaused(value) {
    paused = value;
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.textContent = paused ? "Resume slideshow" : "Pause slideshow";
    status.setAttribute("aria-live", paused ? "polite" : "off");
    schedule();
  }

  function show(index, manual = false) {
    if (manual) setPaused(true);
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
      if (i === current) slide.querySelector("img").loading = "eager";
    });
    status.textContent = slides[current].getAttribute("aria-label");
    schedule();
  }

  pauseButton.addEventListener("click", () => setPaused(!paused));
  carousel.addEventListener("mouseenter", () => {
    hovered = true;
    clearTimeout(timer);
  });
  carousel.addEventListener("mouseleave", () => {
    hovered = false;
    schedule();
  });
  carousel.addEventListener("focusin", (event) => {
    // Focused slide links stay stable; rotation resumes only by choice.
    if (event.target !== pauseButton) setPaused(true);
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
    setPaused(true);
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(current + (dx < 0 ? 1 : -1), true);
    }
    gesture = undefined;
  });
  carousel.addEventListener("pointercancel", () => {
    gesture = undefined;
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
