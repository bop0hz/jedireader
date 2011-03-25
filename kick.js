/*************************************************
2011 Sergey Lubenin web_lab@mail.ru
*************************************************/
var current_pretendent = "";
var vhosts = [
				[/(http\:\/\/)?(www\.)?youtube\.(com|ru)\/watch\?v\=/gim , "<iframe title=\"YouTube video player\" width=\"425\" height=\"349\" src=\"http://www.youtube.com/embed/{{here}}\" frameborder=\"0\" allowfullscreen></iframe>"]
				
			 ];

$(document).ready(function(){
	
	$("textarea[name='req_message']").bind("keypress",function(event){
	
		var ev = event||window.event;
		var kk = ev.keyCode;
		var ctrl = ev.ctrlKey;
		
		if ((kk==10||kk==13) && ctrl) 
			$("form[name='post'] input[type='submit']").get(0).click();

	}); 
	
	$(".postmsg a").each(function(){
	
		
		var msg = $(this).attr("href").replace(/\&.*$/gim,'');
		
		for(var i=0,j=vhosts.length;i<j;i++) {
			
			if(vhosts[i][0].test(msg)){
		
			msg = msg.replace(vhosts[i][0],vhosts[i][1].split('{{here}}')[0]);
			
			$(this).replaceWith(msg+vhosts[i][1].split('{{here}}')[1]);
			
			}
			
		
		}

	});


});



//удаление дебильных иконок
    chrome.extension.sendRequest({localstorage: "headerButtons"}, function(response){
      if (response["headerButtons"] == "true") 
        $("#brdmenu ~ .inbox:first").remove();
    });

//удаление блока Перехода
    chrome.extension.sendRequest({localstorage: "goToForm"}, function(response){
      if (response["goToForm"] == "true") 
        $("#brdfooter").remove();
    });    

//удаление футера
    chrome.extension.sendRequest({localstorage: "footer"}, function(response){
      if (response["footer"] == "true") {
        $("#punindex > .box").remove();
        $("#punviewforum > .box").remove();
        $("#punviewtopic > .box").remove();
      };
    });
    
//удаление веток			
    chrome.extension.sendRequest({localstorage: "branches"}, function(response){
	  var kickedBranches = response["branches"].split('###');
      $("h2 > span").each(function(){
        if (in_array($(this).text(),kickedBranches)) $(this).parents(".blocktable,.block").remove();
      });
    });

	chrome.extension.sendRequest({localstorage: "kicked"}, function(response) { 
		
		/**/
				
		/**/
		var st = response.kicked.split("=#####=");
	
		
	$("body").append("<div id='popupp' style='position:absolute;padding:9px;-webkit-border-radius:10px;font-size:12px;background:#EEE;-webkit-box-shadow:0 0 3px 4px #CCC;display:none;z-index:5000;'><a id='to_s' style='color:red' href='javascript:;' onclick='addToStorage(current_pretendent,st)'>В список!</a><br /><br /><a style='color:green' href='javascript:;' id='from_s'>Реабилитировать</a></div>");
	
	$("#to_s").click(function() {

	var uy = current_pretendent;
	var lst = st;
	var lsst = st.join('=#####=');
	if ( !in_array(uy,lst) && uy!="" ){
		
		var t =(lsst=="" ? '':lsst+'=#####=')+uy;
			lsst = t;
			chrome.extension.sendRequest({localstorage: "set",settedValue:lsst},function(response){document.location.reload()});
	
		} else {
			
			alert('Эта чучундра уже в списке!');
			
			}

	});
	
	
	
	function a_index(arr,fin){
		for(var i=0,l=arr.length;i<l;i++){
			if (arr[i]==fin) return i;
		}
	}	

	$("#from_s").click(function(){
	var uy = current_pretendent;
	var lst = st;
	if (in_array(uy,lst) && uy!=""){
		var aj = a_index(lst,uy);
		if(aj>=0) delete lst[aj];
		
			chrome.extension.sendRequest({localstorage: "set",settedValue:lst.join('=#####=')},function(response){document.location.reload()});
	
		} else {
			
			alert('Его и так там нету!');
			
			}
			});
		
		
		$("div.blockpost a[href*='profile.php']").bind("contextmenu",function(event){
		var target = (event||window.event);
		var x = target.clientX+document.body.scrollLeft+5;
		var y = target.clientY+document.body.scrollTop+5;
		current_pretendent = $(this).text()||"";
		$("#popupp").css({'left':x+'px','top':y+'px'}).show();
		$("div.box").click(function(){
			
				var ob = $("#popupp");
			
				if (ob.is(':visible')) 
					ob.hide("fast"); 
					
			});		
		//if (in_array(text,st)  && text!="")
		
		return false});
		
			$("div.blockpost a[href*='profile.php']").each(function(){
				
				var text = $(this).text()||"";
				
				if (in_array(text,st)  && text!="") {
					$(this)
					.parents("div.blockpost")
					.children("h2")
					.css({'opacity':'0.4'})
					.html(
						$(this)
						.parents("div.blockpost")
						.children("h2")
						.html()
						+"<span style='color:#666;margin-left:30px;'>"
						+"Сообщения этого персонажа нам не интересны.&nbsp;"
						+"<a href='javascript:;' class='shhd' style='color:#555;text-decoration:none;'>Или интересны?</a></span>"
						);
					$(this)
					.parents("div.blockpost")
					.children("div.box")
					.hide();
					
				} 
			});
			
			
			
			
			$("blockquote").each(function(){
			
				var text = $(this).find("h4").text().replace(/\s+написал\:/gim,'')||"";
				
				if(in_array(text,st) && text!="") $(this).css({'opacity':'0.1'});
			
			});
			
			
			$(".byuser").each(function(){
			
				var text = $(this).text().replace(/^от\s+/gim,'')||"";
			
				if (in_array(text,st) && $(this).parents("td").is(":first-child") && text!="") 
					 $(this)
					 .parents("tr")
					 .children("td")
					 .css({'opacity':'0.1'});
			
			});
	
	
			$(".shhd").click(function(){
			
				var ob = $(this).parents("div.blockpost").children("div.box");
			
				if (ob.is(':visible')) 
					ob.hide(); 
				else 
					ob.show('fast');
			
			});
			
	
	});
	
	
	

