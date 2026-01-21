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

// Global variable to store items data
let itemsData = null;

// Global flag to track if click handler is enabled
let clickHandlerEnabled = true;

// Load items from JSON file and populate the inventory
async function loadItems() {
  try {
    const response = await fetch("assets/items/items.json");
    if (!response.ok) throw new Error("Could not load items");

    // Store the data globally for later use
    itemsData = await response.json();

    const inventoryGrid = document.getElementById("inventory-grid");

    if (!inventoryGrid) return; // Not on inventory page

    inventoryGrid.innerHTML = ""; // Clear existing items

    itemsData.items.forEach((item) => {
      // Skip items that are not visible
      if (item.visible === false) return;

      const template = document.getElementById("inventory-item-template");
      const clone = document.importNode(template.content, true);

      // Determine status based on locked and equipped
      const status = getItemStatus(item);

      // Set classes based on item properties
      const itemElement = clone.querySelector(".inventory-item");
      if (item.locked) {
        itemElement.classList.add("locked");
      }
      if (item.equipped === true && !item.locked) {
        itemElement.classList.add("equipped");
      }

      // Set item information
      clone.querySelector(".item-name").textContent = item.name;
      clone.querySelector(".item-description").textContent = item.description;
      clone.querySelector(".status-text").textContent = status;

      // Add icon from JSON if provided, otherwise use category-based SVG
      const iconContainer = clone.querySelector(".item-icon");
      if (item.icon && item.icon.trim() !== "") {
        // Use base path for all item icons
        const basePath = "../assets/images/items/";
        iconContainer.innerHTML = `<img src="${basePath}${item.icon}" alt="${item.name}" />`;
      } else {
        iconContainer.innerHTML = getItemIcon(item.category);
      }

      // Set status indicator
      const statusIndicator = clone.querySelector(".status-indicator");
      if (status === "EQUIPPED" || status.includes("/")) {
        statusIndicator.classList.add("active");
      }

      // Store the item data in the element for click handling
      itemElement.dataset.itemId = item.id;

      inventoryGrid.appendChild(clone);
    });

    // Store the items data globally for click handling
    window.itemsData = itemsData;
  } catch (error) {
    console.error("Error loading items:", error);
  }
}

// Determines the status text based on item properties
function getItemStatus(item) {
  if (item.locked) {
    return "LOCKED";
  } else if (item.category === "consumable") {
    return "AVAILABLE";
  } else if (item.equipped) {
    return "EQUIPPED";
  } else {
    return "AVAILABLE";
  }
}

// Returns appropriate SVG icon based on item category
function getItemIcon(category) {
  switch (category) {
    case "suit":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M8.5,8.64L6.5,11.39L3.5,7.39L7.5,3.39L16.5,3.39L20.5,7.39L17.5,11.39L15.5,8.64L12,12.14L8.5,8.64M15.5,15.36L17.5,12.61L20.5,16.61L16.5,20.61L7.5,20.61L3.5,16.61L6.5,12.61L8.5,15.36L12,11.86L15.5,15.36Z" />
      </svg>`;
    case "weapon":
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17,19H7V5H17M17,3H7C5.89,3 5,3.89 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5C19,3.89 18.1,3 17,3Z" />
      </svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z" />
      </svg>`;
  }
}

async function loadContent(page, addHistory = true) {
  const contentArea = document.getElementById("content-area");

  try {
    const response = await fetch(page);
    if (!response.ok) throw new Error("Page not found");

    const html = await response.text();
    contentArea.innerHTML = html;

    // Initialize content-specific event handlers and populate data
    initializeContent();

    // Update the URL and Browser History
    if (addHistory) {
      history.pushState({ page: page }, "", `#${page}`);
    }
  } catch (error) {
    contentArea.innerHTML = "<h2>Error</h2><p>Could not load page.</p>";
    console.error(error);
  }
}

