// DOM이 defer 덕분에 이미 준비됨
console.log('✅ main.js 로드 완료');
console.log('현재 테마:', document.documentElement.dataset.theme);
// ========================================
// 🌙 다크모드 토글 기능
// ========================================

// 1. 버튼 찾기
const themeToggle = document.querySelector('.theme-toggle');

// 페이지 로드 시 : 저장된 테마 사용
const savedTheme = localStorage.getItem('currentTheme');

if (savedTheme === 'dark'){
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

// 2. 버튼 클릭했을 때
themeToggle.addEventListener('click', () => {
  // 3. 현재 테마 확인
  const currentTheme = document.documentElement.getAttribute('data-theme');
  

  // 4. 테마 전환 (dark ↔ light)
  if (currentTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('currentTheme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('currentTheme', 'dark');
}
});

/* ========================================
   🪟 Contact Modal + Form Validation
   ======================================== */

// 요소 선택
const modalOverlay = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('successMsg');

// 📖 모달 열기
function openModal() {
  modalOverlay.classList.add('active');
  document.body.classList.add('modal-open');
  // 접근성: 첫 입력 필드에 포커스
  setTimeout(() => document.getElementById('name').focus(), 300);
}

// 📕 모달 닫기
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.classList.remove('modal-open');
  
  // 폼 초기화 (0.4초 후 - 애니메이션 끝난 뒤)
  setTimeout(() => {
    form.reset();
    form.style.display = 'flex';
    successMsg.classList.remove('active');
    document.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('error', 'valid');
    });
    document.getElementById('charCount').textContent = '0';
  }, 400);
}

// 이벤트 연결
openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// 배경(오버레이) 클릭 시 닫기
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

/* ========================================
   ✅ 유효성 검사 규칙
   ======================================== */
const validators = {
  name: (value) => {
    if (!value.trim()) return '이름을 입력해주세요.';
    if (value.trim().length < 2) return '이름은 2글자 이상이어야 해요.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return '이메일을 입력해주세요.';
    // 이메일 정규식 (간단 버전)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return '올바른 이메일 형식이 아니에요.';
    return '';
  },
  subject: (value) => {
    if (!value.trim()) return '제목을 입력해주세요.';
    if (value.trim().length < 3) return '제목은 3글자 이상 입력해주세요.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return '메시지를 입력해주세요.';
    if (value.trim().length < 10) return '메시지는 10글자 이상 작성해주세요.';
    return '';
  }
};

/* ========================================
   🔍 필드 하나 검사하는 함수
   ======================================== */
function validateField(fieldName) {
  const input = document.getElementById(fieldName);
  const formGroup = input.closest('.form-group');
  const errorSpan = formGroup.querySelector('.error-msg');
  const errorMessage = validators[fieldName](input.value);

  if (errorMessage) {
    // ❌ 에러 있음
    formGroup.classList.add('error');
    formGroup.classList.remove('valid');
    errorSpan.textContent = errorMessage;
    return false;
  } else {
    // ✅ 통과
    formGroup.classList.remove('error');
    formGroup.classList.add('valid');
    errorSpan.textContent = '';
    return true;
  }
}

/* ========================================
   ⚡ 실시간 검사 (blur + input 이벤트)
   ======================================== */
Object.keys(validators).forEach((fieldName) => {
  const input = document.getElementById(fieldName);
  
  // 포커스 벗어날 때 검사
  input.addEventListener('blur', () => validateField(fieldName));
  
  // 입력 중일 때는 에러 상태라면 실시간 재검사 (UX ↑)
  input.addEventListener('input', () => {
    const formGroup = input.closest('.form-group');
    if (formGroup.classList.contains('error')) {
      validateField(fieldName);
    }
  });
});

/* ========================================
   📊 글자 수 카운터 (메시지 필드)
   ======================================== */
const messageInput = document.getElementById('message');
const charCount = document.getElementById('charCount');

messageInput.addEventListener('input', () => {
  charCount.textContent = messageInput.value.length;
});

/* ========================================
   📤 폼 제출 처리
   ======================================== */
form.addEventListener('submit', (e) => {
  e.preventDefault(); // 새로고침 방지
  
  // 모든 필수 필드 검사
  const fieldsToValidate = ['name', 'email', 'subject', 'message'];
  const results = fieldsToValidate.map(validateField);
  const isAllValid = results.every(result => result === true);
  
  if (!isAllValid) {
    // 첫 번째 에러 필드로 스크롤 & 포커스
    const firstError = document.querySelector('.form-group.error input, .form-group.error textarea');
    if (firstError) firstError.focus();
    return;
  }
  
  // ✅ 검사 통과 → 데이터 수집
  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    type: document.getElementById('type').value,
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
    sentAt: new Date().toLocaleString('ko-KR')
  };
  
  // 콘솔에 출력 (학습용 - 나중에 백엔드 API로 대체)
  console.log('📬 새 메시지 도착!', formData);
  
  // 성공 UI 전환
  form.style.display = 'none';
  successMsg.classList.add('active');
  
  // 2.5초 후 자동 닫기
  setTimeout(() => {
    closeModal();
  }, 2500);
});
/* ========================================
   🐙 GitHub API 연동
   ======================================== */

// ⚙️ 설정
const GITHUB_USERNAME = 'octocat'; // ← 여기에 본인 GitHub 아이디!
const MAX_PROJECTS = 6;             // 보여줄 최대 개수
const projectsGrid = document.getElementById('projectsGrid');

/* ========================================
   🎨 언어별 색상 매핑 (GitHub 스타일)
   ======================================== */
const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Vue: '#41b883',
  React: '#61dafb',
};

