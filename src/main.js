import { searchItems, products } from "./data.mjs";
import { vehicleVisual } from "./vehicle-visual.mjs";
import "./carousel.js";
import "./trust.js";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
function setMenu(expanded, restoreFocus = false) {
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute(
    "aria-label",
    expanded ? "Close navigation" : "Open navigation",
  );
  header.classList.toggle("menu-open", expanded);
  if (expanded) header.querySelector("#primary-nav > a")?.focus();
  else {
    header
      .querySelectorAll(".nav-dropdown[open]")
      .forEach((dropdown) => (dropdown.open = false));
    if (restoreFocus) menuToggle.focus();
  }
}
menuToggle?.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
header.addEventListener("focusout", (event) => {
  if (
    header.classList.contains("menu-open") &&
    !header.contains(event.relatedTarget)
  )
    setMenu(false);
});
const headerParts = [
  document.querySelector(".utility-bar"),
  header.querySelector(".masthead"),
];
function measureHeader() {
  const mastheadHeight = headerParts[1].getBoundingClientRect().height;
  document.documentElement.style.setProperty(
    "--utility-height",
    `${headerParts[0].getBoundingClientRect().height}px`,
  );
  document.documentElement.style.setProperty(
    "--masthead-height",
    `${mastheadHeight}px`,
  );
  const height =
    headerParts[0].getBoundingClientRect().height +
    header.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--header-height", `${height}px`);
}
new ResizeObserver(measureHeader).observe(header);
new ResizeObserver(measureHeader).observe(headerParts[0]);
window.addEventListener("resize", () => {
  measureHeader();
  if (getComputedStyle(menuToggle).display === "none") setMenu(false);
});
measureHeader();
new IntersectionObserver(([entry]) => {
  header.classList.toggle("is-scrolled", !entry.isIntersecting);
}).observe(headerParts[0]);
document.addEventListener("click", (event) => {
  if (header.classList.contains("menu-open") && !header.contains(event.target))
    setMenu(false);
  document.querySelectorAll(".nav-dropdown[open]").forEach((dropdown) => {
    if (!dropdown.contains(event.target)) dropdown.open = false;
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".nav-dropdown[open]").forEach((dropdown) => {
    dropdown.open = false;
    if (dropdown.contains(document.activeElement))
      dropdown.querySelector("summary").focus();
  });
  if (header.classList.contains("menu-open")) {
    setMenu(false, true);
  }
});
const textControls = document.querySelectorAll("[data-text-size]");
textControls.forEach((control) =>
  control.addEventListener("click", () => {
    const enlarged = document.documentElement.classList.toggle("large-text");
    textControls.forEach((textControl) => {
      textControl.setAttribute("aria-pressed", String(enlarged));
      textControl.setAttribute(
        "aria-label",
        enlarged ? "Restore default text size" : "Increase text size",
      );
    });
  }),
);
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest(".products-section");
    const filter = button.dataset.filter;
    section
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    let count = 0;
    section.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    section.querySelector(".filter-status").textContent =
      `${count} ${count === 1 ? "vehicle" : "vehicles"} shown.`;
    section
      .querySelector(".product-grid")
      .scrollTo({ left: 0, behavior: "instant" });
    const strip = button.closest(".filters");
    const bounds = button.getBoundingClientRect(),
      stripBounds = strip.getBoundingClientRect();
    if (bounds.left < stripBounds.left || bounds.right > stripBounds.right) {
      strip.scrollTo({
        left:
          button.offsetLeft -
          strip.offsetLeft -
          (strip.clientWidth - button.offsetWidth) / 2,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  });
});
document.querySelectorAll(".filters").forEach((strip) => {
  const updateCue = () => {
    strip.parentElement.classList.toggle("more-start", strip.scrollLeft > 2);
    strip.parentElement.classList.toggle(
      "more-end",
      strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 2,
    );
  };
  strip.addEventListener("scroll", updateCue, { passive: true });
  new ResizeObserver(updateCue).observe(strip);
  updateCue();
});
const initialCategory = new URLSearchParams(location.search).get("category");
if (["passenger", "goods", "utility"].includes(initialCategory)) {
  document.querySelector(`[data-filter="${initialCategory}"]`)?.click();
}

