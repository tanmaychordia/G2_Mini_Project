var cat_length = null;
var flag = true;
$("document").ready(()=>{

    let i = 0;
    let imgUrl = "https://syntaxxx.com/wp-content/uploads/2014/08/html5-logo-600-580x580.jpg";
    //let quizDom = '<div class="card col" style="width: 18rem;"><img class="card-img-top" src='+'${imgUrl}'+'alt="Card image cap"><div class="card-body"><h5 class="card-title">HTML Quiz</h5><p class="card-text">HTML Quiz to test ability.</p><a href="#" class="btn btn-success">Load Quiz</a></div></div>';
    //

    $('#test').html();

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/categories",
        async: "false",
        success: function (response) {
            cat_length = response.length;

         response.forEach(element => {
             // let quizDom = `<div class="col-md-3 col-sm-4 col-lg-3 "><div class="card mb-3 size-img"><img class="card-img-top" src=${element.img} alt="Card image cap"><div class="card-body"><h5 class="card-title">${element.name}</h5><p class="card-text">${element.data}</p><button class="btn border-0 text-white" value="${element.id}">Load Quiz</button></div></div></div>`;
             let quizDom = "<div class='col-md-4 col-sm-6 col-xs-12 col-lg-3 p-2'><div class='card card-body peopleCarouselImg card-transition'><img class='img-fluid' src='"+element.img+"'><span class='overlay'></span><h3 class='ename'>"+element.name+"</h3> <br> <h4> <button class='btn text-white ' onclick='startQuiz(this);'  value='"+ element.id+","+element.name+"'> Start </button>  <h4></div></div> </div>";
             $('#quizcard').append(quizDom);

         });
         randGenerator(cat_length);
         randGenerator(cat_length);
        }
    });

   //scorecard


    var userName = sessionStorage.getItem("username");


    $('.username_session').append(userName);

});

function startQuiz(e) {
    let data = e.value.split(',');
    sessionStorage.setItem("categoryId",data[0]);
    sessionStorage.setItem("title",data[1]);
    // sessionStorage.setItem("inExam",true)
    window.location.replace("../html/quiz-page.html");
}


// console.log(cat_length);
function randGenerator(data) {

    var rand = Math.floor(Math.random() * Math.floor(data));
    var marks = [];
    var labels = [];
    var label;

    var link = "http://localhost:3000/users/"+sessionStorage.getItem("userId")+"/quiz_data?categoryId="+rand

    $.ajax({
        type: "GET",
        async: "false",
        url: link,
        success: function (response) {
            if(!response.length){
                nullHandler();
            }else{
                response.forEach(element => {
                    marks.push(element.marks),
                    label = element.dateTime.split(" "),
                    labels.push(label[0])
                });
                createGraph();
            }
            function nullHandler(){
                if(flag){
                    flag=false;
                    $("#chart").hide();
                } else {
                    $("#chart1").hide();
                }
            }
            function createGraph(){
              marks.push(15);
                if(flag){
                    var ctx = $("#myChart")[0].getContext('2d');
                    flag=false;
                } else {
                    var ctx = $("#myChart1")[0].getContext('2d');
                }

                new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: rand,
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
        }
    });

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
