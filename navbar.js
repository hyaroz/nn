// navbar.js
// Górny pasek nawigacji (hamburger + logo + GitHub + tryb ciemny).

(function () {
  function getImagePath() {
    const path = window.location.pathname;
    if (path.includes('/subpages/')) {
      return '../images/icon.jpg';
    }
    return 'images/icon.jpg';
  }

  function getIndexHref() {
    const path = window.location.pathname;
    if (path.includes('/subpages/')) {
      return '../index.html';
    }
    return 'index.html';
  }

  function getLightModeHref() {
    const path = window.location.pathname;
    if (path.includes('/subpages/')) {
      return 'light-mode.html';
    }
    return 'subpages/light-mode.html';
  }

  const navHTML = `
    <div class="top-nav-left">
      <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">
        <span class="material-symbols-rounded">menu</span>
      </button>
      <div class="site-title" onclick="window.location.href='${getIndexHref()}'">
        <img src="${getImagePath()}" class="site-logo" alt="Logo">
        Neron's Basement
      </div>
    </div>
    <div class="top-nav-right">
      <a href="https://github.com/hyaroz/nn" target="_blank" class="github-icon-link" title="Source Code">
        <svg height="22" width="22" viewBox="0 0 16 16" fill="var(--heading-color)">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
      </a>
      <a href="${getLightModeHref()}" class="dark-mode-icon-link" title="Toggle Theme">
        <span class="material-symbols-rounded dark-mode-icon">dark_mode</span>
      </a>
    </div>
  `;

  function playFlashbangSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Low-frequency explosion thud
      const thudDuration = 0.5;
      const thudBufferSize = audioCtx.sampleRate * thudDuration;
      const thudBuffer = audioCtx.createBuffer(1, thudBufferSize, audioCtx.sampleRate);
      const thudData = thudBuffer.getChannelData(0);
      for (let i = 0; i < thudBufferSize; i++) {
        thudData[i] = Math.random() * 2 - 1;
      }
      
      const thudNode = audioCtx.createBufferSource();
      thudNode.buffer = thudBuffer;
      
      const thudFilter = audioCtx.createBiquadFilter();
      thudFilter.type = 'lowpass';
      thudFilter.frequency.setValueAtTime(250, audioCtx.currentTime);
      thudFilter.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + thudDuration);
      
      const thudGain = audioCtx.createGain();
      thudGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + thudDuration);
      
      thudNode.connect(thudFilter);
      thudFilter.connect(thudGain);
      thudGain.connect(audioCtx.destination);
      
      // High-pitched ringing sound (sine wave)
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(6000, audioCtx.currentTime);
      
      oscGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 7.0);
      
      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      
      thudNode.start();
      osc.start();
      
      thudNode.stop(audioCtx.currentTime + thudDuration);
      osc.stop(audioCtx.currentTime + 7.0);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policies:", e);
    }
  }

  function triggerFlashbang() {
    playFlashbangSound();
    
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.backgroundColor = "#ffffff";
    flash.style.zIndex = "99999";
    flash.style.pointerEvents = "none";
    flash.style.opacity = "1";
    
    document.body.appendChild(flash);
    
    // Force reflow
    flash.offsetHeight;
    
    // Hold white for 1.0s, then fade out slowly over 6.0s (total 7s)
    setTimeout(() => {
      flash.style.transition = "opacity 6s cubic-bezier(0.1, 0.8, 0.3, 1)";
      flash.style.opacity = "0";
    }, 1000);
    
    setTimeout(() => {
      flash.remove();
    }, 7000);

    // Show roast modal after 150ms (when screen is 100% white, spawning it underneath to fade in as the white overlay disappears)
    setTimeout(() => {
      showRoastModal();
    }, 150);
  }

  function showRoastModal() {
    if (document.getElementById("roast-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "roast-modal-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
    overlay.style.backdropFilter = "blur(10px)";
    overlay.style.webkitBackdropFilter = "blur(10px)";
    overlay.style.zIndex = "99998";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s ease";

    const modal = document.createElement("div");
    modal.id = "roast-modal";
    modal.style.backgroundColor = "var(--container-bg)";
    modal.style.border = "1px solid rgba(223, 161, 104, 0.3)";
    modal.style.borderRadius = "16px";
    modal.style.padding = "30px";
    modal.style.maxWidth = "640px";
    modal.style.width = "90%";
    modal.style.maxHeight = "85vh";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)";
    modal.style.transform = "scale(0.85)";
    modal.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    modal.style.color = "var(--text-color)";
    modal.style.fontFamily = "'Inter', sans-serif";
    modal.style.boxSizing = "border-box";

    modal.innerHTML = `
      <!-- Header (Fixed) -->
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-shrink: 0;">
        <span class="material-symbols-rounded" style="color: var(--accent-color); font-size: 32px; width: 32px; height: 32px;">warning</span>
        <h2 style="margin: 0; color: var(--heading-color); font-size: 1.6em; font-weight: 900; letter-spacing: -0.5px; border: none; padding: 0;">Light Mode Really?</h2>
      </div>
      <div class="separator" style="margin-bottom: 20px; flex-shrink: 0;"></div>
      
      <!-- Content (Scrollable) -->
      <div style="flex: 1; overflow-y: auto; margin-bottom: 20px; font-size: 0.98em; line-height: 1.7;">
        <p style="margin-top: 0;">You actually clicked the dark mode button hoping for a light mode? <strong>Really?</strong></p>
        
        <p>Let me get this straight — you're sitting there, staring at this perfectly fine dark theme that's easy on the eyes, looks professional, and doesn't burn your retinas at 3 AM, and your first thought is "gee, I wish this was blindingly white instead"?</p>
        
        <h2 style="font-size: 1.3em; margin-top: 25px; padding-top: 15px; border-top: 1px dashed var(--border-color); font-weight: 900; color: var(--heading-color);">You have problems</h2>
        <p>Normal people appreciate dark mode. Normal people understand that staring at bright white backgrounds all day is literal torture. But you? No, you're special. You're out here actively seeking eye strain like it's a hobby.</p>
        
        <div class="notice-box" style="margin-top: 20px; margin-bottom: 0; box-sizing: border-box;">
          <p><strong>Pro tip:</strong> There is no light mode. There will never be a light mode. Stop clicking buttons you don't understand, masochist.</p>
        </div>
      </div>
      
      <!-- Footer (Fixed) -->
      <div style="display: flex; justify-content: flex-end; padding-top: 15px; border-top: 1px solid var(--border-color); flex-shrink: 0;">
        <button id="roast-close-btn" style="background-color: var(--accent-color); color: var(--bg-color); border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; font-family: inherit; font-size: 0.9em; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
          Forgive me, back to the NORMAL mode
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Force reflow and animate in
    overlay.offsetHeight;
    overlay.style.opacity = "1";
    modal.style.transform = "scale(1)";

    const closeBtn = modal.querySelector("#roast-close-btn");
    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.backgroundColor = "#f0be95";
      closeBtn.style.transform = "translateY(-1px)";
    });
    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.backgroundColor = "var(--accent-color)";
      closeBtn.style.transform = "none";
    });

    const closeModal = () => {
      overlay.style.opacity = "0";
      modal.style.transform = "scale(0.85)";
      setTimeout(() => {
        overlay.remove();
      }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  function initNavbar() {
    const container = document.getElementById("top-nav");
    if (!container) return;
    container.innerHTML = navHTML;

    const themeToggle = container.querySelector(".dark-mode-icon-link");
    if (themeToggle) {
      themeToggle.addEventListener("click", function(e) {
        e.preventDefault();
        triggerFlashbang();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavbar);
  } else {
    initNavbar();
  }
})();