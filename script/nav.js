/**
 * 移动端导航交互（原生 ES6+，无 jQuery 依赖）
 * PC 端二级菜单展开已改由纯 CSS :hover/:has() 实现，无需 JS
 */
document.addEventListener('DOMContentLoaded', () => {
  const mHou = document.querySelector('.m_hou');
  const openBtn = document.querySelector('.m_qian_tubiao');
  const closeBtns = document.querySelectorAll('.m_hou_tubiao');

  // 点击汉堡按钮，展开移动端导航抽屉
  openBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    mHou?.classList.add('is-open');
  });

  // 点击关闭按钮或遮罩，收起导航抽屉
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      mHou?.classList.remove('is-open');
    });
  });

  // 移动端子导航展开 / 收起
  const navItems = document.querySelectorAll('.m_navList > ul > li');
  navItems.forEach((item) => {
    const icon = item.querySelector('.m_navList_a > i');
    const subNav = item.querySelector('.m_navList_nav');
    const hasSubLink = subNav ? subNav.querySelector('a') : null;

    // 仅含有子链接的项显示展开图标并绑定点击
    if (icon && hasSubLink) {
      icon.classList.add('m_hou_icon');
      icon.addEventListener('click', (event) => {
        event.preventDefault();
        // 先收起同级其他项
        navItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-expanded');
          }
        });
        // 切换当前项展开状态
        item.classList.toggle('is-expanded');
      });
    }
  });

  // 主题切换：分段胶囊，仅切换选中态，不实际切换主题（占位）
  // 每个 .theme_toggle 独立成组（PC 与移动端各一组，互不干扰）
  document.querySelectorAll('.theme_toggle').forEach((group) => {
    const opts = group.querySelectorAll('.theme_opt');
    opts.forEach((opt) => {
      opt.addEventListener('click', () => {
        opts.forEach((other) => {
          const isActive = other === opt;
          other.classList.toggle('is-active', isActive);
          other.setAttribute('aria-pressed', String(isActive));
        });
      });
    });
  });

  // 中英文切换：自定义下拉单选框（占位，暂未实现翻译切换）
  // 每个 .lang_select 独立处理（PC 与移动端各一组）
  document.querySelectorAll('.lang_select').forEach((langSelect) => {
    const langTrigger = langSelect.querySelector('.lang_trigger');
    const langCurrent = langSelect.querySelector('.lang_current');
    const langItems = langSelect.querySelectorAll('.lang_item');

    // 收起当前下拉
    const closeLang = () => {
      langSelect.classList.remove('is-open');
      langTrigger.setAttribute('aria-expanded', 'false');
      langSelect.setAttribute('aria-expanded', 'false');
    };

    // 点击触发按钮展开 / 收起（阻止冒泡，避免被外部点击立即收起）
    langTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = langSelect.classList.toggle('is-open');
      langTrigger.setAttribute('aria-expanded', String(isOpen));
      langSelect.setAttribute('aria-expanded', String(isOpen));
    });

    // 选择某一项：更新当前显示、选中态，并收起
    langItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        langCurrent.textContent = item.textContent;
        langItems.forEach((other) => {
          const selected = other === item;
          other.classList.toggle('is-selected', selected);
          other.setAttribute('aria-selected', String(selected));
        });
        closeLang();
      });
    });

    // 点击组件外部收起
    document.addEventListener('click', (event) => {
      if (!langSelect.contains(event.target)) closeLang();
    });

    // 按 Esc 收起
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLang();
    });
  });
});
