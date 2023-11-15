//Getting the already existing page elements
startButton = document.getElementById("startButton");
introText = document.getElementById("introText");
multiTitle = document.getElementById("multiTitle");
cardBody = document.getElementById("cardBody");
scoreDisplay = document.getElementById("scoreDisplay");
footer = document.getElementById("foot");

//Quiz buttons that need to be displayed to the page
var button1 = document.createElement("a");
var button2 = document.createElement("a");
var button3 = document.createElement("a");
var button4 = document.createElement("a");
let buttonArray = [button1, button2, button3, button4];

//All other items that need to be displayed to the page
var submitInitButton = document.createElement("a");
var initialsBox = document.createElement("input");
var initialsText = document.createElement("p");
var finalScoreText = document.createElement("p");
var goBackButton = document.createElement("a");
var clearHighScores = document.createElement("a");

//Variables needed for keeping track of quiz
let currentQ = 0;
var score = 60;
var initialsEntry;
var scoreInterval;
//2d array that holds the quiz. The first element in each individual array contains the question
//while the next four contain the choices for that question. The sixth and final value is a string 
//representing the answer by naming the index of the the button. For example, if the answer is the 
//answer is the first button, the sixth value in the array would be "0";
let quizArray = [
    ["Inside which HTML element do we put the JavaScript?", "javascript", "js", "script", "scripted", "2"],
    ["Which of these subtracts exactly 1 from the variable 'example'", "example-=", "example - 1", "example -= 10", "example--", "3"],
    ["Which of these do we use to display messages to the console?", "console.log()", "console.go()", "console.msg()", "print()", "0"],
    ["What is the proper way to write the 'and' operator in JavaScript?", "and", "--", "&&", "||", "2"],
    ["What would we call to edit the text of a container stored in the variable 'word')", "word.txt", "word.textContent", "word.text", "word.edit", "1"]
];
//EventListener for the "start quiz" button
startButton.addEventListener("click", function(event){
    //Starts the timer beginning at 60 and counting down 1 every second
    //If the timer reaches 0, end the quiz using the endQuiz() function
    scoreInterval = setInterval(function() {
        if (score > 0){
            score--;
            scoreDisplay.textContent = "Time: " + score;
        }
        else{
            scoreDisplay.textContent = "Time: 0";
            endQuiz();
        }
    }, 1000);

    //setting all the beginning text and buttons to 'none' and 
    //displaying all the quiz buttons without text in them
    introText.style.display = 'none';
    startButton.style.display = 'none';
    multiTitle.style.textAlign = 'left';
    for (i = 0; i<buttonArray.length; i++){
        buttonArray[i].className = "btn btn-primary";
        buttonArray[i].id = i;
        buttonArray[i].style = "display: block; margin-bottom: 5px; width: 80%";
        cardBody.appendChild(buttonArray[i]);
    }
    //calling updateQuestion to fill the title text and button text
    updateQuestion();
});

