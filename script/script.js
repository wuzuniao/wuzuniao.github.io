

/* 导航条 */
$(function () {


    /* PC端 */
   //PC端鼠标浮动展示子导航
   $(".pc_nav>ul>li").each(function () {

      //如果没有子目录，则删除包含子目录的div
      if ($(this).children('.pc_nav2_ul').children('.pc_nav2_li').find('a').length<1) {
         $(this).children('.pc_nav2_ul').remove()
      }

      //设置伸缩和展开的样式
      else{
         $(this).mouseover(
            function (){
               $(this).children('').next('.pc_nav2_ul').stop(true, true).delay(100).slideDown(200);
               $(this).parent('').siblings('.pc_nav_both').stop(true, true).delay(100).slideDown(200);
            })
         $(this).mouseleave(
            function (){
              $(this).children('').next('.pc_nav2_ul').stop(true, true).delay(100).slideUp(100);
              $(this).parent('').siblings('.pc_nav_both').stop(true, true).delay(100).slideUp(100);
            })
      }
   });


    /* 移动端 */
   //点击逐渐展开移动端导航
   $(".m_qian_tubiao").click(
       function () {
           $(".m_hou").stop(true, false).delay(0).animate({
               width: "100%",
               height: "100%"
           }, 0);
           $(".m_hou").find(".m_hou_beijing").stop(true, false).delay(0).animate({
               opacity: "0.9"
           }, 300);
           $(".m_hou").find(".m_hou_tubiao_beijing").stop(true, false).delay(0).animate({
               opacity: "1"
           }, 300);
           $(".m_hou").find(".m_navList").stop(true, false).delay(0).animate({
               right: "0"
           }, 300);
           $('header').css('overflow','hidden');
       }
   )

   //点击关闭，逐渐隐藏
   $(".m_hou_tubiao").click(
       function () {
           $(".m_hou").stop(true, false).delay(300).animate({
               width: "0",
               height: "0"
           }, 0);
           $(".m_hou").find(".m_hou_beijing").stop(true, false).delay(0).animate({
               opacity: "0"
           }, 300);
           $(".m_hou").find(".m_hou_tubiao_beijing").stop(true, false).delay(0).animate({
               opacity: "0"
           }, 300);
           $(".m_hou").find(".m_navList").stop(true, false).delay(0).animate({
               right: "-80%"
           }, 300);
           $('header').css('overflow','auto');
       }
   )

   //判断是否有子标题
   $('.m_navList ul li').each(function () {
      $(this).children('.m_navList_a').find('i').addClass('m_hou_icon')
      if ($(this).children('.m_navList_nav').find('a').length < 1) {
         $(this).children('.m_navList_a').children('i').removeClass('m_hou_icon');
      }
   });

   //点击图标展开关闭子导航
   $('.m_navList ul li').find('.m_navList_a i').click(function () {
      $(this).parent().parent().siblings().children('.m_navList_nav').slideUp();
      $(this).parent().parent().siblings().children('.m_navList_a').find('i').removeClass('m_hou_icon_on')
      $(this).parent().next().toggle("normal").prev().children('i').toggleClass('m_hou_icon_on');
   })

});
