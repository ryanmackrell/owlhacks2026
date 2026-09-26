import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API with your key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getSeaCreatureData(creatureName) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Fetch detailed scientific and biological information for the following sea creature: ${creatureName}`,
    config: {
      responseMimeType: "application/json",
      // Embed your exact JSON schema inside the API configuration
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          common_name: {
            type: Type.STRING,
            description: "The primary common name of the sea creature."
          },
          scientific_name: {
            type: Type.STRING,
            description: "Binomial nomenclature / scientific name."
          },
          taxonomy: {
            type: Type.OBJECT,
            properties: {
              kingdom: { type: Type.STRING },
              phylum: { type: Type.STRING },
              class: { type: Type.STRING },
              order: { type: Type.STRING },
              family: { type: Type.STRING },
              genus: { type: Type.STRING }
            },
            required: ["phylum", "class", "family", "genus"]
          },
          conservation_status: {
            type: Type.STRING,
            enum: [
              "Least Concern",
              "Near Threatened",
              "Vulnerable",
              "Endangered",
              "Critically Endangered",
              "Extinct in the Wild",
              "Extinct",
              "Data Deficient"
            ],
            description: "IUCN Red List classification status."
          },
          habitat: {
            type: Type.OBJECT,
            properties: {
              ocean_zones: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "e.g., Sunlight Zone (Epipelagic), Twilight Zone (Mesopelagic), Abyssal, Coral Reef"
              },
              depth_range_meters: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.INTEGER },
                  max: { type: Type.INTEGER }
                }
              },
              geographic_regions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["ocean_zones", "geographic_regions"]
          },
          physical_characteristics: {
            type: Type.OBJECT,
            properties: {
              average_length_meters: { type: Type.NUMBER },
              average_weight_kg: { type: Type.NUMBER },
              coloration: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              distinctive_features: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["distinctive_features"]
          },
          diet: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: ["Carnivore", "Herbivore", "Omnivore", "Detritivore", "Planktivore"]
              },
              primary_prey: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["type", "primary_prey"]
          },
          fun_facts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 engaging trivia points for web visitors."
          }
        },
        required: [
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
    }
  });

  // Convert Gemini's response string back into a JSON object
  const creatureData = JSON.parse(response.text);
  return creatureData;
}
