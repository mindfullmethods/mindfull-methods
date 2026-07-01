const courses = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering Professional",
    description: "Master structured prompting, evaluation workflows, and business-ready AI communication.",
    price: 14999,
    level: "Professional",
    duration: "6 weeks",
    progress: 82,
    enrollments: 1240,
    completion: 74,
    revenue: 18600000,
    modules: [
      {
        title: "Foundations of Prompt Systems",
        lessons: [
          { title: "AI workflow mindset", duration: "18 min", complete: true },
          { title: "Prompt patterns and constraints", duration: "26 min", complete: true },
          { title: "Evaluation rubrics", duration: "22 min", complete: false }
        ]
      },
      {
        title: "Professional Use Cases",
        lessons: [
          { title: "Research assistant prompts", duration: "20 min", complete: true },
          { title: "Customer support copilots", duration: "31 min", complete: false }
        ]
      }
    ]
  },
  {
    id: "llm-engineering",
    title: "Generative AI & LLM Engineering",
    description: "Build RAG systems, embeddings pipelines, model evaluation loops, and secure AI products.",
    price: 24999,
    level: "Advanced",
    duration: "10 weeks",
    progress: 46,
    enrollments: 880,
    completion: 58,
    revenue: 21999120,
    modules: [
      {
        title: "LLM Product Architecture",
        lessons: [
          { title: "LLM app anatomy", duration: "24 min", complete: true },
          { title: "Token, cost, and latency planning", duration: "28 min", complete: false }
        ]
      }
    ]
  },
  {
    id: "automation-engineering",
    title: "AI Automation Engineering",
    description: "Automate operations with agents, triggers, data connectors, and quality checks.",
    price: 19999,
    level: "Intermediate",
    duration: "8 weeks",
    progress: 28,
    enrollments: 960,
    completion: 51,
    revenue: 19199040,
    modules: [
      {
        title: "Automation Foundations",
        lessons: [
          { title: "Workflow decomposition", duration: "19 min", complete: true },
          { title: "No-code and API orchestration", duration: "34 min", complete: false }
        ]
      }
    ]
  },
  {
    id: "agentic-ai",
    title: "Agentic AI Engineer",
    description: "Design multi-step AI agents with tools, memory, planning, guardrails, and observability.",
    price: 29999,
    level: "Expert",
    duration: "12 weeks",
    progress: 12,
    enrollments: 540,
    completion: 39,
    revenue: 16199460,
    modules: [
      {
        title: "Agent Systems",
        lessons: [
          { title: "Agent loops and tools", duration: "27 min", complete: false },
          { title: "Human approval and safety", duration: "32 min", complete: false }
        ]
      }
    ]
  }
];

const assignments = [
  { title: "Prompt audit report", course: "Prompt Engineering Professional", due: "2026-06-12", status: "Due soon", grade: "Pending" },
  { title: "RAG architecture diagram", course: "Generative AI & LLM Engineering", due: "2026-06-18", status: "Open", grade: "Pending" },
  { title: "Automation capstone", course: "AI Automation Engineering", due: "2026-06-25", status: "Submitted", grade: "92%" }
];

const students = [
  { name: "Aarav Mehta", email: "aarav@example.com", progress: 82, status: "Active" },
  { name: "Nisha Rao", email: "nisha@example.com", progress: 64, status: "Active" },
  { name: "Kabir Shah", email: "kabir@example.com", progress: 18, status: "Suspended" },
  { name: "Mira Iyer", email: "mira@example.com", progress: 97, status: "Active" }
];

const certificates = [
  {
    id: "MM-AI-2401",
    student: "Aarav Mehta",
    course: "Prompt Engineering Professional",
    issued: "2026-06-04",
    score: "91%"
  }
];

const state = {
  role: "student",
  currentCourse: courses[0],
  selectedAnswer: null,
  quizScore: null
};

