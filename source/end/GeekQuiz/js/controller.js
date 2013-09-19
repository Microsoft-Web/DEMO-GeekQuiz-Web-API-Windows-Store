var createQuestionController = (function (root, questionDiv) {
    "use strict";
    var question = {
        answered: false,
        title: "Empty",
        option1: "Empty",
        option2: "Empty",
        option3: "Empty",
        option4: "Empty",
        correct: false,
    };

    var apiUrl = "http://localhost:50505/api/trivia";
    var buttons = questionDiv.getElementsByTagName("button");
    var self = {
        nextQuestion: nextQuestion,
        question: question,
        sendAnswer: sendAnswer,
        loading: true
    };

    WinJS.Utilities.markSupportedForProcessing(nextQuestion);

    function nextQuestion() {

        WinJS.xhr({
            url: apiUrl
        }).then(
       function (response) {
           var i, q = JSON.parse(response.responseText);
           question.id = q.id;
           question.title = q.title;
           question.option1 = q.options[0];
           question.option2 = q.options[1];
           question.option3 = q.options[2];
           question.option4 = q.options[3];

           question.answered = false;

           for(i = 0; i < buttons.length; i++){
               buttons[i].addEventListener("click", function (num) {
                   return function () {
                       self.sendAnswer(question, question["option" + num]);
                   };
               }(i + 1));
           }

           self.loading = false;

           WinJS.Binding.processAll(root, self);
       }, function (error) {
           console.log(error);
       });
    };

    function sendAnswer(question, option) {
        self.loading = true;
        WinJS.Binding.processAll(root, self);
        WinJS.xhr({
            url: apiUrl,
            type: "post",
            headers: { "Content-type": "application/json" },
            data: JSON.stringify({ "questionId": question.id, "optionId": option.id })
        }).then(function (response) {
            var r = JSON.parse(response.responseText);
            question.correct = r;
            question.answered = true;
            self.loading = false;
            WinJS.Binding.processAll(root, self);
        }, function (error) {
            console.log(error);
        });
    };

    return self;
});

