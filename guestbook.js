const guestDialog = document.querySelector('#guestbook-dialog');
const guestOpen = document.querySelector('#open-guestbook');
const guestClose = document.querySelector('#close-guestbook');
const guestRoot = document.querySelector('#giscus-root');
const guestStatus = document.querySelector('#guestbook-status');
let guestbookLoaded = false;

guestOpen.addEventListener('click', () => {
  guestDialog.showModal();
  if (location.protocol === 'file:') {
    guestStatus.textContent = 'Open the online homepage or the GitHub discussion below to read and leave notes.';
    return;
  }
  if (guestbookLoaded) return;
  guestbookLoaded = true;
  guestStatus.textContent = 'Loading the shared guestbook…';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  const settings = {
    repo: guestRoot.dataset.repo,
    'repo-id': guestRoot.dataset.repoId,
    category: guestRoot.dataset.category,
    'category-id': guestRoot.dataset.categoryId,
    mapping: 'number',
    term: guestRoot.dataset.discussion,
    strict: '1',
    'reactions-enabled': '0',
    'emit-metadata': '0',
    'input-position': 'top',
    theme: 'transparent_dark',
    lang: 'en'
  };
  for (const [key, value] of Object.entries(settings)) script.setAttribute(`data-${key}`, value);
  script.crossOrigin = 'anonymous';
  script.async = true;
  script.onerror = () => {
    script.remove();
    guestbookLoaded = false;
    guestStatus.textContent = 'Could not load the guestbook. Try again or open the GitHub discussion below.';
  };
  guestRoot.append(script);
});
guestClose.addEventListener('click', () => guestDialog.close());
guestDialog.addEventListener('click', event => {
  if (event.target !== guestDialog) return;
  const bounds = guestDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) guestDialog.close();
});
addEventListener('message', event => {
  if (event.origin !== 'https://giscus.app' || event.source !== guestRoot.querySelector('iframe')?.contentWindow || !event.data?.giscus) return;
  guestStatus.textContent = event.data.giscus.error
    ? 'Guestbook temporarily unavailable. You can still leave a note in the GitHub discussion below.'
    : '';
});
