﻿var QuestionController = (function () {
    "use strict";
    return WinJS.Class.define(
        function (root, questionDiv, nextButton) {
            var self = this;

            var i;
            this.apiUrl = "http://localhost:50505/api/trivia";

            this.buttons = questionDiv.getElementsByTagName("button");

            this.question = {
                title: "Empty",
                id: 0,
                option1: {},
                option2: {},
                option3: {},
                option4: {},
                correct: false,
            };

            this.states = {
                loading: "loading",
                showingQuestion: "showingQuestion",
                showingAnswer: "showingAnswer"
            };

            this.state = this.states.loading;

            this.eventListeners = [];

            for (i = 0; i <= 3; i++) {
                this.eventListeners[i] = function (num) {
                    return function () {
                        var j;
                        // we are always the same buttons, need to clear event listeners
                        for (j = 0; j < self.buttons.length; j++) {
                            self.buttons[j].removeEventListener("click", self.eventListeners[i]);
                        }
                        self.sendAnswer(self.question, self.question["option" + num]);
                    };
                }(i + 1);
            }

            nextButton.addEventListener("click", function () {
                self.nextQuestion.apply(self, arguments);
            });

            WinJS.Binding.processAll(root, this);

            this.observable = WinJS.Binding.as(this);
        },
        {
            observable: null,
            nextQuestion: function () {
                var self = this;

                WinJS.xhr({
                    url: this.apiUrl
                }).then(
                    function (response) {
                        var j, q = JSON.parse(response.responseText);
                        self.observable.question.id = q.id;
                        self.observable.question.title = q.title;
                        self.observable.question.option1 = q.options[0];
                        self.observable.question.option2 = q.options[1];
                        self.observable.question.option3 = q.options[2];
                        self.observable.question.option4 = q.options[3];

                        for (j = 0; j < self.buttons.length; j++) {
                            self.buttons[j].addEventListener("click", self.eventListeners[j]);
                        }

                        self.observable.state = self.states.showingQuestion;
                    }, function (error) {
                        console.log(error);
                    });
            },
            sendAnswer: function(question, option) {
                this.observable.state = this.states.loading;
                var self = this;
                console.log("web request");
                WinJS.xhr({
                    url: self.apiUrl,
                    type: "post",
                    headers: { "Content-type": "application/json" },
                    data: JSON.stringify({ "questionId": question.id, "optionId": option.id })
                }).then(function (response) {
                    var r = JSON.parse(response.responseText);
                    self.observable.question.correct = r;
                    self.observable.state = self.states.showingAnswer;
                }, function (error) {
                    console.log(error);
                })
            }
        });
}());

//var createQuestionController = (function (root, questionDiv) {
//    "use strict";
//    var i;
//    var apiUrl = "http://localhost:50505/api/trivia";

//    var buttons = questionDiv.getElementsByTagName("button");

//    var question = {
//        title: "Empty",
//        id: 0,
//        option1: {},
//        option2: {},
//        option3: {},
//        option4: {},
//        correct: false,
//    };

//    var states = {
//        loading: "loading",
//        showingQuestion: "showingQuestion",
//        showingAnswer: "showingAnswer"
//    };

//    var eventListeners = [];

//    for (i = 0; i <= 3; i++) {
//        eventListeners[i] = function (num) {
//            return function () {
//                var j;
//                // we are always the same buttons, need to clear event listeners
//                for (j = 0; j < buttons.length; j++) {
//                    buttons[j].removeEventListener("click", eventListeners[i]);
//                }
//                self.sendAnswer(question, question["option" + num]);
//            };
//        }(i + 1);
//    }

//    var self = {
//        // properties
//        state: states.loading,
//        question: question,

//        // methods
//        nextQuestion: nextQuestion,
//        sendAnswer: sendAnswer,
//    };

//    WinJS.Utilities.markSupportedForProcessing(nextQuestion);

//    WinJS.Binding.processAll(root, self);

//    var observableSelf = WinJS.Binding.as(self);

//    function nextQuestion() {
//        WinJS.xhr({
//            url: apiUrl
//        }).then(
//            function (response) {
//                var j, q = JSON.parse(response.responseText);
//                observableSelf.question.id = q.id;
//                observableSelf.question.title = q.title;
//                observableSelf.question.option1 = q.options[0];
//                observableSelf.question.option2 = q.options[1];
//                observableSelf.question.option3 = q.options[2];
//                observableSelf.question.option4 = q.options[3];

//                for (j = 0; j < buttons.length; j++) {
//                    buttons[j].addEventListener("click", eventListeners[j]);
//                }

//                observableSelf.state = states.showingQuestion;
//            }, function (error) {
//                console.log(error);
//            });
//    };

//    function sendAnswer(question, option) {
//        observableSelf.state = states.loading;
//        console.log("web request");
//        WinJS.xhr({
//            url: apiUrl,
//            type: "post",
//            headers: { "Content-type": "application/json" },
//            data: JSON.stringify({ "questionId": question.id, "optionId": option.id })
//        }).then(function (response) {
//            var r = JSON.parse(response.responseText);
//            observableSelf.question.correct = r;
//            observableSelf.state = states.showingAnswer;
//        }, function (error) {
//            console.log(error);
//        });
//    };

//    return self;
//});

