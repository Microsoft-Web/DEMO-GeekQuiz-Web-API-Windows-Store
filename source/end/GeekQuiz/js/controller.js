var createQuestionController = (function (root, questionDiv) {
    "use strict";
    var i;
    var apiUrl = "http://localhost:50505/api/trivia";
    var buttons = questionDiv.getElementsByTagName("button");
    var question = {
        title: "Empty",
        id: 0,
        option1: {},
        option2: {},
        option3: {},
        option4: {},
        correct: false,
    };

    var states = {
        loading: "loading",
        showingQuestion: "showingQuestion",
        showingAnswer: "showingAnswer"
    }

    var self = {
        nextQuestion: nextQuestion,
        question: question,
        sendAnswer: sendAnswer,
        state: states.loading
    };

    WinJS.Utilities.markSupportedForProcessing(nextQuestion);

    WinJS.Binding.processAll(root, self);

    var observableSelf = WinJS.Binding.as(self);

    var eventListeners = [];

    for (i = 0; i <= 3; i++) {
        eventListeners[i] = function (num) {
            return function () {
                var j;
                for (j = 0; j < buttons.length; j++) {
                    buttons[j].removeEventListener("click", eventListeners[i]);
                }
                self.sendAnswer(question, question["option" + num]);
            };
        }(i + 1);
    }

    function nextQuestion() {
        WinJS.xhr({
            url: apiUrl
        }).then(
            function (response) {
               var j, q = JSON.parse(response.responseText);
               observableSelf.question.id = q.id;
               observableSelf.question.title = q.title;
               observableSelf.question.option1 = q.options[0];
               observableSelf.question.option2 = q.options[1];
               observableSelf.question.option3 = q.options[2];
               observableSelf.question.option4 = q.options[3];

               for(j = 0; j < buttons.length; j++){
                   buttons[j].addEventListener("click", eventListeners[j]);
               }

               observableSelf.state = states.showingQuestion;
       }, function (error) {
           console.log(error);
       });
    };

    function sendAnswer(question, option) {
        observableSelf.state = states.loading;
        console.log("web request");
        WinJS.xhr({
            url: apiUrl,
            type: "post",
            headers: { "Content-type": "application/json" },
            data: JSON.stringify({ "questionId": question.id, "optionId": option.id })
        }).then(function (response) {
            var r = JSON.parse(response.responseText);
            observableSelf.question.correct = r;
            observableSelf.state = states.showingAnswer;
        }, function (error) {
            console.log(error);
        });
    };

    return self;
});

