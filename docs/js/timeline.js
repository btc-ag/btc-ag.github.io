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

    // GitHub repository mapping
    var repoMapping = {
        'saa': { owner: 'btc-ag', repo: 'SAA' },
        'scc': { owner: 'btc-ag', repo: 'SCC' },
        'service-idl': { owner: 'btc-ag', repo: 'service-idl' },
        'featuretoggle': { owner: 'btc-ag', repo: 'featuretoggle' },
        'redg': { owner: 'yamass', repo: 'redg' }
    };

    // Cache for fetched READMEs
    var readmeCache = {};

    // Fetch README from GitHub API
    function fetchReadme(projectId) {
        var repoInfo = repoMapping[projectId];
        if (!repoInfo) return;

        // Check cache first
        if (readmeCache[projectId]) {
            displayReadme(projectId, readmeCache[projectId]);
            return;
        }

        var readmeContainer = document.querySelector('#detail-' + projectId + ' .readme-content');
        if (!readmeContainer) return;

        // Show loading state
        readmeContainer.innerHTML = '<p style="text-align: center; color: #6c757d;"><em>Loading README...</em></p>';

        // Fetch from GitHub API
        var apiUrl = 'https://api.github.com/repos/' + repoInfo.owner + '/' + repoInfo.repo + '/readme';

        fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.html'
            }
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('README not found');
            }
            return response.text();
        })
        .then(function(html) {
            // Cache the result
            readmeCache[projectId] = html;
            displayReadme(projectId, html);
        })
        .catch(function(error) {
            console.error('Error fetching README for ' + projectId + ':', error);
            readmeContainer.innerHTML = '<p style="color: #dc3545;"><em>Unable to load README from GitHub.</em></p>';
        });
    }

    // Display README content
    function displayReadme(projectId, htmlContent) {
        var readmeContainer = document.querySelector('#detail-' + projectId + ' .readme-content');
        if (!readmeContainer) return;

        // Create a wrapper div for GitHub-style markdown
        var wrapper = document.createElement('div');
        wrapper.className = 'github-readme';
        wrapper.innerHTML = htmlContent;

        // Remove the first H1 heading to avoid duplication with the detail header
        var firstH1 = wrapper.querySelector('h1');
        if (firstH1) {
            firstH1.remove();
        }

        // Clean up and style the content
        readmeContainer.innerHTML = '';
        readmeContainer.appendChild(wrapper);

        // Fix relative image URLs to point to GitHub
        var repoInfo = repoMapping[projectId];
        var images = wrapper.querySelectorAll('img');
        images.forEach(function(img) {
            var src = img.getAttribute('src');
            if (src && !src.startsWith('http')) {
                img.setAttribute('src', 'https://raw.githubusercontent.com/' + repoInfo.owner + '/' + repoInfo.repo + '/master/' + src);
            }
        });

        // Fix relative links
        var links = wrapper.querySelectorAll('a');
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.setAttribute('href', 'https://github.com/' + repoInfo.owner + '/' + repoInfo.repo + '/blob/master/' + href);
                link.setAttribute('target', '_blank');
            }
        });
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

            // Fetch README for this project
            fetchReadme(projectId);
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
    } else {
        // Load README for initially active project
        var initialActive = document.querySelector('.timeline-item[data-active="true"]');
        if (initialActive) {
            fetchReadme(initialActive.getAttribute('data-project'));
        }
    }
})();
