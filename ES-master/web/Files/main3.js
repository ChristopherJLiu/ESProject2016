///////////////////////////////////////////////////////////////////
//////////////           Global variables            //////////////
///////////////////////////////////////////////////////////////////

var target_api_host = "http://localhost:8082/api/"
var target_api_version = "v2";
var target_project_id = sessionStorage.getItem("id");
var private_token = sessionStorage.getItem("private_token");
var GET_FILES_IN_DIRECTORY = "get_files_in_directory";
var GET_ARTIFACT_COMMIT_HISTORY = "get_artifact_commit_history";
var GET_MEMBERS="get_members";


var traversed_paths = [];
var current_directory="";
var parsed_data;
///////////////////////////////////////////////////////////////////////////
var members="https://git.dei.uc.pt/api/v3/projects/785/members/?private_token="+private_token;


$(document).ready(function(){//All stuff called when doc is rdy
	$("#username").html(sessionStorage.getItem("username"));
	$("#user_img").attr('src', sessionStorage.getItem("avatar_url"));
      get_files_in_current_directory();
      send_api_request(members,GET_MEMBERS);
});

function get_project_members(data){//Mesmo que get_project_ids so que para membros
  var $addToTableEntries=$('#Member_entries');

  for(i=0;i<data.length;i++){
    $addToTableEntries.append("<tr><td>"+"<img class='userAvatar' src='"+data[i].avatar_url+"' alt='icon'> "+data[i].name+"</td></tr>");
  }
}



///////////////////////////////////////////////////////////////////
//////////////  File hierarchy navigation functions  //////////////
///////////////////////////////////////////////////////////////////

function move_up_directory() {
	current_directory="";
	traversed_paths.pop();
	for(var i = 0; i < traversed_paths.length;i++){
		current_directory += traversed_paths[i];
	}
}

function move_into_directory(folder_name){
	current_directory="";
	traversed_paths.push(folder_name+"/");
	for(var i = 0; i < traversed_paths.length; i++){
		current_directory += traversed_paths[i];
	}
}


///////////////////////////////////////////////////////////////////
//////////////    Generic URL building functions     //////////////
///////////////////////////////////////////////////////////////////
function build_path_parameters() {
	var path_parameters = "";

	for (var i = 0; i < arguments.length; i++) {
		path_parameters += arguments[i]+"/";
	}
	return path_parameters;
}

function build_query_parameters() {
	var query_parameters = "";
	var argument_name = "";
	var argument_value = "";

	for (var i = 0; i < arguments.length; i=i+2) {
		argument_name = arguments[i];
		argument_value = arguments[i+1];
		if (i == 0) {
			query_parameters += "?"+argument_name+"="+argument_value;
		} else {
			query_parameters += "&"+argument_name+"="+argument_value;
		}
	}
	return query_parameters;
}

///////////////////////////////////////////////////////////////////
//////////////    User Stories related functions     //////////////
///////////////////////////////////////////////////////////////////


function get_files_in_current_directory() {
	var query_parameters;
	var path_parameters = build_path_parameters(target_api_version, "projects", target_project_id, "tree");
	if(traversed_paths.length == 0)
		query_parameters = build_query_parameters("private_token", private_token);
	else
		query_parameters = build_query_parameters("private_token", private_token, "directory", current_directory);
	var request_url = target_api_host+path_parameters+query_parameters;
	send_api_request(request_url,GET_FILES_IN_DIRECTORY);
}

function get_artifact_commit_history(file_name) {
	var path_parameters = build_path_parameters(target_api_version, "projects", target_project_id, "commits");
	var query_parameters = build_query_parameters("private_token", private_token, "file_path", current_directory+file_name);

	var request_url = target_api_host+path_parameters+query_parameters;
	send_api_request(request_url,GET_ARTIFACT_COMMIT_HISTORY);	 
}


///////////////////////////////////////////////////////////////////
//////////////         API Calling functions         //////////////
///////////////////////////////////////////////////////////////////


