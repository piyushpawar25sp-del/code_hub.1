// ===================================================
//  CODEHUB – app.js  (shared across all pages)
// ===================================================

// ---------- Theme ----------
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('themeIcon');
  if (body.dataset.theme === 'dark') {
    body.dataset.theme = 'light';
    if (icon) { icon.classList.replace('fa-sun', 'fa-moon'); }
    localStorage.setItem('ch-theme', 'light');
  } else {
    body.dataset.theme = 'dark';
    if (icon) { icon.classList.replace('fa-moon', 'fa-sun'); }
    localStorage.setItem('ch-theme', 'dark');
  }
}
(function applyTheme() {
  const saved = localStorage.getItem('ch-theme') || 'dark';
  document.body.dataset.theme = saved;
  const icon = document.getElementById('themeIcon');
  if (icon) { icon.className = saved === 'light' ? 'fas fa-moon' : 'fas fa-sun'; }
})();

// ---------- Ensure custom cursor persists ----------
function applyCustomCursor() {
  try {
    const cursorMain = "url('assets/cursor-small.svg') 4 4, auto";
    const pointer = "url('assets/cursor-small.svg') 4 4, pointer";
    document.documentElement.style.cursor = cursorMain;
    document.body.style.cursor = cursorMain;
    // Apply to interactive elements
    const interactive = document.querySelectorAll('a, button, input, textarea, select, .nav-link, .btn-primary, .btn-outline, .icon-btn, .dropdown-menu a');
    interactive.forEach(el => { el.style.cursor = pointer; });
  } catch (e) { /* ignore */ }
}
document.addEventListener('DOMContentLoaded', () => applyCustomCursor());
// Reapply when navigating or on mouseover of nav (handles dynamic dropdowns)
document.addEventListener('mouseover', (e) => { if (e.target && (e.target.closest('.navbar') || e.target.closest('.dropdown-menu'))) applyCustomCursor(); });

// ---------- Mobile Menu ----------
function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ---------- Search ----------
const searchIndex = [
  { label:'DMS – Database Management System', tag:'DMS', tagColor:'purple', url:'subject-dms.html' },
  { label:'CPP – C++ Programming',                  tag:'CPP', tagColor:'green',  url:'subject-cpp.html' },
  { label:'DSU – Data Structures',                  tag:'DSU', tagColor:'orange', url:'subject-dsu.html' },
  { label:'Relational Databases',        tag:'DMS', tagColor:'purple', url:'subject-dms.html' },
  { label:'SQL & Queries',               tag:'DMS', tagColor:'purple', url:'subject-dms.html' },
  { label:'Transactions & Indexing',     tag:'DMS', tagColor:'purple', url:'subject-dms.html' },
  { label:'Pointers & Arrays',     tag:'CPP', tagColor:'green',  url:'subject-cpp.html' },
  { label:'OOP Concepts',          tag:'CPP', tagColor:'green',  url:'subject-cpp.html' },
  { label:'File Handling',         tag:'CPP', tagColor:'green',  url:'subject-cpp.html' },
  { label:'Linked Lists',          tag:'DSU', tagColor:'orange', url:'subject-dsu.html' },
  { label:'Stacks & Queues',       tag:'DSU', tagColor:'orange', url:'subject-dsu.html' },
  { label:'Trees & Graphs',        tag:'DSU', tagColor:'orange', url:'subject-dsu.html' },
];

function handleSearch(e) {
  const val = e.target.value.trim().toLowerCase();
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;
  if (!val) { resultsEl.style.display = 'none'; return; }
  const matches = searchIndex.filter(x => x.label.toLowerCase().includes(val));
  if (!matches.length) { resultsEl.style.display = 'none'; return; }
  resultsEl.innerHTML = matches.slice(0, 8).map(m =>
    `<div class="search-result-item" onclick="location.href='${m.url}'">
       <span class="tag ${m.tagColor}">${m.tag}</span>
       ${m.label}
     </div>`
  ).join('');
  resultsEl.style.display = 'block';
}
document.addEventListener('click', (e) => {
  const sr = document.getElementById('searchResults');
  if (sr && !e.target.closest('.search-box')) sr.style.display = 'none';
});