async function fetchGitHubRepos() {
  // 💾 캐시 확인 (10분간 유효)
  const cached = localStorage.getItem('github-repos');
  const cachedTime = localStorage.getItem('github-repos-time');
  const TEN_MINUTES = 10 * 60 * 1000;
  
  if (cached && cachedTime && (Date.now() - cachedTime < TEN_MINUTES)) {
    console.log('📦 캐시에서 로드!');
    renderProjects(JSON.parse(cached));
    return;
  }
  
  // 기존 코드...
  try {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    const response = await fetch(url);
    // ... 중략 ...
    
    const filtered = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, MAX_PROJECTS);
    
    // 💾 캐시 저장
    localStorage.setItem('github-repos', JSON.stringify(filtered));
    localStorage.setItem('github-repos-time', Date.now());
    
    renderProjects(filtered);
  } catch (error) {
    // ...
  }
}

/* ========================================
   📡 GitHub API 호출
   ======================================== */
async function fetchGitHubRepos() {
  try {
    // ⏱️ URL 구성 (최근 업데이트 순으로 정렬)
    const url = `https://api.github.com/users/choijiwonj/repos?sort=updated&per_page=100`;
    
    const response = await fetch(url);
    
    // 응답 상태 체크
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('사용자를 찾을 수 없어요.');
      }
      if (response.status === 403) {
        throw new Error('API 요청 한도를 초과했어요. 잠시 후 다시 시도해주세요.');
      }
      throw new Error(`HTTP 에러: ${response.status}`);
    }
    
    const repos = await response.json();
    
    // 🔍 필터링: fork된 저장소 제외, description 있는 것만
    const filtered = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count) // 스타 많은 순
      .slice(0, MAX_PROJECTS);
    
    renderProjects(filtered);
    
  } catch (error) {
    console.error('❌ GitHub API 에러:', error);
    renderError(error.message);
  }
}

/* ========================================
   🎨 프로젝트 카드 렌더링
   ======================================== */
function renderProjects(repos) {
  // 빈 저장소 처리
  if (repos.length === 0) {
    projectsGrid.innerHTML = `
      <div class="projects-message">
        <div class="icon">📭</div>
        <h3>아직 공개된 저장소가 없어요</h3>
        <p>GitHub에 프로젝트를 올려보세요!</p>
      </div>
    `;
    return;
  }
  
  // 카드 HTML 생성
  const cardsHTML = repos.map(repo => {
    const language = repo.language || 'Unknown';
    const color = languageColors[language] || '#8b8b8b';
    const description = repo.description || '설명이 아직 없어요 ✍️';
    const updatedDate = formatDate(repo.updated_at);
    
    return `
      <article class="project-card" data-url="${repo.html_url}">
        <div class="project-header">
          <div>
            <div class="project-icon">📦</div>
            <h3 class="project-title">${repo.name}</h3>
          </div>
        </div>
        
        <p class="project-desc">${description}</p>
        
        <div class="project-meta">
          <span>
            <span class="language-dot" style="background: ${color}"></span>
            ${language}
          </span>
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
        
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">
          GitHub에서 보기 →
        </a>
      </article>
    `;
  }).join('');
  
  projectsGrid.innerHTML = cardsHTML;
}
/* ========================================
   🖱️ 프로젝트 카드 이벤트 위임
   ======================================== */
projectsGrid.addEventListener('click', (e) => {
  
  // 🔗 a 태그 클릭이면 그냥 링크 이동
  if (e.target.closest('.project-link')) return;
  
  // 📦 카드 클릭이면 새 탭으로 열기
  const card = e.target.closest('.project-card');
  if (card) {
    const url = card.dataset.url;
    window.open(url, '_blank');
  }
  
  // 🔄 retry 버튼 클릭
  if (e.target.closest('#retryBtn')) {
    fetchGitHubRepos();
  }
});

/* ========================================
   ⚠️ 에러 화면 렌더링
   ======================================== */
function renderError(message) {
  projectsGrid.innerHTML = `
    <div class="projects-message">
      <div class="icon">😢</div>
      <h3>프로젝트를 불러오지 못했어요</h3>
      <p>${message}</p>
      <button class="retry-btn" id="retryBtn">
        🔄 다시 시도
      </button>
    </div>
  `;
}

/* ========================================
   📅 날짜 포맷 (상대 시간)
   예: "3일 전", "2개월 전"
   ======================================== */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

/* ========================================
   🚀 페이지 로드 시 실행
   ======================================== */
fetchGitHubRepos();


/* ========================================
   🍔 햄버거 메뉴 토글
   ======================================== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// 🎯 햄버거 버튼 클릭 → 메뉴 열기/닫기
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');   // 🍔 → ✖
  navMenu.classList.toggle('active');     // 메뉴 슬라이드 인/아웃
  document.body.classList.toggle('menu-open'); // 배경 스크롤 잠금
});

// 🎯 메뉴 링크 클릭 시 → 메뉴 자동 닫기 (UX 개선!)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// 🎯 화면 크기 커지면 (768px 초과) → 자동으로 메뉴 닫기
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// 요소 가져오기
const myLink = document.querySelector('[aria-label="mY"]');
const profileModal = document.getElementById('profileModal');
const profileModalClose = document.getElementById('profileModalClose');

// 🐙 mY 클릭 → 모달 열기
myLink.addEventListener('click', (e) => {
  e.preventDefault();                   // 링크 이동 막기
  profileModal.classList.add('active');
});

// ✕ 닫기 버튼 클릭
profileModalClose.addEventListener('click', () => {
  profileModal.classList.remove('active');
});

// 🌑 배경 클릭해도 닫기
profileModal.addEventListener('click', (e) => {
  if (e.target === profileModal) {      // 모달 박스 바깥 클릭 시
    profileModal.classList.remove('active');
  }
});