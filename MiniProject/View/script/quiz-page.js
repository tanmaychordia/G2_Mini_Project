// ----------------------------------Global variables-------------------

var questions = [];
var answers = [];
var quizdata =[];
var i = -1;
var response = [];
var timer;
var userId = sessionStorage.getItem('userId');
var web;
var minutes = 0;
var seconds = 0;
var categoryId = sessionStorage.getItem('categoryId');
var images = [];


//-------------------------------Fetching quiz data---------------------
$(document).ready(function(){
    $.ajax(
    {
        url : "http://localhost:3000/categories/"+categoryId+"/questions",
        method : "GET",
        async  : false,
        success : function(e){
            e.forEach(element => {
                //-----------------populating variables with data
                quizdata.push(element);
                questions.push(element.question);
                answers.push(element.answer);
                images.push(element.img);
            });

        },
        error : function (err) {
            alert("sorry database is not ready. Bye ");
            window.open("../html/user-home.html",'_self') ;
        }
    })

//-------------------------------Fetching quiz data ends---------------------

//-------------------------------Setting Title total questions --------------------

    $("#title").text(sessionStorage.getItem("title"));
    $('#tot-que').text(questions.length);

//-------------------------------WebWorker for timer ------------------------------

    if(!sessionStorage.getItem("timer")){
        sessionStorage.setItem("timer",(new Date()).valueOf())
    }
    if (typeof(Worker)!=="undefined"){
        if (web==null){
           web = new Worker("../script/worker.js");
        }
        //------------------trigger on post message--------------------------------
        web.postMessage(sessionStorage.getItem('timer'));
        //------------------printing time------------------------------------------
        web.onmessage = function (event) {
            //------------------limit for timer------------------------------------
            if(event.data.minutes >= 30) {
                checkSubmit();
            }
            //-------------------populating timer every second---------------------
            $("#timer").html(event.data.minutes + ':' + event.data.seconds);
            minutes = event.data.minutes;
            seconds = event.data.seconds;
        };
     } else {
        document.getElementById("timer").innerHTML = "Sorry, your browser does not support Web Workers ...";
     }

//----------------------check if any option selected-------------------------------

    $("input[type='radio']").click(function () {

        var ans = $('input[name="option"]:checked').val();
        if (ans) {
            //---------------populate response string on every selection------------
            response[i] = ans;
        }
    });

    //---------------------first que creation call ----------------------------------
    createQuestion();


//---------------------- create que and next que -------------------------------------
    function createQuestion(){

        //--------------check if reached the end--------------------------------------
        if (i < questions.length - 1) {
            i++;

            //-----------resetting the state of buttons ------------------------------
            $("input[name='option']").prop('checked', false);

            //-----------adding data in component------------------------------------

            $('#curr-que').text(i+1);


            $('#question').text(questions[i]);
            if(image[i] !== ""){

                $("#image").attr("src",images[i]);
            }else{
                $("image").html(null);
            }
            $('#btnradio1').val(quizdata[i].option1);
            $('#ops1').text('1. ' + quizdata[i].option1);

            $('#btnradio2').val(quizdata[i].option2);
            $('#ops2').text('2. ' + quizdata[i].option2);

            $('#btnradio3').val(quizdata[i].option3);
            $('#ops3').text('3. ' + quizdata[i].option3);

            $('#btnradio4').val(quizdata[i].option4);
            $('#ops4').text('4. ' + quizdata[i].option4);

            //------------setting previous response---------------------
            if (response[i]) {
                $(`input[name="option"][value="${response[i]}"]`).prop('checked', true);
            }
        }
    }

    function resetQuestion(){

        //--------------check if reached the start--------------------------------------
        if (i > 0) {
            i--;

            //-----------resetting the state of buttons ------------------------------
            $("input[name='option']").prop('checked', false);

            //-----------adding data in component------------------------------------

            $('#curr-que').text(i+1);
            $('#question').text(questions[i]);
            if(image[i] !== ""){

                $("#image").attr("src",images[i]);
            }else{
                $("image").html(null);
            }
            $('#btnradio1').val(quizdata[i].option1);
            $('#ops1').text('1. ' + quizdata[i].option1);

            $('#btnradio2').val(quizdata[i].option2);
            $('#ops2').text('2. ' + quizdata[i].option2);

            $('#btnradio3').val(quizdata[i].option3);
            $('#ops3').text('3. ' + quizdata[i].option3);

            $('#btnradio4').val(quizdata[i].option4);
            $('#ops4').text('4. ' + quizdata[i].option4);

            //------------setting previous response---------------------
            $(`input[name="option"][value="${response[i]}"]`).prop('checked', true);
        }
    }

    //-----------------next question--------------------------------------
    $('#next-btn').click(function () {
        createQuestion();
    })

    //-----------------first question-------------------------------------
    $('#first-btn').click(function () {
        i = -1;
        createQuestion();
    })

    //-----------------last question---------------------------------------
    $('#last-btn').click(function () {
        i = questions.length - 2;
        createQuestion();
    })

    //------------------previous question----------------------------------
    $('#previous-btn').click(function () {
        resetQuestion();
    })
});

