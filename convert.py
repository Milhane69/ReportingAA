import json

def generer_explication(question_data):
    """
    Génère une explication enrichie et plus fluide basée sur les informations de la question.
    """
    explication = (
        f"La question appartient à la catégorie {question_data['categorie']}, qui traite des problématiques liées à cette thématique. "
        f"Elle permet d'examiner : {question_data['question']}, en exploitant un {question_data['graphique']}. "
        f"Les principales données utilisées sont : {question_data['données']}. "
        f"Ce KPI est essentiel pour mieux comprendre les aspects liés à {', '.join(question_data['motscles'].split('-'))}."
    )
    return explication

# Charger le fichier DataIA.json
with open("DataIA.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Ajouter une explication pour chaque question
data = [{**q, "explication": generer_explication(q)} for q in data]

# Sauvegarder les données mises à jour dans un nouveau fichier
with open("DataIAWithExplication.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Explications ajoutées avec succès !")