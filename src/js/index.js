$(function() {
    // 头部背景图标动画
    $(".header-top span").hover(function() {
        $(this).addClass('activeNow');
        let $i = $(this).find("i");
        if ($i.hasClass('leave-class-active')) {
            $i.removeClass('leave-class-active');
        }
        $i.addClass('enter-class-active')
    }, function() {
        $(this).removeClass('activeNow');
        $(this).find("i").removeClass('enter-class-active').addClass('leave-class-active')
    });
    // 关于我们
    let buff = false;
    $(".ellipsis-more").on('click', function(event) {
        event.preventDefault();
        if (!buff) {
            let $this = $(this);
            $(".about-us p").removeClass('text-ellipsis').css('height', '176');
            setTimeout(function() {
                $this.text("shrink");
            }, 500);
        } else {
            let $this = $(this);
            let $p = $(".about-us p");
            $p.css('height', '54');
            setTimeout(function() {
                $p.addClass('text-ellipsis')
                $this.text("more");
            }, 500);
        }
        buff = !buff;
    });
    //轮番
    /**
     *$swiper 定义父容器
     * $W 定义li的宽度
     * $overshoot 定义反弹尺度
     * $time1 定义间隔时间
     * $time2 定义动画时间
     */
    carousel($(".swiper"), $(window).width(), 5000, 1500)
        // 合作商家滚动
    let $lwContent = $(".lw-content");
    carousel($lwContent, $lwContent.find(".indicators-item").outerWidth(), 5000, 1000)

    function carousel($swiper, $W, $time1, $time2) {
        let $indicators = $swiper.find(".carousel-indicators");
        let $contorl = $swiper.find('.carousel-control a');
        let $html = $indicators.html();
        $html += $html;
        $indicators.html($html);
        let $item = $indicators.find(".indicators-item");
        let $liLength = $item.length;
        // 设置li的宽度与屏幕宽度一致
        $item.width($W)
            // 设置item元素的父集的宽度
            // 合作商家时候有margin值
        if ($W == 236) {
            $W = 243
        }
        $indicators.width($liLength * $W);
        let $index = 0,
            nowSlide = true;
        // 自动滑动
        let timer = setInterval(doMove, $time1);
        // 轮番移入暂停、移出播放
        $item.hover(() => {
            clearInterval(timer);
        }, () => {
            timer = setInterval(doMove, $time1);
        });
        // 商家移入暂停、移出播放
        $contorl.hover(() => {
            clearInterval(timer);
        }, () => {
            timer = setInterval(doMove, $time1);
        });
        // 按钮点击
        $contorl.on('click', function(event) {
            event.preventDefault();
            // 获取按钮的index
            let $indexNow = $(this).index();
            let left = $indicators.css("left");
            // 如果点击时候运动未完成,返回
            if (parseInt(left) != -$index * $W) {
                return;
            }
            // 左侧按钮
            if ($indexNow == 0) {
                // 如果为合作商家中动画执行
                if ($W == 243) {
                    if ($index == $liLength / 2) {
                        $index = 0;
                        $indicators.css("left", "" + -$index * $W + "px");
                    }
                } else {
                    ifIndexNow();
                }
                $index++;
                $indicators.animate({ left: "" + -$index * $W + "px" }, $time2, "backEaseInOut")
            } else {
                // 如果为合作商家中动画执行
                if ($W == 243) {
                    if ($index == 0) {
                        $index = $liLength / 2;
                        $indicators.css("left", "" + -$index * $W + "px");
                    }
                } else {
                    ifIndexNow();
                }
                $index--;
                $indicators.animate({ left: "" + -$index * $W + "px" }, $time2, "backEaseInOut")
            }
        });
        // 运动函数
        function doMove() {
            ifIndexNow();
            $index++;
            $indicators.animate({ left: "" + -$index * $W + "px" }, $time2, "backEaseInOut")
        }
        // 条件函数
        function ifIndexNow() {
            if ($index == 0) {
                $index = $liLength / 2;
                $indicators.css("left", "" + -$index * $W + "px");
            }
            // 合作商家条件
            if ($W == 243) {
                if ($index == $liLength / 2) {
                    $index = 0;
                    $indicators.css("left", "" + -$index * $W + "px");
                };
                return;
            };
            if ($index == $liLength - 1) {
                $index = $liLength / 2 - 1;
                $indicators.css("left", "" + -$index * $W + "px");
            }
        }
        // 运动形式
        jQuery.extend({
            easing: {
                backEaseInOut(p, n, firstNum, diff) {
                    var c = firstNum + diff;
                    // 反弹参数
                    var s = 2.7;
                    if ((p /= 0.5) < 1)
                        return c / 2 * (p * p * (((s *= (1.525)) + 1) * p - s)) + firstNum;
                    else
                        return c / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2) + firstNum;
                }
            }
        });
    }
// 招聘 新闻
    class Data {
        constructor(url, method, data) {
            this.url = url;
            this.method = method;
            this.data = data;
        }
        send(cb) {
            this.cb = cb;
            sendHttp(this.url, this.method, this.data, this.getData.bind(this))
        }
        getData(res) {
            this.cb(res)
        }
    }
    // 请求函数
    function sendHttp(url, method, data, fn) {
        data = data ? data : "";
        $.ajax({
                url: url,
                type: method,
                data: data,
            })
            .done(function(res) {
                fn & fn(res);
            })
            .fail(function(err) {
                console.log(err);
            })
    }
    let recruit="recruit"
    let news = "news";
     // 招聘
    manipulationData(recruit);
    // 新闻
    manipulationData(news);
    function manipulationData(str) {
        new Data("/data/data.json", "get").send((res) => {
            let data;
            if(str == "news"){
                data=res.news;
            }else{
                data=res.recruit;
            }
            let html = ""
            for (let i = 0, len = data.length; i < len; i++) {
                let nowDate = data[i];
                if (str == "news") {
                    html += `<li><a href='javascript:;'>${nowDate.title}</a><span>${nowDate.dateTime}</span></li>`;
                } else {
                    html += `<li><a class="img"><img src="${nowDate.url}" alt="" width="100%" height="100%"></a><div class="content"><a>${nowDate.job}</a><span>TIME:${nowDate.time}</span><p>${nowDate.job}职位名称：${nowDate.jobName}工作地点：${nowDate.jobPosition} 招募人数：${nowDate.peopleCount}人 学历要求：${nowDate.educational}薪资范...</p></div></li>`;
                }
            }
            let $ul = $(".data-list");
            if(str == "news"){
                $ul.eq(1).html(html);
            }else{
                $ul.eq(0).html(html)
                let $a=$("<a src='javascript:;'>More>></a>")
                $(".content").eq(0).append($a)
            }

        })
    }
})