//------------exit function---------------

function exit() {
    if(confirm("You really want to exit???")){
        web.terminate();
        web = undefined;
        sessionStorage.removeItem("categoryId");
        sessionStorage.removeItem("title");
        sessionStorage.removeItem("timer");
        window.open("../html/user-home.html",'_self') ;
    }
}

//-----------------result page here -------------------------------

function showResult(){
    //--------------terminating webworker--------------------------------
    sessionStorage.removeItem("timer");
    web.terminate();
    web = undefined;
    $("#quiz-here").hide();
    $("#result-here").show();

    var result = "";
    let i = 0;
    var srNo =1;
    //----------------bg color logic to show correct and wrong options----------
     result += '<button type="button" onclick="senddata()"  class="btn submit">Score-Card</button>'
    quizdata.forEach(element => {

        result += '<div><h3>'+srNo+++'. '+ element.question +'</h3><br>';


        if(element.answer===element.option1 && response[i]===element.option1){
            result += '<p class="bg-primary" >'+ element.option1 +'</p>'
        }else{
            if(element.answer===element.option1){
                result += '<p class="bg-success" >'+ element.option1 +'</p>'
            }else if(response[i]===element.option1){
                result += '<p class="bg-danger" >'+ element.option1 +'</p>'
            }else{
                result += '<p>'+ element.option1 +'</p>'
            }
        }

        if(element.answer===element.option2 && response[i]===element.option2){
            result += '<p class="bg-primary" >'+ element.option2 +'</p>'
        }else{
            if(element.answer===element.option2){
                result += '<p class="bg-success" >'+ element.option2 +'</p>'
            }else if(response[i]===element.option2){
                result += '<p class="bg-danger" >'+ element.option2 +'</p>'
            }else{
                result += '<p>'+ element.option2 +'</p>'
            }
        }

        if(element.answer===element.option3 && response[i]===element.option3){
            result += '<p class="bg-primary" >'+ element.option3 +'</p>'
        }else{
            if(element.answer===element.option3){
                result += '<p class="bg-success" >'+ element.option3 +'</p>'
            }else if(response[i]===element.option3){
                result += '<p class="bg-danger" >'+ element.option3 +'</p>'
            }else{
                result += '<p>'+ element.option3 +'</p>'
            }
        }

        if(element.answer===element.option4 && response[i]===element.option4){
            result += '<p class="bg-primary" >'+ element.option4 +'</p>'
        }else{
            if(element.answer===element.option4){
                result += '<p class="bg-success" >'+ element.option4 +'</p>'
            }else if(response[i]===element.option4){
                result += '<p class="bg-danger" >'+ element.option4 +'</p>'
            }else{
                result += '<p>'+ element.option4 +'</p>'
            }
        }

        i++;
        result += '</div>'
    });

    $("#result-here").append(result);
}

//------------------submit functionality--------------------------------
function checkSubmit(){
    let flag;

    //-----------------if no options selected---------------------------
    if(response.length===0){
        flag = confirm("No answer selected you really want to submit");
        if(flag){
            showResult();
        }
    }else{
        alert("exam is getting submited");
        showResult();
    }
}

//--------------------post data after all confirmation-------------------
function senddata() {
    let marks = 0;

    //-------------comparing answers and incrementing marks--------------
    for (let j = 0; j < questions.length; j++) {
        if (response[j] === answers[j]) {
            marks++;
        }
    }
    let percent = marks / questions.length * 100;
    let datetime = new Date();
    let time = datetime.toTimeString().split(" ")[0]
    let date = datetime.getDate()+'/'+(parseInt(datetime.getMonth())+1)+'/'+datetime.getFullYear();

    //---------post call--------------------------------------------------
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/quiz_data",
        dataType: "json",
        async: false,
        //data that need to be added
        data: {
            "userId": userId,
            "categoryId": categoryId,
            "marks": marks,
            "totalMarks": questions.length,
            "timeElapsed": minutes+':'+seconds,
            "dateTime": date+ ' : '+time,
            "percent" : percent
        }
    });

    //---------------storing data in session storage for chart--------------

    sessionStorage.setItem("marks",marks);
    sessionStorage.setItem("totalQues",questions.length);
    sessionStorage.setItem("time",minutes+':'+seconds);
    sessionStorage.setItem("percentage",percent);

    //---------------bye bye--------------------------------------------------
    window.open("../html/score-card.html",'_self') ;

 }

 //--------------check isActive-----------------------

// Logout from Session and clear Session Storage
function remove(){
    sessionStorage.clear();
    window.location.replace("./");
  }
  // Prevent User From Direct URL Access
  if (!sessionStorage.getItem('isActive') ) {
     window.open("../html/error/", "_self");
  }
