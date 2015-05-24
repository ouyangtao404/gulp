$(document).ready(function () {
	$('form').each(function (i, el) {
		console.log(el);
		el.reset();
	});


	//定义顶部Banner可固定
	var _fixBtn = $('#fixedBtn'), _b = $('.banner');
	_fixBtn.bind('click', function (e) {

		if (window.localStorage) {
			var _ls = localStorage["banner"], _fx = "fixed";

			if (_ls != _fx) {
				_b.addClass(_fx);
				localStorage["banner"] = _fx;
				_fixBtn.addClass(_fx);
			} else {

				_b.removeClass(_fx);
				localStorage["banner"] = "";
				_fixBtn.removeClass(_fx);
			}
		}
	});
	_b.addClass(localStorage["banner"]);
	_fixBtn.addClass(localStorage["banner"]);
	//定义顶部Banner可固定

});

/* auto complete for p-banner search*/
/*
  $(function() {   
    $('#appsearch').autocomplete({
		
		source: function( request, response ) {
			
			//alert(request.term);
			reqData='{"id":348,"system":{"productVer":"0","lang":"cn","imei":"","productId":"0"},"method":"searchAppNameSimple","params":{"keyWord":"'+request.term+'","size":12}}';
			$.ajax({
				url: "http://apps.aliyun.com/as.htm",
				data:{"reqData":reqData},
				dataType: "json",
				type:"post",
				success: function( data ) {
					_temp=data.result.appList.split(',');
					response(_temp);
				}	 	
	    	})	
		},
		select: function( event, ui ) {
			this.value=ui.item.value;
			$(this).parent().submit();		
		}
    });
});

//  $(function() {
//    $('#appsearch').autocomplete({
//
//		source: function( request, response ) {
//
//			//alert(request.term);
//			reqData='{"id":348,"system":{"productVer":"0","lang":"cn","imei":"","productId":"0"},"method":"searchAppNameSimple","params":{"keyWord":"'+request.term+'","size":12}}';
//			$.ajax({
//				url: "http://apps.yunos.com/web.htm",
//				data:{"reqData":reqData},
//				dataType: "json",
//				type:"post",
//				success: function( data ) {
//					_temp=data.result.appList.split(',');
//					response(_temp);
//				}
//			})
//		},
//		select: function( event, ui ) {
//			this.value=ui.item.value;
//			$(this).parent().submit();
//		}
//    });
//});
*/


