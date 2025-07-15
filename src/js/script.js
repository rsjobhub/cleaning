  // Mock data with categories
      let allJobs = {
        all: [
          {
            id: "JOB001",
            link: "https://example.com/job1",
            viewed: false,
            category: "all"
          },
          {
            id: "JOB002",
            link: "https://example.com/job2",
            viewed: true,
            category: "all"
          },
          {
            id: "JOB003",
            link: "https://example.com/job3",
            viewed: false,
            category: "all"
          },
          {
            id: "JOB004",
            link: "https://example.com/job4",
            viewed: true,
            category: "all"
          },
          {
            id: "JOB005",
            link: "https://example.com/job5",
            viewed: false,
            category: "all"
          }
        ],
        "remote-uk": [
          {
            id: "RUK001",
            link: "https://example.com/remote-uk1",
            viewed: false,
            category: "remote-uk"
          },
          {
            id: "RUK002",
            link: "https://example.com/remote-uk2",
            viewed: true,
            category: "remote-uk"
          },
          {
            id: "RUK003",
            link: "https://example.com/remote-uk3",
            viewed: false,
            category: "remote-uk"
          }
        ],
        "remote-us": [
          {
            id: "RUS001",
            link: "https://example.com/remote-us1",
            viewed: false,
            category: "remote-us"
          },
          {
            id: "RUS002",
            link: "https://example.com/remote-us2",
            viewed: true,
            category: "remote-us"
          },
          {
            id: "RUS003",
            link: "https://example.com/remote-us3",
            viewed: false,
            category: "remote-us"
          },
          {
            id: "RUS004",
            link: "https://example.com/remote-us4",
            viewed: true,
            category: "remote-us"
          }
        ],
        "sponsored-uk": [
          {
            id: "SUK001",
            link: "https://example.com/sponsored-uk1",
            viewed: false,
            category: "sponsored-uk"
          },
          {
            id: "SUK002",
            link: "https://example.com/sponsored-uk2",
            viewed: true,
            category: "sponsored-uk"
          }
        ],
        "sponsored-us": [
          {
            id: "SUS001",
            link: "https://example.com/sponsored-us1",
            viewed: false,
            category: "sponsored-us"
          },
          {
            id: "SUS002",
            link: "https://example.com/sponsored-us2",
            viewed: true,
            category: "sponsored-us"
          },
          {
            id: "SUS003",
            link: "https://example.com/sponsored-us3",
            viewed: false,
            category: "sponsored-us"
          }
        ]
      };

      let deletedToday = 0;
      let currentFilter = "all";

      // DOM Elements
      const totalJobsElement = document.getElementById("totalJobs");
      const viewedJobsElement = document.getElementById("viewedJobs");
      const deleteSelectedButton = document.getElementById("deleteSelected");
      const jobFilter = document.getElementById("jobFilter");
      const tableTitle = document.getElementById("tableTitle");

      // Filter titles mapping
      const filterTitles = {
        all: "All Jobs Overview",
        "remote-uk": "Remote UK Jobs",
        "remote-us": "Remote US Jobs",
        "sponsored-uk": "Sponsored UK Jobs",
        "sponsored-us": "Sponsored US Jobs"
      };

      // Load metrics
      function loadMetrics() {
        const currentJobs = allJobs[currentFilter];
        const viewedJobs = currentJobs.filter((job) => job.viewed).length;
        totalJobsElement.textContent = currentJobs.length;
        viewedJobsElement.textContent = viewedJobs;
        tableTitle.textContent = filterTitles[currentFilter];
      }

      function updateViewedJobs() {
        const currentJobs = allJobs[currentFilter];
        const viewedJobs = currentJobs.filter((job) => job.viewed).length;
        viewedJobsElement.textContent = viewedJobs;
      }

      // Hide all tbody elements
      function hideAllTbodies() {
        const tbodies = document.querySelectorAll("tbody");
        tbodies.forEach((tbody) => {
          tbody.style.display = "none";
        });
      }

      // Show specific tbody
      function showTbody(category) {
        const targetTbody = document.getElementById(
          category === "all" ? "alljobs" : category
        );
        if (targetTbody) {
          targetTbody.style.display = "table-row-group";
        }
      }

      // Render jobs for specific category
      function renderJobs(category = "all") {
        const targetTbodyId = category === "all" ? "alljobs" : category;
        const targetTbody = document.getElementById(targetTbodyId);

        if (!targetTbody) return;

        targetTbody.innerHTML = "";
        const jobs = allJobs[category] || [];

        jobs.forEach((job) => {
          const row = document.createElement("tr");
          row.className = job.viewed ? "viewed" : "unviewed";

          row.innerHTML = `
            <td>
              <input type="checkbox" class="job-checkbox" data-job-id="${job.id}" data-category="${category}">
            </td>
            <td>${job.id}</td>
            <td>
              <a href="${job.link}" target="_blank" onclick="markAsViewed('${job.id}', '${category}')">${job.link}</a>
            </td>
            <td>
              <button onclick="deleteJob('${job.id}', '${category}')" class="delete-button">Delete</button>
            </td>
          `;

          targetTbody.appendChild(row);
        });

        updateDeleteButtonState();
      }

      // Mark job as viewed
      function markAsViewed(jobId, category) {
        const job = allJobs[category].find((j) => j.id === jobId);
        if (job) {
          job.viewed = true;
          renderJobs(category);
          if (category === currentFilter) {
            updateViewedJobs();
          }
        }
      }

      // Delete single job
      function deleteJob(jobId, category) {
        if (confirm("Are you sure you want to delete this job?")) {
          allJobs[category] = allJobs[category].filter(
            (job) => job.id !== jobId
          );
          deletedToday++;
          renderJobs(category);
          if (category === currentFilter) {
            loadMetrics();
          }
        }
      }

      // Delete selected jobs
      function deleteSelectedJobs() {
        const confirmDelete = confirm(
          "Permanently delete data from Database, Are you sure?"
        );
        if (confirmDelete) {
          const selectedCheckboxes = document.querySelectorAll(
            ".job-checkbox:checked"
          );

          selectedCheckboxes.forEach((checkbox) => {
            const jobId = checkbox.dataset.jobId;
            const category = checkbox.dataset.category;
            allJobs[category] = allJobs[category].filter(
              (job) => job.id !== jobId
            );
            deletedToday++;
          });

          renderJobs(currentFilter);
          loadMetrics();
        }
      }

      // Update delete button state
      function updateDeleteButtonState() {
        const selectedCheckboxes = document.querySelectorAll(
          ".job-checkbox:checked"
        );
        deleteSelectedButton.disabled = selectedCheckboxes.length === 0;
      }

      // Handle filter change
      function handleFilterChange() {
        const selectedFilter = jobFilter.value;
        currentFilter = selectedFilter;

        // Hide all tbody elements
        hideAllTbodies();

        // Show the selected tbody
        showTbody(selectedFilter);

        // Render jobs for the selected category
        renderJobs(selectedFilter);

        // Update metrics
        loadMetrics();
      }

      // Event listeners
      deleteSelectedButton.addEventListener("click", deleteSelectedJobs);
      jobFilter.addEventListener("change", handleFilterChange);

      document.addEventListener("change", (e) => {
        if (e.target.classList.contains("job-checkbox")) {
          updateDeleteButtonState();
        }
      });

      // Initial render
      function initializeApp() {
        // Render all categories
        Object.keys(allJobs).forEach((category) => {
          renderJobs(category);
        });

        // Show default view
        hideAllTbodies();
        showTbody("all");

        // Load metrics
        loadMetrics();
      }

      // Initialize the app
      initializeApp();