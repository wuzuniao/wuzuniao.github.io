/**
 * 共享导航 / 页脚片段注入（原生 ES6+，无 jQuery）
 * 三页（index / site/zngg / site/mzsm）的 PC+移动端导航与页脚结构完全一致，
 * 仅资源/链接前缀不同：首页为 ""，子页为 "../"。
 * 通过 <html data-site-base> 读取前缀，注入同一套片段，消除三页重复的 HTML。
 * 以 defer 加载、置于 theme.js 之后、i18n.js / nav.js 之前执行，
 * 保证其 DOMContentLoaded 处理的是已注入的节点。
 */
(function () {
  'use strict';

  // 资源与链接前缀：首页 ""，子页 "../"
  const base = document.documentElement.dataset.siteBase || '';

  // PC 端 + 移动端导航（与三页原有结构完全一致，仅路径加 base 前缀）
  const headerHTML = `
    <!-- PC 端导航 -->
    <div class="pc_header">
      <nav class="pc_nav">
        <a href="${base}index.html"><img class="site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO"></a>
        <ul>
          <li>
            <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source">开源</a>
            <ul class="pc_nav2_ul">
              <li class="pc_nav2_li">
                <a href="https://gitee.com/wuzuniao/hong" target="_blank" rel="noopener" data-en="Wuzuniao (Red)">无足鸟（红）</a>
                <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener" data-en="Wuzuniao (Black)">无足鸟（黑）</a>
                <a href="https://github.com/wuzuniao/yao" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)">无足鸟（药）</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Articles">微信文章</a>
            <ul class="pc_nav2_ul">
              <li class="pc_nav2_li">
                <a href="https://mp.weixin.qq.com/s/kT6fiaZKdSvElfv_uc-3Ow" target="_blank" rel="noopener">Vibe Coding</a>
                <a href="https://mp.weixin.qq.com/s/K5BwdoOtZCsrrGlfVU-CbQ" target="_blank" rel="noopener" data-en="Network Planning Designer">网络规划设计师</a>
                <a href="https://mp.weixin.qq.com/s/LCWTZ2NWtaWwFm90bWdZfg" target="_blank" rel="noopener">Wireshark</a>
                <a href="https://mp.weixin.qq.com/s/W7i8NNIwKmfMVIdGjx8JfA" target="_blank" rel="noopener">MobaXterm</a>
                <a href="https://mp.weixin.qq.com/s/60oJa98_B7J4hV6VKBjYIA" target="_blank" rel="noopener">Markdown</a>
                <a href="https://mp.weixin.qq.com/s/A7c7b322XGzOnwT5fln-1A" target="_blank" rel="noopener">Zabbix 4.4</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="Community">聊天交流</a>
            <ul class="pc_nav2_ul">
              <li class="pc_nav2_li">
              </li>
            </ul>
          </li>
        </ul>
        <!-- 右侧工具区：主题切换 + 中英文切换 -->
        <div class="pc_nav_tools">
          <div class="theme_toggle" role="group" aria-label="主题切换" data-en="Theme" data-en-attr="aria-label">
            <button type="button" class="theme_opt is-active" aria-pressed="true" data-theme-value="light"><img class="theme_icon theme_icon_sun" src="${base}images/sun.png" alt=""><span data-en="Light">浅色</span></button>
            <button type="button" class="theme_opt" aria-pressed="false" data-theme-value="dark"><img class="theme_icon theme_icon_moon" src="${base}images/moon.png" alt=""><span data-en="Dark">深色</span></button>
          </div>
          <div class="lang_select" role="listbox" aria-label="语言切换" data-en="Language" data-en-attr="aria-label" aria-expanded="false">
            <button type="button" class="lang_trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="lang_current">中文</span>
            </button>
            <ul class="lang_menu">
              <li class="lang_item is-selected" role="option" aria-selected="true" data-value="zh">简体中文</li>
              <li class="lang_item" role="option" aria-selected="false" data-value="en">English</li>
            </ul>
          </div>
        </div>
        <div class="pc_nav_both"></div>
      </nav>
    </div>
    <!-- 手机端导航--开始 未点击前 -->
    <div class="m_qian">
      <div class="m_qian_lf">
        <a href="${base}index.html">
          <img class="m_qian_logo site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO">
        </a>
      </div>
      <div class="m_qian_rg">
        <a href="#" class="m_qian_tubiao" role="button" aria-label="打开导航菜单" data-en="Open navigation menu" data-en-attr="aria-label">
          <img class="m_qian_menuimg" src="${base}images/m_menuimg.png" alt="菜单">
        </a>
      </div>
    </div>
    <!-- 点击右边导航后 -->
    <div class="m_hou">
      <div class="m_hou_beijing m_hou_tubiao"></div>
      <div class="m_hou_tubiao_beijing">
        <a href="#" class="m_hou_tubiao" role="button" aria-label="关闭导航菜单" data-en="Close navigation menu" data-en-attr="aria-label">
          <img src="${base}images/close.png" width="22" alt="关闭">
        </a>
      </div>
      <div class="m_navList">
        <!-- 移动端抽屉顶部工具区：主题切换 + 中英文切换 -->
        <div class="m_nav_tools">
          <div class="theme_toggle" role="group" aria-label="主题切换" data-en="Theme" data-en-attr="aria-label">
            <button type="button" class="theme_opt is-active" aria-pressed="true" data-theme-value="light"><img class="theme_icon theme_icon_sun" src="${base}images/sun.png" alt=""><span data-en="Light">浅色</span></button>
            <button type="button" class="theme_opt" aria-pressed="false" data-theme-value="dark"><img class="theme_icon theme_icon_moon" src="${base}images/moon.png" alt=""><span data-en="Dark">深色</span></button>
          </div>
          <div class="lang_select" role="listbox" aria-label="语言切换" data-en="Language" data-en-attr="aria-label" aria-expanded="false">
            <button type="button" class="lang_trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="lang_current">中文</span>
            </button>
            <ul class="lang_menu">
              <li class="lang_item is-selected" role="option" aria-selected="true" data-value="zh">简体中文</li>
              <li class="lang_item" role="option" aria-selected="false" data-value="en">English</li>
            </ul>
          </div>
        </div>
        <ul>
          <li>
            <div class="m_navList_a">
              <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source">开源</a>
              <i></i>
            </div>
            <div class="m_navList_nav">
              <a href="https://gitee.com/wuzuniao/hong" target="_blank" rel="noopener" data-en="Wuzuniao (Red)">无足鸟（红）</a>
              <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener" data-en="Wuzuniao (Black)">无足鸟（黑）</a>
              <a href="https://github.com/wuzuniao/yao" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)">无足鸟（药）</a>
            </div>
          </li>
          <li>
            <div class="m_navList_a">
              <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Articles">微信文章</a>
              <i></i>
            </div>
            <div class="m_navList_nav">
              <a href="https://mp.weixin.qq.com/s/kT6fiaZKdSvElfv_uc-3Ow" target="_blank" rel="noopener">Vibe Coding</a>
              <a href="https://mp.weixin.qq.com/s/K5BwdoOtZCsrrGlfVU-CbQ" target="_blank" rel="noopener" data-en="Network Planning Designer">网络规划设计师</a>
              <a href="https://mp.weixin.qq.com/s/LCWTZ2NWtaWwFm90bWdZfg" target="_blank" rel="noopener">Wireshark</a>
              <a href="https://mp.weixin.qq.com/s/W7i8NNIwKmfMVIdGjx8JfA" target="_blank" rel="noopener">MobaXterm</a>
              <a href="https://mp.weixin.qq.com/s/60oJa98_B7J4hV6VKBjYIA" target="_blank" rel="noopener">Markdown</a>
              <a href="https://mp.weixin.qq.com/s/A7c7b322XGzOnwT5fln-1A" target="_blank" rel="noopener">Zabbix 4.4</a>
            </div>
          </li>
          <li>
            <div class="m_navList_a">
              <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="Community">聊天交流</a>
              <i></i>
            </div>
            <div class="m_navList_nav"></div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 手机端导航--结束 -->
`;

  // PC 端 + 移动端页脚
  const footerHTML = `
    <!-- PC 端页脚 -->
    <div class="footer">
      <div class="footer_erweima">
        <div>
          <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source">开源</a>
          <img src="${base}images/biaoqingbao.gif" alt="开源表情包">
        </div>
        <div>
          <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Official Account">微信公众号</a>
          <img class="footer-ewm-wx" src="${base}images/ewm_wx.png" alt="微信公众号二维码">
        </div>
        <div>
          <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="QQ Group">QQ群</a>
          <img class="footer-ewm-qq" src="${base}images/ewm_qq.png" alt="QQ群二维码">
        </div>
        <div>
          <a href="${base}index.html"><img class="site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO"></a>
        </div>
      </div>
      <div class="footer_ziye">
        <a href="${base}site/zngg.html" data-en="Site Announcements">站内公告</a>
        <a href="${base}site/mzsm.html" data-en="Disclaimer">免责声明</a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2546467418&site=qq&menu=yes" target="_blank" rel="noopener" data-en="Contact us: xpg@wuzuniao.com">联系我们：xpg@wuzuniao.com</a>
        <a href="https://github.com/wuzuniao/wuzuniao.github.io" target="_blank" rel="noopener" id="github">
          <img class="footer-github" src="${base}images/github.png" alt="GitHub">
          <span data-en="GitHub">GitHub</span>
        </a>
        <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener">
          <img src="${base}images/gitee.png" alt="Gitee">
          <span data-en="Gitee">Gitee</span>
        </a>
      </div>
      <div class="copyright">
        <p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">赣ICP备17002383号-5</a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36098202000226" target="_blank" rel="noopener" class="gongan">
            <img src="${base}images/gongan.png" alt="公安备案">
            <span>赣公网安备 36098202000226号</span>
          </a>
        </p>
        <p>CopyRight 2020-2026 wuzuniao.com © All Rights Reserved.</p>
      </div>
    </div>
    <!-- 手机端页脚 -->
    <div class="m_footer">
      <div class="m_footer_erweima">
        <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source">开源</a>
        <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Official Account">微信公众号</a>
        <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="QQ Group">QQ群</a>
      </div>
      <div class="m_footer_ziye">
        <a href="${base}site/zngg.html" data-en="Site Announcements">站内公告</a>
        <a href="${base}site/mzsm.html" data-en="Disclaimer">免责声明</a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2546467418&site=qq&menu=yes" target="_blank" rel="noopener" data-en="Contact us: xpg@wuzuniao.com">联系我们：xpg@wuzuniao.com</a>
        <a href="https://github.com/wuzuniao/wuzuniao.github.io" target="_blank" rel="noopener">GitHub</a>
        <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener">Gitee</a>
      </div>
      <div class="m_copyright">
        <p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">赣ICP备17002383号-5</a>
        </p>
        <p>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36098202000226" target="_blank" rel="noopener" class="gongan">
            <img src="${base}images/gongan.png" alt="公安备案">
            <span>赣公网安备 36098202000226号</span>
          </a>
        </p>
        <p>CopyRight 2020-2026 wuzuniao.com © All Rights Reserved.</p>
      </div>
    </div>
`;

  // 注入到占位节点（三页的 <header id="site-header"> / <footer id="site-footer">）
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;
})();
