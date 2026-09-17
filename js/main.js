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