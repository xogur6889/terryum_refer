const papers = [
  {
    id: "01",
    title: "Sparse Tool Routing for Long-Horizon Agents",
    authors: "Mira Chen, Omar Patel, Jun Seo",
    date: "May 2026",
    summary:
      "A controller learns when to call retrieval, code execution, and verification tools instead of treating every step as a language-only decision. The result is lower token use with stronger performance on planning-heavy tasks.",
    tags: ["Agents", "Tool Use", "Efficiency"],
    readTime: "7 min read",
    signal: "Best for agent builders reducing tool-call cost.",
    whyItMatters:
      "Shows a concrete route to making multi-step agents cheaper without flattening every decision into one prompt.",
  },
  {
    id: "02",
    title: "Embodied Memory Maps for Household Manipulation",
    authors: "Ari Watanabe, Laila Novak, Chris Bell",
    date: "April 2026",
    summary:
      "The paper connects visual scene memory with tactile checkpoints, giving a mobile manipulator a compact way to recover from partial observability and small physical disturbances.",
    tags: ["Robotics", "Memory", "Manipulation"],
    readTime: "6 min read",
    signal: "Useful if your model must recover from messy real-world state.",
    whyItMatters:
      "Connects perception and action memory in a way that can make physical agents less brittle between steps.",
  },
  {
    id: "03",
    title: "Preference Models That Explain Their Tradeoffs",
    authors: "Nadia Flores, Kenji Rao",
    date: "April 2026",
    summary:
      "Instead of producing a single hidden reward score, the model decomposes preferences into criteria that can be inspected, challenged, and tuned by the user before deployment.",
    tags: ["Alignment", "UX", "Evaluation"],
    readTime: "5 min read",
    signal: "A practical pattern for interpretable preference tuning.",
    whyItMatters:
      "Turns preference modeling into something teams can inspect and negotiate before it becomes product behavior.",
  },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function createPaperCard(paper) {
  const article = document.createElement("article");
  article.className = "paper-card";

  const tagMarkup = paper.tags
    .map((tag) => `<li><span>${escapeHtml(tag)}</span></li>`)
    .join("");

  article.innerHTML = `
    <div class="paper-index" aria-hidden="true">${escapeHtml(paper.id)}</div>
    <div>
      <div class="paper-meta">
        <span>${escapeHtml(paper.authors)}</span>
        <span>${escapeHtml(paper.date)}</span>
      </div>
      <h3>${escapeHtml(paper.title)}</h3>
      <p class="paper-summary">${escapeHtml(paper.summary)}</p>
      <div class="paper-insight">
        <span>Signal</span>
        <p>${escapeHtml(paper.signal)}</p>
      </div>
      <p class="paper-impact">${escapeHtml(paper.whyItMatters)}</p>
      <ul class="tag-list" aria-label="Paper topics">
        ${tagMarkup}
      </ul>
    </div>
    <footer>
      <span>${escapeHtml(paper.readTime)}</span>
      <span class="read-arrow" aria-hidden="true">-></span>
    </footer>
  `;

  return article;
}

function renderPapers() {
  const list = document.querySelector("#paper-list");
  const fragment = document.createDocumentFragment();
  papers.forEach((paper) => fragment.appendChild(createPaperCard(paper)));
  list.appendChild(fragment);
}

let signalFrameId;

function drawSignalMap() {
  const canvas = document.querySelector("#signal-canvas");
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cancelAnimationFrame(signalFrameId);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const width = rect.width;
  const height = rect.height;
  const nodes = Array.from({ length: 34 }, (_, index) => {
    const angle = index * 0.82;
    const radius = 38 + (index % 9) * 24;
    return {
      x: width * 0.5 + Math.cos(angle) * radius + ((index * 37) % 80) - 40,
      y: height * 0.46 + Math.sin(angle) * radius + ((index * 29) % 60) - 30,
      size: 2 + (index % 5) * 0.65,
    };
  });

  let frame = 0;

  function paint() {
    frame += 0.012;
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(15, 118, 110, 0.18)");
    gradient.addColorStop(0.58, "rgba(228, 95, 69, 0.12)");
    gradient.addColorStop(1, "rgba(185, 121, 16, 0.16)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 1;
    nodes.forEach((node, index) => {
      const next = nodes[(index + 5) % nodes.length];
      const pulse = Math.sin(frame + index * 0.23) * 10;
      context.strokeStyle = "rgba(17, 20, 23, 0.08)";
      context.beginPath();
      context.moveTo(node.x, node.y + pulse);
      context.lineTo(next.x, next.y - pulse);
      context.stroke();
    });

    nodes.forEach((node, index) => {
      const pulse = Math.sin(frame * 2 + index) * 0.8;
      context.beginPath();
      context.fillStyle = index % 3 === 0 ? "#e45f45" : "#0f766e";
      context.arc(node.x, node.y + pulse * 6, node.size + pulse, 0, Math.PI * 2);
      context.fill();
    });

    if (shouldAnimate) {
      signalFrameId = requestAnimationFrame(paint);
    }
  }

  paint();
}

document.querySelector(".briefing-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Saved";
  setTimeout(() => {
    button.textContent = "Notify me";
  }, 1800);
});

renderPapers();
drawSignalMap();
window.addEventListener("resize", drawSignalMap, { passive: true });
