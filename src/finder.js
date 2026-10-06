import { finderChoices, finderModel, finderResult } from "./finder.mjs";

document.querySelectorAll("[data-finder]").forEach((finder) => {
  const controls = finder.querySelector("[data-finder-controls]");
  const needs = finder.querySelector("[data-finder-need]");
  const initial = new URLSearchParams(location.search).get("category");
  let work = Object.hasOwn(finderChoices, initial) ? initial : "passenger";
  function showResult(announce = true) {
    finder.querySelector("[data-finder-result]").innerHTML = finderResult(
      work,
      needs.value,
    );
    if (announce)
      finder.querySelector("[data-finder-status]").textContent =
        `Start with ${finderModel(work, needs.value).name}. Explore the model or compare its published specifications.`;
  }
  function selectWork(next, announce = true) {
    work = next;
    finder
      .querySelectorAll("[data-finder-work]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.finderWork === work),
        ),
      );
    needs.replaceChildren(
      ...finderChoices[work].needs.map(([key, text]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = text;
        return option;
      }),
    );
    showResult(announce);
  }
  finder
    .querySelectorAll("[data-finder-work]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        selectWork(button.dataset.finderWork),
      ),
    );
  needs.addEventListener("change", () => showResult());
  controls.disabled = false;
  selectWork(work, false);
});