const titles = {
  dashboard: "Student Dashboard",
  courses: "AI Courses",
  learn: "Course Learning",
  quizzes: "Quiz Center",
  assignments: "Assignments",
  certificates: "Certificates",
  admin: "Admin Dashboard",
  instructor: "Instructor Workspace",
  verify: "Certificate Verification"
};

const $ = (selector) => document.querySelector(selector);
const formatINR = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

function metric(label, value, detail = "") {
  return `<article class="metric"><span class="muted">${label}</span><strong>${value}</strong>${detail ? `<small class="muted">${detail}</small>` : ""}</article>`;
}

function courseCard(course) {
  return `
    <article class="course-card">
      <div class="course-art">${course.title}</div>
      <div>
        <span class="badge">${course.level} · ${course.duration}</span>
        <h3>${course.title}</h3>
        <p class="muted">${course.description}</p>
      </div>
      <div class="progress" aria-label="${course.progress}% progress"><span style="width:${course.progress}%"></span></div>
      <div class="row-actions">
        <button class="primary-button" type="button" data-learn="${course.id}">Resume</button>
        <button class="ghost-button" type="button" data-pay="${course.id}">${formatINR(course.price)}</button>
      </div>
    </article>
  `;
}

function renderDashboard() {
  $("#dashboard").innerHTML = `
    <div class="grid cols-4">
      ${metric("Enrolled courses", "4", "Across professional AI tracks")}
      ${metric("Average progress", "57%", "3 lessons completed this week")}
      ${metric("Certificates earned", "1", "1 verification link live")}
      ${metric("Upcoming assignments", "2", "Next due June 12, 2026")}
    </div>
    <div class="grid cols-2">
      <article class="card">
        <h2>Continue learning</h2>
        ${courseCard(state.currentCourse)}
      </article>
      <article class="card">
        <h2>Recent activity</h2>
        <ul class="list">
          <li><span>Completed lesson: AI workflow mindset</span><span class="badge">Today</span></li>
          <li><span>Submitted Automation capstone</span><span class="badge">Graded 92%</span></li>
          <li><span>Certificate generated</span><span class="badge">MM-AI-2401</span></li>
          <li><span>Razorpay payment synced</span><span class="badge">Success</span></li>
        </ul>
      </article>
    </div>
  `;
}

function renderCourses() {
  $("#courses").innerHTML = `
    <div class="grid cols-4">
      ${courses.map(courseCard).join("")}
    </div>
  `;
}

function renderLearn() {
  const course = state.currentCourse;
  $("#learn").innerHTML = `
    <div class="grid cols-2">
      <article class="lesson-player">
        <div class="video-stage"><span>▶</span></div>
        <div class="lesson-body">
          <p class="eyebrow">Bunny Stream video</p>
          <h2>${course.modules[0].lessons[0].title}</h2>
          <p class="muted">Secure video playback area with resume-learning state, completion tracking, and downloadable notes.</p>
          <div class="row-actions">
            <button class="primary-button" type="button" id="completeLesson">Mark lesson complete</button>
            <button class="ghost-button" type="button" id="downloadNotes">Download notes</button>
          </div>
        </div>
      </article>
      <article class="card">
        <h2>${course.title}</h2>
        ${course.modules.map((module) => `
          <h3>${module.title}</h3>
          <ul class="list">
            ${module.lessons.map((lesson) => `
              <li>
                <span>${lesson.complete ? "✓" : "○"} ${lesson.title}<br><small class="muted">${lesson.duration}</small></span>
                <span class="badge">${lesson.complete ? "Complete" : "Open"}</span>
              </li>
            `).join("")}
          </ul>
        `).join("")}
      </article>
    </div>
  `;
}

