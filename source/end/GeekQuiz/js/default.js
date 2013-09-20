// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";
    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    WinJS.Namespace.define("Converters", {
        boolToVisibilityConverter: WinJS.Binding.converter(function (answered) {
            return answered ? "" : "none";
        }),
        inverseBoolToVisibilityConverter: WinJS.Binding.converter(function (answered) {
            return !answered ? "" : "none";
        }),
        showingQuestionToVisibilityConverter:WinJS.Binding.converter(function (state) {
            return state === "showingQuestion" ? "" : "none";
        }),
        showingAnswerToVisibilityConverter: WinJS.Binding.converter(function (state) {
            return state === "showingAnswer" ? "" : "none";
        }),
        loadingToVisibilityConverter: WinJS.Binding.converter(function (state) {
            return state === "loading" ? "" : "none";
        }),
    });

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

            var root = document.getElementById("root");
            var questionDiv = document.getElementById("question");
            var controller = createQuestionController(root, questionDiv);

            controller.nextQuestion();
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
