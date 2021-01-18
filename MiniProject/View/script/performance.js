var cat_length;
var flag = true;

$('Document').ready(()=>{
        var userName = sessionStorage.getItem("username");
        $('.username_session').append(userName);
        $('title').html(userName+' -Quizzards');
        if (!sessionStorage.getItem('isActive') ) {
            window.open("../html/error.html", "_self");
        }
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/categories",
            async: "false",
            success: function (response) {
                cat_length = response.length;
                response.forEach(element => {
                    let quizDom = "<div class='col-md-4 col-sm-6 col-xs-12 col-lg-3 p-2'><div class='card card-body peopleCarouselImg card-transition'><img class='img-fluid' src='"+element.img+"'><span class='overlay'></span><h3>"+element.name+"</h3> <br> <h4> <a href='#focusChart' class='btn text-white button 'onclick='showGraph("+element.id+");'  value='"+ element.id+","+element.name+"'> Show </a>  <h4></div></div> </div>";
                    $('#categorycard').append(quizDom);
                });
            }
        });
});




function showGraph(i) {


    var marks = [];
    var labels = [];
    var label;
    var link = "http://localhost:3000/users/"+sessionStorage.getItem("userId")+"/quiz_data?categoryId="+i;
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

            createGraph();
            function createGraph(){
              marks.push(15);
                var ctx = $("#myChart")[0].getContext('2d');
                flag=false;
                new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: i,
                        data: marks,
                        backgroundColor: 'rgba(36, 38, 51, 0.9)',
                        borderWidth: 1,
                        barPercentage: 0.8,
                        responsive: true,

                    }]
                },
                options: {
                    scales:  {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize:1
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
