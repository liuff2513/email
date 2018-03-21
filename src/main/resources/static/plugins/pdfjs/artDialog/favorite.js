jQuery(document).ready(function(){
		jQuery("#sub").click(function(){
			jQuery.ajax({type : "post",  
		       url : "/favorite/add/favorite.htm",
		       data : {
		           projectName : "钉子",  
		           projectUrl  : "www.google.com"
		       },
		       success : function(data) {  
	             alert("新增成功！");  
	           },  
	           error : function(data) {  
	             alert("error");
           }   
       });
	});
});