//function to penalize 10 seconds for a wrong answer
//If the time can not go down 10 seconds without being negative,
//end the quiz using endQuiz()
function penalizeTime(){
    if (score - 10 > 0){
        score -= 10;
        scoreDisplay.textContent = "Time: " + score;
        footer.textContent = "Incorrect.";
    }
    else{
        score = 0;
        scoreDisplay.textContent = "Time: " + score;
        endQuiz();
    }
}
//function to check for a correct answer. If the answer is wrong
//the function calls penalizeTime() to subtract some time/score. 
function checkCorrect(buttonID){
    if (buttonID === quizArray[currentQ-1][5]){
        footer.textContent = "Correct!";
        }
    else{
        penalizeTime();
    }
}
//Update question is called every time an answer is given and is used
//to fill the text in for the next question, check if the previous answer
//given was correct using checkCorrect(), and advance currentQ +1.
function updateQuestion(){
    //If at the end of questionsArray, log the final input and end quiz
    if (currentQ === quizArray.length){
        checkCorrect(this.id);
        endQuiz();
    }
    else{
        if (currentQ > 0)
            checkCorrect(this.id);
        //Changing the text for the question title and buttons
        for (i=0; i<5; i++){
            if (i === 0 && score > 0){
                multiTitle.textContent = quizArray[currentQ][i];
            }
            else{
                buttonArray[i-1].innerHTML = quizArray[currentQ][i];
            }
        }
            //Increasing the question index
            currentQ++;
    }
        
}
//function to end the quiz. Completely wipes all text boxes and buttons and brings 
//up the "enter initials" page. 
function endQuiz(){
    
    clearInterval(scoreInterval);
    footer.textContent = "";
    finalScoreText.textContent = "Your final score is " + score;
    finalScoreText.style.textAlign = "left";

    initialsText.textContent = "Enter initials: ";
    initialsText.style = "text-align: left; display: inline";

    initialsBox.type = "text";
    initialsBox.style = "display: inline; width: 30%";

    submitInitButton.className = "btn btn-primary";
    submitInitButton.innerHTML = "Submit";
    submitInitButton.style = "display: block; width: 40%; margin-top: 5px; margin-left: 30%";

    multiTitle.textContent = "All Done!";

    cardBody.appendChild(finalScoreText);
    cardBody.appendChild(initialsText);
    cardBody.appendChild(initialsBox);
    cardBody.appendChild(submitInitButton);

    for (i = 0; i < buttonArray.length; i++){
        buttonArray[i].style.display = "none";
    }
}
//adding an eventListener to each button so that, when clicked, 
//they call update question to advance to the next question
button1.addEventListener("click", updateQuestion);
button2.addEventListener("click", updateQuestion);
button3.addEventListener("click", updateQuestion);
button4.addEventListener("click", updateQuestion);

//removes the "enter initials" page and displays the high scores page.
//Retrieves all high score localStorage items and displays them before storing 
//and then displaying the score the user just received alongside the other scores.
submitInitButton.addEventListener("click", function(){
    initialsEntry = initialsBox.value;
    //count quizScore items, then format and display them to the page
    let scoreCount = 0;
    for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        if (key !== null && key.includes("quizScore")){
            scoreCount++;
            var tempItem = JSON.parse(localStorage.getItem(key));
            var newScore = document.createElement("p");
            newScore.textContent = tempItem.init + " // " + tempItem.s;
            newScore.className = "quizScore";
            newScore.style = "text-align: left";
            cardBody.appendChild(newScore);
        }
    }
    //create new score and add that to localStorage. Also displays it to cardBody.
    var newScoreItem = {init: initialsEntry, s: score}
    localStorage.setItem("quizScore" + (scoreCount+1), JSON.stringify(newScoreItem));
    var tempScore = document.createElement("p");
    tempScore.textContent = newScoreItem.init + " // " + newScoreItem.s;
    tempScore.className = "quizScore";
    tempScore.style = "text-align: left";
    cardBody.appendChild(tempScore);

    //Getting rid of "get initials" page elements then displaying 
    //the high score elements
    multiTitle.textContent = "High Scores";
    finalScoreText.style.display = "none";
    initialsText.style.display = "none";
    initialsBox.style.display = "none";
    submitInitButton.style.display = "none";

    goBackButton.className = "btn btn-primary";
    goBackButton.innerHTML = "Go Back";
    goBackButton.style = "margin-right: 5px";

    clearHighScores.className = "btn btn-primary";
    clearHighScores.innerHTML = "Clear High Scores";

    cardBody.appendChild(goBackButton);
    cardBody.appendChild(clearHighScores);
});

//reloads the page when user presses the go back button
goBackButton.addEventListener("click", function(){
    window.location.reload();
});

clearHighScores.addEventListener("click", function(){
    //clears all scores from localStorage
    for (let key in localStorage){
        if (key !== null && key.includes("quizScore")){
            localStorage.removeItem(key);
        }
    }
    //clears all scores from the actual page
    var pageScores = document.getElementsByClassName("quizScore");
    const pageScoresArray = Array.from(pageScores);
    pageScoresArray.forEach(ps => {
        ps.parentNode.removeChild(ps);
    });
    //hides the clear scores button
    this.style.display = 'none';
})