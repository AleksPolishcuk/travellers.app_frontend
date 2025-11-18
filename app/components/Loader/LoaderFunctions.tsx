export function showLoader() {
  const el = document.getElementById('global-loader');
  if (el) el.style.display = 'flex';
}

export function hideLoader() {
  const el = document.getElementById('global-loader');
  if (el) el.style.display = 'none';
}
