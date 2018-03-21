
function loadInvestRecords(a) {
    $.ajax({
        type: "GET",
        cache: !1,
        url: "/investment/records/" + PrjStatus.prjId + "_" + a + "_" + _page_size,
        beforeSend: function() {
            PPLoading(_tbody)
        },
        success: function(a) {
            if (hideLoading(_tbody), 1 != a.State) return void PPmoney.dialog.quickClose({
                content: a.Msg
            });
            var b = "",
            c = 0;
            if (a.Data.TotalCount > 0) {
                var d = a.Data.TotalCount - (a.Data.PageIndex - 1) * a.Data.PageSize;
                $(a.Data.Rows).each(function(a, e) {
                    b += "<tr><td>" + d--+"</td><td>" + fmtDisplayName(e.Nickname, e.Surname, e.Sex, e.OrgName) + "</td><td>" + fmtDisplayName(e.CrdNickname, e.CrdSurname, e.CrdSex, e.OrgName) + "</td><td>" + formatCurrency(e.Amount) + "元</td><td>" + formatDateTime(e.ApplyTime, "yyyy-MM-dd hh:mm:ss") + "</td><td>" + SourceType(e.Source, e.IsAuto) + "</td></tr>",
                    c += e.Amount
                }),
                $("#recordPagi").html(PPmoneyPagination({
                    pageIndex: a.Data.PageIndex,
                    pageSize: _page_size,
                    totalCount: a.Data.TotalCount,
                    callback: "loadInvestRecords"
                })),
                $("#invested-people").html(a.Data.TotalCount),
                $("#invested-money").html(formatCurrency(PrjAmount.AmountTotal / a.Data.TotalCount))
            } else b = '<tr><td colspan="6"><div class="no-record">暂无投资记录</div></td></tr>';
            _tbody.html(b)
        },
        error: function() {
            PPLoading(_tbody)
        }
    })
}
function fmtDisplayName(a, b, c, d) {
    var e = "";
    return "" != d ? d + '<span class="org_user" title="机构用户">机构</span>': e = null != a && "" != a ? a: b + "**" + (101001 == c ? "先生": "女士")
}
function SourceType(a, b) {
    if (b) return "自动";
    switch (a.split("_")[0].toLowerCase()) {
    case "sys":
    case "awy":
        return "PC手动";
    case "weixin":
        return "微信手动";
    case "whan":
    case "whap":
        return "APP手动";
    default:
        return "其他来源"
    }
}
function loadMyInfo(a) {
    if (a.Id) $("#span_CustomerAmount").html(a.CustomerAmount >= 100 ? formatCurrency(a.CustomerAmount) + "元": formatCurrency(a.CustomerAmount) + '元<a href="/Customer/Recharge/" class="recharge" target="_blank">充值</a>'),
    isLogin = !0,
    accountType = $("input[name='AccountType']:checked").val(),
    "1" == accountType ? CustomerAmount = Math.floor(a.CustomerAmount) : "4" == accountType && (CustomerAmount = Math.floor(a.DailyBaoAmount)),
    PrjAmount.minAmount > 100 && $investNum.val("1" == PrjAmount.PackageType ? PrjAmount.minAmount / 100 : PrjAmount.minAmount),
    1 == a.HasDailyBaoAccount ? ($("#span_CustomerDailyBaoAmount").text(formatCurrency(a.DailyBaoAmount) + "元"), 1 == isDisableDailyBao ? $("#account-dailybao").attr("disabled", !0) : $("#account-dailybao").attr("disabled", !1), $("#dailyBaoTransIn").hide()) : ($("#account-dailybao").attr("disabled", !0), $("#span_CustomerDailyBaoAmount").hide(), $("#dailyBaoTransIn").show()),
    $("input[name=AccountType]").on({
        click: function() {
            accountType = $("input[name='AccountType']:checked").val(),
            "1" == accountType ? CustomerAmount = Math.floor(a.CustomerAmount) : "4" == accountType && (CustomerAmount = Math.floor(a.DailyBaoAmount)),
            $(this).is(":checked") && ($("#accountTitle").text($(this).attr("data-tips")), "true" != PrjStatus.isFinancialFund && inputState())
        }
    });
    else {
        var b = "<a class='em' href='/login?ReturnUrl=project/commondetail/" + PrjStatus.prjId + "'>请先登录</a>";
        $investBox.find(".my-account-bd").html(b),
        $("#btnTotal").hide()
    }
}
function userInfo() {
    $.ajax({
        type: "get",
        cache: !1,
        url: "/project/AsyncLoadUserInfo",
        data: {},
        beforeSend: function() {
            PPLoading($investBox)
        },
        success: function(a) {
            hideLoading($investBox),
            loadMyInfo(a)
        }
    })
}
function prjStatus() {
    $.ajax({
        type: "get",
        cache: !1,
        url: "/project/AsyncLoadPrjStatus/" + PrjStatus.prjId,
        beforeSend: function() {
            PPLoading($investBox)
        },
        success: function(a) {
            hideLoading($investBox),
            $investBox.find(".progress-num").text(a.ProgressRate + "%").end().find(".progress-bar").width(a.ProgressRate + "%").end().find("#total-money").html(formatCurrency(a.CirculationMoney)),
            CirculationMoney = a.CirculationMoney,
            (newDate(a.Now).getHours() >= 23 || newDate(a.Now).getHours() < 1) && (isDisableDailyBao = !0, $("#account-dailybao").attr("disabled", !0), $("#dailybaotips").html("每天23:00至次日凌晨01:00不能用日利宝投资"), $("#dailybaotips").attr("title", "因银行系统维护时间，每天23:00点到次日凌晨01:00点之间转入，转出相关操作可能失败！"));
            var b = "",
            c = !1;
            if (newDate(a.beginTime).getTime() - newDate(a.Now).getTime() > 0) return "true" == PrjStatus.isReservationPrj.toLowerCase() && newDate(a.beginTime).getTime() - 60 * PrjStatus._reservationCouponRetainMinutes * 1e3 < newDate(a.Now).getTime() && newDate(a.Now).getTime() < newDate(a.beginTime).getTime() ? (c = !0, b = '<div id="pro-subside1-advance-btn" class="pro-subside1-btn cutdown-c"><div id="prjBtnWait" class="cutdown-time"></div><div id="prjBtn" class="cutdown-btn">抢投</div></div>') : (b = '<div id="prjBtnWait" class="btn btn-invest btn-wait"></div>', $(".pro-subside1-ft").removeClass("unsubscribe-c")),
            "true" == PrjStatus.isReservationPrj.toLowerCase() && (isreservation = !0, $(".pro-subside1-ft").addClass("unsubscribe-c"), $(".pro-subside1-ft .u2-05").click(function() {
                $(".pro-subside1-ft").removeClass("unsubscribe-c")
            })),
            $prjStatusBtn.html(b),
            showInvest(),
            void(c || "true" != PrjStatus.isReservationPrj.toLowerCase() ? new PPCutDown({
                from: a.Now,
                to: a.beginTime,
                refresh: function(a, b) {
                    $("#prjBtnWait").html("倒计时 " + b)
                },
                callback: function() {
                    prjStatus()
                }
            }).start() : new PPCutDown({
                from: a.Now,
                to: a.beginTime,
                refresh: function(a, b) {
                    a.totalTime - 60 * PrjStatus._reservationCouponRetainMinutes < 0 ? a.stop() : $("#prjBtnWait").html("倒计时 " + b)
                },
                callback: function() {
                    prjStatus()
                }
            }).start());
            if (newDate(a.endTime) < newDate(a.Now) && a.ProgressRate - 100 < 0) b = '<div class="btn btn-invest btn-finish">该项目已结束</div>';
            else if (a.ProgressRate - 100 < 0) b = '<div id="prjBtn" class="btn btn-invest">立即投资</div>';
            else if (a.ProgressRate - 100 == 0) {
                b = '<div class="btn btn-invest btn-finish">已满额</div>';
                var d, e = (newDate(a.endTime).getTime() - newDate(a.beginTime).getTime()) / 60 / 1e3;
                d = 60 > e && e > 0 ? 1 >= e ? Math.ceil(numFormat(60 * e)) + "秒": Math.ceil(e) + "分钟": "火速",
                $("#invested-time").html(d)
            } else a.isLiuZhuan && (b = '<div class="btn btn-invest btn-finish">流转</div>');
            $prjStatusBtn.html(b),
            showInvest()
        },
        error: function() {
            PPLoading($investBox)
        }
    })
}
function inputState() {
    var a = [],
    b = $investNum.val();
    investFlag = !0,
    0 == $investNum.val().length || ("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) < Math.min(CirculationMoney, PrjAmount.minAmount) ? (investFlag = investFlag && !1, a.push(PPmoney.config.errico + Math.min(CirculationMoney, PrjAmount.minAmount) + "元起投<br>")) : (investFlag = investFlag && !0, a.push(PPmoney.config.corico + Math.min(CirculationMoney, PrjAmount.minAmount) + "元起投<br>")),
    "1" == PrjAmount.PackageType ? 100 * $investNum.val() % PrjStatus.amountBase != 0 && (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "请输入" + PrjStatus.amountBase + "元的整数倍<br>")) : $investNum.val() % PrjStatus.amountBase != 0 && (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "请输入" + PrjStatus.amountBase + "元的整数倍<br>")),
    void 0 == $("#invitation_code").val() || "" != $("#invitation_code").val() && null != $("#invitation_code").val() || (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "请输入邀请码<br>")),
    PrjAmount.singleInvestmentAmount - 0 > 0 && (("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) - PrjAmount.singleInvestmentAmount > 0 ? (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "限投总额" + PrjAmount.singleInvestmentAmount + "元<br>")) : (investFlag = investFlag && !0, a.push(PPmoney.config.corico + "限投总额" + PrjAmount.singleInvestmentAmount + "元<br>"))),
    PrjAmount.maxAmount - 0 > 0 && (("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) - PrjAmount.maxAmount > 0 ? (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "单次限投" + PrjAmount.maxAmount + "元<br>")) : (investFlag = investFlag && !0, a.push(PPmoney.config.corico + "单次限投" + PrjAmount.maxAmount + "元<br>"))),
    /^[0-9]*[1-9][0-9]*$/.test(b) ? (investFlag = investFlag && !0, a.push(PPmoney.config.emico + Arabia_to_Chinese(("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) + "") + "<br>")) : (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "请输入整数<br>")),
    a.push(PPmoney.config.corico + "预计收益" + formatCurrency(("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) * PrjAmount.rate + "") + "元<br>");
    var c = maxInvestMoney();
    "1" == PrjAmount.PackageType && (100 * $investNum.val() - CirculationMoney > 0 && ($investNum.val((c / 100).toString().split(".")[0]), inputState(), PPmoney.dialog.quickClose({
        content: PPmoney.config.errico + "超出可投金额"
    })), 100 * $investNum.val() > CustomerAmount && (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "超出所选账户余额<br>"))),
    "1" != PrjAmount.PackageType && ($investNum.val() - CirculationMoney > 0 && ($investNum.val(c.toString().split(".")[0]), inputState(), PPmoney.dialog.quickClose({
        content: PPmoney.config.errico + "超出可投金额"
    })), $investNum.val() > CustomerAmount && (investFlag = investFlag && !1, a.push(PPmoney.config.errico + "超出所选账户余额<br>")));
    var d = "";
    return $.each(a,
    function(a, b) {
        d += b
    }),
    dialog.get("tipsBox").show($(".invest-bd")[0]).content(d).height(""),
    investFlag ? $investNum.removeClass("invest-num-error") : ($investNum.addClass("invest-num-error"), $tipsBox.css({
        opacity: 0,
        marginLeft: "20px"
    }).animate({
        marginLeft: 0,
        opacity: 1
    },
    100)),
    investFlag
}
function showInvest() {
    $("#prjBtn").on("click",
    function() {
        if (!isLogin) return void PPmoney.dialog.showModal({
            content: '<div class="p-20">' + PPmoney.config.errico + '您还没登录呢，立即去<a class="em" href="/login?returnurl=project/commondetail/' + PrjStatus.prjId + '">登录</a></div>',
            ok: function() {
                location.href = "/login?returnurl=project/commondetail/" + PrjStatus.prjId
            }
        });
        if ( - 1 == $.inArray(1, PrjStatus.canUseCoupon) && -1 == $.inArray(2, PrjStatus.canUseCoupon) && -1 == $.inArray(3, PrjStatus.canUseCoupon) && -1 == $.inArray(4, PrjStatus.canUseCoupon) && -1 == $.inArray(5, PrjStatus.canUseCoupon)) {
            if (("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) - CustomerAmount > 0 && "true" != PrjStatus.isFinancialFund && 1 == accountType) return void PPmoney.dialog.showModal({
                content: '<div class="p-20">' + PPmoney.config.errico + "余额不足，立即去充值？</div>",
                ok: function() {
                    location.href = "/"
                }
            });
            if (("1" == PrjAmount.PackageType ? 100 * $investNum.val() : $investNum.val()) - CustomerAmount > 0 && "true" != PrjStatus.isFinancialFund && 1 != accountType) return void PPmoney.dialog.showModal({
                content: '<div class="p-20">' + PPmoney.config.errico + "该账户可用余额不足</div>"
            })
        }
        return investFlag ? (dialog.get("tipsBox").close(), void(myIframe = PPmoney.dialog.iframe({
            title: "确认信息",
            width: 500,
            url: "/Project/InvestConfirm?PackageId=" + PrjStatus.prjId
        }))) : void $tipsBox.css({
            opacity: 0,
            marginLeft: "20px"
        }).animate({
            marginLeft: 0,
            opacity: 1
        },
        100)
    }),
    $("#btnTotal").click(function() {
        var a = maxInvestMoney();
        $investNum.val("1" == PrjAmount.PackageType ? Math.floor(a / 100) : a),
        inputState()
    })
}
function closeInvestConfirmDialog() {
    myIframe.close().remove()
}
function maxInvestMoney() {
    var a;
    return a = isLogin ? PrjAmount.maxAmount - 0 > 0 ? PrjAmount.singleInvestmentAmount - 0 > 0 ? Math.min(CirculationMoney, PrjAmount.singleInvestmentAmount, PrjAmount.maxAmount, CustomerAmount) : Math.min(CirculationMoney, PrjAmount.maxAmount, CustomerAmount) : PrjAmount.singleInvestmentAmount - 0 > 0 ? Math.min(CirculationMoney, PrjAmount.singleInvestmentAmount, CustomerAmount) : Math.min(CirculationMoney, CustomerAmount) : PrjAmount.maxAmount - 0 > 0 ? PrjAmount.singleInvestmentAmount - 0 > 0 ? Math.min(CirculationMoney, PrjAmount.singleInvestmentAmount, PrjAmount.maxAmount) : Math.min(CirculationMoney, PrjAmount.singleInvestmentAmount) : PrjAmount.singleInvestmentAmount - 0 > 0 ? Math.min(CirculationMoney, PrjAmount.singleInvestmentAmount) : CirculationMoney
}
function init() {
    userInfo(),
    prjStatus(),
    loadInvestRecords(1),
    $investNum.val("1" == PrjAmount.PackageType ? 1 : 100)
}
var prjDataIndex = 0,
imgsArr = [],
_page_size = 6,
_tbody = $("#record_panel"),
$investBox = $("#pro-subside1-normal"),
$investNum = $("#investNum"),
$totalMoney = $("#total-money"),
CustomerAmount,
CirculationMoney,
investFlag = !0,
$tipsBox,
myIframe,
$prjStatusBtn = $("#prjStatusBtn"),
isLogin = !1,
isreservation = !1,
accountType = 1,
isDisableDailyBao = !1; !
function() {
    $("#prjImg").find(">div").each(function(a, b) {
        var c = [];
        $(b).find("img").each(function(a, b) {
            c.push({
                src: $(b).attr("src"),
                alt: "undefined" == typeof $(b).attr("alt") ? "图片": $(b).attr("alt")
            })
        }),
        imgsArr.push({
            title: $(b).find("h2").html(),
            content: c
        })
    });
    for (var a in imgsArr) {
        a = imgsArr[a];
        for (var b = '<div class="mod-prove"><h3>' + a.title + '</h3><div class="mod-prove-bd"><ul>',
        c = "",
        d = 0,
        e = a.content.length; e > d; d++) c += d % 2 ? '<div class="mod-prove-sub"><h4>' + a.content[d].alt + '</h4><a class="fancybox-thumbs" data-fancybox-group="gallery" href="' + a.content[d].src + '" title="' + a.content[d].alt + '"><img src="' + a.content[d].src + '" alt="' + a.content[d].alt + '"></a></div>' + (d + 1 != e ? "</li>": "") : '<li class="cf"><div class="mod-prove-sub"><h4>' + a.content[d].alt + '</h4><a class="fancybox-thumbs" data-fancybox-group="gallery" href="' + a.content[d].src + '" title="' + a.content[d].alt + '"><img src="' + a.content[d].src + '" alt="' + a.content[d].alt + '"></a></div>';
        b += c + "</li></ul></div>" + (e > 2 ? '<a href="javascript:void(0)" class="unslider-arrow prev"><span class="caret-l"></span></a><a href="javascript:void(0)" class="unslider-arrow next"><span class="caret-r"></span></a>': "") + "</div>",
        a.content.length > 0 && $(".pro-subside2").append(b)
    }
} (),
!
function() {
    $(".pro-tab-item").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
        var a = $(this).index(".pro-tab-item");
        $(".pro-tab-pane").eq(a).addClass("active").siblings().removeClass("active");
        
    }),
    $(".fancybox-thumbs").fancybox({
        helpers: {
            title: {
                type: "inside"
            }
        },
        afterLoad: function() {
            this.title = this.title + "(" + (this.index + 1) + "/" + this.group.length + ")"
        }
    }),
    $(".pro-subside2 .mod-prove-bd").each(function(a, b) {
        var c = $(b).unslider({
            speed: 200,
            delay: !1
        });
        $(b).parent().find(".unslider-arrow").click(function() {
            var a = $(this).attr("class").split(" ")[1];
            c.data("unslider")[a]()
        })
    }),
    defaultImg(".pro-wrap img"),
    $(".pro-tab-pane-item").find("strong").each(function(a, b) {
        0 == $(b).text().length && $(b).remove()
    });
    var a = {
        A: "债务的支付能力和长期债务的偿还能力较强；经营处于良性循环状态；<br>偿还债务的能力较强，较易受不利经济环境的影响，盈利能力和偿债能力会产生波动，违约风险较低；",
        AA: "债务的支付能力和长期债务的偿还能力很强；经营处于良性循环状态；<br>偿还债务的能力很强，受不利经济环境的影响较小，违约风险很低；",
        AAA: "债务的支付能力和债务的偿还能力具有最大保障；<br>偿还债务的能力极强，基本不受不利经济环境的影响，违约风险极低；"
    };
    PPmoney.dialog.hoverTips({
        elem: $(".u2-06"),
        content: '<div class="p-10">' + a[$("#prjLevel").text()] + "</div>"
    }),
    dialog({
        id: "tipsBox",
        align: "right",
        quickClose: !1,
        autofocus: !1
    }),
    $tipsBox = $("div[aria-labelledby='title:tipsBox']"),
    "true" == PrjStatus.isFinancialFund && $(".pro-subside1-invest").hide().after("<p class='em p-10'>仅支持理财基金</p>")
} (),
$investNum.on({
    blur: function() {},
    keyup: function() {
        setTimeout(function() {
            inputState()
        },
        20)
    }
});