const searchDialog = document.querySelector(".search-dialog");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector(".search-results");
const searchStatus = document.querySelector(".search-status");
let searchOpener;
function renderSearch() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const results = searchItems.filter((item) =>
    `${item.title} ${item.detail}`.toLocaleLowerCase().includes(query),
  );
  searchResults.replaceChildren();
  results.forEach((item) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const title = document.createElement("strong");
    const detail = document.createElement("span");
    a.href = item.url;
    title.textContent = item.title;
    detail.textContent = item.detail;
    a.append(title, detail);
    li.append(a);
    searchResults.append(li);
  });
  searchStatus.textContent = results.length
    ? `${results.length} ${results.length === 1 ? "result" : "results"}${query ? ` for “${searchInput.value.trim()}”` : " · Browse popular pages or start typing"}`
    : "No results. Try “electric”, “contact” or “tenders”.";
}
document.querySelector(".search-open")?.addEventListener("click", () => {
  searchOpener = document.querySelector(".search-open");
  searchDialog.showModal();
  renderSearch();
  searchInput.focus();
});
searchDialog?.addEventListener("close", () => searchOpener?.focus());
searchDialog?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    searchDialog.close();
  }
});
searchInput?.addEventListener("input", renderSearch);
document
  .querySelector(".dialog-close")
  ?.addEventListener("click", () => searchDialog.close());
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
}

const galleryDialog = document.querySelector(".gallery-dialog");
const galleryPhotos = [...document.querySelectorAll("[data-gallery-image]")];
let galleryIndex = 0,
  galleryOpener;
function showGallery(index) {
  if (!galleryPhotos.length) return;
  galleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[galleryIndex];
  const img = galleryDialog.querySelector("img");
  img.src = photo.querySelector("img").src;
  img.alt = photo.querySelector("img").alt;
  galleryDialog.querySelector("p").textContent =
    photo.querySelector("span").textContent;
  galleryDialog.querySelector(".gallery-count").textContent =
    `Photo ${galleryIndex + 1} of ${galleryPhotos.length}`;
}
galleryPhotos.forEach((button, index) => {
  button.addEventListener("click", () => {
    galleryOpener = button;
    showGallery(index);
    galleryDialog.showModal();
  });
});
galleryDialog
  .querySelector("[data-gallery-prev]")
  .addEventListener("click", () => showGallery(galleryIndex - 1));
galleryDialog
  .querySelector("[data-gallery-next]")
  .addEventListener("click", () => showGallery(galleryIndex + 1));
galleryDialog.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  showGallery(galleryIndex + (event.key === "ArrowRight" ? 1 : -1));
});
galleryDialog.addEventListener("close", () => galleryOpener?.focus());
document
  .querySelector(".gallery-close")
  ?.addEventListener("click", () => galleryDialog.close());

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("enter-pending");
      revealObserver.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -30px 0px", threshold: 0.08 },
);
if (!motionPreference.matches) {
  document
    .querySelectorAll(
      ".about-grid, .stewardship-grid, .engineering-grid, .updates-grid, .gallery-preview, .facility-grid",
    )
    .forEach((element) => {
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add("enter-pending");
      revealObserver.observe(element);
      element.addEventListener(
        "focusin",
        () => element.classList.remove("enter-pending"),
        { once: true },
      );
    });
}
motionPreference.addEventListener("change", () => {
  if (!motionPreference.matches) return;
  document
    .querySelectorAll(".enter-pending")
    .forEach((el) => el.classList.remove("enter-pending"));
  revealObserver.disconnect();
});

