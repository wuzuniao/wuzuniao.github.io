/**
 * 主题切换引擎（原生 ES6+，无 jQuery）
 * 通过给 <html> 设置 data-theme="light|dark" 切换全站语义色令牌（见 init.css）。
 * 选择持久化于 localStorage，刷新 / 跨页面 / 多标签页保持一致。
 * 在 <head> 中同步加载（非 defer），首屏即设置 data-theme，避免浅色闪烁。
 */
const THEME_KEY = 'wuzuniao_theme';

// 读取当前主题：localStorage 优先，否则跟随系统偏好
function getTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 应用主题：设置 data-theme，并同步 PC / 移动端主题切换器的选中态
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('.theme_opt').forEach((opt) => {
    const isDark = opt.dataset.themeValue === 'dark';
    const active = theme === 'dark' ? isDark : !isDark;
    opt.classList.toggle('is-active', active);
    opt.setAttribute('aria-pressed', String(active));
  });
}

// 设置并持久化主题
function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

// 首屏：尽早设置 data-theme（此时 body 未解析，切换器同步留待 DOMContentLoaded）
applyTheme(getTheme());

// DOM 就绪后再次同步切换器选中态（修正 HTML 默认 is-active）
document.addEventListener('DOMContentLoaded', () => applyTheme(getTheme()));

// 多标签页同步：一处切换，其余页面随之更新
window.addEventListener('storage', (event) => {
  if (event.key === THEME_KEY) applyTheme(getTheme());
});

// 暴露给 nav.js 调用
window.setTheme = setTheme;
window.getTheme = getTheme;
