const status = document.querySelector('header strong');
document.querySelectorAll('[data-variant]').forEach(button => button.addEventListener('click', () => {
  const result = window.KineticSoulsOfficialPage?.start({ variant: button.dataset.variant });
  if (!result?.ok) status.textContent = result?.reason || 'Kinetic page adapter did not load.';
}));
document.querySelector('#restore').addEventListener('click', () => window.KineticSoulsOfficialPage?.stop());
