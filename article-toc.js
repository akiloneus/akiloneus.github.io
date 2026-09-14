(() => {
  const toggle = document.querySelector(".article-toc-toggle");
  const toc = document.querySelector(".article-toc");

  if (!toggle || !toc) return;

  const panel = toc.querySelector(".article-toc__panel");
  const links = Array.from(toc.querySelectorAll('#TableOfContents a[href^="#"]'));
  const headings = links
    .map((link) => document.getElementById(decodeURIComponent(link.getAttribute("href").slice(1))))
    .filter(Boolean);
  const mobileQuery = window.matchMedia("(max-width: 1119px)");
  const openLabel = toggle.dataset.openLabel;
  const closeLabel = toggle.dataset.closeLabel;

  function setOpen(open, returnFocus = false) {
    toc.classList.toggle("is-open", open);
    document.body.classList.toggle("article-toc-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? closeLabel : openLabel);
    toggle.setAttribute("title", open ? closeLabel : openLabel);

    if (open) {
      window.setTimeout(() => links[0]?.focus(), 170);
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", () => setOpen(!toc.classList.contains("is-open")));

  toc.addEventListener("click", (event) => {
    if (mobileQuery.matches && !panel.contains(event.target)) setOpen(false, true);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) setOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toc.classList.contains("is-open")) {
      event.preventDefault();
      setOpen(false, true);
    }
  });

  const closeForDesktop = () => {
    if (!mobileQuery.matches) setOpen(false);
  };

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", closeForDesktop);
  } else {
    mobileQuery.addListener(closeForDesktop);
  }

  function setActive(id) {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function updateActive() {
    if (!headings.length) return;

    const marker = Math.min(window.innerHeight * 0.3, 260);
    let current = headings[0];

    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= marker) current = heading;
    });

    setActive(current.id);
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActive();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("resize", updateActive);
  updateActive();
})();
