var parsed_data;
var private_token="?private_token="+sessionStorage.getItem("private_token");
var link="https://git.dei.uc.pt/api/v3/projects/"+sessionStorage.getItem("id");
var commit_link="/repository/commits"
var members="/members/"
var project_members=[]
var project_commits=[]
var single_member_commits;
var page_number=0
var commit_members=[]


$(document).ready(function(){
  $("#username").html(sessionStorage.getItem("username"));
  $("#user_img").attr('src', sessionStorage.getItem("avatar_url"));
  get_stuff(2,link+members+private_token);
  console.log(sessionStorage.getItem("id"));
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
    commit_members.push(data[i].name);
    userIcon.push(data[i].avatar_url);
    $addToTableEntries.append("<tr><td>"+"<img class='userAvatar' src='"+data[i].avatar_url+"' alt='icon'> "+project_members[i]+"</td></tr>");
  }
  get_stuff(1,link+commit_link+private_token+"&page="+page_number);
}


function get_project_commits(data){//Commits
	n_added_commits=0;
  for(i=0;i<data.length;i++){
    project_commits.push(data[i]);
    if(commit_members.indexOf(data[i].author_name)==-1){
    	commit_members.push(data[i].author_name);
    	console.log(commit_members);
    }
    n_added_commits+=1;
  }
  if(n_added_commits==20){
  	page_number+=1;
  	get_stuff(1,link+commit_link+private_token+"&page="+page_number);
  }
  else{
  	display_choose_members();
  }
}

function display_choose_members(){
	var $addToTableEntries=$('#Tables_entries');
	for(i=0;i<commit_members.length;i++){
		name=commit_members[i].split(' ').join('+');
    console.log(name);
		s="<tr><td class='tree'><a href'#' onclick=javascript:Handle('"+name+"')"+">"+commit_members[i]+"</a></td></tr>"//Creates a appropriate element
		$addToTableEntries.append(s);
    console.log(s);
	}
}

function Handle(username){
	$("#Tables_entries tr").remove();
	username=username.split('+').join(' ');
  $('#file_select h4').text("Contributions of user:"+username);
	display_commits(username);
}

function Back_Handler(){//Handles the Back button that shows when a file is clicked
//Not tested because of commits are not working so theres no way to know if the elements are being removed or not
	$('#button_div').hide();
	$("#Tables_entries tr").remove();
	$('#file_select h4').text("See contributions of an user:");
	display_choose_members();
}




function display_commits(user){
	var n=0;
	var $addToTableEntries=$('#Tables_entries');
	for(i=0;i<project_commits.length;i++){
		if(project_commits[i].author_name==user){
			s="<tr><td>"+" Title:"+project_commits[i].title+" ID:"+project_commits[i].short_id+"</td></tr>";
    		$addToTableEntries.append(s);
    		n++;
    	}
	}
	if(n==0)
		$addToTableEntries.append("<tr><td> No user commits found </td></tr>");
	$('#button_div').html("<a href=# onclick=javascript:Back_Handler() id='button_back'><p id='go_back_p'>Go Back</p></a>");
	$('#button_div').show();
}


/****************************************/

