const credentials = (window.CREDENTIALS || [])
  .filter((credential) => credential.include)
  .sort((a, b) => getCompletionTime(b.completed) - getCompletionTime(a.completed));
let activeCategory = "All";

const grid = document.querySelector("#credential-grid");
const filters = document.querySelector("#filters");
const skillCloud = document.querySelector("#skill-cloud");

function normalizeClassName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCompletionTime(dateText) {
  const timestamp = Date.parse(dateText);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getCategories() {
  return ["All", ...new Set(credentials.flatMap((credential) => credential.categories))];
}

function getSkills(items = credentials) {
  return [...new Set(items.flatMap((credential) => credential.skills))].sort((a, b) => a.localeCompare(b));
}

function renderStats() {
  document.querySelector("#credential-count").textContent = credentials.length;
  document.querySelector("#skill-count").textContent = getSkills().length;
  document.querySelector("#category-count").textContent = getCategories().length - 1;
}

function renderFilters() {
  filters.innerHTML = getCategories()
    .map((category) => {
      const isActive = category === activeCategory ? " active" : "";
      return `<button class="filter-button${isActive}" type="button" data-category="${category}">${category}</button>`;
    })
    .join("");
}

function renderCredentials() {
  const visibleCredentials =
    activeCategory === "All"
      ? credentials
      : credentials.filter((credential) => credential.categories.includes(activeCategory));

  grid.innerHTML = visibleCredentials
    .map((credential) => {
      const categories = credential.categories
        .map((category) => `<span class="category ${normalizeClassName(category)}">${category}</span>`)
        .join("");
      const featuredClass = credential.featured ? " featured" : "";
      const tags = credential.skills.map((skill) => `<span class="tag">${skill}</span>`).join("");
      const verifyLink = credential.verificationUrl
        ? `<a class="verify-link" href="${credential.verificationUrl}" target="_blank" rel="noopener">Verify credential</a>`
        : `<span class="verify-link">Add verification link</span>`;

      return `
        <article class="credential-card${featuredClass}">
          <div class="card-topline">
            <div class="category-list">${categories}</div>
            <span class="date">${credential.completed}</span>
          </div>
          <h3>${credential.title}</h3>
          <p class="issuer">${credential.issuer}</p>
          <div class="tags">${tags}</div>
          ${verifyLink}
        </article>
      `;
    })
    .join("");
}

function renderSkills() {
  skillCloud.innerHTML = getSkills()
    .map((skill) => `<span class="tag">${skill}</span>`)
    .join("");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  renderFilters();
  renderCredentials();
});

renderStats();
renderFilters();
renderCredentials();
renderSkills();
