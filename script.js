console.log("Hello, JavaScript!");

const company = document.getElementById("company");
const position = document.getElementById("position");
const date = document.getElementById("date");
const link = document.getElementById("link");
const status1 = document.getElementById("status");
const addApplication = document.getElementById("addApplication");
const addBody = document.getElementById("addBody");

const storageKey = "internshipApplications";

let applications = JSON.parse(localStorage.getItem(storageKey) || "[]"); //fetch old data or create a new array

const statusOrder = {// encode the status for ranking
    Offer: 1,
    Interviewing: 2,
    Applied: 3,
    Rejected: 4,
};

function escapeHTML(value) {//prevent user type in html codes
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function render() {
    applications = JSON.parse(localStorage.getItem(storageKey) || "[]");

    addBody.innerHTML = "";

    for (const application of applications) {
        const row = `
            <tr id="row${application.id}">
                <td>${escapeHTML(application.company)}</td>
                <td>${escapeHTML(application.position)}</td>
                <td>${escapeHTML(application.date)}</td>
                <td>${escapeHTML(application.link)}</td>
                <td>${escapeHTML(application.status1)}</td>
                <td><button type="button" id="deleteBtn${application.id}">delete</button></td>
            </tr>
        `;

        addBody.innerHTML += row;
    }
}

addApplication.addEventListener("click", function () {
    const application = {
        id: Math.max(0, ...applications.map(item => item.id)) + 1, //get the largest id + 1 to prevent repeated id
        company: company.value,
        position: position.value,
        date: date.value,
        link: link.value,
        status1: status1.value
    };

    applications.push(application);

    localStorage.setItem(storageKey, JSON.stringify(applications));

    render();

    company.value = "";
    position.value = "";
    date.value = "";
    link.value = "";
});

addBody.addEventListener("click", function (event) {
    const button = event.target.closest('button[id^="deleteBtn"]');

    if (button) {
        const number = button.id.slice("deleteBtn".length);

        document.getElementById("row" + number).remove();

        applications = applications.filter(function (item) {
            return item.id !== Number(number);
        });

        localStorage.setItem(storageKey, JSON.stringify(applications));
    }
});


// Sort by status

sortStatus.addEventListener("click", function () {
    applications = JSON.parse(localStorage.getItem(storageKey) || "[]");

    applications.sort(function (a, b) {
        return statusOrder[a.status1] - statusOrder[b.status1];
    });

    localStorage.setItem(storageKey, JSON.stringify(applications));

    render();
});


// Sort by date

sortDate.addEventListener("click", function () {
    applications = JSON.parse(localStorage.getItem(storageKey) || "[]");

    applications.sort(function (a, b) {
        return b.date.localeCompare(a.date);
    });

    localStorage.setItem(storageKey, JSON.stringify(applications));

    render();
});


render();
