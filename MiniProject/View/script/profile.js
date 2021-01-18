$(document).ready(function (){
    var userName = sessionStorage.getItem("username");
    $('.username_session').append(userName);
    var id= sessionStorage.getItem("userId");
    $.ajax({
        url: "http://localhost:3000/users/"+id,
        type: 'GET',
        success:function(response){
          
            $("#profileName").val(response.name);
            $("#profileEmail").val(response.username);
            $("#profilePassword").val(response.password);

            $("#editName").val(response.name);
            $("#editUsername").val(response.username);
            $("#editPassword").val(response.password);
        }
    });  
});


// Function call for user profile update and Patch
    function updateprofile(){
          event.preventDefault();
          var userId=sessionStorage.getItem("userId");
          var flag= confirm("Are you sure want to edit ?"+userId);
          if(flag){
                $.ajax({
                        url:"http://localhost:3000/users/"+userId,
                        type: "PATCH",
                        data: {
                          name: $('#editName').val(),
                          username: $('#editUsername').val(),
                          password: $('#editPassword').val()
                          },
                        success: function (data){  
                          // console.log(data);
                        }
                });
            }else{
                alert("aborted");
            }
      }


 
// Logout from Session and clear Session Storage 
function remove(){
  sessionStorage.clear();
  window.location.replace("./");
}
// Prevent User From Direct URL Access 
if (!sessionStorage.getItem('isActive') ) {
   window.open("../html/error/", "_self");
}
