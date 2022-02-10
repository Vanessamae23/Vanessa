var scoreboard = 0
var videoOn = document.querySelector(".video")
let currentNumber = 0;



function submit() {
        let user_answer = parseInt($('#question-number').val())
        // console.log(user_answer)
        console.log(JCQuestions[currentNumber].answer)
        if (user_answer === JCQuestions[currentNumber].answer) {
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
    if (currentNumber < (JCQuestions.length - 1)) {
        currentNumber++;
        
        questionUpdate();
        $(".video").css("display", "none")
        $(".wrong-sentence").css("visibility", "hidden")
        $(".correct-answer").css("visibility", "hidden")
    } else {
        $(".bodyhead").css("display", "none")
        var text = document.createElement("p")
        text.style.margin = "20px";
        text.innerHTML = `Congratulations, your score is ${scoreboard} out of ${JCQuestions.length}`
        $("footer").before(text)
        }
    }

function isWrong() {
    $(".wrong-sentence").css("visibility", "visible")
    $(".video").attr("src", JCQuestions[currentNumber].youtube_id)
    $(".video").css("display", "block")
    $(".correct-answer").css("visibility", "visible")
    $(".correct-answer").text(`The correct answer is ${JCQuestions[currentNumber].answer} and ${JCQuestions[currentNumber].youtube_id}`)
}

function questionUpdate() {
    $(".question-fill").text(JCQuestions[currentNumber].question)
}

