// Mock data - replace with your actual data source
let jobs = [
  { id: "JOB001", link: "https://example.com/job1", viewed: false },
  { id: "JOB002", link: "https://example.com/job2", viewed: true },
  { id: "JOB003", link: "https://example.com/job3", viewed: false },
  { id: "JOB004", link: "https://example.com/job4", viewed: true },
  { id: "JOB005", link: "https://example.com/job5", viewed: false },
];

let deletedToday = 0;

// DOM Elements
const totalJobsElement = document.getElementById("totalJobs");
const deletedJobsElement = document.getElementById("deletedJobs");
const viewedJobsElement = document.getElementById("viewedJobs");
const jobsTableBody = document.getElementById("jobsTableBody");
const deleteSelectedButton = document.getElementById("deleteSelected");

// Default metrics
function loadMatrics() {
  const viewedJobs = jobs.filter((job) => job.viewed).length;
  totalJobsElement.textContent = jobs.length;
  deletedJobsElement.textContent = deletedToday;
  viewedJobsElement.textContent = viewedJobs;
}

function updateViewedJobs() {
  const viewedJobs = jobs.filter((job) => job.viewed).length;
  viewedJobsElement.textContent = viewedJobs;
}
// Update metrics
function updateMetrics() {
  deletedJobsElement.textContent = deletedToday;
}

function renderJobs() {
  jobsTableBody.innerHTML = "";

  jobs.forEach((job) => {
    const row = document.createElement("tr");
    row.className = job.viewed ? "viewed" : "unviewed";

    row.innerHTML = `
      <td>
        <input type="checkbox" class="job-checkbox" data-job-id="${job.id}">
      </td>
      <td>${job.id}</td>
      <td>
        <a href="${job.link}" target="_blank" onclick="markAsViewed('${
      job.id
    }')">${job.link}</a>
      </td>
      <td>
        <span class="status-indicator ${job.viewed ? "viewed" : "unviewed"}">
          ${job.viewed ? "Viewed" : "New"}
        </span>
      </td>
      <td>
        <button onclick="deleteJob('${
          job.id
        }')" class="delete-button">Delete</button>
      </td>
    `;

    jobsTableBody.appendChild(row);
  });

  updateDeleteButtonState();
}

// Mark job as viewed
function markAsViewed(jobId) {
  const job = jobs.find((j) => j.id === jobId);
  if (job) {
    job.viewed = true;
    renderJobs();
    updateMetrics();
    updateViewedJobs();
  }
}

// Delete single job
function deleteJob(jobId) {
  jobs = jobs.filter((job) => job.id !== jobId);
  deletedToday++;
  updateMetrics();
  renderJobs();
}

// Delete selected jobs
function deleteSelectedJobs() {
  let confirmDelete = confirm(
    "Permanently delete data from Database, Are you sure?"
  );
  if (confirmDelete) {
    const selectedCheckboxes = document.querySelectorAll(
      ".job-checkbox:checked"
    );
    const selectedIds = Array.from(selectedCheckboxes).map(
      (checkbox) => checkbox.dataset.jobId
    );

    jobs = jobs.filter((job) => !selectedIds.includes(job.id));
    deletedToday += selectedIds.length;

    updateMetrics();
    renderJobs();
  } else {
    return false;
  }
}

// Update delete button state
function updateDeleteButtonState() {
  const selectedCheckboxes = document.querySelectorAll(".job-checkbox:checked");
  deleteSelectedButton.disabled = selectedCheckboxes.length === 0;
}

deleteSelectedButton.addEventListener("click", deleteSelectedJobs);

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("job-checkbox")) {
    updateDeleteButtonState();
  }
});

// Initial render
loadMatrics();
renderJobs();
