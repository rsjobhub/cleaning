// Mock data - replace with your actual data source
let jobs = [
  { id: "JOB001", link: "https://example.com/job1", viewed: false },
  { id: "JOB002", link: "https://example.com/job2", viewed: true },
  { id: "JOB003", link: "https://example.com/job3", viewed: false },
  { id: "JOB004", link: "https://example.com/job4 ", viewed: true },
  { id: "JOB005", link: "https://example.com/job5", viewed: false },
  { id: "JOB006", link: "https://example.com/job5", viewed: false },
  { id: "JOB007", link: "https://example.com/job5", viewed: false },
  { id: "JOB0011", link: "https://example.com/job5", viewed: false },
  { id: "JOB008", link: "https://example.com/job5", viewed: false },
  { id: "JOB009", link: "https://example.com/job5", viewed: false },
  { id: "JOB010", link: "https://example.com/job5", viewed: false },
];

let deletedToday = 0;

// DOM Elements
const totalJobsElement = document.getElementById("totalJobs");
const deletedJobsElement = document.getElementById("deletedJobs");
const remainingJobsElement = document.getElementById("remainingJobs");
const jobsTableBody = document.getElementById("jobsTableBody");
const deleteSelectedButton = document.getElementById("deleteSelected");
const svgIcon = `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#071d29"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash-2"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                </svg>`;

// Update metrics
function updateMetrics() {
  totalJobsElement.textContent = jobs.length;
  deletedJobsElement.textContent = deletedToday;
  remainingJobsElement.textContent = jobs.length;
}

// Render jobs table
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
          <a href="${job.link}" target="_blank" onclick="markAsViewed('${job.id}')">${job.link}</a>
        </td>
        <td>
          <button onclick="deleteJob('${job.id}')" class="single-delete-button">${svgIcon}</button>
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
  let confirmDelete = confirm("Permanently delete data from Database, Are you sure?");
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
updateMetrics();
renderJobs();
