import json

def generer_explication(question_data):
    """
    Génère une explication basée sur les informations de la question.
    """
    explication = (
        f"Cette question appartient à la catégorie '{question_data['categorie']}'. "
        f"Elle permet d'analyser '{question_data['question']}' en utilisant un {question_data['graphique']}. "
        f"Les données exploitées sont : {question_data['données']}. "
        f"Ce KPI est utile pour comprendre {question_data['motscles'].replace('-', ' ')}."
    )
    return explication

# Charger le fichier DataIA.json
with open("DataIA.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Ajouter une explication pour chaque question
for question in data:
    question["explication"] = generer_explication(question)

# Sauvegarder les données mises à jour dans un nouveau fichier
with open("DataIAWithExplication.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Explications ajoutées avec succès !")
