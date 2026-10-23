const status = document.querySelector("header strong");
document.querySelectorAll("[data-variant]").forEach(button => button.addEventListener("click", () => {
  const result = window.KineticSoulsOfficialPage?.start({ variant: button.dataset.variant });
  if (!result?.ok) status.textContent = result?.reason || "Kinetic page adapter did not load.";
}));
document.querySelector("#restore").addEventListener("click", () => window.KineticSoulsOfficialPage?.stop());
function addPanel() {
  const panel = document.createElement("div");
  panel.className = "loose";
  panel.textContent = `NEW PAGE PIECE ${document.querySelectorAll("#added .loose").length + 1}`;
  document.querySelector("#added").append(panel);
}
document.querySelector("#add-panel").addEventListener("click", addPanel);
document.addEventListener("keydown", event => {
  if (event.key.toLowerCase() === "n" && !(event.target instanceof HTMLInputElement)) addPanel();
});
