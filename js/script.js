(function () {
    var backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.addEventListener("click", function (ev) {
            window.history.back();
        });
    }

    var languageCurrentElement = document.getElementById("language-current");
    var languageList = document.getElementById("language-list");
    if (!languageCurrentElement || !languageList) {
        console.warn("Language selector elements missing! Showing both languages!");
        return;
    }

    var switchLanguage = function (lang) {
        console.log("Switching to " + lang);
        var languageLinks = languageList.getElementsByTagName("a");
        var targetLanguage = Array.from(languageLinks).find(function (value) {
            return value.getAttribute("data-language") === lang;
        });
        var languageData = targetLanguage ? {
            code: targetLanguage.getAttribute("data-language"),
            name: targetLanguage.innerText
        } : {
            code: "en",
            name: "English"
        };
        languageCurrentElement.setAttribute("data-current-language", languageData.code);
        languageCurrentElement.innerText = languageData.name;

        Array.from(document.querySelectorAll("[data-lang]")).forEach(function(elem) {
            elem.style.display = "none";
        });
        Array.from(document.querySelectorAll("[data-lang=" + languageData.code + "]")).forEach(function(elem) {
            elem.style.display = "block";
        });

    };
    var userLang = navigator.language.split("-")[0];
    switchLanguage(userLang);
    Array.from(languageList.getElementsByTagName("a")).forEach(function(elem) {
        elem.addEventListener("click", function (ev) {
            switchLanguage(elem.getAttribute("data-language"));
        });
    })
})();