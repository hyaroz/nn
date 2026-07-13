// sidebar.js
// Boczne menu + obsługa mobilnego drawer'a (zjednoczone).

(function () {
  function getPageHref(target) {
    const isSubsite = window.location.pathname.includes('/subpages/');
    if (isSubsite) {
      if (target === 'index.html') {
        return '../index.html';
      }
      if (target.startsWith('subpages/')) {
        return target.substring(9); // e.g. "subpages/tools.html" -> "tools.html"
      }
      return target;
    } else {
      if (target === 'index.html') {
        return 'index.html';
      }
      if (target.startsWith('subpages/')) {
        return target;
      }
      return 'subpages/' + target;
    }
  }

  const sidebarHTML = `
    <a href="${getPageHref('index.html')}" class="menu-link" data-page="index.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">home</span>
        Intro
      </div>
    </a>

    <a href="${getPageHref('subpages/tools.html')}" class="menu-link" data-page="tools.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">construction</span>
        Tools I Use
      </div>
    </a>

    <a href="${getPageHref('subpages/roadmap.html')}" class="menu-link" data-page="roadmap.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">map</span>
        Roadmap
      </div>
    </a>

    <a href="${getPageHref('subpages/contact.html')}" class="menu-link" data-page="contact.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">mail</span>
        Contact
      </div>
    </a>


    <div class="sidebar-section-label accent">My Projects:</div>

    <a href="#" class="menu-link dropdown-toggle" data-group="dbd">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">bolt</span>
        DBD FPS Unlocker
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="dbd">
      <a href="${getPageHref('dbd-info.html')}" data-page="dbd-info.html">Info</a>
      <a href="${getPageHref('dbd-install.html')}" data-page="dbd-install.html">Guide</a>
      <a href="${getPageHref('dbd-download.html')}" data-page="dbd-download.html">Download</a>
    </div>

    <a href="${getPageHref('hitman-info.html')}" class="menu-link" data-page="hitman-info.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">dns</span>
        Hitman Peacock Powershell
      </div>
    </a>
  `;

  function isMobileMenu() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function getMenuElements() {
    return {
      sidebar: document.getElementById("sidebar-left"),
      overlay: document.getElementById("sidebar-overlay"),
      toggle: document.getElementById("menu-toggle"),
    };
  }

  function setMenuOpen(open) {
    const { sidebar, overlay, toggle } = getMenuElements();
    if (!sidebar) return;

    sidebar.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("visible", open);
    document.body.classList.toggle("menu-open", open);

    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      const icon = toggle.querySelector(".material-symbols-rounded");
      if (icon) icon.textContent = open ? "close" : "menu";
    }
  }

  function closeMobileMenu() {
    if (isMobileMenu()) setMenuOpen(false);
  }

  function initMobileMenu() {
    const { sidebar, overlay, toggle } = getMenuElements();
    if (!sidebar || !toggle) return;

    toggle.addEventListener("click", function () {
      setMenuOpen(!sidebar.classList.contains("open"));
    });

    if (overlay) {
      overlay.addEventListener("click", closeMobileMenu);
    }

    sidebar.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href !== "#") {
        link.addEventListener("click", closeMobileMenu);
      }
    });

    window.addEventListener("resize", function () {
      if (!isMobileMenu()) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileMenu();
    });
  }

  function initSidebar() {
    const container = document.getElementById("sidebar-left");
    if (!container) return;

    container.innerHTML = sidebarHTML;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const topLevelLinks = container.querySelectorAll("a.menu-link[data-page]");
    topLevelLinks.forEach((link) => {
      const dataPage = link.getAttribute("data-page");
      if (dataPage === currentPage) {
        link.classList.add("active");
      }
    });

    const activeSubLink = container.querySelector(`.sub-menu a[data-page="${currentPage}"]`);
    if (activeSubLink) {
      activeSubLink.classList.add("active");
      const subMenu = activeSubLink.closest(".sub-menu");
      if (subMenu) {
        subMenu.style.display = "flex";
        const group = subMenu.getAttribute("data-submenu");
        const toggle = container.querySelector(`.dropdown-toggle[data-group="${group}"]`);
        if (toggle) {
          const rightIcon = toggle.querySelector(".menu-icon-right");
          if (rightIcon) rightIcon.textContent = "keyboard_arrow_up";
        }
      }
    }

    const dropdownToggles = container.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const subMenu = this.nextElementSibling;
        if (!subMenu) return;
        const arrowIcon = this.querySelector(".menu-icon-right");
        if (subMenu.style.display === "flex") {
          subMenu.style.display = "none";
          if (arrowIcon) arrowIcon.textContent = "keyboard_arrow_down";
        } else {
          subMenu.style.display = "flex";
          if (arrowIcon) arrowIcon.textContent = "keyboard_arrow_up";
        }
      });
    });

    initMobileMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }
})();