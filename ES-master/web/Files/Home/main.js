var parsed_data;
var private_token="?private_token="+sessionStorage.getItem("private_token");
var link="https://git.dei.uc.pt/api/v3/projects"
var members="/members/"
var project_members=[]



$(document).ready(function(){
	$("#username").html(sessionStorage.getItem("username"));
	$("#user_img").attr('src', sessionStorage.getItem("avatar_url"));
  get_stuff(1,link+private_token);
});


function parse(data){//recebe os dados JSON e converte para um objecto iteravel
  parsed_data=JSON.parse(data);
}


function get_stuff(type,url){
  console.log(url);
  	var request= new XMLHttpRequest();
    request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	parse(request.responseText);
      	if(type==1)
          get_all_projects(parsed_data);
    };
  }
  request.open('get',url,true);
  request.send();
}

/****************************************/
function get_all_projects(data){
  console.log(data);
  var $addToTableEntries=$('#Tables_entries');
  for(i=0;i<data.length;i++){
    s="<tr><td class='tree'><a href'#' onclick=javascript:Handle('"+data[i].id+"')"+">"+data[i].name+"</a></td></tr>"//Creates a appropriate element
    $addToTableEntries.append(s);
  }
}

function Handle(stuff){
  sessionStorage.setItem("id", stuff);
  window.location.href = "../index.html";
}



