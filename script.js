document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const questionSelect = document.getElementById("question-select");
    const pageRecommandee = document.getElementById("page-recommandee");
    const powerbiFrame = document.getElementById("powerbi-frame");
    const searchInput = document.getElementById("search-question");
    const refreshButton = document.getElementById("refresh-btn");
    const keywordsContainer = document.getElementById("keywords-container");
    const keywordsSuggestions = document.createElement("div");
    

    questionSelect.addEventListener("change", function () {
        afficherGraphique();
        mettreAJourBoutonFavori();
    });
    
    keywordsSuggestions.setAttribute("id", "keywords-suggestions");
    searchInput.parentNode.insertBefore(keywordsSuggestions, searchInput.nextSibling);

    let questionsData = [];
    let allKeywords = new Set();
    let selectedKeywords = [];
    
    // 🔹 Charger le rôle et les permissions de l'utilisateur
    const userRole = localStorage.getItem("role") || "guest";
    const permissions = JSON.parse(localStorage.getItem("permissions")) || { "categories": [], "graphique": "all" };


    const favoriteButton = document.getElementById("favorite-btn");
    const favoritesDropdown = document.getElementById("favorites-dropdown");
    const favoritesMenu = document.getElementById("favorites-menu");
    let currentUser = localStorage.getItem("currentUser") || "guest";

    // Charger les favoris de l'utilisateur connecté
    let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser}`)) || [];
    // Liste des pages Power BI associées aux questions
    const pagesPowerBI = {
        "Tableau_Bord_General" : "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=20ce2b37f60710341947",
        "KPI_01" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=7f8c2fe388d505176022&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_02" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=4a5e0b97f1d8266baa3f&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_03" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=7f80dfd66e4030bf1534chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_04" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=76bee452b6809ac919f6&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_05" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=6053d46dba80451bb78c&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_06" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=cc1ceb04b0ec5823151b&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_07" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=7a4a20193bd98dc35666&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_08" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=20ab0142f85e5e4416fd&chromeless=true&navContentPaneEnabled=false&autoAuth=true",
        "KPI_09" :  "https://app.powerbi.com/view?r=eyJrIjoiN2Y3MzkyNTAtYzA5OS00ZThlLTkyYzItMDk3NGViOGMxZjcyIiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&pageName=4199aa39c44b26400c92&chromeless=true&navContentPaneEnabled=false&autoAuth=true"
    };    

    // Noms des pages Power BI
    const pageNames = {
        "Tableau_Bord_General" : "Tableau de bord général",
        "KPI_01": "Temps de traitement des réclamations",
        "KPI_02": "Taux de réclamation en attente",
        "KPI_03": "Suivi des affaires",
        "KPI_04": "Taux d'impayés sur factures",
        "KPI_05": "Délai moyen de paiement d'une facture",
        "KPI_06": "% de prélèvements rejetés",
        "KPI_07": "% de compteurs sans relève",
        "KPI_08": "Courriers revenus en PND",
        "KPI_09": "Suivi des rôles et statuts des factures"
    };   

    // Vérifier si le mode sombre est activé dans le localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    // Mettre à jour l'icône et le texte du bouton
    function updateButtonText() {
        if (body.classList.contains("dark-mode")) {
            darkModeToggle.innerHTML = "☀️ Mode Clair";
        } else {
            darkModeToggle.innerHTML = "🌙 Mode Sombre";
        }
    }

    updateButtonText(); // Met à jour le texte initialement

    // Ajout d'un événement au clic pour basculer entre les modes
    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        // Sauvegarder le mode choisi dans le localStorage
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }

        updateButtonText(); // Mettre à jour l'affichage du bouton
    });

    // 🔹 Mettre à jour l'affichage du nom d'utilisateur dans le menu
    document.getElementById("username").textContent = currentUser;
    
    // 🔹 Fonction pour changer d'utilisateur et recharger ses favoris
    function changerUtilisateur(nouvelUtilisateur) {
        // Sauvegarde les favoris de l'utilisateur actuel
        localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
    
        // Mise à jour de l'utilisateur
        currentUser = nouvelUtilisateur;
        localStorage.setItem("currentUser", nouvelUtilisateur);
    
        // Charger les nouveaux favoris
        favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser}`)) || [];
        mettreAJourFavoris();
    }
    

    
    // 🔹 Événement de changement d'utilisateur (ex: après connexion)
    document.getElementById("logout").addEventListener("click", () => {
        changerUtilisateur("guest");
    });
    
    // Charger les questions depuis `DataIA.json`
    fetch("DataIA.json")
    .then(response => response.json())
    .then(data => {
        // 🔹 Charger le rôle et les permissions de l'utilisateur depuis localStorage
        let role = localStorage.getItem("role") || "guest";

        // 🔹 Charger les permissions depuis roles.json
        fetch("roles.json")
            .then(response => response.json())
            .then(rolesData => {
                let permissions = rolesData.roles[role] || { categories: [], graphique: [] };

                // 🔹 Filtrer les questions selon les catégories autorisées
                questionsData = data.filter(question => 
                    permissions.categories.includes(question.categorie)
                );

                // 🔹 Supprimer les mots-clés associés aux graphiques non autorisés
                questionsData = questionsData.filter(question => 
                    permissions.graphique === "all" || permissions.graphique.includes(question.graphique)
                );
                extraireMotsCles();
                filtrerMotsCles();

                // 🔹 Mettre à jour le menu déroulant
                mettreAJourMenuDeroulant();

                // 🔹 Supprimer les questions interdites du menu déroulant
                filtrerQuestionsAffichage();
            });
    })
    .catch(error => console.error("Erreur de chargement des fichiers JSON :", error));

    // 🟢 Fonction pour analyser et améliorer le texte
    function analyserTexte(input) {
        if (!input) return "";
        input = input.toLowerCase().trim();

        // Correction avancée des fautes orthographiques
        const corrections = {
            "reclmations": "réclamations", "comptuers": "compteurs", "afffaire": "affaires",
            "facturs": "factures", "durer": "durée", "delai": "délai",
            "souhaite": "", "veux": "", "voudrais": "", "voir": "", "afficher": ""
        };
        input = input.split(" ").map(word => corrections[word] || word).join(" ");

        // Suppression des accents
        const accents = { "é": "e", "è": "e", "ê": "e", "à": "a", "â": "a", "ô": "o", "ù": "u", "û": "u", "ç": "c", "î": "i" };
        input = input.split("").map(letter => accents[letter] || letter).join("");

        // Suppression des mots inutiles
        const motsInutiles = new Set(["je", "les", "des", "le", "du", "de", "un", "une", "est", "sur", "pour", "avec", "dans", "mon", "ton", "son", "notre", "quel", "quelle", "quels", "quelles", "comment", "peut", "peux", "faire", "connaitre", "afficher", "montrer", "voir", "donner", "indiquer", "demontrer", "fournir", "etudier"]);
        
        let motsFiltres = input.split(" ").filter(word => !motsInutiles.has(word));

        // Détection et correction des synonymes enrichis
        const synonymes = {
            "duree": "temps", "reclamations": "plaintes", "factures": "paiement",
            "compteurs": "mesures", "affaires": "dossiers", "courriers": "lettres",
            "paiements": "transactions", "impayes": "dettes", "anomalies": "erreurs",
            "evolution": "tendance", "performance": "rendement", "analyse": "examen",
            "revenus": "gains", "depenses": "couts", "risque": "danger", "amelioration": "optimisation"
        };

        motsFiltres = motsFiltres.map(word => synonymes[word] || word);

        return motsFiltres.join(" ");
    }

    function filtrerMotsCles() {
        if (permissions.graphique === "all") return; // Si tout est autorisé, ne rien filtrer
    
        const graphiquesAutorisés = new Set(permissions.graphique);
    
        // Ne filtrer que les mots-clés des questions autorisées
        allKeywords.clear();
        questionsData.forEach(q => {
            if (graphiquesAutorisés.has(q.page)) {
                q.motscles.split(" ").forEach(mot => allKeywords.add(mot.toLowerCase()));
            }
        });
    }    

    // 🟢 Extraire les mots-clés des questions
    function extraireMotsCles() {
        allKeywords.clear(); // Réinitialiser les mots-clés
    
        questionsData.forEach(question => {
            if (question.motscles) {
                question.motscles.split(" ").forEach(mot => allKeywords.add(mot.toLowerCase()));
            }
        });
    }  

    // 🟢 Suggestions dynamiques de mots-clés
    function afficherSuggestionsMotsCles() {
        const query = analyserTexte(searchInput.value);
        keywordsSuggestions.innerHTML = "";
    
        if (query.length === 0) return;
    
        console.log("Mots-clés disponibles :", allKeywords); // Debugging
    
        const suggestions = [...allKeywords].filter(mot => mot.startsWith(query)).slice(0, 5);
        suggestions.forEach(mot => {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = mot;
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.addEventListener("click", () => {
                ajouterMotCle(mot);
                keywordsSuggestions.innerHTML = "";
                rechercherQuestion();
            });
            keywordsSuggestions.appendChild(suggestionItem);
        });
    }
    
    // 🟢 Ajouter un mot-clé sélectionné
    function ajouterMotCle(mot) {
        if (!selectedKeywords.includes(mot) && selectedKeywords.length < 4) {
            selectedKeywords.push(mot);
            afficherMotsClesSelectionnes();
            rechercherQuestion();
        }
    }

    // 🟢 Afficher les mots-clés sélectionnés
    function afficherMotsClesSelectionnes() {
        keywordsContainer.innerHTML = "";
        selectedKeywords.forEach(mot => {
            const span = document.createElement("span");
            span.textContent = mot;
            span.classList.add("keyword-item");
            span.addEventListener("click", () => {
                selectedKeywords = selectedKeywords.filter(k => k !== mot);
                afficherMotsClesSelectionnes();
                rechercherQuestion();
            });
            keywordsContainer.appendChild(span);
        });
    }

    function mettreAJourMenuDeroulant() {
        questionSelect.innerHTML = '<option value="">-- Sélectionner une question --</option>';
        
        let categoriesAffichees = new Set();
    
        questionsData.forEach(q => {
            if (!categoriesAffichees.has(q.categorie)) {
                let optgroup = document.createElement("optgroup");
                optgroup.label = q.categorie;
                questionSelect.appendChild(optgroup);
                categoriesAffichees.add(q.categorie);
            }
    
            let option = document.createElement("option");
            option.value = q.page;
            option.textContent = q.question;
            questionSelect.appendChild(option);
        });
    }
    

    function filtrerQuestionsAffichage() {
        const options = document.querySelectorAll("#question-select option");
        options.forEach(option => {
            if (option.value && !questionsData.some(q => q.page === option.value)) {
                option.remove(); // Supprime les questions non autorisées
            }
        });
    }
    
        // 📌 Recherche avancée prenant en compte tous les éléments de la question
        function rechercherQuestion() {
            let query = analyserTexte(searchInput.value);
            let motsTrouves = [...selectedKeywords]; // Mots-clés sélectionnés
        
            // 📌 Vérification : La recherche se fait si :
            // - La phrase tapée fait au moins 5 caractères
            // - OU au moins un mot-clé est sélectionné
            if (query.length < 5 && motsTrouves.length === 0) {
                pageRecommandee.innerHTML = "<strong>Veuillez entrer au moins 5 caractères ou sélectionner un mot-clé.</strong>";
                return;
            }
        
            let meilleureQuestion = null;
            let meilleurScore = 0;
            const seuilSimilarite = 80; // Exige une correspondance ≥ 80%
        
            questionsData.forEach(question => {
                let score = 0;
        
                // 🔹 Récupération et nettoyage des données
                let texteQuestion = analyserTexte(question.question);
                let texteMotsCles = analyserTexte(question.motscles || "");
                let texteDonnees = analyserTexte(question.données || "");
        
                // 🔹 Vérification avec la phrase écrite par l'utilisateur
                if (query.length >= 5) {
                    let similariteQuestion = calculerSimilarite(query, texteQuestion);
                    let similariteMotsCles = calculerSimilarite(query, texteMotsCles);
                    let similariteDonnees = calculerSimilarite(query, texteDonnees);
        
                    if (similariteQuestion >= seuilSimilarite) score += 5;
                    if (similariteMotsCles >= seuilSimilarite) score += 4;
                    if (similariteDonnees >= seuilSimilarite) score += 3;
        
                    // 🔹 Vérification si une partie du mot-clé est contenue dans la recherche
                    texteMotsCles.split(" ").forEach(keyword => {
                        if (query.includes(keyword)) score += 2;
                    });
        
                    // 🔹 Vérification si la recherche correspond à une partie du texte de la question
                    if (texteQuestion.includes(query)) score += 3;
                }
        
                // 🔹 Vérification avec les mots-clés sélectionnés par l’utilisateur
                motsTrouves.forEach(keyword => {
                    if (texteMotsCles.includes(keyword)) score += 5;
                    if (texteQuestion.includes(keyword)) score += 3;
                    if (texteDonnees.includes(keyword)) score += 2;
                });
        
                // Sélection de la meilleure correspondance
                if (score > meilleurScore) {
                    meilleurScore = score;
                    meilleureQuestion = question;
                }
            });
        
            // 🔹 Mise à jour de l'affichage
            if (meilleureQuestion) {
                questionSelect.value = meilleureQuestion.page;
                pageRecommandee.innerHTML = `<strong>${meilleureQuestion.question}</strong>`;
                afficherGraphique();
            } else {
                pageRecommandee.innerHTML = "<strong>Aucune correspondance trouvée.</strong>";
            }
        }
        
        // 📌 Fonction pour calculer la similarité avec Levenshtein
        function calculerSimilarite(a, b) {
            if (!a || !b) return 0;
            a = analyserTexte(a);
            b = analyserTexte(b);
        
            let distance = distanceLevenshtein(a, b);
            let maxLen = Math.max(a.length, b.length);
            return ((maxLen - distance) / maxLen) * 100; // Retourne un pourcentage de similarité
        }
        
        // 📌 Fonction de distance de Levenshtein
        function distanceLevenshtein(a, b) {
            const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
        
            for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
            for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1, // Suppression
                        matrix[i][j - 1] + 1, // Insertion
                        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Substitution
                    );
                }
            }
            return matrix[a.length][b.length];
        }
        
        // 📌 Correction de l'event listener (recherche activée si 5 caractères ou mots-clés)
        searchInput.addEventListener("input", () => {
            if (searchInput.value.length >= 5 || selectedKeywords.length > 0) {
                afficherSuggestionsMotsCles();
                rechercherQuestion();
            } else {
                pageRecommandee.innerHTML = "<strong>Veuillez entrer au moins 5 caractères ou sélectionner un mot-clé.</strong>";
            }
        });       

        function afficherGraphique() {
        const selectedPage = questionSelect.value;

        if (!selectedPage) {
            console.warn("❌ Aucune question sélectionnée.");
            return;
        }

        console.log(`✅ Affichage du rapport pour : ${selectedPage}`);

        if (pagesPowerBI[selectedPage]) {
            powerbiFrame.src = pagesPowerBI[selectedPage];
        } else {
            console.error("🚨 La page Power BI n'existe pas :", selectedPage);
            powerbiFrame.src = ""; // Efface l'iframe si aucun rapport correspondant
        }
    }

    searchInput.addEventListener("input", () => {
        afficherSuggestionsMotsCles();
        rechercherQuestion();
    });

    refreshButton.addEventListener("click", () => location.reload());

    // 🔹 Ajouter une page aux favoris de l'utilisateur actuel
    function ajouterFavori() {
        const selectedPage = questionSelect.value;
        if (!selectedPage || favorites.includes(selectedPage)) return;
    
        favorites.push(selectedPage);
        localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
    
        mettreAJourFavoris();
        mettreAJourBoutonFavori();
    }
    
    
    // 🔹 Met à jour l'affichage du bouton Favori selon l'état actuel
    function mettreAJourBoutonFavori() {
        const selectedPage = questionSelect.value;
        const favoriteButton = document.getElementById("favorite-btn");
    
        if (!selectedPage) {
            favoriteButton.style.display = "none"; // cacher si aucune sélection
            return;
        } else {
            favoriteButton.style.display = "inline-block"; // afficher sinon
        }
    
        if (favorites.includes(selectedPage)) {
            favoriteButton.textContent = "❌ Retirer des Favoris";
        } else {
            favoriteButton.textContent = "⭐ Ajouter aux Favoris";
        }
    }
    
    
    // 🔹 Supprimer un favori spécifique de l'utilisateur actuel
    function supprimerFavori(page) {
        favorites = favorites.filter(fav => fav !== page);
        localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
    
        mettreAJourFavoris();
        mettreAJourBoutonFavori();
    }
    
    // 🔹 Mettre à jour l'affichage des favoris spécifiques à l'utilisateur
    function mettreAJourFavoris() {
        favoritesDropdown.innerHTML = "";
        
        if (favorites.length === 0) {
            favoritesDropdown.innerHTML = "<li>Aucun favori</li>";
            return;
        }
    
        favorites.forEach(page => {
            const listItem = document.createElement("li");
            listItem.textContent = pageNames[page] || page;
            listItem.addEventListener("click", () => {
                questionSelect.value = page;
                afficherGraphique();
            });
    
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.classList.add("delete-fav");
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                supprimerFavori(page);
            });
    
            listItem.appendChild(deleteBtn);
            favoritesDropdown.appendChild(listItem);
        });
    }
    
    favoriteButton.addEventListener("click", function() {
        const selectedPage = questionSelect.value;
    
        if (!selectedPage) return;
    
        if (favorites.includes(selectedPage)) {
            favorites = favorites.filter(fav => fav !== selectedPage);
        } else {
            favorites.push(selectedPage);
        }
    
        localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
        mettreAJourFavoris();
        mettreAJourBoutonFavori();
    });
    document.addEventListener("DOMContentLoaded", function () {
        const darkModeToggle = document.getElementById("dark-mode-toggle");
        const body = document.body;
    
        function updateButtonText() {
            if (body.classList.contains("dark-mode")) {
                darkModeToggle.innerHTML = "☀️ Mode Clair";
            } else {
                darkModeToggle.innerHTML = "🌙 Mode Sombre";
            }
        }
    
        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
        }
        
        updateButtonText();
    
        darkModeToggle.addEventListener("click", function () {
            body.classList.toggle("dark-mode");
    
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "enabled");
            } else {
                localStorage.setItem("darkMode", "disabled");
            }
    
            updateButtonText();
        });
    }); 
    
    // Charger immédiatement les favoris au chargement de la page
    mettreAJourFavoris();

    // Bloquer F12 (DevTools)
    document.addEventListener("keydown", function(event) {
        if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
            event.preventDefault();
        }
    });

    // Bloquer clic droit (Empêche "Inspecter")
    document.addEventListener("contextmenu", function(event) {
        event.preventDefault();
    });

    // Détecter si DevTools est ouvert
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            alert("Inspection interdite !");
            window.location.href = "index.html"; // Redirige l’utilisateur
        }
    }, 1000);
    questionSelect.addEventListener("change", afficherGraphique);
});
