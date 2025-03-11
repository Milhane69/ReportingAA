document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("-36UOhegVST7TvVPx"); // Ta clé publique EmailJS

    document.getElementById("signup-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.querySelector("#signup-form input[name='nom']").value;
        const email = document.querySelector("#signup-form input[name='email']").value;
        const message = document.querySelector("#signup-form textarea[name='message']").value;

        const templateParams = {
            from_name: nom,
            from_email: email,
            message: message,
            to_name: "Administrateur Annemasse Agglo",
            subject: "Demande de création de compte"
        };

        emailjs.send("service_jfzhg89", "template_v1c962o", templateParams)
            .then(function (response) {
                alert("✅ Demande envoyée avec succès !");
                console.log("Succès :", response);
                document.getElementById("signup-form").reset();
            }, function (error) {
                alert("❌ Une erreur est survenue. Vérifiez la configuration.");
                console.error("Erreur :", error);
            });
    });
});
