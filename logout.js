document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const currentUser = localStorage.getItem("currentUser") || "guest";

            // ✅ Sauvegarde des favoris avant suppression
            if (currentUser !== "guest") {
                const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser}`)) || [];
                localStorage.setItem(`favorites_${currentUser}`, JSON.stringify(favorites));
            }

            // ✅ Suppression des informations de session
            localStorage.removeItem("user");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("role");
            localStorage.removeItem("permissions");

            // ✅ Redirection vers la connexion
            window.location.href = "index.html";
        });
    }

    // Vérification de la connexion de l'utilisateur
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "index.html";
    } else {
        document.getElementById("username").textContent = user;
    }
});
