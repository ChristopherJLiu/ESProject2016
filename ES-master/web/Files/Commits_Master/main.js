var parsed_data;
var private_token="?private_token="+sessionStorage.getItem("private_token");
var link="https://git.dei.uc.pt/api/v3/projects/"+sessionStorage.getItem("id");
var commit_link="/repository/commits/"
var members="/members/"
var project_members=[]
var project_commits=[]
var detailed_commits=[]
var n_added_commits=0
var page_number=0


$(document).ready(function(){
	$("#username").html(sessionStorage.getItem("username"));
	$("#user_img").attr('src', sessionStorage.getItem("avatar_url"));
  get_stuff(1,link+commit_link+private_token+"&page="+page_number);
  get_stuff(2,link+members+private_token);
});


function parse(data){//recebe os dados JSON e converte para um objecto iteravel
  parsed_data=JSON.parse(data);
}


function get_stuff(type,url){
  	var request= new XMLHttpRequest();
    request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	parse(request.responseText);
      	if(type==1)
        	get_project_commits(parsed_data);
      	else if(type==2)
        	get_project_members(parsed_data);
    	else if(type==3)
        	detailed_commits.push(parsed_data);
    };
  }
  request.open('get',url,true);
  request.send();
}

/****************************************/
function get_project_members(data){//Members
  var $addToTableEntries=$('#Member_entries');
  var userIcon = [];

  for(i=0;i<data.length;i++){
    project_members.push(data[i].name);
    userIcon.push(data[i].avatar_url);
    $addToTableEntries.append("<tr><td>"+"<img class='userAvatar' src='"+data[i].avatar_url+"' alt='icon'> "+project_members[i]+"</td></tr>");
  }
  console.log(project_members);
}


function get_project_commits(data){//Commits
	n_added_commits=0;
  for(i=0;i<data.length;i++){
    project_commits.push(data[i]);
    n_added_commits+=1;
  }
  if(n_added_commits==20){
  	page_number+=1;
  	get_stuff(1,link+commit_link+private_token+"&page="+page_number);
  }
  else{
  	console.log(0);
  	console.log(project_commits);
  	get_project_commits_single();
  	display_commits();
  }
}

function get_project_commits_single(){
	for(i=0;i<project_commits.length;i++){
		s=link+commit_link+project_commits[i].id+"/diff"+private_token;
		get_stuff(3,s);
	}
	console.log(detailed_commits);
}



function display_commits(){
	var $addToTableEntries=$('#Tables_entries');
	for(i=0;i<project_commits.length;i++){
		s="<tr><td>"+"Author:"+project_commits[i].author_name+" Title:"+project_commits[i].title+" ID:"+project_commits[i].short_id+"</td></tr>";
    	$addToTableEntries.append(s);
	}
}
/****************************************/