function send_api_request(url,type){
	console.log(url);
	var data;
	var request= new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log(request.responseText);
        data=JSON.parse(request.responseText);
        console.log(data);
        //IMPORTANT: UNCOMMENT THE FOLLOWING 3 LINES SO IT CAN SEE IF RECIVED ERROR OR NOT
        if(data.code!=undefined){
        	alert_error(data);
        	return 0;
        }
        switch(type){
        	case GET_ARTIFACT_COMMIT_HISTORY:
        		update_html_commits(data);
        		break;
        	case GET_FILES_IN_DIRECTORY:
        		update_html_files(data);
        		break;
        	case GET_MEMBERS:
        		get_project_members(data);
        		break;
        }
        
      };
    }
  request.open('get',url,true);
  request.send();
}


///////////////////////////////////////////////////////////////////
//////////////         Fill  HTML functions          //////////////
///////////////////////////////////////////////////////////////////


function update_html_files(data){
	var $addToTableEntries=$('#Tables_entries');//Creates a Table
  	var folderIcon = "<img src='pics/folder.png' alt='icon'>  ";//Icon
  	var fileIcon = "<img src='pics/file.png' alt='icon'>  ";//Icon
  	if(traversed_paths.length != 0){
  		aux="<tr><td><a href'#' onclick=javascript:Handle(1)"+">"+folderIcon+"..."+"</a></td></tr>"
  		$addToTableEntries.append(aux);
  	}
  	for(i=0;i<data.length;i++){//Iterates through all the data 
    	if (data[i].type=="tree"){//Checks if is a folder
      		aux="<tr><td class='tree'><a href'#' onclick=javascript:Handle('"+data[i].name+"',2)"+">"+folderIcon+data[i].name+"</a></td></tr>"//Creates a appropriate element
      		$addToTableEntries.append(aux);//Adds to the table
    	}
    	else{
      		aux="<tr><td class='file'><a href'#' onclick=javascript:Handle('"+data[i].name+"',3)"+">"+fileIcon+data[i].name+"</a></td></tr>"//Creates a appropriate element
      		$addToTableEntries.append(aux);//Adds to the table
    }
  }

}

function update_html_commits(data){
	//Not testable ATM
	var $addToTableEntries=$('#Tables_entries');
	if(data.length==0){
		$("#Tables_entries").append("<tr><td> No commits related to this file </td></tr>")
	}
	for(i=0;i<data.length;i++){
        $("#Tables_entries").append("<tr><td><div class='commit_info'><p class='commit_text'> "+data[i].created_at+" </p><p class='commit_text'> "+data[i].author_name+" </p><p class='commit_text'> "+data[i].message+"</p></div></td></tr>");
	}
	$('#button_div').html("<a href=# onclick=javascript:Back_Handler() id='button_back'><p id='go_back_p'>Go Back</p></a>");
	$('#button_div').show();
}

///////////////////////////////////////////////////////////////////
//////////////         Helper functions              //////////////
///////////////////////////////////////////////////////////////////

function Handle(){
	//Added a button to go back after showing commits
	$("#Tables_entries tr").remove();
	if(arguments.length==1){
		move_up_directory();
		Change_Header_Name();
		get_files_in_current_directory();
	}
	else if (arguments.length==2){
		if(arguments[1]==2){
			move_into_directory(arguments[0]);
			Change_Header_Name();
			get_files_in_current_directory();
		}
		else if(arguments[1]==3){
			$('#file_select h4').text("Timeline of:"+arguments[0]);
			get_artifact_commit_history(arguments[0]);
		}
	}
}

function alert_error(data){//Alerts error
	alert("Error:"+data.code+"Cause:"+data.cause+"Solution:"+data.solution);
	alert("Reload the page.");
}


function Change_Header_Name(){//Changes the Header name so it can match with which folder is the user currently on
var aux=".../";
	if(traversed_paths.length==0)
		$('#file_select h4').text("Root");
	else{
		console.log(traversed_paths);
		for(i=traversed_paths.length-3;i<traversed_paths.length;i++){
			if(traversed_paths[i]!=undefined)
				aux+=traversed_paths[i];
		}
		$('#file_select h4').text(aux);
	}
}


function Back_Handler(){//Handles the Back button that shows when a file is clicked
	$("#Tables_entries tr").remove();//Not tested because of commits are not working so theres no way to know if the elements are being removed or not
	$('#button_div').hide();
	Change_Header_Name();
	get_files_in_current_directory();
}



