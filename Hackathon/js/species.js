const species = [
    {
        name: "Thresher Shark",
        scientificName: "Alopias vulpinus",
        image: "data/images/Thresher Shark.jpg",
        conservationStatus: "Vulnerable",
        funFact: "The thresher shark uses its extremely long tail like a whip to stun schools of fish before eating them."
    },
    {
        name: "Bull Shark",
        scientificName: "Carcharhinus leucas",
        image: "data/images/Bull Shark.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Bull sharks can live in both saltwater and freshwater."
    },
    {
        name: "Tiger Shark",
        scientificName: "Galeocerdo cuvier",
        image: "data/images/Tiger Shark.jpg",
        conservationStatus: "Near Threatened",
        funFact: "Tiger sharks will eat an incredible variety of prey."
    },
    {
        name: "Shortfin Mako Shark",
        scientificName: "Isurus oxyrinchus",
        image: "data/images/Shortfin Mako Shark.jpg",
        conservationStatus: "Endangered",
        funFact: "The shortfin mako is considered the fastest shark in the world."
    },
    {
        name: "Bonnethead Shark",
        scientificName: "Sphyrna tiburo",
        image: "data/images/Bonnethead Shark.jpg",
        conservationStatus: "Endangered",
        funFact: "The bonnethead is one of the only sharks known to regularly eat seagrass."
    },
    {
        name: "Blue Whale",
        scientificName: "Balaenoptera musculus",
        image: "data/images/Blue Whale.jpg",
        conservationStatus: "Endangered",
        funFact: "The blue whale is the largest animal ever known to have lived on Earth."
    },
    {
        name: "Great White Shark",
        scientificName: "Carcharodon carcharias",
        image: "data/images/Great White Shark.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Great whites can detect tiny amounts of blood in the water."
    },
    {
        name: "Giant Pacific Octopus",
        scientificName: "Enteroctopus dofleini",
        image: "data/images/Giant Pacific Octopus.jpg",
        conservationStatus: "Least Concern",
        funFact: "It has three hearts and blue blood."
    },
    {
        name: "Green Sea Turtle",
        scientificName: "Chelonia mydas",
        image: "data/images/Green Sea Turtle.jpg",
        conservationStatus: "Endangered",
        funFact: "Adult green sea turtles are mostly herbivorous."
    },
    {
        name: "Manta Ray",
        scientificName: "Mobula birostris",
        image: "data/images/Manta Ray.jpg",
        conservationStatus: "Endangered",
        funFact: "Manta rays have the largest brain-to-body ratio of any fish."
    },
    {
        name: "Narwhal",
        scientificName: "Monodon monoceros",
        image: "data/images/Narwhal.jpg",
        conservationStatus: "Near Threatened",
        funFact: "Its famous tusk is actually an elongated tooth."
    },
    {
        name: "Beluga Whale",
        scientificName: "Delphinapterus leucas",
        image: "data/images/Beluga Whale.jpg",
        conservationStatus: "Least Concern",
        funFact: "Belugas can mimic human-like sounds."
    },
    {
        name: "Dugong",
        scientificName: "Dugong dugon",
        image: "data/images/Dugong.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Dugongs are often called sea cows."
    },
    {
        name: "Sea Otter",
        scientificName: "Enhydra lutris",
        image: "data/images/Sea Otter.jpg",
        conservationStatus: "Endangered",
        funFact: "Sea otters use rocks as tools to crack open shellfish."
    },
    {
        name: "Emperor Penguin",
        scientificName: "Aptenodytes forsteri",
        image: "data/images/Emperor Penguin.jpg",
        conservationStatus: "Near Threatened",
        funFact: "It is the tallest and heaviest penguin species."
    },
    {
        name: "Atlantic Puffin",
        scientificName: "Fratercula arctica",
        image: "data/images/Atlantic Puffin.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Puffins can carry several fish at once in their beaks."
    },
    {
        name: "Whale Shark",
        scientificName: "Rhincodon typus",
        image: "data/images/Whale Shark.jpg",
        conservationStatus: "Endangered",
        funFact: "It is the largest fish in the world."
    },
    {
        name: "Leafy Seadragon",
        scientificName: "Phycodurus eques",
        image: "data/images/Leafy Seadragon.jpg",
        conservationStatus: "Near Threatened",
        funFact: "Its body resembles drifting seaweed for camouflage."
    },
    {
        name: "Bottlenose Dolphin",
        scientificName: "Tursiops truncatus",
        image: "data/images/Bottlenose Dolphin.jpg",
        conservationStatus: "Least Concern",
        funFact: "Dolphins have unique signature whistles similar to names."
    },
    {
        name: "Horseshoe Crab",
        scientificName: "Limulus polyphemus",
        image: "data/images/Horseshoe Crab.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Its blue blood is used in medical testing."
    },
    {
        name: "Moon Jellyfish",
        scientificName: "Aurelia aurita",
        image: "data/images/Moon Jellyfish.jpg",
        conservationStatus: "Not Evaluated",
        funFact: "Jellyfish have no brain or heart."
    },
    {
        name: "Giant Clam",
        scientificName: "Tridacna gigas",
        image: "data/images/Giant Clam.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Giant clams can weigh over 400 pounds."
    },
    {
        name: "Great Hammerhead Shark",
        scientificName: "Sphyrna mokarran",
        image: "data/images/Great Hammerhead Shark.jpg",
        conservationStatus: "Critically Endangered",
        funFact: "Its wide head improves its ability to find prey."
    },
    {
        name: "Lionfish",
        scientificName: "Pterois volitans",
        image: "data/images/Lionfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "Lionfish have venomous spines."
    },
    {
        name: "Coelacanth",
        scientificName: "Latimeria chalumnae",
        image: "data/images/Coelacanth.jpg",
        conservationStatus: "Critically Endangered",
        funFact: "It was once thought extinct for millions of years."
    },
    {
        name: "Atlantic Bluefin Tuna",
        scientificName: "Thunnus thynnus",
        image: "data/images/Atlantic Bluefin Tuna.jpg",
        conservationStatus: "Endangered",
        funFact: "It can swim at speeds exceeding 40 mph."
    },
    {
        name: "Walrus",
        scientificName: "Odobenus rosmarus",
        image: "data/images/Walrus.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Walrus tusks can grow over three feet long."
    },
    {
        name: "Sea Cucumber",
        scientificName: "Holothuroidea",
        image: "data/images/Sea Cucumber.jpg",
        conservationStatus: "Varies by Species",
        funFact: "Some species can eject internal organs to escape predators."
    },
    {
        name: "Moray Eel",
        scientificName: "Muraenidae",
        image: "data/images/Moray Eel.jpg",
        conservationStatus: "Least Concern",
        funFact: "Moray eels have a second set of jaws in their throats."
    },
    {
        name: "Australian Sea Lion",
        scientificName: "Neophoca cinerea",
        image: "data/images/Australian Sea Lion.jpg",
        conservationStatus: "Endangered",
        funFact: "It is found only in Australia."
    },
    {
        name: "Harbor Seal",
        scientificName: "Phoca vitulina",
        image: "data/images/Harbor Seal.jpg",
        conservationStatus: "Least Concern",
        funFact: "Harbor seals can sleep underwater."
    },
    {
        name: "Orca (Killer Whale)",
        scientificName: "Orcinus orca",
        image: "data/images/Orca (Killer Whale).jpg",
        conservationStatus: "Data Deficient",
        funFact: "Orcas are actually the largest members of the dolphin family."
    },
    {
        name: "Goblin Shark",
        scientificName: "Mitsukurina owstoni",
        image: "data/images/Goblin Shark.jpg",
        conservationStatus: "Least Concern",
        funFact: "Its jaws can rapidly shoot forward to catch prey."
    },
    {
        name: "Vampire Squid",
        scientificName: "Vampyroteuthis infernalis",
        image: "data/images/Vampire Squid.jpg",
        conservationStatus: "Least Concern",
        funFact: "It glows in the dark using bioluminescence."
    },
    {
        name: "Nautilus",
        scientificName: "Nautilus pompilius",
        image: "data/images/Nautilus.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Its shell is divided into chambers."
    },
    {
        name: "Coral Catshark",
        scientificName: "Atelomycterus marmoratus",
        image: "data/images/Coral Catshark.jpg",
        conservationStatus: "Near Threatened",
        funFact: "This small shark prefers coral reef habitats."
    },
    {
        name: "Arapaima",
        scientificName: "Arapaima gigas",
        image: "data/images/Arapaima.jpg",
        conservationStatus: "Data Deficient",
        funFact: "It can breathe air at the water's surface."
    },
    {
        name: "Piranha",
        scientificName: "Pygocentrus nattereri",
        image: "data/images/Piranha.jpg",
        conservationStatus: "Least Concern",
        funFact: "Contrary to myths, piranhas rarely attack humans."
    },
    {
        name: "Electric Eel",
        scientificName: "Electrophorus electricus",
        image: "data/images/Electric Eel.jpg",
        conservationStatus: "Least Concern",
        funFact: "It can generate electrical shocks over 600 volts."
    },
    {
        name: "Chinese Giant Salamander",
        scientificName: "Andrias davidianus",
        image: "data/images/Chinese Giant Salamander.jpg",
        conservationStatus: "Critically Endangered",
        funFact: "It is the world's largest amphibian."
    },
    {
        name: "Axolotl",
        scientificName: "Ambystoma mexicanum",
        image: "data/images/Axolotl.jpg",
        conservationStatus: "Critically Endangered",
        funFact: "Axolotls can regenerate entire limbs."
    },
    {
        name: "Manatee",
        scientificName: "Trichechus manatus",
        image: "data/images/Manatee.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Manatees spend up to half their day sleeping."
    },
    {
        name: "Seahorse",
        scientificName: "Hippocampus kuda",
        image: "data/images/Seahorse.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Male seahorses carry and give birth to babies."
    },
    {
        name: "Mudskipper",
        scientificName: "Periophthalmus argentilineatus",
        image: "data/images/Mudskipper.jpg",
        conservationStatus: "Least Concern",
        funFact: "It can walk on land using its fins."
    },
    {
        name: "Dragon Moray Eel",
        scientificName: "Enchelycore pardalis",
        image: "data/images/Dragon Moray Eel.jpg",
        conservationStatus: "Least Concern",
        funFact: "Its colorful appearance resembles a dragon."
    },
    {
        name: "Ocean Sunfish",
        scientificName: "Mola mola",
        image: "data/images/Ocean Sunfish.jpg",
        conservationStatus: "Vulnerable",
        funFact: "It is one of the heaviest bony fish species."
    },
    {
        name: "Coconut Octopus",
        scientificName: "Amphioctopus marginatus",
        image: "data/images/Coconut Octopus.jpg",
        conservationStatus: "Least Concern",
        funFact: "It carries coconut shells as portable shelters."
    },
    {
        name: "Antarctic Krill",
        scientificName: "Euphausia superba",
        image: "data/images/Antarctic Krill.jpg",
        conservationStatus: "Not Evaluated",
        funFact: "Krill form enormous swarms visible from space."
    },
    {
        name: "Flying Fish",
        scientificName: "Exocoetidae",
        image: "data/images/Flying Fish.jpg",
        conservationStatus: "Least Concern",
        funFact: "Flying fish can glide over 600 feet."
    },
    {
        name: "Triggerfish",
        scientificName: "Balistidae",
        image: "data/images/Triggerfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "They have a locking dorsal spine for protection."
    },
    {
        name: "Crown-of-Thorns Starfish",
        scientificName: "Acanthaster planci",
        image: "data/images/Crown-of-Thorns Starfish.jpg",
        conservationStatus: "Not Evaluated",
        funFact: "It can have up to 21 arms."
    },
    {
        name: "Ribbon Seal",
        scientificName: "Histriophoca fasciata",
        image: "data/images/Ribbon Seal.jpg",
        conservationStatus: "Least Concern",
        funFact: "Adults have striking ribbon-like white markings."
    },
    {
        name: "Zebra Shark",
        scientificName: "Stegostoma tigrinum",
        image: "data/images/Zebra Shark.jpg",
        conservationStatus: "Endangered",
        funFact: "Young zebra sharks look completely different from adults."
    },
    {
        name: "Japanese Spider Crab",
        scientificName: "Macrocheira kaempferi",
        image: "data/images/Japanese Spider Crab.jpg",
        conservationStatus: "Data Deficient",
        funFact: "It has the longest leg span of any arthropod."
    },
    {
        name: "Portuguese Man O' War",
        scientificName: "Physalia physalis",
        image: "data/images/Portuguese Man O' War.jpg",
        conservationStatus: "Not Evaluated",
        funFact: "It is a colony of specialized organisms rather than a single animal."
    },
    {
        name: "Mandarin Dragonet",
        scientificName: "Synchiropus splendidus",
        image: "data/images/Mandarin Dragonet.jpg",
        conservationStatus: "Least Concern",
        funFact: "It is considered one of the most colorful fish in the world."
    },
    {
        name: "Copperband Butterflyfish",
        scientificName: "Chelmon rostratus",
        image: "data/images/Copperband Butterflyfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "Its narrow snout helps it reach prey in coral crevices."
    },
    {
        name: "Bannerfish",
        scientificName: "Heniochus acuminatus",
        image: "data/images/Bannerfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "It is often mistaken for the Moorish Idol."
    },
    {
        name: "Sailfin Tang",
        scientificName: "Zebrasoma veliferum",
        image: "data/images/Sailfin Tang.jpg",
        conservationStatus: "Least Concern",
        funFact: "Its large fins resemble sails when extended."
    },
    {
        name: "Cleaner Wrasse",
        scientificName: "Labroides dimidiatus",
        image: "data/images/Cleaner Wrasse.jpg",
        conservationStatus: "Least Concern",
        funFact: "It removes parasites from larger fish."
    },
    {
        name: "Humphead Wrasse",
        scientificName: "Cheilinus undulatus",
        image: "data/images/Humphead Wrasse.jpg",
        conservationStatus: "Endangered",
        funFact: "It is one of the largest reef fish."
    },
    {
        name: "Parrotfish",
        scientificName: "Scarus ghobban",
        image: "data/images/Parrotfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "Parrotfish create sand by grinding coral with their beaks."
    },
    {
        name: "Giant Grouper",
        scientificName: "Epinephelus lanceolatus",
        image: "data/images/Giant Grouper.jpg",
        conservationStatus: "Vulnerable",
        funFact: "It can weigh over 800 pounds."
    },
    {
        name: "Nassau Grouper",
        scientificName: "Epinephelus striatus",
        image: "data/images/Nassau Grouper.jpg",
        conservationStatus: "Critically Endangered",
        funFact: "It gathers in massive spawning aggregations."
    },
    {
        name: "Barracuda",
        scientificName: "Sphyraena barracuda",
        image: "data/images/Barracuda.jpg",
        conservationStatus: "Least Concern",
        funFact: "Barracudas can accelerate with incredible speed."
    },
    {
        name: "Tarpon",
        scientificName: "Megalops atlanticus",
        image: "data/images/Tarpon.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Tarpon can gulp air from the surface."
    },
    {
        name: "Bonefish",
        scientificName: "Albula vulpes",
        image: "data/images/Bonefish.jpg",
        conservationStatus: "Near Threatened",
        funFact: "Bonefish are among the fastest fish in shallow water."
    },
    {
        name: "Blue Marlin",
        scientificName: "Makaira nigricans",
        image: "data/images/Blue Marlin.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Blue marlin can weigh over 1,800 pounds."
    },
    {
        name: "Black Marlin",
        scientificName: "Istiompax indica",
        image: "data/images/Black Marlin.jpg",
        conservationStatus: "Data Deficient",
        funFact: "It is one of the largest bony fish in the ocean."
    },
    {
        name: "Swordfish",
        scientificName: "Xiphias gladius",
        image: "data/images/Swordfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "Swordfish use their bills to slash at prey."
    },
    {
        name: "Wahoo",
        scientificName: "Acanthocybium solandri",
        image: "data/images/Wahoo.jpg",
        conservationStatus: "Least Concern",
        funFact: "Wahoo are among the fastest pelagic fish."
    },
    {
        name: "Mahi-Mahi",
        scientificName: "Coryphaena hippurus",
        image: "data/images/Mahi-Mahi.jpg",
        conservationStatus: "Least Concern",
        funFact: "Mahi-mahi grow extraordinarily fast."
    },
    {
        name: "Atlantic Cod",
        scientificName: "Gadus morhua",
        image: "data/images/Atlantic Cod.jpg",
        conservationStatus: "Vulnerable",
        funFact: "Atlantic cod once supported one of the world's largest fisheries."
    },
    {
        name: "Pollock",
        scientificName: "Pollachius virens",
        image: "data/images/Pollock.jpg",
        conservationStatus: "Least Concern",
        funFact: "Pollock are important predators in North Atlantic ecosystems."
    },
    {
        name: "Northern Pike",
        scientificName: "Esox lucius",
        image: "data/images/Northern Pike.jpg",
        conservationStatus: "Least Concern",
        funFact: "Pike are ambush predators with razor-sharp teeth."
    },
    {
        name: "Muskellunge",
        scientificName: "Esox masquinongy",
        image: "data/images/Muskellunge.jpg",
        conservationStatus: "Least Concern",
        funFact: "It is often called the fish of ten thousand casts."
    },
    {
        name: "Rainbow Trout",
        scientificName: "Oncorhynchus mykiss",
        image: "data/images/Rainbow Trout.jpg",
        conservationStatus: "Least Concern",
        funFact: "Some populations migrate to the ocean and become steelhead."
    },
    {
        name: "Brook Trout",
        scientificName: "Salvelinus fontinalis",
        image: "data/images/Brook Trout.jpg",
        conservationStatus: "Least Concern",
        funFact: "Brook trout are actually a type of char, not a true trout."
    },
    {
        name: "White Sturgeon",
        scientificName: "Acipenser transmontanus",
        image: "data/images/White Sturgeon.jpg",
        conservationStatus: "Least Concern",
        funFact: "It is North America's largest freshwater fish."
    },
    {
        name: "Alligator Gar",
        scientificName: "Atractosteus spatula",
        image: "data/images/Alligator Gar.jpg",
        conservationStatus: "Least Concern",
        funFact: "Alligator gars can breathe both air and water."
    },
    {
        name: "African Lungfish",
        scientificName: "Protopterus annectens",
        image: "data/images/African Lungfish.jpg",
        conservationStatus: "Least Concern",
        funFact: "It can survive droughts by burying itself in mud."
    }
];