// ---------- Toast ----------
function showToast(msg, type = 'success') {
  let tc = document.querySelector('.toast-container');
  if (!tc) { tc = document.createElement('div'); tc.className = 'toast-container'; document.body.appendChild(tc); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${msg}</span>`;
  tc.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; setTimeout(() => t.remove(), 400); }, 3200);
}

// ---------- LocalStorage helpers ----------
function getFiles(subject) {
  try { return JSON.parse(localStorage.getItem('ch-files-' + subject) || '[]'); } catch { return []; }
}
function saveFiles(subject, files) {
  localStorage.setItem('ch-files-' + subject, JSON.stringify(files));
}

// ---------- Update home page counts ----------
function updateHomeCounts() {
  ['dms','cpp','dsu'].forEach(sub => {
    const el = document.getElementById(sub + '-count');
    if (el) {
      const n = getFiles(sub).length;
      el.innerHTML = `<i class="fas fa-file-alt"></i> ${n} Material${n !== 1 ? 's' : ''}`;
    }
  });
}
if (document.getElementById('dms-count')) updateHomeCounts();

// ---------- Subject Page Logic ----------
const SUBJECT_META = {
  dms: { name: 'DMS', full: 'Database Management System', color: 'purple', icon: 'fa-project-diagram' },
  cpp: { name: 'CPP', full: 'C++ Programming',                  color: 'green',  icon: 'fa-code'            },
  dsu: { name: 'DSU', full: 'Data Structures',                  color: 'orange', icon: 'fa-database'         },
};

let currentSubject = null;
let currentFilter  = 'all';

function initSubjectPage(sub) {
  currentSubject = sub;
  const meta = SUBJECT_META[sub];
  document.title = `${meta.name} – CODEHUB`;

  // Hero styling
  const heroIcon = document.querySelector('.subject-hero-icon');
  const badge    = document.querySelector('.sub-badge');
  if (heroIcon) {
    heroIcon.className = `subject-hero-icon ${meta.color}-icon`;
    heroIcon.innerHTML = `<i class="fas ${meta.icon}"></i>`;
  }
  if (badge) {
    badge.className    = `sub-badge ${meta.color}-badge`;
    badge.textContent  = meta.name;
  }

  // Nav active
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.href && l.href.includes(sub)) l.classList.add('active');
  });

  // Upload area
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  if (dropZone) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault(); dropZone.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files);
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));
  }

  renderMaterials();
}

function handleFiles(fileList) {
  const files = getFiles(currentSubject);
  Array.from(fileList).forEach(f => {
    // Store metadata only (not actual file, as localStorage has limits)
    const entry = {
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      type: getFileType(f.name),
      date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      dataUrl: null
    };
    // Try to store small files as dataURL
    if (f.size < 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        entry.dataUrl = ev.target.result;
        const arr = getFiles(currentSubject);
        arr.push(entry);
        saveFiles(currentSubject, arr);
        renderMaterials();
        showToast(`"${f.name}" added successfully!`);
      };
      reader.readAsDataURL(f);
    } else {
      files.push(entry);
      showToast(`"${f.name}" linked (large files not stored locally).`, 'success');
    }
  });
  if (Array.from(fileList).some(f => f.size >= 5 * 1024 * 1024)) {
    saveFiles(currentSubject, files);
    renderMaterials();
  }
}

function getFileType(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext))                           return 'pdf';
  if (['cpp','c','h','py','js','java','ts'].includes(ext)) return 'cpp';
  if (['doc','docx','txt','md'].includes(ext))         return 'doc';
  if (['ppt','pptx'].includes(ext))                    return 'ppt';
  if (['png','jpg','jpeg','gif','svg','webp'].includes(ext)) return 'img';
  return 'other';
}

function getFileIconClass(type) {
  const map = { pdf:'fa-file-pdf', cpp:'fa-file-code', doc:'fa-file-word', ppt:'fa-file-powerpoint', img:'fa-file-image', other:'fa-file' };
  return map[type] || 'fa-file';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

function renderMaterials() {
  const container = document.getElementById('materialsList');
  const countEl   = document.getElementById('matCount');
  if (!container) return;
  let files = getFiles(currentSubject);
  if (currentFilter !== 'all') files = files.filter(f => f.type === currentFilter);
  const total = getFiles(currentSubject).length;
  if (countEl) countEl.textContent = `${total} file${total !== 1 ? 's' : ''}`;

  if (!files.length) {
    container.innerHTML = `<div class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>No materials yet. Upload files using the panel →</p>
    </div>`;
    return;
  }

  container.innerHTML = files.map(f => `
    <div class="material-item" id="item-${f.id}">
      <div class="file-icon ${f.type}">
        <i class="fas ${getFileIconClass(f.type)}"></i>
      </div>
      <div class="file-meta">
        <div class="file-name" title="${f.name}">${f.name}</div>
        <div class="file-info">${formatSize(f.size)} &nbsp;•&nbsp; ${f.date} &nbsp;•&nbsp; ${f.type.toUpperCase()}</div>
      </div>
      <div class="file-actions">
        ${f.dataUrl
          ? `<a href="${f.dataUrl}" download="${f.name}" class="icon-btn" title="Download"><i class="fas fa-download"></i></a>`
          : `<button class="icon-btn" title="Not available" disabled style="opacity:0.4"><i class="fas fa-download"></i></button>`
        }
        <button class="icon-btn delete" title="Delete" onclick="deleteFile('${f.id}')"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function deleteFile(id) {
  if (!confirm('Remove this file?')) return;
  const files = getFiles(currentSubject).filter(f => String(f.id) !== String(id));
  saveFiles(currentSubject, files);
  renderMaterials();
  showToast('File removed.', 'error');
}

function setFilter(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMaterials();
}

function triggerUpload() {
  document.getElementById('fileInput').click();
}
