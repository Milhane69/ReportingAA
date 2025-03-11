import csv
import json

# Names of the CSV and JSON files
csv_file = "DataIA.csv"
json_file = "DataIA.json"

# Initialize an empty list to hold the data
data = []

# Read the CSV file and convert it to a list of dictionaries
with open(csv_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data.append(row)

# Write the list of dictionaries to the JSON file
with open(json_file, "w", encoding="utf-8") as jsonfile:
    json.dump(data, jsonfile, indent=4, ensure_ascii=False)

print("Conversion terminée : DataIA.json créé.")
