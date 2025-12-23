const ITEMS_PER_PAGE = 3;
let currentPage = 1;
let currentSearchTerm = "";

const db = {
  users: [
    { id: "ETS1234/12", password: "123", name: "Abebe Belachew" },
    { id: "admin", password: "admin", name: "System Admin" },
  ],
  items: [
    {
      id: 1,
      title: "Scientific Calculator",
      location: "Engineering Library",
      date: "Dec 08, 2025",
      image: "images/calculator.jpg",
      status: "Found",
    },
    {
      id: 2,
      title: "Power Bank",
      location: "Teacher's Lounge",
      date: "Dec 07, 2025",
      image: "images/power_bank.jpg",
      status: "Found",
    },
    {
      id: 3,
      title: "Silver Water Bottle",
      location: "KK Yellow",
      date: "Dec 09, 2025",
      image: "images/water_bottle.jpg",
      status: "Found",
    },
    {
      id: 4,
      title: "Sweater",
      location: "LT-47",
      date: "2025-12-10",
      image: "images/placeholder.jpg",
      status: "Found",
    },
    {
      id: 5,
      title: "NoteBook",
      location: "Library 2 Floor",
      date: "2025-12-11",
      image: "images/placeholder.png",
      status: "Found",
    },
    {
      id: 6,
      title: "Keys",
      location: "Digital Library",
      date: "2025-12-12",
      image: "images/placeholder.jpg",
      status: "Found",
    },
  ],
};

function handleLogin() {
  const userInput = document.getElementById("username").value;
  const passInput = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  const userFound = db.users.find(
    (u) => u.id === userInput && u.password === passInput
  );

  if (userFound) {
    localStorage.setItem("currentUser", userFound.name);
    window.location.href = "dashboard.html";
  } else {
    errorMsg.innerText = "Invalid ID or Password. Try 'ETS1234/12' / '123'";
  }
}

function loadDashboard() {
  console.log("2. loadDashboard function called.");
  const container = document.getElementById("itemsContainer");
  const userDisplay = document.getElementById("welcomeUser");
  const paginationContainer = document.getElementById("pagination");

  if (!container) return;
  let allItems = JSON.parse(localStorage.getItem("lostItems"));
  if (!allItems || allItems.length < db.items.length) {
    allItems = db.items;
    localStorage.setItem("lostItems", JSON.stringify(db.items));
  }

  // Filter Data
  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(currentSearchTerm.toLowerCase())
  );

  // Paginate Data
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  if (currentPage > totalPages) currentPage = 1;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToShow = filteredItems.slice(startIndex, endIndex);

  // Render Items
  container.innerHTML = "";
  const currentUser = localStorage.getItem("currentUser") || "Student";
  if (userDisplay) userDisplay.innerText = `Welcome, ${currentUser}`;

  if (itemsToShow.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666">No items found.</p>`;
  }

  itemsToShow.forEach((item) => {
    const cardHTML = `
        <div class="item-card">
            <img src="${item.image}" alt="${item.title}" class="item-image" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>Location: <span class="badge">${item.location}</span></p>
                <p>Date: ${item.date}</p>
                <button class="btn claim-btn" onclick="claimItem(${item.id})">Claim Item</button>
            </div>
        </div>
        `;
    container.innerHTML += cardHTML;
  });

  // Render Pagination Buttons
  if (paginationContainer) {
    if (totalPages > 1) {
      paginationContainer.innerHTML = `
              <button class="page-btn" onclick="changePage(-1)" ${
                currentPage === 1 ? "disabled" : ""
              }>Previous</button>
              <span class="page-info">Page ${currentPage} of ${totalPages}</span>
              <button class="page-btn" onclick="changePage(1)" ${
                currentPage === totalPages ? "disabled" : ""
              }>Next</button>
          `;
    } else {
      paginationContainer.innerHTML = "";
    }
  }

  console.log("4. Injection complete.");
}

// --- FUNCTIONS FOR PAGINATION & SEARCH ---

function handleSearch() {
  const input = document.getElementById("searchInput");
  currentSearchTerm = input.value;
  currentPage = 1;
  loadDashboard();
}

function changePage(direction) {
  currentPage += direction;
  loadDashboard();
  document.querySelector(".container").scrollIntoView({ behavior: "smooth" });
}

function submitReport() {
  const title = document.getElementById("itemName").value;
  const location = document.getElementById("itemLocation").value;
  const date = document.getElementById("itemDate").value;
  const imageInput = document.getElementById("itemImage");

  if (title === "" || location === "") {
    if (typeof showNotification === "function") {
      showNotification("Please fill in all required fields!");
    } else {
      alert("Please fill in all required fields!");
    }
    return;
  }
  const saveToStorage = (imgUrl) => {
    const newItem = {
      id: Date.now(),
      title: title,
      location: location,
      date: date,
      image: imgUrl,
      status: "Found",
    };

    let currentItems =
      JSON.parse(localStorage.getItem("lostItems")) || db.items;
    currentItems.unshift(newItem);
    localStorage.setItem("lostItems", JSON.stringify(currentItems));

    if (typeof showNotification === "function") {
      showNotification("Item Reported Successfully!");
    }

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  };

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveToStorage(e.target.result);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveToStorage("images/placeholder.jpg");
  }
}

function claimItem(id) {
  showNotification(
    `Claim Request Sent for Item #${id}! Please visit Block 509.`
  );
}

function showNotification(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.innerText = message;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.style.opacity = "0";
    setTimeout(() => alertDiv.remove(), 500);
  }, 3000);
}

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM is fully loaded. Running script...");
  loadDashboard();
});