function renderQuizzes() {
  const options = ["A reusable instruction pattern", "A payment gateway response", "A database migration", "A video hosting endpoint"];
  $("#quizzes").innerHTML = `
    <article class="card">
      <div class="row-actions" style="justify-content:space-between">
        <div>
          <p class="eyebrow">Timed auto-evaluation</p>
          <h2>Prompt Engineering Quiz</h2>
        </div>
        <span class="badge" id="timer">10:00</span>
      </div>
      <p>What is a prompt template?</p>
      <div class="grid">
        ${options.map((option, index) => `<button class="quiz-option ${state.selectedAnswer === index ? "is-selected" : ""}" type="button" data-answer="${index}">${option}</button>`).join("")}
      </div>
      <div class="row-actions" style="margin-top:16px">
        <button class="primary-button" type="button" id="submitQuiz">Submit quiz</button>
        ${state.quizScore ? `<span class="badge">Score: ${state.quizScore}</span>` : ""}
      </div>
    </article>
  `;
}

function renderAssignments() {
  $("#assignments").innerHTML = `
    <div class="grid cols-2">
      <article class="card">
        <h2>Submit assignment</h2>
        <label>PDF or ZIP upload<input type="file" accept=".pdf,.zip" /></label>
        <label>GitHub repository<input value="https://github.com/student/ai-capstone" /></label>
        <label>Project URL<input value="https://student-ai-demo.vercel.app" /></label>
        <button class="primary-button" type="button" id="submitAssignment">Submit project</button>
      </article>
      <article class="card">
        <h2>Assignment tracker</h2>
        <ul class="list">
          ${assignments.map((item) => `<li><span>${item.title}<br><small class="muted">${item.course} · Due ${item.due}</small></span><span class="badge">${item.status}</span></li>`).join("")}
        </ul>
      </article>
    </div>
  `;
}

function renderCertificates() {
  $("#certificates").innerHTML = certificates.map((certificate) => `
    <article class="card certificate">
      <p class="eyebrow">Certificate of completion</p>
      <h2>${certificate.course}</h2>
      <p>This certifies that <strong>${certificate.student}</strong> completed the course with a passing score of ${certificate.score}.</p>
      <div class="grid cols-2">
        <div>
          <p><strong>Certificate ID:</strong> ${certificate.id}</p>
          <p><strong>Issue date:</strong> ${certificate.issued}</p>
          <p><strong>Verification URL:</strong> /verify/${certificate.id}</p>
        </div>
        <div class="qr">QR</div>
      </div>
      <button class="primary-button" type="button" data-view-button="verify">Verify certificate</button>
    </article>
  `).join("");
}

function renderAdmin() {
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  $("#admin").innerHTML = `
    <div class="grid cols-4">
      ${metric("Total students", "3,620")}
      ${metric("Active students", "3,141")}
      ${metric("Revenue", formatINR(totalRevenue))}
      ${metric("Completion rate", "61%")}
    </div>
    <div class="grid cols-2">
      <article class="card">
        <h2>Course management</h2>
        <label>Title<input value="Agentic AI Engineer" /></label>
        <label>Description<textarea>Design tool-using AI agents with planning, memory, and guardrails.</textarea></label>
        <div class="grid cols-2">
          <label>Price<input value="29999" /></label>
          <label>Level<input value="Expert" /></label>
        </div>
        <div class="row-actions">
          <button class="primary-button" type="button" id="saveCourse">Save course</button>
          <button class="ghost-button" type="button">Delete</button>
        </div>
      </article>
      <article class="card">
        <h2>Student management</h2>
        ${students.map((student) => `<div class="table-row"><span>${student.name}<br><small class="muted">${student.email} · ${student.progress}% progress</small></span><span class="badge">${student.status}</span></div>`).join("")}
      </article>
    </div>
  `;
}

