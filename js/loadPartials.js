(function () {
  const scriptEl =
    document.currentScript ||
    (function () {
      const s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  const scriptURL = new URL(scriptEl.src, window.location.origin);
  const SITE_BASE = scriptURL.pathname.replace(/\/js\/[^/]+$/, "/");

  function rebaseUrls(container) {
    container.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || /^[a-z]+:/i.test(href)) return;
      if (href.startsWith("/")) {
        a.setAttribute("href", SITE_BASE + href.replace(/^\//, ""));
      } else {
        a.setAttribute("href", SITE_BASE + href);
      }
    });

    container.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src || /^[a-z]+:/i.test(src)) return;
      if (src.startsWith("/")) {
        img.setAttribute("src", SITE_BASE + src.replace(/^\//, ""));
      } else {
        img.setAttribute("src", SITE_BASE + src);
      }
    });
  }

  function initHeaderScroll() {
    const header = document.getElementById("main-header");
    const navbarCollapse = document.getElementById("navbarNav");
    if (!header || !navbarCollapse) return;

    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false,
    });

    // Handle header transparency
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.remove("transparent");
        header.classList.add("solid");
      } else {
        header.classList.remove("solid");
        header.classList.add("transparent");
      }

      // Auto-close menu when scrolling
      if (navbarCollapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    };

    document.addEventListener("scroll", handleScroll);
    window.addEventListener("load", () => {
      header.classList.add("transparent");
      handleScroll();
    });

    // Smooth scroll for nav links (stop exactly at section top)
    document
      .querySelectorAll(".navbar-collapse a[href^='#']")
      .forEach((link) => {
        link.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href").substring(1);
          const targetEl = document.getElementById(targetId);
          if (!targetEl) return;

          e.preventDefault();

          window.scrollTo({
            top: targetEl.offsetTop, // no offset, stop at title
            behavior: "smooth",
          });

          // Close mobile menu after clicking
          if (navbarCollapse.classList.contains("show")) {
            bsCollapse.hide();
          }
        });
      });
  }

  function loadInto(id, file) {
    const target = document.getElementById(id);
    if (!target) return Promise.resolve();

    return fetch(SITE_BASE + "partials/" + file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`);
        return res.text();
      })
      .then((html) => {
        target.innerHTML = html;
        rebaseUrls(target);
        if (id === "header") initHeaderScroll();
      })
      .catch((err) => console.error(err));
  }

  document.addEventListener("DOMContentLoaded", () => {
    Promise.all([
      loadInto("header", "header.html"),
      loadInto("footer", "footer.html"),
    ]);
  });
})();
