// sidebar.js
// Jedyne miejsce, w którym definiujemy strukturę bocznego menu.
// Każda podstrona ma tylko <aside class="sidebar-left" id="sidebar-left"></aside>
// a ten skrypt wypełnia ją zawartością i podświetla aktywną stronę.

(function () {
  const sidebarHTML = `
    <a href="index.html" class="menu-link" data-page="index.html">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">home</span>
        Intro
      </div>
    </a>

    <a href="#" class="menu-link">
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
      <a href="depot-info.html" data-page="depot-info.html">Info</a>
      <a href="depot-install.html" data-page="depot-install.html">Installation</a>
    </div>

    <a href="#" class="menu-link dropdown-toggle" data-group="dbd">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">bolt</span>
        DBD FPS Unlocker
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="dbd">
      <a href="dbd-info.html" data-page="dbd-info.html">Info</a>
      <a href="dbd-install.html" data-page="dbd-install.html">Installation</a>
    </div>

    <a href="#" class="menu-link dropdown-toggle" data-group="hitman">
      <div class="menu-link-content">
        <span class="material-symbols-rounded">dns</span>
        Hitman Peacock Powershell
      </div>
      <span class="material-symbols-rounded menu-icon-right">keyboard_arrow_down</span>
    </a>
    <div class="sub-menu" data-submenu="hitman">
      <a href="hitman-info.html" data-page="hitman-info.html">Info</a>
      <a href="hitman-install.html" data-page="hitman-install.html">Installation</a>
    </div>
  `;

  function initSidebar() {
    const container = document.getElementById("sidebar-left");
    if (!container) return;

    container.innerHTML = sidebarHTML;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Podświetl "Intro" jeśli jesteśmy na stronie głównej
    const introLink = container.querySelector('[data-page="index.html"]');
    if (introLink && (currentPage === "index.html" || currentPage === "")) {
      introLink.classList.add("active");
    }

    // Podświetl aktywny link w podmenu i rozwiń jego grupę
    const activeSubLink = container.querySelector(`.sub-menu a[data-page="${currentPage}"]`);
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

    // Obsługa rozwijania/zwijania podmenu
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }
})();
