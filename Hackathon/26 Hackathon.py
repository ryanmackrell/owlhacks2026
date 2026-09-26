from google import genai

from google.genai import types

client = genai.Client()

sea_creatures_schema = {
  "type": "OBJECT",
  "properties": {
    "common_name": {
      "type": "STRING",
      "description": "The primary common name of the sea creature."
    },
    "scientific_name": {
      "type": "STRING",
      "description": "Binomial nomenclature / scientific name."
    },
    "taxonomy": {
      "type": "OBJECT",
      "properties": {
        "kingdom": { "type": "STRING" },
        "phylum": { "type": "STRING" },
        "class": { "type": "STRING" },
        "order": { "type": "STRING" },
        "family": { "type": "STRING" },
        "genus": { "type": "STRING" }
      },
      "required": ["phylum", "class", "family", "genus"]
    },
    "conservation_status": {
      "type": "STRING",
      "enum": [
        "Least Concern",
        "Near Threatened",
        "Vulnerable",
        "Endangered",
        "Critically Endangered",
        "Extinct in the Wild",
        "Extinct",
        "Data Deficient"
      ],
      "description": "IUCN Red List classification status."
    },
    "habitat": {
      "type": "OBJECT",
      "properties": {
        "ocean_zones": {
          "type": "ARRAY",
          "items": { "type": "STRING" },
          "description": "e.g., Sunlight Zone (Epipelagic), Twilight Zone (Mesopelagic), Abyssal, Coral Reef"
        },
        "depth_range_meters": {
          "type": "OBJECT",
          "properties": {
            "min": { "type": "INTEGER" },
            "max": { "type": "INTEGER" }
          }
        },
        "geographic_regions": {
          "type": "ARRAY",
          "items": { "type": "STRING" }
        }
      },
      "required": ["ocean_zones", "geographic_regions"]
    },
    "physical_characteristics": {
      "type": "OBJECT",
      "properties": {
        "average_length_meters": { "type": "NUMBER" },
        "average_weight_kg": { "type": "NUMBER" },
        "coloration": {
          "type": "ARRAY",
          "items": { "type": "STRING" }
        },
        "distinctive_features": {
          "type": "ARRAY",
          "items": { "type": "STRING" }
        }
      },
      "required": ["distinctive_features"]
    },
    "diet": {
      "type": "OBJECT",
      "properties": {
        "type": {
          "type": "STRING",
          "enum": ["Carnivore", "Herbivore", "Omnivore", "Detritivore", "Planktivore"]
        },
        "primary_prey": {
          "type": "ARRAY",
          "items": { "type": "STRING" }
        }
      },
      "required": ["type", "primary_prey"]
    },
    "fun_facts": {
      "type": "ARRAY",
      "items": { "type": "STRING" },
      "description": "3-5 engaging trivia points for web visitors."
    }
  },
  "required": [
    "common_name",
    "scientific_name",
    "taxonomy",
    "conservation_status",
    "habitat",
    "physical_characteristics",
    "diet",
    "fun_facts"
  ]
}

response = client.generate(sea_creatures_schema)
print(response)