$.extend({
	/**
	 * {
	 *      start : 初始时间input
	 *      end   : 结束时间input
	 * }
	 * @param config
	 */
	initDate: function (config) {
//		var start = config.start,
//			end = config.end,
//			start_t = 0,
//			end_t = 0,
//			_con = {
//				maxDate: "+0d"
//			};
//		_con = $(_con, config);
//		seajs.use('datepicker', function () {
//			start.datepicker({
//				dateFormat: 'yy-mm-dd',
//				maxDate: _con.maxDate,
//				onSelect: function (dateText, inst) {
//					start_t = dateText.replace(/-/g, '') - 0;
//					(start_t <= end_t || end_t === 0) ? 1 : (function () {
//						end.val('');
//						end_t = 0;
//					})();
//				}
//			});
//			end.datepicker({
//				dateFormat: 'yy-mm-dd',
//				maxDate: _con.maxDate,
//				onSelect: function (dateText, inst) {
//					end_t = dateText.replace(/-/g, '') - 0;
//					(start_t <= end_t) ? 1 : (function () {
//						start.val('');
//						start_t = 0;
//					})();
//				}
//			});
//		});

		var start = config.start,
			end = config.end;
		seajs.use('lhgcalendar', function () {
			start && start.calendar({
				'format': 'yyyy-MM-dd HH:mm:ss'
			});
			end && end.calendar({
				'format': 'yyyy-MM-dd HH:mm:ss'
			});

		});
	},
	goTop: function () {
		var topNode = $('<a href="#" class="iconfont go-top">&#61534</a>'),
			body = $('body'),
			doc = $(document),
			flag = 1;
		topNode.appendTo('.sub-col');
		$(window).scroll(function () {
			if (doc.scrollTop() > 200 && !!flag) {
				flag = 0;
				topNode.addClass('go-top-display');
			} else if (doc.scrollTop() < 200 && !flag) {
				flag = 1;
				topNode.removeClass('go-top-display');
			}
		});
	},
	selectLink: function (firSelectNode, layout_map, callback) {
		for (var i in layout_map) {
			if(layout_map[i].num){
				layout_map[i].num = layout_map[i].num.split(',');
			}
		}
		var str = '<label>位置:</label>' +
			'       <select name="position" class="J_pos-select">' +
			'			<% for(var i = 0, l = this.num.length; i < l; i++){ var acc=this.num[i]; %>' +
			'			<option value="<%=acc%>"><% if(acc==="all"){ %> 全部 <%}else{%> <%=acc%><% } %></option>' +
			'			<%}%>' +
			'		</select>',
			strIndex = function(str, arr){
				for(var i = 0, m = arr.length; i != m; i++){
					if(arr[i]===str){
						return i;
					}
				}
			};

		//...
		var lay = firSelectNode[0].options[firSelectNode[0].selectedIndex].text;
		lay = lay === '全部' ? 'all' : lay;
		var domstr = $.jqote(str, layout_map[lay]),
			insertNode = $(domstr);
		insertNode.insertAfter(firSelectNode);
		if(lay !== 'all'){
			console.log($('.J_pos-select')[0])

//			$('.J_pos-select')[0].selectedIndex = 3;
			$('.J_pos-select')[0].selectedIndex = strIndex(layout_map.curPos, layout_map[lay].num);
		}


		firSelectNode.change(function () {
			lay = firSelectNode[0].options[firSelectNode[0].selectedIndex].text;
			lay = lay === '全部' ? 'all' : lay;
			domstr = $.jqote(str, layout_map[lay]);
			insertNode.remove();
			insertNode = $(domstr);
			insertNode.insertAfter(firSelectNode);
			callback && callback($(insertNode[2]));
		});
		return $(insertNode[2]);
	},
	//页码部分初始化 by:baohe.oyt
	pagination: function (formNode, paginationBox, callback) {
		var pagination = paginationBox ? $('.p-pagination', paginationBox) : $('.p-pagination'),
			dom = {
				pageIndex: $('.J_pageIndex', formNode),
				pageSize: $('.J_pageSize', formNode),
				pageCount: $('.J_pageCount', formNode),
				gotoIpt: $('.goto', pagination)
			};
		//翻页
		pagination.bind('click', function (e) {
			e.preventDefault();
			var tar = $(e.target);
			var cIndex = parseInt(dom.pageIndex.val(), 10);
			//上一页
			if (tar.hasClass('page-prev')) {
				changePage({
					pageIndex: cIndex - 1
				});
			}
			//下一页
			if (tar.hasClass('page-next')) {
				changePage({
					pageIndex: cIndex + 1
				});
			}
			//go
			if (tar.hasClass('page-go')) {
				var pageIndex = parseInt(dom.pageIndex.val(), 10),
					page = parseInt(dom.gotoIpt.val(), 10);

				if (page === pageIndex) {
					dom.gotoIpt.val('');
					return;
				}
				changePage({
					pageIndex: page
				});
			}
			//每页多少条
			if (tar.hasClass('J_page-size')) {
				changePage({
					pageIndex: 1,
					pageSize: parseInt(tar.html(), 10)
				});
			}
		});
		/**
		 * 修改页码信息的input的value并且重新搜索
		 * @param o
		 * @private
		 */
		function changePage(o) {
			var page = o.pageIndex,
				pageCount = parseInt(dom.pageCount.val(), 10);

			if (page < 1 || page > pageCount || isNaN(page)) {
				dom.gotoIpt.val('');
				return;
			}
			if (o.pageIndex) {
				dom.pageIndex.val(o.pageIndex);
			}
			if (o.pageSize) {
				dom.pageSize.val(o.pageSize);
			}
			if (callback) {
				callback();
				return;
			}
			formNode.submit();
		}
	}
});