// Handle the Back/Forward buttons
window.onpopstate = function (event) {
  if (event.state && event.state.page) {
    // We pass 'false' because the browser already updated the history
    loadContent(event.state.page, false);
  } else {
    // Fallback to home if no state exists
    loadContent("pages/stats.html", false);
  }
};

// Function to initialize content and set up event handlers
function initializeContent() {
  // Load items if on inventory page
  if (document.getElementById("inventory-grid")) {
    loadItems();
  }
  // Populate character information
  if (document.querySelector("#info-item-1 .info-label")) {
    document.querySelector("#info-item-1 .info-label").textContent = STATS_DESCRIPTION_1_NAME;
    document.querySelector("#info-item-1 .info-value").textContent = STATS_DESCRIPTION_1_VALUE;

    document.querySelector("#info-item-2 .info-label").textContent = STATS_DESCRIPTION_2_NAME;
    document.querySelector("#info-item-2 .info-value").textContent = STATS_DESCRIPTION_2_VALUE;

    document.querySelector("#info-item-3 .info-label").textContent = STATS_DESCRIPTION_3_NAME;
    document.querySelector("#info-item-3 .info-value").textContent = STATS_DESCRIPTION_3_VALUE;

    document.querySelector("#info-item-4 .info-label").textContent = STATS_DESCRIPTION_4_NAME;
    document.querySelector("#info-item-4 .info-value").textContent = STATS_DESCRIPTION_4_VALUE;
  }

  // Populate health stats
  if (document.querySelector("#stat-health .stat-label")) {
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
  }

  // Populate mission progress
  if (document.querySelector("#mission-1 .mission-title")) {
    document.querySelector("#mission-1 .mission-title").textContent = MISSION_1_NAME;
    document.querySelector("#mission-1 .mission-status").textContent = MISSION_1_STATUS;

    document.querySelector("#mission-2 .mission-title").textContent = MISSION_2_NAME;
    document.querySelector("#mission-2 .mission-status").textContent = MISSION_2_STATUS;

    document.querySelector("#mission-3 .mission-title").textContent = MISSION_3_NAME;
    document.querySelector("#mission-3 .mission-status").textContent = MISSION_3_STATUS;
  }

  // Populate location data
  if (document.querySelector("#location-1 .location-label")) {
    document.querySelector("#location-1 .location-label").textContent = LOCATION_SECTOR_NAME;
    document.querySelector("#location-1 .location-value").textContent = LOCATION_SECTOR_VALUE;

    document.querySelector("#location-2 .location-label").textContent = LOCATION_REGION_NAME;
    document.querySelector("#location-2 .location-value").textContent = LOCATION_REGION_VALUE;

    document.querySelector("#location-3 .location-label").textContent = LOCATION_DEPTH_NAME;
    document.querySelector("#location-3 .location-value").textContent = LOCATION_DEPTH_VALUE;
  }

  // Populate system status
  if (document.querySelector("#sys-status")) {
    document.querySelector("#status-item-1 .status-label").textContent = SYS_STATUS_NAME;
    document.querySelector("#sys-status").textContent = SYS_STATUS_VALUE;

    document.querySelector("#status-item-2 .status-label").textContent = POWER_LEVEL_NAME;
    document.querySelector("#power-level").textContent = POWER_LEVEL_VALUE;

    document.querySelector(".system-id .id-label").textContent = UNIT_ID_NAME;
    document.querySelector("#unit-id-value").textContent = UNIT_ID_VALUE;
  }

  // Populate map location details
  if (document.querySelector(".detail-card h3")) {
    document.querySelector(".detail-card h3").textContent = MAP_LOCATION_NAME;
    document.querySelector(".detail-card p").textContent = MAP_LOCATION_DESCRIPTION;

    document.querySelector("#detail-stat-1 .stat-label").textContent = MAP_TEMP_NAME;
    document.querySelector("#detail-stat-1 .stat-value").textContent = MAP_TEMP_VALUE;

    document.querySelector("#detail-stat-2 .stat-label").textContent = MAP_HUMIDITY_NAME;
    document.querySelector("#detail-stat-2 .stat-value").textContent = MAP_HUMIDITY_VALUE;

    document.querySelector("#detail-stat-3 .stat-label").textContent = MAP_TOXICITY_NAME;
    document.querySelector("#detail-stat-3 .stat-value").textContent = MAP_TOXICITY_VALUE;
  }

  // Interactive inventory items - use event delegation for dynamically loaded items
  document.addEventListener("click", function (e) {
    // Skip if click handler is disabled
    if (!clickHandlerEnabled) return;

    const item = e.target.closest(".inventory-item");
    if (!item) return;

    // Get the item ID from the data attribute
    const itemId = item.dataset.itemId;
    if (!itemId || !window.itemsData) return;

    // Find the clicked item in the global data
    const itemData = window.itemsData.items.find((i) => i.id === itemId);
    if (!itemData) return;

    // Skip equip/unequip for locked or consumable items
    if (itemData.locked || itemData.category === "consumable") {
      // Visual feedback for locked/consumable items (but no state change)
      item.style.transform = "scale(0.98)";
      setTimeout(() => {
        item.style.transform = "";
      }, 200);
      return;
    }

    // Toggle equipped state for the clicked item
    const wasEquipped = itemData.equipped === true;

    if (!wasEquipped) {
      // Equip the clicked item
      itemData.equipped = true;

      // Unequip all other items in the same category
      window.itemsData.items.forEach((i) => {
        if (i.id !== itemId && i.category === itemData.category) {
          i.equipped = false;
        }
      });
    } else {
      // Unequip the clicked item
      itemData.equipped = false;
    }

    // Update the UI for all items to reflect the new state
    document.querySelectorAll(".inventory-item").forEach((uiItem) => {
      const uiItemId = uiItem.dataset.itemId;
      const uiItemData = window.itemsData.items.find((i) => i.id === uiItemId);

      if (uiItemData) {
        const status = getItemStatus(uiItemData);

        // Update the status text
        uiItem.querySelector(".status-text").textContent = status;

        // Update the equipped class and status indicator
        if (status === "EQUIPPED") {
          uiItem.classList.add("equipped");
          uiItem.querySelector(".status-indicator").classList.add("active");
        } else {
          uiItem.classList.remove("equipped");
          uiItem.querySelector(".status-indicator").classList.remove("active");
        }
      }
    });

    // Visual feedback
    item.style.transform = "scale(0.98)";

    // Disable click handler temporarily to prevent duplicate clicks
    clickHandlerEnabled = false;
    setTimeout(() => {
      item.style.transform = "";
      clickHandlerEnabled = true;
    }, 50);
  });

  // Interactive map cells
  const mapCells = document.querySelectorAll(".map-cell.visited, .map-cell.current");
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
      const detailCard = document.querySelector(".detail-card h3");
      if (detailCard) {
        detailCard.textContent = locationName;
      }

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
}

// Initialize everything when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Tab navigation functionality
  const navItems = document.querySelectorAll(".nav-item");

  // Load the default page (stats)
  loadContent("pages/stats.html");

  // Tab navigation event listeners
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      const pageToLoad = `pages/${tabId}.html`;

      // Remove active class from all nav items
      navItems.forEach((navItem) => {
        navItem.classList.remove("active");
      });

      // Add active class to clicked nav item
      this.classList.add("active");

      // Load the appropriate page
      loadContent(pageToLoad);

      // Add haptic feedback simulation (visual effect)
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
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

  // Apply feedback to nav items
  navItems.forEach((element) => {
    element.addEventListener("click", function () {
      simulateInteractionFeedback(this);
    });
  });

  // Update time immediately after DOM is loaded
  updateTime();

  // Then update every second
  setInterval(updateTime, 1000);
});
