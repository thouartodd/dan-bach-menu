// System time functionality - displays in 24-hour military format based on browser's timezone
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timeElement = document.getElementById("system-time");
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

// Initialize everything when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Tab navigation functionality
  const navItems = document.querySelectorAll(".nav-item");
  const tabContents = document.querySelectorAll(".tab-content");

  // Populate character information
  document.querySelector("#info-item-1 .info-label").textContent = STATS_DESCRIPTION_1_NAME;
  document.querySelector("#info-item-1 .info-value").textContent = STATS_DESCRIPTION_1_VALUE;

  document.querySelector("#info-item-2 .info-label").textContent = STATS_DESCRIPTION_2_NAME;
  document.querySelector("#info-item-2 .info-value").textContent = STATS_DESCRIPTION_2_VALUE;

  document.querySelector("#info-item-3 .info-label").textContent = STATS_DESCRIPTION_3_NAME;
  document.querySelector("#info-item-3 .info-value").textContent = STATS_DESCRIPTION_3_VALUE;

  document.querySelector("#info-item-4 .info-label").textContent = STATS_DESCRIPTION_4_NAME;
  document.querySelector("#info-item-4 .info-value").textContent = STATS_DESCRIPTION_4_VALUE;

  // Populate health stats
  document.querySelector("#stat-health .stat-label").textContent = STATS_HEALTH_NAME;
  document.querySelector("#stat-health .stat-fill").style.width = STATS_HEALTH_VALUE + "%";
  document.querySelector("#stat-health .stat-value").textContent = STATS_HEALTH_VALUE + "%";

  document.querySelector("#stat-energy .stat-label").textContent = STATS_ENERGY_NAME;
  document.querySelector("#stat-energy .stat-fill").style.width = STATS_ENERGY_VALUE + "%";
  document.querySelector("#stat-energy .stat-value").textContent = STATS_ENERGY_VALUE + "%";

  document.querySelector("#stat-oxygen .stat-label").textContent = STATS_OXYGEN_NAME;
  document.querySelector("#stat-oxygen .stat-fill").style.width = STATS_OXYGEN_VALUE + "%";
  document.querySelector("#stat-oxygen .stat-value").textContent = STATS_OXYGEN_VALUE + "%";

  document.querySelector("#stat-armor .stat-label").textContent = STATS_ARMOR_NAME;
  document.querySelector("#stat-armor .stat-fill").style.width = STATS_ARMOR_VALUE + "%";
  document.querySelector("#stat-armor .stat-value").textContent = STATS_ARMOR_VALUE + "%";

  // Populate mission progress
  document.querySelector("#mission-1 .mission-title").textContent = MISSION_1_NAME;
  document.querySelector("#mission-1 .mission-status").textContent = MISSION_1_STATUS;

  document.querySelector("#mission-2 .mission-title").textContent = MISSION_2_NAME;
  document.querySelector("#mission-2 .mission-status").textContent = MISSION_2_STATUS;

  document.querySelector("#mission-3 .mission-title").textContent = MISSION_3_NAME;
  document.querySelector("#mission-3 .mission-status").textContent = MISSION_3_STATUS;

  // Populate location data
  document.querySelector("#location-1 .location-label").textContent = LOCATION_SECTOR_NAME;
  document.querySelector("#location-1 .location-value").textContent = LOCATION_SECTOR_VALUE;

  document.querySelector("#location-2 .location-label").textContent = LOCATION_REGION_NAME;
  document.querySelector("#location-2 .location-value").textContent = LOCATION_REGION_VALUE;

  document.querySelector("#location-3 .location-label").textContent = LOCATION_DEPTH_NAME;
  document.querySelector("#location-3 .location-value").textContent = LOCATION_DEPTH_VALUE;

  // Populate system status
  document.querySelector("#status-item-1 .status-label").textContent = SYS_STATUS_NAME;
  document.querySelector("#sys-status").textContent = SYS_STATUS_VALUE;

  document.querySelector("#status-item-2 .status-label").textContent = POWER_LEVEL_NAME;
  document.querySelector("#power-level").textContent = POWER_LEVEL_VALUE;

  document.querySelector(".system-id .id-label").textContent = UNIT_ID_NAME;
  document.querySelector("#unit-id-value").textContent = UNIT_ID_VALUE;

  // Populate map location details
  document.querySelector(".detail-card h3").textContent = MAP_LOCATION_NAME;
  document.querySelector(".detail-card p").textContent = MAP_LOCATION_DESCRIPTION;

  document.querySelector("#detail-stat-1 .stat-label").textContent = MAP_TEMP_NAME;
  document.querySelector("#detail-stat-1 .stat-value").textContent = MAP_TEMP_VALUE;

  document.querySelector("#detail-stat-2 .stat-label").textContent = MAP_HUMIDITY_NAME;
  document.querySelector("#detail-stat-2 .stat-value").textContent = MAP_HUMIDITY_VALUE;

  document.querySelector("#detail-stat-3 .stat-label").textContent = MAP_TOXICITY_NAME;
  document.querySelector("#detail-stat-3 .stat-value").textContent = MAP_TOXICITY_VALUE;

  // Tab navigation event listeners
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Remove active class from all nav items and tab contents
      navItems.forEach((navItem) => {
        navItem.classList.remove("active");
      });

      tabContents.forEach((content) => {
        content.classList.remove("active");
      });

      // Add active class to clicked nav item and corresponding tab content
      this.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");

      // Add haptic feedback simulation (visual effect)
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });

  // Interactive inventory items
  const inventoryItems = document.querySelectorAll(".inventory-item");
  inventoryItems.forEach((item) => {
    if (!item.classList.contains("locked")) {
      item.addEventListener("click", function () {
        // If item is not equipped, toggle equip state
        if (!this.classList.contains("equipped")) {
          // Remove equipped class from other items in the same category (simplified logic)
          document.querySelectorAll(".inventory-item.equipped").forEach((equippedItem) => {
            if (equippedItem !== this) {
              equippedItem.classList.remove("equipped");
              equippedItem.querySelector(".status-text").textContent = "AVAILABLE";
              equippedItem.querySelector(".status-indicator").classList.remove("active");
            }
          });

          // Toggle equipped state on current item
          this.classList.toggle("equipped");
          if (this.classList.contains("equipped")) {
            this.querySelector(".status-text").textContent = "EQUIPPED";
            this.querySelector(".status-indicator").classList.add("active");
          } else {
            this.querySelector(".status-text").textContent = "AVAILABLE";
            this.querySelector(".status-indicator").classList.remove("active");
          }
        }

        // Visual feedback
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
        }, 200);
      });
    }
  });

  // Interactive map cells
  const mapCells = document.querySelectorAll(".map-cell.visited");
  mapCells.forEach((cell) => {
    cell.addEventListener("click", function () {
      // Remove current class from all cells
      document.querySelectorAll(".map-cell").forEach((mapCell) => {
        mapCell.classList.remove("current");
      });

      // Add current class to clicked cell
      this.classList.add("current");

      // Update location details (simplified - just changes title)
      const locationName = this.textContent;
      document.querySelector(".detail-card h3").textContent = locationName;

      // Visual feedback
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);
    });
  });

  // Add some random flicker effects to status indicators
  const statusValues = document.querySelectorAll(".status-value");
  statusValues.forEach((value) => {
    setInterval(() => {
      if (Math.random() > 0.8) {
        value.style.opacity = "0.7";
        setTimeout(() => {
          value.style.opacity = "1";
        }, 100);
      }
    }, 5000);
  });

  // Add a subtle animation to stat bars
  const statFills = document.querySelectorAll(".stat-fill");
  statFills.forEach((fill, index) => {
    const originalWidth = fill.style.width;
    fill.style.width = "0";

    setTimeout(
      () => {
        fill.style.width = originalWidth;
      },
      500 + index * 100,
    );
  });

  // Add keyboard navigation
  document.addEventListener("keydown", function (e) {
    const activeNavIndex = Array.from(navItems).findIndex((item) => item.classList.contains("active"));

    if (e.key === "ArrowLeft" && activeNavIndex > 0) {
      navItems[activeNavIndex - 1].click();
    } else if (e.key === "ArrowRight" && activeNavIndex < navItems.length - 1) {
      navItems[activeNavIndex + 1].click();
    }
  });

  // Add sound effect simulation (visual feedback instead of actual sound)
  function simulateInteractionFeedback(element) {
    element.style.boxShadow = "0 0 20px rgba(47, 196, 255, 0.7)";
    setTimeout(() => {
      element.style.boxShadow = "";
    }, 300);
  }

  // Apply feedback to clickable elements
  document.querySelectorAll("button, .nav-item, .inventory-item:not(.locked), .map-cell.visited").forEach((element) => {
    element.addEventListener("click", function () {
      simulateInteractionFeedback(this);
    });
  });

  // Update time immediately after DOM is loaded
  updateTime();

  // Then update every second
  setInterval(updateTime, 1000);
});
