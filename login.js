document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();

        try {
            const usersResponse = await fetch("users.json");
            const usersData = await usersResponse.json();
            const rolesResponse = await fetch("roles.json");
            const rolesData = await rolesResponse.json();

            if (usersData.users[username] && usersData.users[username].password === password) {
                const userRole = usersData.users[username].role;
                
                // ✅ Enregistrement correct de l'utilisateur
                localStorage.setItem("user", username);
                localStorage.setItem("currentUser", username); // Correction ici ✅
                localStorage.setItem("role", userRole);
                localStorage.setItem("permissions", JSON.stringify(rolesData.roles[userRole]));

                window.location.href = "dashboard.html";
            } else {
                alert("❌ Identifiant ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs ou rôles :", error);
        }
    });
});
