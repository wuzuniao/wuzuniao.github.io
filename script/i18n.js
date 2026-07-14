/**
 * 国际化引擎（原生 ES6+，无 jQuery）
 * 支持三种语言：简体中文(zh) / 繁體中文(zh-Hant) / 英文(en)。
 *
 * 用法：
 *  - 文本元素：data-en="英文"  data-hant="繁體中文"，原文以页面中文为基准。
 *  - 属性元素：data-en="英文"  data-en-attr="属性名"  data-hant-attr="繁體中文"，
 *    原属性值（中文）由首次访问缓存，切换时套用对应语言值。
 * 默认以页面中文为原文，切英文用 data-en，切繁体用 data-hant，切回中文还原原文。
 *
 * 语言状态持久化于 localStorage，刷新 / 跨页面路由 / 多标签页均保持一致。
 */
const I18N_KEY = 'wuzuniao_lang';
const I18N_PREV_KEY = 'wuzuniao_lang_prev';

// 读取当前语言（默认简体中文）
function getLang() {
  return localStorage.getItem(I18N_KEY) || 'zh';
}

// 读取「上一个语言」（切换前的语言）；首次访问无记录返回 null
function getPrevLang() {
  return localStorage.getItem(I18N_PREV_KEY);
}

// 语言码 → 下拉菜单中的原生显示文字
function labelOf(lang) {
  if (lang === 'en') return 'English';
  if (lang === 'zh-Hant') return '繁體中文';
  return '简体中文'; // zh
}

// 无「上一个语言」记录时（首次访问）的按钮默认文案
function defaultPrevLabel(lang) {
  return lang === 'zh' ? 'English' : '简体中文';
}

// 设置语言并持久化 + 应用
function setLanguage(lang) {
  // 记录切换前的语言作为「上一个语言」
  localStorage.setItem(I18N_PREV_KEY, getLang());
  localStorage.setItem(I18N_KEY, lang);
  applyLanguage(lang);
}

// 应用语言到全页
function applyLanguage(lang) {
  const isEn = lang === 'en';
  const isHant = lang === 'zh-Hant';
  // 同步 <html lang> 属性（繁体用通用标准码 zh-Hant）
  document.documentElement.lang = isEn ? 'en' : (isHant ? 'zh-Hant' : 'zh-CN');

  // 逐元素套用 / 还原文本或属性（文本元素与属性元素统一处理）
  document.querySelectorAll('[data-en],[data-hant]').forEach((el) => {
    const enText = el.getAttribute('data-en');
    const hantText = el.getAttribute('data-hant');
    const hantAttr = el.getAttribute('data-hant-attr');
    const attr = el.getAttribute('data-en-attr'); // 仅属性需翻译时存在
    // 首次访问缓存原文（中文）
    if (!el.__i18nOrig) {
      el.__i18nOrig = attr ? el.getAttribute(attr) : el.textContent;
    }
    let value;
    if (attr) {
      // 属性翻译：zh 还原中文；en 用 data-en；zh-Hant 优先 data-hant-attr，否则回退 data-en
      if (isEn) value = enText;
      else if (isHant) value = hantAttr || enText;
      else value = el.__i18nOrig;
      el.setAttribute(attr, value);
    } else {
      // 文本翻译：zh 还原中文；zh-Hant 用 data-hant（缺省回退中文）；en 用 data-en（缺省回退中文）
      if (isEn) value = enText || el.__i18nOrig;
      else if (isHant) value = hantText || el.__i18nOrig;
      else value = el.__i18nOrig;
      el.textContent = value;
    }
  });

  // 同步语言切换器 UI（PC 与移动端各一组）
  // 触发按钮显示「上一个语言」：切换后界面变为所选语言，按钮提示可一键切回上一种语言。
  //   首次访问（无上一种记录）且为简体中文时，按钮默认显示 English。
  // 完整三语选项始终在下拉菜单中列出，当前项高亮。
  const prevLabel = getPrevLang() ? labelOf(getPrevLang()) : defaultPrevLabel(lang);
  document.querySelectorAll('.lang_current').forEach((el) => {
    el.textContent = prevLabel;
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
