(function() {
    var backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.addEventListener("click", function (ev) {
            window.history.back();
        });
    }
})();