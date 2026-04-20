/** UI strings; question text still comes from the API (English). */
export const messages = {
  en: {
    'settings.button': 'Settings',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.close': 'Close',
    'settings.hint': 'Interface language only. Questions stay in English from the server.',
    'settings.theme': 'Appearance',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',

    'start.title': 'Interactive Quiz',
    'start.subtitle':
      'Choose difficulty and question count. You have 15 seconds per question.',
    'start.difficulty': 'Difficulty',
    'start.category': 'Category',
    'start.categoryAll': 'All categories',
    'start.categoriesLoadError': 'Could not load categories.',
    'start.countLabel': 'Number of questions (1–100)',
    'start.start': 'Start',
    'start.loading': 'Loading…',

    'diff.easy': 'Easy',
    'diff.medium': 'Medium',
    'diff.hard': 'Hard',

    'app.loading': 'Loading questions…',
    'app.errorEmpty': 'No questions returned. Try different filters or check the API.',
    'app.errorLoad': 'Failed to load questions',
    'app.progress': 'Q {{n}} / {{total}}',

    'quiz.progress': 'Question {{n}} / {{total}}',

    'result.title': 'Results',
    'result.summary':
      'You answered {{correct}} of {{total}} correctly ({{percent}}%).',
    'result.correct': 'Correct',
    'result.wrongLabel': 'Wrong / timeout',
    'result.best': 'Best score (by % correct):',
    'result.playAgain': 'Play again',
    'result.home': 'Back to home',
  },
  vi: {
    'settings.button': 'Cài đặt',
    'settings.title': 'Cài đặt',
    'settings.language': 'Ngôn ngữ',
    'settings.close': 'Đóng',
    'settings.hint':
      'Chỉ đổi giao diện. Nội dung câu hỏi vẫn theo API (tiếng Anh).',
    'settings.theme': 'Giao diện',
    'settings.themeLight': 'Sáng',
    'settings.themeDark': 'Tối',

    'start.title': 'Quiz tương tác',
    'start.subtitle':
      'Chọn độ khó và số câu. Mỗi câu có 15 giây.',
    'start.difficulty': 'Độ khó',
    'start.category': 'Thể loại',
    'start.categoryAll': 'Tất cả thể loại',
    'start.categoriesLoadError': 'Không tải được danh sách thể loại.',
    'start.countLabel': 'Số câu hỏi (1–100)',
    'start.start': 'Bắt đầu',
    'start.loading': 'Đang tải…',

    'diff.easy': 'Dễ',
    'diff.medium': 'Trung bình',
    'diff.hard': 'Khó',

    'app.loading': 'Đang tải câu hỏi…',
    'app.errorEmpty': 'Không lấy được câu hỏi. Thử đổi bộ lọc hoặc kiểm tra API.',
    'app.errorLoad': 'Không tải được câu hỏi',
    'app.progress': 'Câu {{n}} / {{total}}',

    'quiz.progress': 'Câu {{n}} / {{total}}',

    'result.title': 'Kết quả',
    'result.summary':
      'Bạn trả lời đúng {{correct}} / {{total}} câu ({{percent}}%).',
    'result.correct': 'Đúng',
    'result.wrongLabel': 'Sai / hết giờ',
    'result.best': 'Điểm cao nhất (theo % đúng):',
    'result.playAgain': 'Chơi lại',
    'result.home': 'Về trang chủ',
  },
}

export const STORAGE_LOCALE_KEY = 'quiz-ui-locale'

export function translate(locale, key, vars) {
  const table = messages[locale] || messages.en
  let s = table[key] ?? messages.en[key] ?? key
  if (vars && typeof s === 'string') {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{{${k}}}`, String(v))
    }
  }
  return s
}
