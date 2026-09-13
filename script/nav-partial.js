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

  // 认证站（子域 auth.wuzuniao.com）页面地址与对接参数名：
  //   未登录点击登录按钮 → 登录页并携带 redirect=当前页地址；
  //   登录成功后认证站重定向回 redirect 页并附加 auth_user=用户名；
  //   本站读取 auth_user 写入 localStorage 后清除该参数（见文件末尾），实现「登录完成自动跳回 + 按钮变用户名」。
  //   已登录点击用户名 → 认证站个人中心（同样携带 redirect=当前页地址）；
  //   个人中心退出登录后重定向回 redirect 页并附加 auth_logout=1，本站清除登录态、按钮恢复「登录」。
  //   SSO 自动识别：auth/yao 任一子域登录时同步写父域 Cookie wz_sso（Domain=.wuzuniao.com），
  //   本站页面加载时读取该 Cookie 自动识别登录态（见下方同步逻辑），无需经登录页回跳；
  //   auth/yao 任一子域登出时清除该 Cookie，本站下次加载即恢复「登录」态（惰性同步）。
  //   auth_user 与 Cookie 中的用户名仅用于界面展示（本站无鉴权逻辑）；若后续引入鉴权，禁止经 URL 明文传 token，
  //   须改为一次性授权码或 .wuzuniao.com 主域 HttpOnly Cookie，并同步双方对接约定与以下常量。
  //   若认证站实际参数名不同，仅需调整以下参数名常量。
  const AUTH_LOGIN_URL = 'https://auth.wuzuniao.com/pages/authentication/login.html';
  const AUTH_PROFILE_URL = 'https://auth.wuzuniao.com/pages/authentication/profile.html';
  const AUTH_REDIRECT_KEY = 'redirect';
  const AUTH_USER_KEY = 'auth_user';
  const AUTH_LOGOUT_KEY = 'auth_logout';
  // 登录注册按钮（全站 header 注入；href 为占位，由文件末尾按登录态写入真实跳转地址）
  // 繁体「登入」为人工校正：机械转换「登录」→「登錄」语义为注册（record/register），对登录动作不准确
  const loginBtnHTML = '<a class="nav-login" href="#" data-en="Sign in" data-hant="登入">登录</a>';

  // PC 端 + 移动端导航（与三页原有结构完全一致，仅路径加 base 前缀）
  const headerHTML = `
    <!-- PC 端导航 -->
    <div class="pc-header">
      <nav class="pc-nav">
        <a href="${base}index.html"><img class="site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO"></a>
        <ul>
          <!-- 一级「解决方案」落点未指定，暂为占位 #；子导航为产品矩阵入口 -->
          <li>
            <a href="#" data-en="Solutions" data-hant="解決方案">解决方案</a>
            <ul class="pc-nav2-ul">
              <li class="pc-nav2-li">
                <a href="https://auth.wuzuniao.com/" target="_blank" rel="noopener" data-en="Wuzuniao (User)" data-hant="無足鳥（用戶）">无足鸟（用户）</a>
                <a href="https://yao.wuzuniao.com/" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)" data-hant="無足鳥（藥）">无足鸟（药）</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source" data-hant="開源">开源</a>
            <ul class="pc-nav2-ul">
              <li class="pc-nav2-li">
                <a href="https://github.com/wuzuniao/DESIGN" target="_blank" rel="noopener" data-en="Wuzuniao (Design)" data-hant="無足鳥（設計）">无足鸟（设计）</a>
                <a href="https://gitee.com/wuzuniao/hong" target="_blank" rel="noopener" data-en="Wuzuniao (Red)" data-hant="無足鳥（紅）">无足鸟（红）</a>
                <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener" data-en="Wuzuniao (Black)" data-hant="無足鳥（黑）">无足鸟（黑）</a>
                <a href="https://github.com/wuzuniao/yao" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)" data-hant="無足鳥（藥）">无足鸟（药）</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Articles" data-hant="微信文章">微信文章</a>
            <ul class="pc-nav2-ul">
              <li class="pc-nav2-li">
                <a href="https://mp.weixin.qq.com/s/kT6fiaZKdSvElfv_uc-3Ow" target="_blank" rel="noopener">Vibe Coding</a>
                <a href="https://mp.weixin.qq.com/s/K5BwdoOtZCsrrGlfVU-CbQ" target="_blank" rel="noopener" data-en="Network Planning Designer" data-hant="網路規劃設計師">网络规划设计师</a>
                <a href="https://mp.weixin.qq.com/s/LCWTZ2NWtaWwFm90bWdZfg" target="_blank" rel="noopener">Wireshark</a>
                <a href="https://mp.weixin.qq.com/s/W7i8NNIwKmfMVIdGjx8JfA" target="_blank" rel="noopener">MobaXterm</a>
                <a href="https://mp.weixin.qq.com/s/60oJa98_B7J4hV6VKBjYIA" target="_blank" rel="noopener">Markdown</a>
                <a href="https://mp.weixin.qq.com/s/A7c7b322XGzOnwT5fln-1A" target="_blank" rel="noopener">Zabbix 4.4</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="Community" data-hant="聊天交流">聊天交流</a>
            <ul class="pc-nav2-ul">
              <li class="pc-nav2-li">
              </li>
            </ul>
          </li>
        </ul>
        <!-- 右侧工具区：主题切换 + 中英文切换 -->
        <div class="pc-nav-tools">
          <div class="theme-toggle" role="group" aria-label="主题切换" data-en="Theme" data-en-attr="aria-label" data-hant-attr="主題切換">
            <button type="button" class="theme-opt is-active" aria-pressed="true" data-theme-value="light"><img class="theme-icon theme-icon-sun" src="${base}images/sun.png" alt=""><span data-en="Light" data-hant="淺色">浅色</span></button>
            <button type="button" class="theme-opt" aria-pressed="false" data-theme-value="dark"><img class="theme-icon theme-icon-moon" src="${base}images/moon.png" alt=""><span data-en="Dark" data-hant="深色">深色</span></button>
          </div>
          <div class="lang-select" role="listbox" aria-label="语言切换" data-en="Language" data-en-attr="aria-label" data-hant-attr="語言切換" aria-expanded="false">
            <button type="button" class="lang-trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="lang-current">English</span>
            </button>
            <ul class="lang-menu">
              <li class="lang-item is-selected" role="option" aria-selected="true" data-value="zh">简体中文</li>
              <li class="lang-item" role="option" aria-selected="false" data-value="zh-Hant">繁體中文</li>
              <li class="lang-item" role="option" aria-selected="false" data-value="en">English</li>
            </ul>
          </div>
        </div>
        <div class="pc-nav-both"></div>
      </nav>
    </div>
    <!-- 手机端导航--开始 未点击前 -->
    <div class="m-qian">
      <div class="m-qian-lf">
        <a href="${base}index.html">
          <img class="m-qian-logo site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO">
        </a>
      </div>
      <div class="m-qian-rg">
        <a href="#" class="m-qian-tubiao" role="button" aria-label="打开导航菜单" data-en="Open navigation menu" data-en-attr="aria-label" data-hant-attr="打開導覽選單">
          <img class="m-qian-menuimg" src="${base}images/m_menuimg.png" alt="菜单">
        </a>
      </div>
    </div>
    <!-- 点击右边导航后 -->
    <div class="m-hou">
      <div class="m-hou-beijing m-hou-tubiao"></div>
      <div class="m-hou-tubiao-beijing">
        <a href="#" class="m-hou-tubiao" role="button" aria-label="关闭导航菜单" data-en="Close navigation menu" data-en-attr="aria-label" data-hant-attr="關閉導覽選單">
          <img src="${base}images/close.png" width="22" alt="关闭">
        </a>
      </div>
      <div class="m-nav-list">
        <!-- 移动端抽屉顶部工具区：主题切换 + 中英文切换 -->
        <div class="m-nav-tools">
          <div class="theme-toggle" role="group" aria-label="主题切换" data-en="Theme" data-en-attr="aria-label" data-hant-attr="主題切換">
            <button type="button" class="theme-opt is-active" aria-pressed="true" data-theme-value="light"><img class="theme-icon theme-icon-sun" src="${base}images/sun.png" alt=""><span data-en="Light" data-hant="淺色">浅色</span></button>
            <button type="button" class="theme-opt" aria-pressed="false" data-theme-value="dark"><img class="theme-icon theme-icon-moon" src="${base}images/moon.png" alt=""><span data-en="Dark" data-hant="深色">深色</span></button>
          </div>
          <div class="lang-select" role="listbox" aria-label="语言切换" data-en="Language" data-en-attr="aria-label" data-hant-attr="語言切換" aria-expanded="false">
            <button type="button" class="lang-trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="lang-current">English</span>
            </button>
            <ul class="lang-menu">
              <li class="lang-item is-selected" role="option" aria-selected="true" data-value="zh">简体中文</li>
              <li class="lang-item" role="option" aria-selected="false" data-value="zh-Hant">繁體中文</li>
              <li class="lang-item" role="option" aria-selected="false" data-value="en">English</li>
            </ul>
          </div>
        </div>
        <ul>
          <!-- 一级「解决方案」落点未指定，暂为占位 #；子导航为产品矩阵入口 -->
          <li>
            <div class="m-nav-list-a">
              <a href="#" data-en="Solutions" data-hant="解決方案">解决方案</a>
              <i></i>
            </div>
            <div class="m-nav-list-nav">
              <a href="https://auth.wuzuniao.com/" target="_blank" rel="noopener" data-en="Wuzuniao (User)" data-hant="無足鳥（用戶）">无足鸟（用户）</a>
              <a href="https://yao.wuzuniao.com/" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)" data-hant="無足鳥（藥）">无足鸟（药）</a>
            </div>
          </li>
          <li>
            <div class="m-nav-list-a">
              <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source" data-hant="開源">开源</a>
              <i></i>
            </div>
            <div class="m-nav-list-nav">
              <a href="https://github.com/wuzuniao/DESIGN" target="_blank" rel="noopener" data-en="Wuzuniao (Design)" data-hant="無足鳥（設計）">无足鸟（设计）</a>
              <a href="https://gitee.com/wuzuniao/hong" target="_blank" rel="noopener" data-en="Wuzuniao (Red)" data-hant="無足鳥（紅）">无足鸟（红）</a>
              <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener" data-en="Wuzuniao (Black)" data-hant="無足鳥（黑）">无足鸟（黑）</a>
              <a href="https://github.com/wuzuniao/yao" target="_blank" rel="noopener" data-en="Wuzuniao (Medicine)" data-hant="無足鳥（藥）">无足鸟（药）</a>
            </div>
          </li>
          <li>
            <div class="m-nav-list-a">
              <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Articles" data-hant="微信文章">微信文章</a>
              <i></i>
            </div>
            <div class="m-nav-list-nav">
              <a href="https://mp.weixin.qq.com/s/kT6fiaZKdSvElfv_uc-3Ow" target="_blank" rel="noopener">Vibe Coding</a>
              <a href="https://mp.weixin.qq.com/s/K5BwdoOtZCsrrGlfVU-CbQ" target="_blank" rel="noopener" data-en="Network Planning Designer" data-hant="網路規劃設計師">网络规划设计师</a>
              <a href="https://mp.weixin.qq.com/s/LCWTZ2NWtaWwFm90bWdZfg" target="_blank" rel="noopener">Wireshark</a>
              <a href="https://mp.weixin.qq.com/s/W7i8NNIwKmfMVIdGjx8JfA" target="_blank" rel="noopener">MobaXterm</a>
              <a href="https://mp.weixin.qq.com/s/60oJa98_B7J4hV6VKBjYIA" target="_blank" rel="noopener">Markdown</a>
              <a href="https://mp.weixin.qq.com/s/A7c7b322XGzOnwT5fln-1A" target="_blank" rel="noopener">Zabbix 4.4</a>
            </div>
          </li>
          <li>
            <div class="m-nav-list-a">
              <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="Community" data-hant="聊天交流">聊天交流</a>
              <i></i>
            </div>
            <div class="m-nav-list-nav"></div>
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
      <div class="footer-erweima">
        <div>
          <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source" data-hant="開源">开源</a>
          <img src="${base}images/biaoqingbao.gif" alt="开源表情包">
        </div>
        <div>
          <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Official Account" data-hant="微信公眾號">微信公众号</a>
          <img class="footer-ewm-wx" src="${base}images/ewm_wx.png" alt="微信公众号二维码">
        </div>
        <div>
          <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="QQ Group" data-hant="QQ群">QQ群</a>
          <img class="footer-ewm-qq" src="${base}images/ewm_qq.png" alt="QQ群二维码">
        </div>
        <div>
          <a href="${base}index.html"><img class="site-logo" src="${base}images/logo_wuzuniao_com_q.png" alt="无足鸟LOGO"></a>
        </div>
      </div>
      <div class="footer-ziye">
        <a href="${base}site/zngg.html" data-en="Site Announcements" data-hant="站內公告">站内公告</a>
        <a href="${base}site/mzsm.html" data-en="Disclaimer" data-hant="免責聲明">免责声明</a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2546467418&site=qq&menu=yes" target="_blank" rel="noopener" data-en="Contact us: xpg@wuzuniao.com" data-hant="聯繫我們：xpg@wuzuniao.com">联系我们：xpg@wuzuniao.com</a>
        <a href="https://github.com/wuzuniao/wuzuniao.github.io" target="_blank" rel="noopener" id="github">
          <img class="footer-github" src="${base}images/github.png" alt="GitHub">
          <span data-en="GitHub" data-hant="GitHub">GitHub</span>
        </a>
        <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener">
          <img src="${base}images/gitee.png" alt="Gitee">
          <span data-en="Gitee" data-hant="Gitee">Gitee</span>
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
        <p>Copyright 2020-${new Date().getFullYear()} wuzuniao.com © All Rights Reserved.</p>
      </div>
    </div>
    <!-- 手机端页脚 -->
    <div class="m-footer">
      <div class="m-footer-erweima">
        <a href="https://github.com/wuzuniao" target="_blank" rel="noopener" data-en="Open Source" data-hant="開源">开源</a>
        <a href="https://mp.weixin.qq.com/s/sZmS0axaiBpExRVVSG1rgA" target="_blank" rel="noopener" data-en="WeChat Official Account" data-hant="微信公眾號">微信公众号</a>
        <a href="https://jq.qq.com/?_wv=1027&k=OyWwUJBI" target="_blank" rel="noopener" data-en="QQ Group" data-hant="QQ群">QQ群</a>
      </div>
      <div class="m-footer-ziye">
        <a href="${base}site/zngg.html" data-en="Site Announcements" data-hant="站內公告">站内公告</a>
        <a href="${base}site/mzsm.html" data-en="Disclaimer" data-hant="免責聲明">免责声明</a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2546467418&site=qq&menu=yes" target="_blank" rel="noopener" data-en="Contact us: xpg@wuzuniao.com" data-hant="聯繫我們：xpg@wuzuniao.com">联系我们：xpg@wuzuniao.com</a>
        <a href="https://github.com/wuzuniao/wuzuniao.github.io" target="_blank" rel="noopener">GitHub</a>
        <a href="https://gitee.com/wuzuniao/hei" target="_blank" rel="noopener">Gitee</a>
      </div>
      <div class="m-copyright">
        <p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">赣ICP备17002383号-5</a>
        </p>
        <p>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36098202000226" target="_blank" rel="noopener" class="gongan">
            <img src="${base}images/gongan.png" alt="公安备案">
            <span>赣公网安备 36098202000226号</span>
          </a>
        </p>
        <p>Copyright 2020-${new Date().getFullYear()} wuzuniao.com © All Rights Reserved.</p>
      </div>
    </div>
`;

  // 注入到占位节点（三页的 <header id="site-header"> / <footer id="site-footer">）
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = headerHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  // header 增强：追加登录按钮 + 登录态切换（全站三页；nav-partial defer 顺序在 i18n 之前，
  //   故登录态属性调整会先于 i18n 首次翻译到位，详见下方注释）
  if (headerEl) {
    // PC 端：登录按钮追加到 .pc-nav-tools 末尾（贴右，作为最右子项）
    const pcTools = headerEl.querySelector('.pc-nav-tools');
    if (pcTools) pcTools.insertAdjacentHTML('beforeend', loginBtnHTML);

    // 移动端：登录按钮追加到抽屉顶部工具区 .m-nav-tools 末尾（位于语言切换右侧，与 PC 工具区同构；
    //   .m-nav-tools 为 flex-end 紧凑贴右，窄屏放不下时 wrap 换行仍贴右）
    const mTools = headerEl.querySelector('.m-nav-tools');
    if (mTools) mTools.insertAdjacentHTML('beforeend', loginBtnHTML);

    // SSO 单点登录同步：读取父域 Cookie wz_sso（Domain=.wuzuniao.com，auth/yao 登录或令牌刷新时写入，
    //   值为 encodeURIComponent(JSON{at, rt, exp, ui})），与 auth/yao 实现「一处登录，处处通行」——
    //   其他子域登录过则本站自动识别为已登录；其他子域登出（Cookie 被清除）或 Cookie 过期
    //   （Max-Age 14 天）则清除本地登录态，按钮恢复「登录」（惰性同步）。
    //   本站仅取 ui.username 用于界面展示（与下方 auth_user 回跳同一定位，不存令牌、无鉴权逻辑）；
    //   有效性判断与写入端一致——Cookie 存在且含令牌（at）即视为已登录，不校验 exp：
    //   www 无令牌刷新能力，3~14 天窗口内 yao/auth 静默刷新后仍为已登录态，本站保持一致。
    //   先于 auth_user/auth_logout 回跳处理执行——URL 回跳参数代表认证站刚告知的最终状态，优先级最高。
    let ssoUser = '';
    try {
      const ssoMatch = document.cookie.match(/(?:^|;\s*)wz_sso=([^;]*)/);
      if (ssoMatch) {
        const ssoPayload = JSON.parse(decodeURIComponent(ssoMatch[1]));
        if (ssoPayload && ssoPayload.at && ssoPayload.ui && ssoPayload.ui.username) {
          ssoUser = ssoPayload.ui.username;
        }
      }
    } catch (e) {
      // Cookie 缺失或格式异常（非本族站点写入）时按未登录处理
      ssoUser = '';
    }
    if (ssoUser) {
      // Cookie 有有效登录态：同步用户名到 localStorage（覆盖旧值，兼容在其他子域切换账号的场景）
      localStorage.setItem('wuzuniao_user', ssoUser);
    } else {
      // Cookie 无登录态：清除本地残留（其他子域已登出或 Cookie 已过期）
      localStorage.removeItem('wuzuniao_user');
    }

    // 登录回跳处理：认证站登录成功后重定向回「redirect 页」并附加 auth_user=用户名；
    // 本站读取后写入 localStorage（持久登录态），并清除该参数还原干净地址（保留其余 query 与 hash）。
    const returnPage = new URL(location.href);
    const authUser = returnPage.searchParams.get(AUTH_USER_KEY);
    if (authUser) {
      localStorage.setItem('wuzuniao_user', authUser);
      returnPage.searchParams.delete(AUTH_USER_KEY);
      history.replaceState(null, '', returnPage.pathname + returnPage.search + returnPage.hash);
    }

    // 登出回跳处理：认证站个人中心退出登录后重定向回「redirect 页」并附加 auth_logout=1；
    // 本站读取后清除本地登录态（按钮恢复「登录」态），并清除该参数还原干净地址（与 auth_user 同位置处理）。
    if (returnPage.searchParams.get(AUTH_LOGOUT_KEY)) {
      localStorage.removeItem('wuzuniao_user');
      returnPage.searchParams.delete(AUTH_LOGOUT_KEY);
      history.replaceState(null, '', returnPage.pathname + returnPage.search + returnPage.hash);
    }

    // 登录状态：读取 localStorage「wuzuniao_user」；非空则按钮显示用户名并去除高亮，点击跳认证站个人中心；
    //   未登录则点击跳认证站登录页，redirect 携带当前页地址（不含 hash：认证站拼接参数时 hash 居中会破坏格式），
    //   登录完成后由认证站重定向回本页并附加 auth_user，实现自动跳回。
    //   已登录时移除 data-en/data-hant，i18n.applyLanguage 的 [data-en],[data-hant] 查询会跳过此元素，
    //   使其在首次翻译及后续语言切换中始终保留用户名不被覆盖（refresh 重新读取 localStorage）。
    //   登录/个人中心为流程页，同窗口跳转（不加 target=_blank）以保证登录回跳连贯。
    const savedUser = localStorage.getItem('wuzuniao_user');
    headerEl.querySelectorAll('.nav-login').forEach((btn) => {
      if (savedUser) {
        btn.textContent = savedUser;
        btn.classList.add('is-logged');
        btn.removeAttribute('data-en');
        btn.removeAttribute('data-hant');
        // 已登录：点击用户名跳转认证站个人中心，redirect 携带当前页地址（不含 hash，同登录按钮），
        //   供个人中心退出登录后附加 auth_logout=1 回跳本页（本站据此恢复「登录」态）
        btn.href = AUTH_PROFILE_URL + '?' + AUTH_REDIRECT_KEY + '=' + encodeURIComponent(location.origin + location.pathname + location.search);
      } else {
        // 未登录：跳转认证站登录页，redirect 告知认证站登录完成后回跳的页面
        btn.href = AUTH_LOGIN_URL + '?' + AUTH_REDIRECT_KEY + '=' + encodeURIComponent(location.origin + location.pathname + location.search);
      }
    });
  }
})();
