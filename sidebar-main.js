// sidebar-main.js
// Boczne menu dla index.html (w folderze głównym).

(function () {
  const sidebarHTML = `
    <a href="index.html" class="menu-link" data-page="index.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">home</span>
        Intro
      </div>
    </a>

    <a href="subsites/tools.html" class="menu-link" data-page="subsites/tools.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">construction</span>
        Tools I Use
      </div>
    </a>

    <div class="sidebar-section-label accent">My Projects:</div>

    <a href="#" class="menu-link dropdown-toggle" data-group="depot">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">history</span>
        DepotDowngrader
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="depot">
      <a href="subsites/depot-info.html" data-page="subsites/depot-info.html">Info</a>
      <a href="subsites/depot-install.html" data-page="subsites/depot-install.html">Installation</a>
    </div>

    <a href="#" class="menu-link dropdown-toggle" data-group="dbd">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">bolt</span>
        DBD FPS Unlocker
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="dbd">
      <a href="subsites/dbd-info.html" data-page="subsites/dbd-info.html">Info</a>
      <a href="subsites/dbd-install.html" data-page="subsites/dbd-install.html">Installation</a>
    </div>

    <a href="#" class="menu-link dropdown-toggle" data-group="hitman">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">dns</span>
        Hitman Peacock Powershell
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="hitman">
      <a href="subsites/hitman-info.html" data-page="subsites/hitman-info.html">Info</a>
      <a href="subsites/hitman-install.html" data-page="subsites/hitman-install.html">Installation</a>
    </div>
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
      if (link.getAttribute("data-page") === currentPage || link.getAttribute("data-page") === "subsites/" + currentPage) {
        link.classList.add("active");
      }
    });

    const activeSubLink = container.querySelector(`.sub-menu a[data-page="${currentPage}"]`) || 
                         container.querySelector(`.sub-menu a[data-page="subsites/${currentPage}"]`);
    if (activeSubLink) {
      activeSubLink.classList.add("active");
      const subMenu = activeSubLink.closest(".sub-menu");
      subMenu.style.display = "flex";
      const group = subMenu.getAttribute("data-submenu");
      const toggle = container.querySelector(`.dropdown-toggle[data-group="${group}"]`);
      if (toggle) {
        toggle.querySelector(".menu-icon-right").textContent = "keyboard_arrow_up";
      }
    }

    const dropdownToggles = container.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const subMenu = this.nextElementSibling;
        const arrowIcon = this.querySelector(".menu-icon-right");
        if (subMenu.style.display === "flex") {
          subMenu.style.display = "none";
          arrowIcon.textContent = "keyboard_arrow_down";
        } else {
          subMenu.style.display = "flex";
          arrowIcon.textContent = "keyboard_arrow_up";
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
