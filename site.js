const filters = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.paper-card')];
const status = document.querySelector('#filter-status');
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  papers.forEach(paper => { paper.hidden = selected !== 'all' && paper.dataset.group !== selected; });
  const count = papers.filter(paper => !paper.hidden).length;
  status.textContent = `Showing ${count} ${selected === 'all' ? 'research works' : selected === 'published' ? 'published papers' : 'preprints and manuscripts'}.`;
}));

const navigation = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const progress = document.querySelector('.reading-progress');
let scheduled = false;
function updateReadingPosition() {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
  const active = [...sections].reverse().find(section => section.getBoundingClientRect().top <= innerHeight * .35) || sections[0];
  navigation.forEach(item => {
    if (item.hash === `#${active.id}`) item.setAttribute('aria-current', 'location');
    else item.removeAttribute('aria-current');
  });
  scheduled = false;
}
addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateReadingPosition);
  }
}, { passive: true });
addEventListener('resize', updateReadingPosition);
updateReadingPosition();

if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  const spotlight = document.querySelector('.spotlight');
  let pointerScheduled = false;
  let x = 0;
  let y = 0;
  addEventListener('pointermove', event => {
    x = event.clientX;
    y = event.clientY;
    if (!pointerScheduled) {
      pointerScheduled = true;
      requestAnimationFrame(() => {
        spotlight.style.setProperty('--x', `${x}px`);
        spotlight.style.setProperty('--y', `${y}px`);
        pointerScheduled = false;
      });
    }
  }, { passive: true });
}