function renderInstructor() {
  $("#instructor").innerHTML = `
    <div class="grid cols-3">
      ${metric("Assigned courses", "2")}
      ${metric("Pending reviews", "18")}
      ${metric("Avg learner score", "84%")}
    </div>
    <div class="grid cols-2">
      <article class="card">
        <h2>Upload lesson</h2>
        <label>Course<select>${courses.map((course) => `<option>${course.title}</option>`).join("")}</select></label>
        <label>Lesson title<input value="Building reliable AI automations" /></label>
        <label>Bunny Stream URL<input value="https://iframe.mediadelivery.net/embed/demo" /></label>
        <button class="primary-button" type="button" id="uploadLesson">Publish lesson</button>
      </article>
      <article class="card">
        <h2>Review assignments</h2>
        <ul class="list">
          ${assignments.map((assignment) => `<li><span>${assignment.title}<br><small class="muted">${assignment.course}</small></span><button class="ghost-button" type="button">Grade</button></li>`).join("")}
        </ul>
      </article>
    </div>
  `;
}

function renderVerify() {
  const certificate = certificates[0];
  $("#verify").innerHTML = `
    <article class="card">
      <p class="eyebrow">/verify/${certificate.id}</p>
      <h2>Certificate verified</h2>
      <p><strong>${certificate.student}</strong> completed <strong>${certificate.course}</strong> on ${certificate.issued}.</p>
      <div class="grid cols-3">
        ${metric("Certificate ID", certificate.id)}
        ${metric("Passing score", certificate.score)}
        ${metric("Status", "Valid")}
      </div>
    </article>
  `;
}

function renderAll() {
  renderDashboard();
  renderCourses();
  renderLearn();
  renderQuizzes();
  renderAssignments();
  renderCertificates();
  renderAdmin();
  renderInstructor();
  renderVerify();
}

function navigate(view) {
  const cleanView = view.startsWith("verify") ? "verify" : view;
  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("is-visible", section.id === cleanView));
  document.querySelectorAll("[data-view-link]").forEach((link) => link.classList.toggle("active", link.dataset.viewLink === cleanView));
  $("#pageTitle").textContent = titles[cleanView] || titles.dashboard;
  location.hash = view;
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-open-auth]")) {
    $("#authPanel").hidden = !$("#authPanel").hidden;
  }

  if (target.dataset.viewButton) {
    navigate(target.dataset.viewButton);
  }

  if (target.dataset.learn) {
    state.currentCourse = courses.find((course) => course.id === target.dataset.learn) || courses[0];
    renderLearn();
    navigate("learn");
  }

  if (target.dataset.pay) {
    const course = courses.find((item) => item.id === target.dataset.pay);
    showToast(`Razorpay checkout prepared for ${course.title}.`);
  }

  if (target.dataset.answer) {
    state.selectedAnswer = Number(target.dataset.answer);
    renderQuizzes();
  }

  if (target.id === "submitQuiz") {
    state.quizScore = state.selectedAnswer === 0 ? "100%" : "0%";
    renderQuizzes();
    showToast("Quiz evaluated automatically.");
  }

  if (target.id === "completeLesson") {
    state.currentCourse.progress = Math.min(100, state.currentCourse.progress + 4);
    state.currentCourse.modules[0].lessons[0].complete = true;
    renderAll();
    navigate("learn");
    showToast("Lesson marked complete and progress updated.");
  }

  if (["downloadNotes", "submitAssignment", "saveCourse", "uploadLesson", "forgotPassword", "googleLogin"].includes(target.id)) {
    const messages = {
      downloadNotes: "Notes download started.",
      submitAssignment: "Assignment submitted for instructor review.",
      saveCourse: "Course saved in admin draft state.",
      uploadLesson: "Lesson published to the assigned course.",
      forgotPassword: "Password reset email queued.",
      googleLogin: "Google sign-in handoff ready."
    };
    showToast(messages[target.id]);
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Logged in with Supabase email auth demo state.");
  $("#authPanel").hidden = true;
});

$("#themeToggle").addEventListener("click", () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
});

$("#roleSelect").addEventListener("change", (event) => {
  state.role = event.target.value;
  const roleViews = { student: "dashboard", instructor: "instructor", admin: "admin" };
  navigate(roleViews[state.role]);
});

window.addEventListener("hashchange", () => navigate(location.hash.replace("#", "") || "dashboard"));

renderAll();
navigate(location.hash.replace("#", "") || "dashboard");
