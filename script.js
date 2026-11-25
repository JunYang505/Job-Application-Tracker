console.log("Hello, JavaScript!");

let n = 1;

const company = document.getElementById("company");
const position = document.getElementById("position");
const date = document.getElementById("date");
const link = document.getElementById("link");
const status1 = document.getElementById("status");
const addApplication = document.getElementById("addApplication");
const addBody = document.getElementById("addBody");
const sortStatus = document.getElementById("sortStatus");
const sortDate = document.getElementById("sortDate");

const storageKey = "internshipApplications";

const statusOrder = {
  Offer: 1,
  Interviewing: 2,
  Applied: 3,
  Rejected: 4
    /*
    <option>Applied</option>
    <option>Interviewing</option>
    <option>Offer</option>
    <option>Rejected</option>
    */
};

function addRow(application) {
  const row = addBody.insertRow();
  row.id = "row" + application.id;

  row.insertCell().textContent = application.company;
  row.insertCell().textContent = application.position;
  row.insertCell().textContent = application.date;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", application.link);
  linkElement.textContent = "Link";
  row.insertCell().appendChild(linkElement);

  row.insertCell().textContent = application.status1;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.id = "deleteBtn" + application.id;
  deleteBtn.textContent = "delete";
  row.insertCell().appendChild(deleteBtn);
}

function saveApplications() {
  const applications = Array.from(addBody.rows, function (row) {
    return {
      id: Number(row.id.slice("row".length)),
      company: row.cells[0].textContent,
      position: row.cells[1].textContent,
      date: row.cells[2].textContent,
      link: row.cells[3].querySelector("a").getAttribute("href"),
      status1: row.cells[4].textContent
    };
  });

  localStorage.setItem(storageKey, JSON.stringify(applications));
}

addApplication.addEventListener("click", function () {
  const application = {
    id: n,
    company: company.value,
    position: position.value,
    date: date.value,
    link: link.value,
    status1: status1.value
  };

  addRow(application);

  company.value = "";
  position.value = "";
  date.value = "";
  link.value = "";

  n++;
  saveApplications();
});

addBody.addEventListener("click", function (event) {
  const button = event.target.closest('button[id^="deleteBtn"]');

  if (button) {
    const number = button.id.slice("deleteBtn".length);
    document.getElementById("row" + number).remove();
    saveApplications();
  }
});

sortStatus.addEventListener("click", function () {
  const rows = Array.from(addBody.rows);

  rows.sort(function (a, b) {
    const statusA = a.cells[4].textContent.trim();
    const statusB = b.cells[4].textContent.trim();

    return statusOrder[statusA] - statusOrder[statusB];
  });

  addBody.append(...rows);
  saveApplications();
});

sortDate.addEventListener("click", function () {
  const rows = Array.from(addBody.rows);

  rows.sort(function (a, b) {
    const dateA = a.cells[2].textContent.trim();
    const dateB = b.cells[2].textContent.trim();

    return dateB.localeCompare(dateA);
  });

  addBody.append(...rows);
  saveApplications();
});

const savedApplications = JSON.parse(localStorage.getItem(storageKey) || "[]");

for (const application of savedApplications) {
  addRow(application);
  n = Math.max(n, application.id + 1);
}