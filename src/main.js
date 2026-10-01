import { searchItems } from "./data.mjs";
import "./carousel.js";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute(
    "aria-label",
    expanded ? "Close navigation" : "Open navigation",
  );
  header.classList.toggle("menu-open", expanded);
});
document.addEventListener("click", (event) => {
  document.querySelectorAll(".nav-dropdown[open]").forEach((dropdown) => {
    if (!dropdown.contains(event.target)) dropdown.open = false;
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document
    .querySelectorAll(".nav-dropdown[open]")
    .forEach((dropdown) => (dropdown.open = false));
  if (header.classList.contains("menu-open")) {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.focus();
  }
});
const textControl = document.querySelector("[data-text-size]");
textControl?.addEventListener("click", () => {
  const enlarged = document.documentElement.classList.toggle("large-text");
  textControl.setAttribute("aria-pressed", String(enlarged));
  textControl.setAttribute(
    "aria-label",
    enlarged ? "Restore default text size" : "Increase text size",
  );
});
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
  });
});
const initialCategory = new URLSearchParams(location.search).get("category");
if (["passenger", "goods", "utility"].includes(initialCategory)) {
  document.querySelector(`[data-filter="${initialCategory}"]`)?.click();
}

const searchDialog = document.querySelector(".search-dialog");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector(".search-results");
const searchStatus = document.querySelector(".search-status");
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
  searchDialog.showModal();
  renderSearch();
  searchInput.focus();
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
document.querySelectorAll("[data-gallery-image]").forEach((button) => {
  button.addEventListener("click", () => {
    const img = galleryDialog.querySelector("img");
    img.src = button.querySelector("img").src;
    img.alt = button.querySelector("img").alt;
    galleryDialog.querySelector("p").textContent =
      button.querySelector("span").textContent;
    galleryDialog.showModal();
  });
});
document
  .querySelector(".gallery-close")
  ?.addEventListener("click", () => galleryDialog.close());

const form = document.querySelector("#enquiry-form");
if (form) {
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
    const text = `Vehicle enquiry: ${fields.get("vehicle")}\n\nName: ${fields.get("name")}\nEmail: ${fields.get("email")}\nPhone: ${fields.get("phone")}\n\n${fields.get("message")}\n\nPrepared using the KAL website design demonstration.`;
    const preview = document.querySelector(".enquiry-preview");
    preview.hidden = false;
    preview.querySelector("pre").textContent = text;
    const email = preview.querySelector("[data-email-draft]");
    email.href = `mailto:marketingexe.kal@kerala.gov.in?subject=${encodeURIComponent(`Vehicle enquiry: ${fields.get("vehicle")}`)}&body=${encodeURIComponent(text)}`;
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
