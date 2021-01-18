var catId = sessionStorage.getItem("categoryId");
var percent = sessionStorage.getItem("percentage");
var title = sessionStorage.getItem("title");
var tQ = sessionStorage.getItem("totalQues");


$(document).ready(function(){
    var userName = sessionStorage.getItem("username");
    $('.username_session').append(userName);
    // -----------------Filling the scores ----------------
    $("#marks").append(sessionStorage.getItem("marks")+"/"+tQ);
    $("#percent").append(percent+" %");
    $("#time").append(sessionStorage.getItem("time")+" min");
    $("#quiz-title").append(title); 
    if(percent>30){
        if(percent>90){
            $('#emoji').attr("src","../images/pro.png");
        }else{
            $('#emoji').attr("src","../images/above.png");
        }
    }else{
        $('#emoji').attr("src","../images/noob.png");
    }

    sessionStorage.removeItem("categoryId");
    sessionStorage.removeItem("percentage");
    sessionStorage.removeItem("title");
    sessionStorage.removeItem("totalQues");
    sessionStorage.removeItem("marks");
    sessionStorage.removeItem("time");

    //----------------required variables for graph--------------------
    var marks = [];
    var labels = [];
    var label;

    var link = "http://localhost:3000/users/"+sessionStorage.getItem("userId")+"/quiz_data?categoryId="+catId
   
    
    
    //-----------------fetching previous exam datas-----------------
    $.ajax({
        type: "GET",
        async: "false",
        url: link,
        success: function (response) {
            response.forEach(element => {
                marks.push(element.marks),
                label = element.dateTime.split(" "),
                labels.push(label[0])
            });
            //--------------calling create graph here-------------
            createGraph();
        }
    });

    //-----------graph creation here---------------
    function createGraph(){
     
        marks.push(tQ);
        var ctx = $("#myChart")[0].getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: marks,
                backgroundColor: 'rgba(36, 38, 51, 0.9)',
                borderWidth: 1,
                barPercentage: 0.8,
                responsive: true,
                
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    }
})



// Logout from Session and clear Session Storage 
function remove(){
    sessionStorage.clear();
    window.location.replace("./");
  }
  // Prevent User From Direct URL Access 
  if (!sessionStorage.getItem('isActive') ) {
     window.open("../html/error/", "_self");
  }
