/* ==========================================================================
   GIT Tutorials — site-wide progressive enhancement
   Pure JS, no build step, no dependencies beyond the Mermaid CDN script
   already loaded by head-custom.html. Everything here degrades gracefully:
   if JS fails, the page is still a complete, readable Markdown page.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The real Jekyll baseurl ("" locally, "/git-tutorials" on GitHub Pages),
  // rendered server-side into a data attribute — never guessed from the URL.
  // Guessing "drop the first path segment" breaks the moment the site isn't
  // served under a subpath, which is exactly what a local `jekyll serve`
  // without --baseurl does.
  function getBaseUrl() {
    var raw = (document.body.dataset.baseurl || "").replace(/\/$/, "");
    return raw;
  }
  function stripBaseUrl(pathname) {
    var base = getBaseUrl();
    return base && pathname.indexOf(base) === 0 ? pathname.slice(base.length) : pathname;
  }

  /* ========================================================================
     1. THEME — light / dark / system, persisted, manual toggle
     ======================================================================== */
  var ThemeManager = {
    STORAGE_KEY: "git-tutorials-theme",

    getStored: function () {
      try { return localStorage.getItem(this.STORAGE_KEY); } catch (e) { return null; }
    },
    setStored: function (value) {
      try { localStorage.setItem(this.STORAGE_KEY, value); } catch (e) { /* private mode etc. */ }
    },
    apply: function (theme) {
      // theme is "light", "dark", or null (= follow system)
      if (theme === "light" || theme === "dark") {
        document.documentElement.setAttribute("data-theme", theme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      this.updateButton();
      this.reinitMermaid();
    },
    effectiveTheme: function () {
      var stored = this.getStored();
      if (stored === "light" || stored === "dark") return stored;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light";
    },
    cycle: function () {
      var current = this.getStored();
      // light -> dark -> system(null) -> light ...
      var next = current === "light" ? "dark" : current === "dark" ? null : "light";
      if (next === null) { try { localStorage.removeItem(this.STORAGE_KEY); } catch (e) {} }
      else { this.setStored(next); }
      this.apply(next);
    },
    updateButton: function () {
      var btn = document.getElementById("theme-toggle-btn");
      if (!btn) return;
      var stored = this.getStored();
      var label = stored === "light" ? "Light (click for dark)"
        : stored === "dark" ? "Dark (click for system)"
        : "System theme (click for light)";
      var icon = stored === "light" ? "☀️" : stored === "dark" ? "🌙" : "🖥️";
      btn.textContent = icon;
      btn.setAttribute("aria-label", "Theme: " + label);
      btn.title = "Theme: " + label;
    },
    reinitMermaid: function () {
      if (!window.mermaid) return;
      var isDark = this.effectiveTheme() === "dark";
      try {
        window.mermaid.initialize({ startOnLoad: false, theme: isDark ? "dark" : "default" });
        document.querySelectorAll("pre.mermaid[data-processed]").forEach(function (el) {
          el.removeAttribute("data-processed");
        });
        window.mermaid.run ? window.mermaid.run() : window.mermaid.init(undefined, document.querySelectorAll("pre.mermaid"));
      } catch (e) { /* older mermaid API shape — ignore, initial render already happened */ }
    },
    init: function () {
      this.apply(this.getStored());
      var btn = document.createElement("button");
      btn.id = "theme-toggle-btn";
      btn.type = "button";
      btn.className = "chrome-btn";
      document.body.appendChild(btn);
      btn.addEventListener("click", this.cycle.bind(this));
      this.updateButton();
    }
  };

  /* ========================================================================
     2. GFM ALERT UPGRADE — fix [!NOTE]/[!TIP]/etc. rendering on Pages
        kramdown renders these as a plain <blockquote><p>[!TYPE]\ntext</p></blockquote>.
        GitHub.com renders them with icons natively; this makes the Pages
        site match that instead of showing the literal "[!TYPE]" text.
     ======================================================================== */
  var ALERT_META = {
    note:      { icon: "ℹ️",  label: "Note" },
    tip:       { icon: "💡", label: "Tip" },
    important: { icon: "❗",       label: "Important" },
    warning:   { icon: "⚠️", label: "Warning" },
    caution:    { icon: "🚨", label: "Caution" }
  };

  function upgradeGfmAlerts() {
    document.querySelectorAll("blockquote").forEach(function (bq) {
      var firstP = bq.querySelector("p:first-of-type");
      if (!firstP) return;
      var html = firstP.innerHTML;
      var match = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*<br\s*\/?>\s*/i.exec(html) ||
                  /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i.exec(html);
      if (!match) return;
      var type = match[1].toLowerCase();
      firstP.innerHTML = html.slice(match[0].length);

      var meta = ALERT_META[type];
      var wrapper = document.createElement("div");
      wrapper.className = "callout gfm-alert gfm-alert-" + type;
      var labelEl = document.createElement("p");
      labelEl.className = "callout-label";
      labelEl.innerHTML = '<span aria-hidden="true">' + meta.icon + "</span> " + meta.label;
      wrapper.appendChild(labelEl);
      while (bq.firstChild) wrapper.appendChild(bq.firstChild);
      bq.replaceWith(wrapper);
    });
  }

  /* ========================================================================
     3. COPY BUTTONS on fenced code blocks (skips Mermaid source blocks)
     ======================================================================== */
  function addCopyButtons() {
    document.querySelectorAll("div.highlighter-rouge, figure.highlight, pre").forEach(function (block) {
      // Normalize to the actual <pre> we want a button on.
      var pre = block.tagName === "PRE" ? block : block.querySelector("pre");
      if (!pre || pre.classList.contains("mermaid") || pre.dataset.copyWired) return;
      var codeEl = pre.querySelector("code");
      var text = (codeEl || pre).textContent;
      if (!text || !text.trim()) return;
      pre.dataset.copyWired = "true";

      var wrap = document.createElement("div");
      wrap.className = "code-block-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      wrap.appendChild(btn);

      btn.addEventListener("click", function () {
        var doCopy = function () {
          btn.dataset.copied = "true";
          btn.textContent = "Copied!";
          setTimeout(function () {
            btn.textContent = "Copy";
            delete btn.dataset.copied;
          }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(doCopy, doCopy);
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
          doCopy();
        }
      });
    });
  }

  /* ========================================================================
     4. BACK TO TOP
     ======================================================================== */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.id = "back-to-top-btn";
    btn.type = "button";
    btn.className = "chrome-btn";
    btn.innerHTML = '<span aria-hidden="true">↑</span>';
    btn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(btn);

    window.addEventListener("scroll", function () {
      btn.classList.toggle("visible", window.scrollY > 480);
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      document.body.setAttribute("tabindex", "-1");
      document.body.focus();
      document.body.removeAttribute("tabindex");
    });
  }

  /* ========================================================================
     5. BREADCRUMBS — built from the URL path, e.g.
        Git Tutorials -> Module 01 - Git Fundamentals
     ======================================================================== */
  function titleFromSlug(slug) {
    var withoutExt = slug.replace(/\.(html?|md)$/i, "");
    var withoutNum = withoutExt.replace(/^\d+-/, "");
    var words = withoutNum.split("-").map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    });
    var numMatch = /^(\d+)-/.exec(withoutExt);
    return (numMatch ? numMatch[1] + " · " : "") + words.join(" ");
  }

  function initBreadcrumbs() {
    var h1 = document.querySelector(".page-content h1, main h1");
    if (!h1) return;
    var pathname = stripBaseUrl(window.location.pathname);
    var parts = pathname.split("/").filter(Boolean);
    var segments = parts.filter(function (p) { return p !== "index.html"; });
    if (segments.length === 0) return; // already on the home page

    var nav = document.createElement("nav");
    nav.className = "breadcrumb-nav";
    nav.setAttribute("aria-label", "Breadcrumb");

    var home = document.createElement("a");
    home.href = getBaseUrl() + "/";
    home.textContent = "🏠 Git Tutorials";
    nav.appendChild(home);

    segments.forEach(function (seg, i) {
      var sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "›";
      nav.appendChild(sep);

      var isLast = i === segments.length - 1;
      if (isLast) {
        var current = document.createElement("span");
        current.className = "current";
        current.textContent = titleFromSlug(seg);
        nav.appendChild(current);
      } else {
        var link = document.createElement("a");
        link.href = getBaseUrl() + "/" + parts.slice(0, i + 1).join("/") + "/";
        link.textContent = titleFromSlug(seg);
        nav.appendChild(link);
      }
    });

    h1.parentNode.insertBefore(nav, h1);
  }

  /* ========================================================================
     6. AUTO TABLE OF CONTENTS for long pages
     ======================================================================== */
  function initTOC() {
    var mount = document.getElementById("toc-sidebar-mount");
    var content = document.querySelector(".page-content") || document.querySelector("main");
    if (!mount || !content) return;
    var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
    if (headings.length < 4) return; // short pages don't need one — mount stays empty, CSS hides it

    var details = document.createElement("details");
    details.className = "toc-box";
    details.open = true;
    var summary = document.createElement("summary");
    summary.textContent = "On this page";
    details.appendChild(summary);

    var list = document.createElement("ul");
    var linkById = {};
    headings.forEach(function (h, i) {
      if (!h.id) h.id = "toc-heading-" + i;
      var li = document.createElement("li");
      if (h.tagName === "H3") li.style.marginLeft = "1em";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.replace(/^[^\w]*/, ""); // trim leading emoji clutter
      li.appendChild(a);
      list.appendChild(li);
      linkById[h.id] = a;
    });
    details.appendChild(list);
    mount.appendChild(details);

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = linkById[entry.target.id];
          if (!link) return;
          link.classList.toggle("active", entry.isIntersecting);
        });
      }, { rootMargin: "-10% 0px -70% 0px" });
      headings.forEach(function (h) { observer.observe(h); });
    }
  }

  /* ========================================================================
     7. EXTERNAL LINKS open in a new tab (same-repo links stay in-tab)
        [carried over from the previous head-custom.html inline script]
     ======================================================================== */
  function externalLinksNewTab() {
    var repoBase = getBaseUrl();
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!/^https?:\/\//i.test(href)) return;
      try {
        var url = new URL(href, location.href);
        var isSameRepo = url.origin === location.origin &&
          (repoBase ? url.pathname.indexOf(repoBase + "/") === 0 : true);
        if (!isSameRepo) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      } catch (e) { /* malformed href — leave it alone */ }
    });
  }

  /* ========================================================================
     8. MERMAID — convert kramdown's fenced-block output, then render
     ======================================================================== */
  function initMermaid() {
    document.querySelectorAll("code.language-mermaid").forEach(function (codeEl) {
      var pre = document.createElement("pre");
      pre.className = "mermaid";
      pre.textContent = codeEl.textContent;
      var oldPre = codeEl.closest("pre") || codeEl;
      oldPre.replaceWith(pre);
    });
    if (window.mermaid) {
      var isDark = ThemeManager.effectiveTheme() === "dark";
      window.mermaid.initialize({ startOnLoad: true, theme: isDark ? "dark" : "default" });
    }
  }

  /* ========================================================================
     9. PROGRESS TRACKER — localStorage only, no login, no server
     ======================================================================== */
  var MODULES = [
    { slug: "00-introduction", title: "Introduction & Setup" },
    { slug: "01-git-fundamentals", title: "Git Fundamentals" },
    { slug: "02-git-and-github", title: "Git + GitHub" },
    { slug: "03-contributing-to-open-source", title: "Contributing to Open Source" },
    { slug: "04-undo-and-recovery", title: "Undo & Recovery" },
    { slug: "05-advanced-git", title: "Advanced Git" },
    { slug: "06-certification-prep", title: "Certification Prep" },
    { slug: "07-exercises-and-study-plan", title: "Exercises & Study Plan" }
  ];
  var ProgressTracker = {
    STORAGE_KEY: "git-tutorials-progress",
    read: function () {
      try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}"); }
      catch (e) { return {}; }
    },
    write: function (data) {
      try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    },
    markVisited: function (slug) {
      var data = this.read();
      if (!data[slug]) { data[slug] = "visited"; this.write(data); }
    },
    markComplete: function (slug, complete) {
      var data = this.read();
      data[slug] = complete ? "complete" : "visited";
      this.write(data);
    },
    recordCurrentPage: function () {
      var parts = stripBaseUrl(location.pathname).split("/").filter(Boolean);
      var slug = parts[0];
      if (slug && MODULES.some(function (m) { return m.slug === slug; })) {
        this.markVisited(slug);
      }
    },
    renderWidget: function () {
      var mount = document.getElementById("progress-tracker-mount");
      if (!mount) return;
      var data = this.read();
      mount.innerHTML = "";
      var container = document.createElement("div");
      container.className = "progress-tracker";

      var completedCount = MODULES.filter(function (m) { return data[m.slug] === "complete"; }).length;

      MODULES.forEach(function (m) {
        var state = data[m.slug] || "not-started";
        var row = document.createElement("div");
        row.className = "progress-row";

        var label = document.createElement("div");
        label.className = "progress-label";
        var link = document.createElement("a");
        link.href = "./" + m.slug + "/";
        link.textContent = m.title;
        label.appendChild(link);
        if (state === "complete") {
          var check = document.createElement("span");
          check.className = "progress-check";
          check.setAttribute("aria-label", "Completed");
          check.textContent = "✓";
          label.appendChild(check);
        }
        row.appendChild(label);

        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "progress-reset-btn";
        toggle.textContent = state === "complete" ? "Mark incomplete" : "Mark complete";
        toggle.addEventListener("click", function () {
          var isComplete = state === "complete";
          ProgressTracker.markComplete(m.slug, !isComplete);
          ProgressTracker.renderWidget();
        });
        row.appendChild(toggle);

        var track = document.createElement("div");
        track.className = "progress-track";
        var fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = (state === "complete" ? 100 : state === "visited" ? 35 : 0) + "%";
        track.appendChild(fill);
        row.appendChild(track);

        container.appendChild(row);
      });

      var resetAll = document.createElement("button");
      resetAll.type = "button";
      resetAll.className = "progress-reset-btn";
      resetAll.style.marginTop = "0.75em";
      resetAll.textContent = "Reset all progress (" + completedCount + "/" + MODULES.length + " complete)";
      resetAll.addEventListener("click", function () {
        ProgressTracker.write({});
        ProgressTracker.renderWidget();
      });
      container.appendChild(resetAll);

      mount.appendChild(container);
    }
  };

  /* ========================================================================
     Boot
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    ThemeManager.init();
    initMermaid();
    upgradeGfmAlerts();
    addCopyButtons();
    initBackToTop();
    initBreadcrumbs();
    initTOC();
    externalLinksNewTab();
    ProgressTracker.recordCurrentPage();
    ProgressTracker.renderWidget();
  });
})();
