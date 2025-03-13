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
        "Tableau_Bord_General" : "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=20ce2b37f60710341947&chromeless=true&navContentPaneEnabled=false",
    "KPI_01" : "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=7f8c2fe388d505176022&chromeless=true&navContentPaneEnabled=false",
    "KPI_02" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=4a5e0b97f1d8266baa3f&chromeless=true&navContentPaneEnabled=false",
    "KPI_03" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=7f80dfd66e4030bf1534&navContentPaneEnabled=false",
    "KPI_04" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=76bee452b6809ac919f6&chromeless=true&navContentPaneEnabled=false",
    "KPI_05" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=6053d46dba80451bb78c&chromeless=true&navContentPaneEnabled=false",
    "KPI_06" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=cc1ceb04b0ec5823151b&chromeless=true&navContentPaneEnabled=false",
    "KPI_07" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=7a4a20193bd98dc35666&chromeless=true&navContentPaneEnabled=false",
    "KPI_08" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=20ab0142f85e5e4416fd&chromeless=true&navContentPaneEnabled=false",
    "KPI_09" :  "https://app.powerbi.com/view?r=eyJrIjoiOTZlN2E5NDQtZjBmMC00ZTk0LWFiNmQtODcxOGYyYzA4OGQ4IiwidCI6ImUyMWU5NzgzLWQwYTAtNDhmOC04NTBlLTBiMDgxYjQ2ZDc4OCIsImMiOjh9&embedImagePlaceholder=true&pageName=4199aa39c44b26400c92&chromeless=true&navContentPaneEnabled=false"
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
    
    
    

    // 🟢 Rechercher et recommander une page en temps réel
    function rechercherQuestion() {
        let query = analyserTexte(searchInput.value);
        let motsTrouves = [...selectedKeywords];
    
        let bestMatch = null;
        let bestScore = 0;
    
        questionsData.forEach(question => {
            let score = 0;
            const motsCles = question.motscles ? question.motscles.toLowerCase().split(" ") : [];
    
            motsTrouves.forEach(keyword => {
                if (motsCles.includes(keyword)) score += 5;
                if (question.question.toLowerCase().includes(keyword)) score += 3;
                if (question.categorie.toLowerCase().includes(keyword)) score += 2;
            });
    
            if (query) {
                if (question.question.toLowerCase().includes(query)) score += 5;
                if (question.motscles.toLowerCase().includes(query)) score += 4;
            }
    
            if (score > bestScore) {
                bestScore = score;
                bestMatch = question.page;
            }
        });
    
        console.log("🔍 Meilleure correspondance trouvée :", bestMatch); // Debugging
    
        if (bestMatch) {
            questionSelect.value = bestMatch;
            pageRecommandee.innerHTML = `<strong>${pageNames[bestMatch]}</strong>`;
            afficherGraphique();
        } else {
            pageRecommandee.innerHTML = "<strong>Aucune correspondance trouvée.</strong>";
        }
    }
    

    function afficherGraphique() {
        const selectedPage = questionSelect.value;
    
        if (!selectedPage) {
            console.warn("❌ Aucune question sélectionnée.");
            return;
        }
    
        console.log(`✅ Affichage du rapport pour : ${selectedPage}`); // Debugging
    
        // Vérifier si la page existe bien dans `pagesPowerBI`
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
});
