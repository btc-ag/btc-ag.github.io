(function () {
    // Language Selector
    var languageCurrentElement = document.getElementById("language-current");
    var languageList = document.getElementById("language-list");
    if (languageCurrentElement && languageList) {
        var switchLanguage = function (lang) {
            document.documentElement.setAttribute("lang", lang);
            localStorage["language"] = lang;
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
            Array.from(document.querySelectorAll('[data-lang="' + languageData.code + '"]')).forEach(function(elem) {
                elem.style.display = "inline";
            });
        };

        var userLang = localStorage["language"] || navigator.language.split("-")[0];
        switchLanguage(userLang);
        Array.from(languageList.getElementsByTagName("a")).forEach(function(elem) {
            elem.addEventListener("click", function (ev) {
                switchLanguage(elem.getAttribute("data-language"));
            });
        });
    }

    // Timeline Navigation
    var timelineItems = document.querySelectorAll('.timeline-item');
    var projectDetails = document.querySelectorAll('.project-detail');

    if (timelineItems.length === 0 || projectDetails.length === 0) {
        return;
    }

    function showProject(projectId) {
        timelineItems.forEach(function(item) {
            item.setAttribute('data-active', 'false');
        });
        projectDetails.forEach(function(detail) {
            detail.setAttribute('data-active', 'false');
        });
        var activeTimelineItem = document.querySelector('.timeline-item[data-project="' + projectId + '"]');
        if (activeTimelineItem) {
            activeTimelineItem.setAttribute('data-active', 'true');
        }
        var activeDetail = document.getElementById('detail-' + projectId);
        if (activeDetail) {
            activeDetail.setAttribute('data-active', 'true');
            var detailPanel = document.querySelector('.detail-panel');
            if (detailPanel) {
                detailPanel.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        localStorage.setItem('activeProject', projectId);
    }

    timelineItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var projectId = this.getAttribute('data-project');
            showProject(projectId);
        });
    });

    var savedProject = localStorage.getItem('activeProject');
    if (savedProject) {
        showProject(savedProject);
    }
})();
