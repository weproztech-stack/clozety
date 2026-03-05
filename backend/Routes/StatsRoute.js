const express = require("express");
const router = express.Router();
const { getStats, getStatsPage } = require("../Controllers/StatsController");

// HTML page
router.get("/", getStatsPage);

// JSON API for chart data
router.get("/data", getStats);

// Sidebar injection script (loaded by AdminJS via assets.scripts)
router.get("/nav-inject.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.send(`
(function () {
  var LINK_TEXT = "Analytics Dashboard";
  var LINK_HREF = "/admin/stats";
  var LINK_ICON = "📊";
  var injected = false;

  function injectAnalyticsLink() {
    if (injected && document.getElementById("analytics-nav-link")) return;

    // AdminJS renders nav items as <a> tags inside the sidebar
    var allLinks = document.querySelectorAll("nav a, [class*='SidebarParent'] a, [class*='sidebar'] a");
    if (!allLinks || allLinks.length === 0) return;

    // Check if already injected
    if (document.getElementById("analytics-nav-link")) return;

    // Find the last nav link to insert after
    var lastLink = allLinks[allLinks.length - 1];
    var container = lastLink.closest("li, div") || lastLink.parentElement;
    if (!container) return;

    var wrapper = container.cloneNode(false);
    wrapper.id = "analytics-nav-link";
    wrapper.style.cssText = "list-style:none;margin:0;padding:0;";

    var a = document.createElement("a");
    a.href = LINK_HREF;
    a.style.cssText = [
      "display:flex",
      "align-items:center",
      "gap:8px",
      "padding:8px 16px",
      "color:inherit",
      "text-decoration:none",
      "font-size:14px",
      "opacity:0.9",
      "transition:opacity .15s",
      "cursor:pointer",
    ].join(";");
    a.onmouseover = function(){ this.style.opacity = "1"; };
    a.onmouseout  = function(){ this.style.opacity = "0.9"; };

    a.innerHTML = '<span style="font-size:16px">' + LINK_ICON + '</span><span>' + LINK_TEXT + '</span>';
    wrapper.appendChild(a);

    // Insert before the parent of the last nav link
    var navParent = container.parentElement;
    if (navParent) {
      navParent.appendChild(wrapper);
      injected = true;
    }
  }

  // Watch for DOM changes (AdminJS is a SPA, sidebar renders async)
  var observer = new MutationObserver(function () {
    injectAnalyticsLink();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately + after short delays
  injectAnalyticsLink();
  setTimeout(injectAnalyticsLink, 500);
  setTimeout(injectAnalyticsLink, 1500);
  setTimeout(injectAnalyticsLink, 3000);
})();
    `);
});

module.exports = router;

