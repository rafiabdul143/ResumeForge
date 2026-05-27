/* ========================================
   ResumeForge — app.js
   ======================================== */

let currentStep = 1;
const TOTAL_STEPS = 8;

// STEP NAVIGATION
function goToStep(n) {
    document.querySelector(`#step${currentStep}`).classList.remove('active');
    document.querySelector(`.step-pill[data-step="${currentStep}"]`).classList.remove('active');
    if (currentStep < n) {
        document.querySelector(`.step-pill[data-step="${currentStep}"]`).classList.add('completed');
    }
    currentStep = n;
    document.querySelector(`#step${currentStep}`).classList.add('active');
    document.querySelector(`.step-pill[data-step="${currentStep}"]`).classList.add('active');
    document.getElementById('progressBar').style.width = `${(currentStep / TOTAL_STEPS) * 100}%`;
    document.getElementById('btnBack').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('btnNext').textContent = currentStep === TOTAL_STEPS - 1 ? 'Preview Resume →' : 'Continue →';
    if (currentStep === TOTAL_STEPS) {
        document.getElementById('btnNext').style.display = 'none';
        buildPreview();
    } else {
        document.getElementById('btnNext').style.display = 'block';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() { if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1); }
function prevStep() { if (currentStep > 1) goToStep(currentStep - 1); }

document.querySelectorAll('.step-pill').forEach(pill => {
    pill.addEventListener('click', () => goToStep(parseInt(pill.dataset.step)));
});

document.getElementById('summary').addEventListener('input', function () {
    document.getElementById('summaryCount').textContent = this.value.length;
});

// EXPERIENCE
let expCount = 0;
function addExperience() {
    expCount++;
    const id = `exp${expCount}`;
    const html = `
    <div class="repeatable-card" id="${id}">
      <div class="card-header-row">
        <span class="card-label">Experience #${expCount}</span>
        <button class="btn-remove" onclick="removeCard('${id}')">✕ Remove</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Company / Organization</label>
          <input type="text" id="${id}_company" placeholder="e.g. Quadrant Technologies" />
        </div>
        <div class="field">
          <label>Job Title</label>
          <input type="text" id="${id}_role" placeholder="e.g. Software Engineer" />
        </div>
        <div class="field">
          <label>Start Date</label>
          <input type="text" id="${id}_start" placeholder="e.g. Feb 2025" />
        </div>
        <div class="field">
          <label>End Date</label>
          <input type="text" id="${id}_end" placeholder="e.g. Present" />
        </div>
        <div class="field full">
          <label>Key Responsibilities & Achievements</label>
          <p class="bullets-hint">Enter each bullet point on a new line. Start with action verbs.</p>
          <textarea id="${id}_bullets" rows="5" placeholder="• Provided technical support for Power BI workloads&#10;• Resolved issues related to data ingestion&#10;• Collaborated with engineering teams"></textarea>
        </div>
      </div>
    </div>`;
    document.getElementById('experienceList').insertAdjacentHTML('beforeend', html);
}

// EDUCATION
let eduCount = 0;
function addEducation() {
    eduCount++;
    const id = `edu${eduCount}`;
    const html = `
    <div class="repeatable-card" id="${id}">
      <div class="card-header-row">
        <span class="card-label">Education #${eduCount}</span>
        <button class="btn-remove" onclick="removeCard('${id}')">✕ Remove</button>
      </div>
      <div class="form-grid">
        <div class="field full">
          <label>Institution Name</label>
          <input type="text" id="${id}_inst" placeholder="e.g. Kakatiya Institute of Technology" />
        </div>
        <div class="field">
          <label>Degree</label>
          <input type="text" id="${id}_degree" placeholder="e.g. Bachelor of Technology" />
        </div>
        <div class="field">
          <label>Field of Study</label>
          <input type="text" id="${id}_field" placeholder="e.g. Information Technology" />
        </div>
        <div class="field">
          <label>Start Year</label>
          <input type="text" id="${id}_start" placeholder="e.g. 2020" />
        </div>
        <div class="field">
          <label>End Year</label>
          <input type="text" id="${id}_end" placeholder="e.g. 2023" />
        </div>
        <div class="field">
          <label>GPA / CGPA (optional)</label>
          <input type="text" id="${id}_gpa" placeholder="e.g. 6.88 / 10" />
        </div>
      </div>
    </div>`;
    document.getElementById('educationList').insertAdjacentHTML('beforeend', html);
}

// SKILLS
let skillCount = 0;
const defaultSkillCategories = [
    { cat: 'Cloud Platforms', vals: 'Microsoft Azure, Microsoft Fabric' },
    { cat: 'Data Engineering', vals: 'Data Pipelines, Lakehouses, Dataflows Gen2, ETL/ELT' },
    { cat: 'Analytics & BI', vals: 'Power BI Desktop, Power BI Service, DAX, Power Query' },
    { cat: 'Programming Languages', vals: 'Java, Python, SQL' },
];

function addSkillCategory(cat = '', vals = '') {
    skillCount++;
    const id = `skill${skillCount}`;
    const html = `
    <div class="repeatable-card" id="${id}">
      <div class="card-header-row">
        <span class="card-label">Skill Category</span>
        <button class="btn-remove" onclick="removeCard('${id}')">✕ Remove</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Category Name</label>
          <input type="text" id="${id}_cat" placeholder="e.g. Cloud Platforms" value="${cat}" />
        </div>
        <div class="field">
          <label>Skills (comma separated)</label>
          <input type="text" id="${id}_vals" placeholder="e.g. AWS, Azure, GCP" value="${vals}" />
        </div>
      </div>
    </div>`;
    document.getElementById('skillsList').insertAdjacentHTML('beforeend', html);
}

// PROJECTS
let projCount = 0;
function addProject() {
    projCount++;
    const id = `proj${projCount}`;
    const html = `
    <div class="repeatable-card" id="${id}">
      <div class="card-header-row">
        <span class="card-label">Project #${projCount}</span>
        <button class="btn-remove" onclick="removeCard('${id}')">✕ Remove</button>
      </div>
      <div class="form-grid">
        <div class="field full">
          <div class="project-search-row">
            <div class="field" style="flex:1; gap:6px; display:flex; flex-direction:column;">
              <label>Project Name <span class="req">*</span></label>
              <input type="text" id="${id}_name" placeholder="e.g. Restaurant Recommendation System" />
            </div>
            <button class="btn-ai-search" onclick="aiSearchProject('${id}')">✦ AI Fill</button>
          </div>
          <p class="bullets-hint" style="margin-top:6px;">Don't know the details? Enter name and click <strong>AI Fill</strong>!</p>
        </div>
        <div class="field">
          <label>Technologies Used</label>
          <input type="text" id="${id}_tech" placeholder="e.g. Python, Flask, MySQL" />
        </div>
        <div class="field">
          <label>Duration / Year</label>
          <input type="text" id="${id}_duration" placeholder="e.g. Jan 2023 – Apr 2023" />
        </div>
        <div class="field full">
          <label>Project Description</label>
          <textarea id="${id}_desc" rows="4" placeholder="Describe what the project does, your role, and the impact..."></textarea>
          <span class="ai-fill-badge" id="${id}_aibadge" style="display:none;">✓ AI Filled</span>
        </div>
        <div class="field full">
          <label>GitHub / Live Link (optional)</label>
          <input type="url" id="${id}_link" placeholder="https://github.com/yourname/project" />
        </div>
      </div>
    </div>`;
    document.getElementById('projectsList').insertAdjacentHTML('beforeend', html);
}

// CERTIFICATIONS
let certCount = 0;
function addCert() {
    certCount++;
    const id = `cert${certCount}`;
    const html = `
    <div class="repeatable-card" id="${id}">
      <div class="card-header-row">
        <span class="card-label">Certification #${certCount}</span>
        <button class="btn-remove" onclick="removeCard('${id}')">✕ Remove</button>
      </div>
      <div class="form-grid">
        <div class="field full">
          <label>Certification Title</label>
          <input type="text" id="${id}_title" placeholder="e.g. Microsoft Certified: Fabric Analytics Engineer Associate (DP-600)" />
        </div>
        <div class="field">
          <label>Issuing Organization</label>
          <input type="text" id="${id}_org" placeholder="e.g. Microsoft" />
        </div>
        <div class="field">
          <label>Date Obtained</label>
          <input type="text" id="${id}_date" placeholder="e.g. 2024" />
        </div>
      </div>
    </div>`;
    document.getElementById('certsList').insertAdjacentHTML('beforeend', html);
}

// REMOVE CARD
function removeCard(id) {
    document.getElementById(id)?.remove();
}

// AI PROJECT SEARCH
async function aiSearchProject(id) {
    const projectName = document.getElementById(`${id}_name`)?.value?.trim();
    if (!projectName) {
        alert('Please enter a project name first!');
        return;
    }
    showAIOverlay(true);
    try {
        const response = await fetch('/api/ai/project-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectName })
        });
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        if (data.description) document.getElementById(`${id}_desc`).value = data.description;
        if (data.technologies && !document.getElementById(`${id}_tech`).value)
            document.getElementById(`${id}_tech`).value = data.technologies;
        const badge = document.getElementById(`${id}_aibadge`);
        if (badge) badge.style.display = 'inline-block';
    } catch (err) {
        console.error('AI search failed:', err);
        document.getElementById(`${id}_desc`).value =
            `Developed a ${projectName} to solve real-world problems using modern technologies. ` +
            `Implemented core features including data processing, user interface design, and backend logic. ` +
            `Optimized performance and ensured scalability for production deployment.`;
        const badge = document.getElementById(`${id}_aibadge`);
        if (badge) badge.style.display = 'inline-block';
    } finally {
        showAIOverlay(false);
    }
}

