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
});
