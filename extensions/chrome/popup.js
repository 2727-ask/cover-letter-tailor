document.addEventListener('DOMContentLoaded', function () {
    const CONSTANTS = {
        jobberService: "http://localhost:4000",
        cLEndpoint: "/generateCL",
        skillEndpoint: "/generateSkills",
        health: "/health"
    };

    const clURL = CONSTANTS.jobberService + CONSTANTS.cLEndpoint;
    const skillURL = CONSTANTS.jobberService + CONSTANTS.skillEndpoint;
    const HEALTH_CHECK_URL = CONSTANTS.jobberService + CONSTANTS.health;

    console.log("DOM Content Loaded");

    const healthIndicator = document.getElementById('healthIndicator');
    const healthStatus = document.getElementById('healthStatus');
    const companyNameElement = document.getElementById('company');
    const jobTitleElement = document.getElementById('jobTitle');
    const jobDescriptionElement = document.getElementById('jobDescription');
    const generateButton = document.getElementById('generateButton');
    const generateSkillButton = document.getElementById('generateSkillButton');

    const setContent = (key, element, defaultText) => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] && element) {
                element.textContent = data[key];
            } else if (element) {
                element.textContent = defaultText;
            }
        });
    };

    setContent("companyName", companyNameElement, "No company name saved yet.");
    setContent("jobTitle", jobTitleElement, "No job title saved yet.");
    setContent("jobDescription", jobDescriptionElement, "No description saved yet.");

    const makePostRequest = (url, payload) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data);
            })
            .catch(error => {
                console.error("Error while making POST request:", error);
            });
    };

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            console.log("Generate Cover Letter button clicked");
            const payload = {
                companyName: companyNameElement?.textContent || "",
                jobTitle: jobTitleElement?.textContent || "",
                jd: jobDescriptionElement?.textContent || ""
            };
            makePostRequest(clURL, payload);
        });
    }

    if (generateSkillButton) {
        generateSkillButton.addEventListener('click', () => {
            console.log("Generate Skills button clicked");
            const payload = {
                companyName: companyNameElement?.textContent || "",
                jobTitle: jobTitleElement?.textContent || "",
                jd: jobDescriptionElement?.textContent || ""
            };
            makePostRequest(skillURL, payload);
        });
    }

    const checkServerHealth = () => {
        fetch(HEALTH_CHECK_URL)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success" && data.message === "Server is healthy") {
                    if (healthIndicator) {
                        healthIndicator.style.backgroundColor = "green";
                        healthIndicator.title = "Server is healthy";
                    }
                    if (healthStatus) {
                        healthStatus.innerHTML = "<p>Server is healthy</p>";
                    }
                } else {
                    if (healthIndicator) {
                        healthIndicator.style.backgroundColor = "red";
                        healthIndicator.title = "Server is not healthy";
                    }
                    if (healthStatus) {
                        healthStatus.innerHTML = "<p>Server is not healthy</p>";
                    }
                }
            })
            .catch(error => {
                console.error("Health check failed:", error);
                if (healthIndicator) {
                    healthIndicator.style.backgroundColor = "red";
                    healthIndicator.title = "Server health check failed";
                }
                if (healthStatus) {
                    healthStatus.innerHTML = "<p>Server health check failed</p>";
                }
            });
    };

    checkServerHealth();
});