function showAIOverlay(show) {
    document.getElementById('aiOverlay').classList.toggle('show', show);
}

// DATA COLLECTORS
function getExperiences() {
    const results = [];
    document.querySelectorAll('[id^="exp"][id$="_company"]').forEach(el => {
        const base = el.id.replace('_company', '');
        const company = el.value.trim();
        if (!company) return;
        results.push({
            company,
            role: document.getElementById(`${base}_role`)?.value?.trim() || '',
            start: document.getElementById(`${base}_start`)?.value?.trim() || '',
            end: document.getElementById(`${base}_end`)?.value?.trim() || '',
            bullets: (document.getElementById(`${base}_bullets`)?.value || '')
                .split('\n').map(b => b.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
        });
    });
    return results;
}

function getEducations() {
    const results = [];
    document.querySelectorAll('[id^="edu"][id$="_inst"]').forEach(el => {
        const base = el.id.replace('_inst', '');
        const inst = el.value.trim();
        if (!inst) return;
        results.push({
            inst,
            degree: document.getElementById(`${base}_degree`)?.value?.trim() || '',
            field: document.getElementById(`${base}_field`)?.value?.trim() || '',
            start: document.getElementById(`${base}_start`)?.value?.trim() || '',
            end: document.getElementById(`${base}_end`)?.value?.trim() || '',
            gpa: document.getElementById(`${base}_gpa`)?.value?.trim() || ''
        });
    });
    return results;
}

function getSkills() {
    const results = [];
    document.querySelectorAll('[id^="skill"][id$="_cat"]').forEach(el => {
        const base = el.id.replace('_cat', '');
        const cat = el.value.trim();
        if (!cat) return;
        results.push({
            cat,
            vals: document.getElementById(`${base}_vals`)?.value?.trim() || ''
        });
    });
    return results;
}

function getProjects() {
    const results = [];
    document.querySelectorAll('[id^="proj"][id$="_name"]').forEach(el => {
        const base = el.id.replace('_name', '');
        const name = el.value.trim();
        if (!name) return;
        results.push({
            name,
            tech: document.getElementById(`${base}_tech`)?.value?.trim() || '',
            duration: document.getElementById(`${base}_duration`)?.value?.trim() || '',
            desc: document.getElementById(`${base}_desc`)?.value?.trim() || '',
            link: document.getElementById(`${base}_link`)?.value?.trim() || ''
        });
    });
    return results;
}

function getCerts() {
    const results = [];
    document.querySelectorAll('[id^="cert"][id$="_title"]').forEach(el => {
        const base = el.id.replace('_title', '');
        const title = el.value.trim();
        if (!title) return;
        results.push({
            title,
            org: document.getElementById(`${base}_org`)?.value?.trim() || '',
            date: document.getElementById(`${base}_date`)?.value?.trim() || ''
        });
    });
    return results;
}

// RESUME PREVIEW BUILDER
// RESUME PREVIEW BUILDER
function buildPreview() {

    const name = document.getElementById('fullName').value || 'Your Name';
    const jobTitle = document.getElementById('jobTitle').value || '';
    const location = document.getElementById('location').value || '';
    const phone = document.getElementById('phone').value || '';
    const email = document.getElementById('email').value || '';
    const linkedin = document.getElementById('linkedin').value || '';
    const github = document.getElementById('github').value || '';
    const summary = document.getElementById('summary').value || '';

    const experiences = getExperiences();
    const educations = getEducations();
    const skills = getSkills();
    const projects = getProjects();
    const certs = getCerts();

    let contactParts = [];

    if (location) contactParts.push(esc(location));

    if (phone) contactParts.push(esc(phone));

    if (email)
        contactParts.push(esc(email));

    if (linkedin)
        contactParts.push(
            esc(
                linkedin
                    .replace(/^https?:\/\//, '')
                    .replace('www.', '')
            )
        );

    if (github)
        contactParts.push(
            esc(
                github
                    .replace(/^https?:\/\//, '')
                    .replace('www.', '')
            )
        );

    let html = `
        <div class="rv-name">${esc(name)}</div>

        ${jobTitle
            ? `<div style="text-align:center;font-size:10pt;color:#111;margin-bottom:6px;">
                    ${esc(jobTitle)}
               </div>`
            : ''
        }

        <div class="rv-contact">
            ${contactParts.join(' &nbsp;|&nbsp; ')}
        </div>
    `;

    // SUMMARY
    if (summary) {
        html += `
            <div class="rv-section-title">
                Professional Summary
            </div>

            <p>
                ${esc(summary)}
            </p>
        `;
    }

    // EXPERIENCE
    if (experiences.length > 0) {

        html += `<div class="rv-section-title">Professional Experience</div>`;

        experiences.forEach(exp => {

            html += `
                <div class="rv-entry">

                    <div class="rv-entry-header">

                        <span class="rv-company">
                            ${esc(exp.company)}
                        </span>

                        <span class="rv-dates">
                            ${esc(exp.start)}
                            ${exp.end ? ' – ' + esc(exp.end) : ''}
                        </span>

                    </div>

                    <div class="rv-role">
                        ${esc(exp.role)}
                    </div>

                    ${exp.bullets.length > 0
                    ? `
                            <ul class="rv-bullets">
                                ${exp.bullets.map(b =>
                        `<li>${esc(b)}</li>`
                    ).join('')}
                            </ul>
                          `
                    : ''
                }

                </div>
            `;
        });
    }

    // EDUCATION
    if (educations.length > 0) {

        html += `<div class="rv-section-title">Education</div>`;

        educations.forEach(edu => {

            html += `
                <div class="rv-entry">

                    <div class="rv-entry-header">

                        <span class="rv-company">
                            ${esc(edu.inst)}
                        </span>

                        <span class="rv-dates">
                            ${esc(edu.start)}
                            ${edu.end ? ' – ' + esc(edu.end) : ''}
                        </span>

                    </div>

                    <div class="rv-degree">
                        ${esc(edu.degree)}
                        ${edu.field ? ', ' + esc(edu.field) : ''}
                    </div>

                    ${edu.gpa
                    ? `<div class="rv-cgpa">
                                CGPA: ${esc(edu.gpa)}
                           </div>`
                    : ''
                }

                </div>
            `;
        });
    }

    // SKILLS
    if (skills.length > 0) {

        html += `
            <div class="rv-section-title">
                Technical Skills
            </div>

            <div class="rv-skills-grid">
        `;

        skills.forEach(skill => {

            html += `
                <div class="rv-skill-row">

                    <span class="rv-skill-cat">
                        ${esc(skill.cat)}
                    </span>

                    <span class="rv-skill-vals">
                        ${esc(skill.vals)}
                    </span>

                </div>
            `;
        });

        html += `</div>`;
    }

    // PROJECTS
    if (projects.length > 0) {

        html += `<div class="rv-section-title">Projects</div>`;

        projects.forEach(proj => {

            html += `
                <div class="rv-entry">

                    <div class="rv-entry-header">

                        <span class="rv-project-name">
                            ${esc(proj.name)}
                        </span>

                        <span class="rv-dates">
                            ${esc(proj.duration)}
                        </span>

                    </div>

                    ${proj.tech
                    ? `
                            <div class="rv-project-tech">
                                Technologies: ${esc(proj.tech)}
                            </div>
                          `
                    : ''
                }

                    ${proj.desc
                    ? `
                            <div class="rv-project-desc">
                                ${esc(proj.desc)}
                            </div>
                          `
                    : ''
                }

                    ${proj.link
                    ? `
                            <div style="font-size:9.5pt;margin-top:2px;color:#111;">
                                ${esc(
                        proj.link
                            .replace(/^https?:\/\//, '')
                            .replace('www.', '')
                    )}
                            </div>
                          `
                    : ''
                }

                </div>
            `;
        });
    }

    // CERTIFICATIONS
    if (certs.length > 0) {

        html += `<div class="rv-section-title">Certifications</div>`;

        certs.forEach(cert => {

            html += `
                <div class="rv-cert-item">

                    ${esc(cert.title)}

                    ${cert.org ? ' — ' + esc(cert.org) : ''}

                    ${cert.date ? ' (' + esc(cert.date) + ')' : ''}

                </div>
            `;
        });
    }

    document.getElementById('resumePreview').innerHTML = html;
}

function esc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Initialize default cards on page load
window.addEventListener('DOMContentLoaded', () => {
    addExperience();
    addEducation();
    defaultSkillCategories.forEach(s => addSkillCategory(s.cat, s.vals));
    addProject();
    addCert();
});