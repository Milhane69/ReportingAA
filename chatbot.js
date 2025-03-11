    document.addEventListener("DOMContentLoaded", function () {
        const chatbotToggle = document.getElementById("chatbot-toggle");
        const chatbotContainer = document.querySelector(".chatbot-container");
        const chatbotClose = document.getElementById("chatbot-close");
        const chatbotMessages = document.getElementById("chatbot-messages");
        const chatbotInput = document.getElementById("chatbot-input");
        const chatbotSend = document.getElementById("chatbot-send");
        const chatbotSuggestions = document.getElementById("chatbot-suggestions");

        let questionsData = [];
        let rolesData = {};
        let userRole = localStorage.getItem("role") || "guest";

        const pageNames = {
            "Tableau_Bord_General": "Tableau de bord général",
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

        fetch("DataIAWithExplication.json")
            .then(response => response.json())
            .then(data => { questionsData = data; })
            .catch(error => console.error("Erreur de chargement des questions :", error));

        fetch("roles.json")
            .then(response => response.json())
            .then(data => { rolesData = data.roles; })
            .catch(error => console.error("Erreur de chargement des rôles :", error));

        chatbotToggle.addEventListener("click", function () {
            chatbotContainer.classList.toggle("active");
            afficherSuggestions();
        });

        chatbotClose.addEventListener("click", function () {
            chatbotContainer.classList.remove("active");
        });

        chatbotSend.addEventListener("click", envoyerMessage);
        chatbotInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") envoyerMessage();
        });

        function analyserTexte(input) {
            if (!input) return "";
            input = input.toLowerCase().trim();
        
            const corrections = {
                "reclmations": "réclamations",
                "comptuers": "compteurs",
                "facturs": "factures",
                "impayes": "impayés",
                "delai": "délai",
                "moyen": "moyenne",
                "traitment": "traitement",
                "traitementt": "traitement",
                "evolution": "évolution",
                "rejets": "rejetés",
                "couriers": "courriers",
                "courier": "courrier",
                "pnnd": "pnd"
            };
        
            input = input.split(" ").map(word => corrections[word] || word).join(" ");
        
            const motsInutiles = [
                "je", "veux", "souhaite", "peux", "voudrais", "voir", "afficher", "montrer",
                "savoir", "connaître", "explique", "explication", "me", "donne", "dis",
                "quel", "quelle", "quels", "quelles", "est", "la", "le", "les", "un", "une", "des"
            ];
        
            input = input.split(" ").filter(word => !motsInutiles.includes(word)).join(" ");
        
            return input;
        }
        

        function trouverCorrespondance(requete) {
            let correspondances = [];
            const categoriesAutorisees = new Set(rolesData[userRole]?.categories || []);

            questionsData.forEach(question => {
                if (!categoriesAutorisees.has(question.categorie)) return;

                const motsCles = question.motscles.toLowerCase().split(" ");
                let score = motsCles.reduce((acc, mot) => acc + (requete.includes(mot) ? 1 : 0), 0);

                if (analyserTexte(question.question).includes(requete)) score += 5;

                if (score > 0) {
                    correspondances.push({ question, score });
                }
            });

            correspondances.sort((a, b) => b.score - a.score);

            return correspondances.slice(0, 3).map(c => c.question);
        }

        function envoyerMessage() {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;
            afficherMessage("Vous", userMessage);
            chatbotInput.value = "";

            if (/explique|explication/i.test(userMessage)) {
                expliquerQuestion(userMessage);
                return;
            }

            const requeteAnalyse = analyserTexte(userMessage);
            const meilleuresQuestions = trouverCorrespondance(requeteAnalyse);

            if (meilleuresQuestions.length > 0) {
                let reponse = `<div>Voici les informations trouvées :</div>`;
            
                meilleuresQuestions.forEach(q => {
                    reponse += `
                        <div class="question-result" style="cursor:pointer;color:#005A9C;margin:5px 0;" data-question="${q.question}">
                            ➡️ <strong>${q.question}</strong> (Page : ${pageNames[q.page] || q.page})
                        </div>`;
                });
            
                afficherMessage("Chatbot", reponse);
            
                document.querySelectorAll(".question-result").forEach(item => {
                    item.addEventListener("click", () => expliquerQuestionDirecte(item.getAttribute("data-question")));
                });
            
            } else {
                afficherMessage("Chatbot", "Désolé, je ne trouve pas de correspondance. Essayez d'être plus précis !");
            }       
            // Gérer des commandes personnalisées spécifiques
            if (/cr[eé]er (un )?ticket/i.test(userMessage)) {
                afficherMessage("Chatbot", `Pour créer un ticket, cliquez sur ce lien : <a href="ticket.html" target="_blank">Créer un Ticket 🎫</a>`);
                return;
            }

            if (/ajouter (aux )?favoris/i.test(userMessage)) {
                const selectedPage = document.getElementById("question-select").value;
                if (selectedPage) {
                    ajouterFavoriDepuisChatbot(selectedPage);
                } else {
                    afficherMessage("Chatbot", "Veuillez sélectionner d'abord une page pour l'ajouter aux favoris ⭐.");
                }
                return;
            }

            if (/retirer (des )?favoris/i.test(userMessage)) {
                const selectedPage = document.getElementById("question-select").value;
                if (selectedPage) {
                    retirerFavoriDepuisChatbot(selectedPage);
                } else {
                    afficherMessage("Chatbot", "Veuillez sélectionner d'abord une page pour la retirer des favoris ❌.");
                }
                return;
            }

            

            afficherSuggestions();
        }

        function expliquerQuestionDirecte(questionText) {
            expliquerQuestion(questionText);
        }

        function expliquerQuestion(questionText) {
            const categoriesAutorisees = new Set(rolesData[userRole]?.categories || []);
        
            const questionTrouvee = questionsData.find(q =>
                analyserTexte(q.question) === analyserTexte(questionText) && categoriesAutorisees.has(q.categorie)
            );
        
            if (questionTrouvee && questionTrouvee.explication) {
                let explication = `
                <div style="padding:10px;border-left:4px solid #005A9C;background-color:#f0f8ff;border-radius:5px;">
                    <strong style="font-size:16px;color:#005A9C;">${questionTrouvee.question}</strong><br>
                    <strong>📍 Page :</strong> ${pageNames[questionTrouvee.page] || questionTrouvee.page}<br>
                    <strong>📊 Graphique :</strong> ${questionTrouvee.graphique}<br>
                    <strong>📋 Données :</strong> ${questionTrouvee.données}<br>
                    <hr style="border-top:1px dashed #005A9C;margin:5px 0;">
                    <strong>ℹ️ Explication :</strong> ${questionTrouvee.explication}
                </div>`;
        
                afficherMessage("Chatbot", explication);
            } else {
                afficherMessage("Chatbot", "Je ne trouve pas de question correspondante à expliquer ou vous n'avez pas accès à cette information.");
            }
        }
        

        function afficherMessage(utilisateur, message) {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", utilisateur === "Chatbot" ? "message-chatbot" : "message-user");
            
            messageElement.innerHTML = `<strong>${utilisateur} :</strong> ${message}`;
            
            chatbotMessages.appendChild(messageElement);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        // Retirer une page des favoris depuis le chatbot
        function retirerFavoriDepuisChatbot(page) {
            let currentUser = localStorage.getItem("currentUser") || "guest";
            let favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser}`)) || [];

            if (favorites.includes(page)) {
                favorites = favorites.filter(fav => fav !== page);
                localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
                afficherMessage("Chatbot", `✅ La page <strong>${pageNames[page] || page}</strong> a été retirée des favoris.`);
            } else {
                afficherMessage("Chatbot", `⚠️ La page <strong>${pageNames[page] || page}</strong> n'est pas dans vos favoris.`);
            }
        }

        

        function afficherSuggestions() {
            const categoriesAutorisees = new Set(rolesData[userRole]?.categories || []);
            let suggestions = questionsData.filter(q => categoriesAutorisees.has(q.categorie)).sort(() => 0.5 - Math.random()).slice(0, 3);

            chatbotSuggestions.innerHTML = "";
            suggestions.forEach(q => {
                let suggestionBtn = document.createElement("button");
                suggestionBtn.classList.add("suggestion-item");
                suggestionBtn.textContent = q.question;
                suggestionBtn.addEventListener("click", function () {
                    chatbotInput.value = q.question;
                    envoyerMessage();
                });
                chatbotSuggestions.appendChild(suggestionBtn);
            });
        }
    });
