/* 
   CI: app.js
   Version: 1.0
   Author: Samiya Yusuf (Lead Dev)
   Description: Handles Login authentication and Dashboard data rendering.
*/
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
    errorMsg.innerText = "Invalid ID or Password. Try 'ETS1234' / '12'";
  }
}

function submitReport() {
    const title = document.getElementById('itemName').value;
    const location = document.getElementById('itemLocation').value;
    const date = document.getElementById('itemDate').value;

    if(title === "" || location === "") {
        alert("Please fill in all fields");
        return;
    }

    const newItem = {
        id: Date.now(), 
        title: title,
        location: location,
        date: date,
        image: "images/calculator.jpg", 
        status: "Found"
    };

    let currentItems = JSON.parse(localStorage.getItem('lostItems'));
    if (!currentItems) {
        currentItems = db.items;
    }

    currentItems.push(newItem);
    localStorage.setItem('lostItems', JSON.stringify(currentItems));

    alert("Item Reported Successfully!");
    window.location.href = "dashboard.html";
}

function loadDashboard() {
  console.log("2. loadDashboard function called.");
  const container = document.getElementById("itemsContainer");
  const userDisplay = document.getElementById("welcomeUser");

  if (!container) {
    console.error("ERROR: Container not found in HTML!");
    return;
  }
  const currentUser = localStorage.getItem("currentUser") || "Student";

  console.log("3. Container found. Injecting items...");

  if (userDisplay) userDisplay.innerText = `Welcome, ${currentUser}`;

  container.innerHTML = "";
  
  let displayItems = JSON.parse(localStorage.getItem("lostItems"));

  if (!displayItems) {
    displayItems = db.items;
    localStorage.setItem("lostItems", JSON.stringify(db.items));
  }  

   displayItems.forEach((item) => {
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
  console.log("4. Injection complete.");
}

function claimItem(id) {
  alert(`Claim Request sent for Item ID: ${id}. Visit the security office.`);
}


function filterItems() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const cards = document.getElementsByClassName('item-card');

    for (let i = 0; i < cards.length; i++) {
        const title = cards[i].getElementsByTagName("h3")[0];
        const txtValue = title.textContent || title.innerText;
        
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM is fully loaded. Running script...");
  loadDashboard();
});

