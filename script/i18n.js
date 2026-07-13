/**
 * 中英文国际化引擎（原生 ES6+，无 jQuery）
 * 用法：在需要翻译的元素上加 data-en="英文文本"；
 * 若需翻译属性（如 aria-label、meta 的 content），再加 data-en-attr="属性名"。
 * 默认以页面中文为原文，切换英语时套用 data-en，切回中文时还原原文。
 * 语言状态持久化于 localStorage，刷新 / 跨页面路由均保持一致。
 */
const I18N_KEY = 'wuzuniao_lang';

// 读取当前语言（默认中文）
function getLang() {
  return localStorage.getItem(I18N_KEY) || 'zh';
}

// 设置语言并持久化 + 应用
function setLanguage(lang) {
  localStorage.setItem(I18N_KEY, lang);
  applyLanguage(lang);
}

// 应用语言到全页
function applyLanguage(lang) {
  const isEn = lang === 'en';
  // 同步 <html lang> 属性
  document.documentElement.lang = isEn ? 'en' : 'zh-CN';

  // 逐元素套用 / 还原文本或属性
  document.querySelectorAll('[data-en]').forEach((el) => {
    const enText = el.getAttribute('data-en');
    const attr = el.getAttribute('data-en-attr');
    // 首次访问时缓存原文（中文）
    if (!el.__i18nOrig) {
      el.__i18nOrig = attr ? el.getAttribute(attr) : el.textContent;
    }
    const value = isEn ? enText : el.__i18nOrig;
    if (attr) {
      el.setAttribute(attr, value);
    } else {
      el.textContent = value;
    }
  });

  // 同步语言切换器 UI（PC 与移动端各一组）
  // 按钮显示「目标语言」：当前中文页显示 English（点按切英文），当前英文页显示 简体中文（点按切中文），交互更直观
  document.querySelectorAll('.lang_current').forEach((el) => {
    el.textContent = isEn ? '简体中文' : 'English';
  });
  document.querySelectorAll('.lang_select .lang_item').forEach((item) => {
    const selected = item.getAttribute('data-value') === lang;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-selected', String(selected));
  });
}

// 页面加载即套用已保存的语言
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(getLang());
});

// 多标签页同步：一处切换，其余页面随之更新
window.addEventListener('storage', (event) => {
  if (event.key === I18N_KEY) {
    applyLanguage(getLang());
  }
});

// 暴露给 nav.js 调用
window.setLanguage = setLanguage;
window.getLang = getLang;