const form = document.querySelector("#enquiry-form");
if (form) {
  const purpose = new URLSearchParams(location.search).get("purpose");
  if (["fleet", "dealer"].includes(purpose)) {
    form.elements.purpose.value = purpose;
    form.elements.vehicle.value = "Help choosing a vehicle";
  }
  const selected = new URLSearchParams(location.search).get("vehicle");
  if (
    selected &&
    [...form.elements.vehicle.options].some(
      (option) => option.value === selected,
    )
  )
    form.elements.vehicle.value = selected;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const purposeLabel = form.elements.purpose.selectedOptions[0].textContent;
    const text = `${purposeLabel}: ${fields.get("vehicle")}\n\nName: ${fields.get("name")}\nEmail: ${fields.get("email")}\nPhone: ${fields.get("phone")}\n\n${fields.get("message")}\n\nPrepared for Kerala Automobiles Limited.`;
    const preview = document.querySelector(".enquiry-preview");
    preview.hidden = false;
    preview.querySelector("pre").textContent = text;
    const email = preview.querySelector("[data-email-draft]");
    email.href = `mailto:marketingexe.kal@kerala.gov.in?subject=${encodeURIComponent(`${purposeLabel}: ${fields.get("vehicle")}`)}&body=${encodeURIComponent(text)}`;
    preview.querySelector("[data-download-enquiry]").onclick = () => {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "KAL-vehicle-enquiry.txt";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    document.querySelector(".form-status").textContent =
      "Enquiry prepared. Review your draft below. Nothing has been sent.";
    preview.focus();
  });
  form.addEventListener("input", () => {
    document.querySelector(".enquiry-preview").hidden = true;
    document.querySelector(".form-status").textContent = "";
  });
}

document.querySelectorAll("[data-compare]").forEach((select) => {
  select.addEventListener("change", () => {
    const product = products.find((item) => item.slug === select.value);
    const slot = select.dataset.compare;
    if (!product) return;
    const head = document.querySelector(`[data-comparison-head="${slot}"]`);
    head.querySelector(".comparison-photo").innerHTML = vehicleVisual(product, { context: "compare" });
    head.querySelector("h3").textContent = product.name;
    head.querySelector("a").href = `/products/${product.slug}/`;
    document
      .querySelectorAll(`[data-compare-cell="${slot}"]`)
      .forEach((cell) => {
        cell.textContent = product[cell.dataset.spec] || "Confirm with KAL";
      });
    const names = [...document.querySelectorAll("[data-compare]")].map(
      (item) => products.find((p) => p.slug === item.value)?.name,
    );
    document.querySelector(".comparison-note").textContent =
      names[0] === names[1]
        ? "Both selections show the same vehicle. Choose another model to compare."
        : `Comparing ${names[0]} and ${names[1]}.`;
  });
});

// A card's comparison link carries that vehicle into the first comparison slot.
const initialComparison = new URLSearchParams(location.search).get("compare");
const firstComparison = document.querySelector('[data-compare="0"]');
if (firstComparison && products.some((p) => p.slug === initialComparison)) {
  firstComparison.value = initialComparison;
  const second = document.querySelector('[data-compare="1"]');
  if (second.value === initialComparison) {
    second.value = products.find((p) => p.slug !== initialComparison).slug;
    second.dispatchEvent(new Event("change"));
  }
  firstComparison.dispatchEvent(new Event("change"));
}

// Small photographic depth on precise pointers; touch and reduced motion stay still.
const cardPointer = matchMedia("(hover: hover) and (pointer: fine)");
document.querySelectorAll(".product-card").forEach((card) => {
  let frame;
  const reset = () => {
    cancelAnimationFrame(frame);
    card.style.removeProperty("--card-x");
    card.style.removeProperty("--card-y");
  };
  card.addEventListener(
    "pointermove",
    (event) => {
      if (!cardPointer.matches || motionPreference.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty("--card-x", `${(x * 5).toFixed(2)}deg`);
        card.style.setProperty("--card-y", `${(-y * 4).toFixed(2)}deg`);
      });
    },
    { passive: true },
  );
  card.addEventListener("pointerleave", reset);
  cardPointer.addEventListener("change", reset);
  motionPreference.addEventListener("change", reset);
});
