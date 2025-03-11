document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("-36UOhegVST7TvVPx"); // Remplace par ton Public Key trouvé dans EmailJS

    document.getElementById("ticket-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.querySelector("input[name='nom']").value;
        const email = document.querySelector("input[name='email']").value;
        const message = document.querySelector("textarea[name='message']").value;

        const templateParams = {
            from_name: nom,
            from_email: email,
            message: message,
            to_name: "Support Annemasse Agglo"
        };

        emailjs.send("service_jfzhg89", "template_v1c962o", templateParams)
            .then(function (response) {
                alert("✅ Ticket envoyé avec succès !");
                console.log("Succès :", response);
                document.getElementById("ticket-form").reset();
            }, function (error) {
                alert("❌ Une erreur est survenue. Vérifiez la configuration.");
                console.error("Erreur :", error);
            });
    });
});
