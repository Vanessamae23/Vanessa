var scoreboard = 0
var videoOn = document.querySelector(".video")
let currentNumber = 0;



function submit() {
        let user_answer = parseInt($('#question-number').val())
        // console.log(user_answer)
        console.log(P6Questions[currentNumber].answer)
        if (user_answer === P6Questions[currentNumber].answer) {
            isCorrect();
        } else {
            isWrong();
        }
    
}

function isCorrect() {
    /* the new scoreboard function */
    if (window.getComputedStyle(videoOn).display === "none") {
            scoreboard++;
          } 
        console.log(scoreboard) 
    if (currentNumber < (P6Questions.length - 1)) {
        currentNumber++;
        
        questionUpdate();
        $(".video").css("display", "none")
        $(".wrong-sentence").css("visibility", "hidden")
    } else {
        $(".bodyhead").css("display", "none")
        var text = document.createElement("p")
        text.style.margin = "20px";
        text.innerHTML = `Congratulations, your score is ${scoreboard} out of ${P6Questions.length}`
        $("footer").before(text)
        }
    }

function isWrong() {
    $(".wrong-sentence").css("visibility", "visible")
    $(".video").attr("src", P6Questions[currentNumber].youtube_id)
    $(".video").css("display", "block")
}

function questionUpdate() {
    $(".question-fill").text(P6Questions[currentNumber].question)
}

