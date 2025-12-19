const form = document.getElementById("complaintForm");
const list = document.getElementById("complaintList");

const totalText = document.getElementById("total");
const pendingText = document.getElementById("pending");
const resolvedText = document.getElementById("resolved");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

/* SUBMIT */
form.addEventListener("submit", e => {
  e.preventDefault();

  const complaint = {
    id: "CMP" + Date.now(),
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    priority: document.getElementById("priority").value,
    description: document.getElementById("description").value,
    status: "Pending",
    createdAt: Date.now(),
    timeline: ["Submitted"]
  };

  complaints.push(complaint);
  form.reset();
  render();
});

/* UPDATE STATUS */
function updateStatus(index) {
  const c = complaints[index];

  if (c.status === "Pending") {
    c.status = "In Progress";
    c.timeline.push("In Progress");
  } else if (c.status === "In Progress") {
    c.status = "Resolved";
    c.timeline.push("Resolved");
  }

  render();
}

/* RENDER */
function render() {
  list.innerHTML = "";

  /* DASHBOARD (ALL DATA) */
  totalText.textContent = complaints.length;
  pendingText.textContent = complaints.filter(c => c.status !== "Resolved").length;
  resolvedText.textContent = complaints.filter(c => c.status === "Resolved").length;

  /* FILTERED LIST */
  complaints
    .filter(c =>
      (filterCategory.value === "All" || c.category === filterCategory.value) &&
      (c.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
       c.id.includes(searchInput.value))
    )
    .forEach((c, index) => {

      let delay = "";
      if (c.status === "Pending" && (Date.now() - c.createdAt) > 120000) {
        delay = " ⏱ Delayed";
      }

      let btn = "";
      if (document.getElementById("role").value === "Admin") {
        btn = `<button onclick="updateStatus(${index})">Update Status</button>`;
      }

      const li = document.createElement("li");
      li.className = c.priority.toLowerCase();

      li.innerHTML = `
        <strong>${c.id}</strong> - ${c.name}<br>
        Category: ${c.category} | Priority: ${c.priority}<br>
        Issue: ${c.description}<br>
        Status: <b>${c.status}${delay}</b><br>
        Timeline: ${c.timeline.join(" → ")}<br><br>
        ${btn}
      `;

      list.appendChild(li);
    });

  localStorage.setItem("complaints", JSON.stringify(complaints));
}

/* LIVE SEARCH */
searchInput.addEventListener("input", render);
filterCategory.addEventListener("change", render);

render();
