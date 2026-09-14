// ==UserScript==
// @name         Jackbox Prompt Filler
// @namespace    jackbox-utils
// @version      1.4.0
// @description  One click: submit 50 random prompts on the jackbox.tv add-prompt page, wait 4s, then press Done.
// @author       isycat
// @homepageURL  https://github.com/isycat/jackbox-utils
// @supportURL   https://github.com/isycat/jackbox-utils/issues
// @downloadURL  https://github.com/isycat/jackbox-utils/raw/refs/heads/main/greasemonkey/jackbox-prompt-filler.user.js
// @updateURL    https://github.com/isycat/jackbox-utils/raw/refs/heads/main/greasemonkey/jackbox-prompt-filler.user.js
// @match        *://jackbox.tv/*
// @match        *://*.jackbox.tv/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // Buttons listing the prompts already added (clicking one removes it).
    const ADDED_PROMPT_SELECTOR = '#promptsRegion > div > div > button';

    // Toggled on <html> by the blur setting (not <body>, whose classes page code may reset).
    const BLUR_CLASS = 'jackbox-prompt-filler-blur';

    const blurStyle = document.createElement('style');
    blurStyle.textContent = `.${BLUR_CLASS} ${ADDED_PROMPT_SELECTOR} { filter: blur(6px); }`;
    document.head.appendChild(blurStyle);

    // Index 0 is Gen 1; regional forms sit with the generation that introduced them.
    const POKEMON_BY_GEN = [
        // Gen 1
        ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran", "Nidorina", "Nidoqueen", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew"],
        // Gen 2
        ["Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi"],
        // Gen 3
        ["Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia", "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth", "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur", "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass", "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle", "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt", "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish", "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet", "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol", "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys"],
        // Gen 4
        ["Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky", "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke", "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus"],
        // Gen 5
        ["Victini", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup", "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna", "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola", "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad", "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny", "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka", "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty", "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen", "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino", "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe", "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus", "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo", "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent", "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao", "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom", "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect"],
        // Gen 6
        ["Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling", "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo", "Pyroar", "Flabebe", "Floette", "Florges", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge", "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink", "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion"],
        // Gen 7
        ["Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Pikipek", "Trumbeak", "Toucannon", "Yungoos", "Gumshoos", "Grubbin", "Charjabug", "Vikavolt", "Crabrawler", "Crabominable", "Oricorio", "Cutiefly", "Ribombee", "Rockruff", "Lycanroc", "Wishiwashi", "Mareanie", "Toxapex", "Mudbray", "Mudsdale", "Dewpider", "Araquanid", "Fomantis", "Lurantis", "Morelull", "Shiinotic", "Salandit", "Salazzle", "Stufful", "Bewear", "Bounsweet", "Steenee", "Tsareena", "Comfey", "Oranguru", "Passimian", "Wimpod", "Golisopod", "Sandygast", "Palossand", "Pyukumuku", "Type: Null", "Silvally", "Minior", "Komala", "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise", "Jangmo-o", "Hakamo-o", "Kommo-o", "Alolan Rattata", "Alolan Raticate", "Alolan Raichu", "Alolan Sandshrew", "Alolan Sandslash", "Alolan Vulpix", "Alolan Ninetales", "Alolan Diglett", "Alolan Dugtrio", "Alolan Meowth", "Alolan Persian", "Alolan Geodude", "Alolan Graveler", "Alolan Golem", "Alolan Grimer", "Alolan Muk", "Alolan Exeggutor", "Alolan Marowak", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Nihilego", "Buzzwole", "Pheromosa", "Xurkitree", "Celesteela", "Kartana", "Guzzlord", "Necrozma", "Magearna", "Marshadow", "Poipole", "Naganadel", "Stakataka", "Blacephalon", "Zeraora", "Meltan", "Melmetal"],
        // Gen 8
        ["Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Skwovet", "Greedent", "Rookidee", "Corvisquire", "Corviknight", "Blipbug", "Dottler", "Orbeetle", "Nickit", "Thievul", "Gossifleur", "Eldegoss", "Wooloo", "Dubwool", "Chewtle", "Drednaw", "Yamper", "Boltund", "Rolycoly", "Carkol", "Coalossal", "Applin", "Flapple", "Appletun", "Silicobra", "Sandaconda", "Cramorant", "Arrokuda", "Barraskewda", "Toxel", "Toxtricity", "Sizzlipede", "Centiskorch", "Clobbopus", "Grapploct", "Sinistea", "Polteageist", "Hatenna", "Hattrem", "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Galarian Zigzagoon", "Galarian Linoone", "Obstagoon", "Perrserker", "Cursola", "Galarian Farfetch'd", "Sirfetch'd", "Galarian Mr. Mime", "Mr. Rime", "Galarian Yamask", "Runerigus", "Milcery", "Alcremie", "Falinks", "Pincurchin", "Snom", "Frosmoth", "Stonjourner", "Eiscue", "Indeedee", "Morpeko", "Cufant", "Copperajah", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish", "Duraludon", "Dreepy", "Drakloak", "Dragapult", "Zacian", "Zamazenta", "Eternatus"],
        // Gen 9
        ["Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Pawmi", "Pawmo", "Pawmot", "Tandemaus", "Maushold", "Fidough", "Dachsbun", "Smoliv", "Dolliv", "Arboliva", "Squawkabilly", "Nacli", "Naclstack", "Garganacl", "Charcadet", "Armarouge", "Ceruledge", "Tadbulb", "Bellibolt", "Wattrel", "Kilowattrel", "Maschiff", "Mabosstiff", "Shroodle", "Grafaiai", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Klawf", "Capsakid", "Scovillain", "Rellor", "Rabsca", "Flittle", "Espathra", "Tinkatink", "Tinkatuff", "Tinkaton", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Glimmet", "Glimmora", "Greavard", "Houndstone", "Flamigo", "Cetoddle", "Cetitan", "Veluza", "Dondozo", "Tatsugiri", "Annihilape", "Clodsire", "Farigiraf", "Dudunsparce", "Kingambit", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Iron Valiant", "Koraidon", "Miraidon"],
        // Gen 10: no names yet
        [],
    ];
    const MOVES = ["Absorb", "Accelerock", "Acid", "Acid Armor", "Acid Downpour", "Acid Spray", "Acrobatics", "Acupressure", "Aerial Ace", "Aeroblast", "After You", "Agility", "Air Cutter", "Air Slash", "All-Out Pummeling", "Ally Switch", "Amnesia", "Anchor Shot", "Ancient Power", "Apple Acid", "Aqua Jet", "Aqua Ring", "Aqua Tail", "Arm Thrust", "Aromatherapy", "Aromatic Mist", "Assist", "Assurance", "Astonish", "Attack Order", "Attract", "Aura Sphere", "Aura Wheel", "Aurora Beam", "Aurora Veil", "Autotomize", "Avalanche", "Baby-Doll Eyes", "Baddy Bad", "Baneful Bunker", "Barrage", "Barrier", "Baton Pass", "Beak Blast", "Beat Up", "Behemoth Bash", "Behemoth Blade", "Belch", "Belly Drum", "Bestow", "Bide", "Bind", "Bite", "Black Hole Eclipse", "Blast Burn", "Blaze Kick", "Blizzard", "Block", "Bloom Doom", "Blue Flare", "Body Press", "Body Slam", "Bolt Beak", "Bolt Strike", "Bone Club", "Bone Rush", "Bonemerang", "Boomburst", "Bounce", "Bouncy Bubble", "Branch Poke", "Brave Bird", "Breaking Swipe", "Breakneck Blitz", "Brick Break", "Brine", "Brutal Swing", "Bubble", "Bubble Beam", "Bug Bite", "Bug Buzz", "Bulk Up", "Bulldoze", "Bullet Punch", "Bullet Seed", "Burn Up", "Buzzy Buzz", "Calm Mind", "Camouflage", "Captivate", "Catastropika", "Celebrate", "Charge", "Charge Beam", "Charm", "Chatter", "Chip Away", "Circle Throw", "Clamp", "Clanging Scales", "Clangorous Soul", "Clangorous Soulblaze", "Clear Smog", "Close Combat", "Coil", "Comet Punch", "Confide", "Confuse Ray", "Confusion", "Constrict", "Continental Crush", "Conversion", "Copycat", "Core Enforcer", "Corkscrew Crash", "Cosmic Power", "Cotton Guard", "Cotton Spore", "Counter", "Court Change", "Covet", "Crabhammer", "Crafty Shield", "Cross Chop", "Cross Poison", "Crunch", "Crush Claw", "Crush Grip", "Curse", "Cut", "Dark Pulse", "Dark Void", "Darkest Lariat", "Dazzling Gleam", "Decorate", "Defend Order", "Defense Curl", "Defog", "Destiny Bond", "Detect", "Devastating Drake", "Diamond Storm", "Dig", "Disable", "Disarming Voice", "Discharge", "Dive", "Dizzy Punch", "Doom Desire", "Double Hit", "Double Iron Bash", "Double Kick", "Double Slap", "Double Team", "Double-Edge", "Draco Meteor", "Dragon Ascent", "Dragon Breath", "Dragon Claw", "Dragon Dance", "Dragon Darts", "Dragon Hammer", "Dragon Pulse", "Dragon Rage", "Dragon Rush", "Dragon Tail", "Drain Punch", "Draining Kiss", "Dream Eater", "Drill Peck", "Drill Run", "Drum Beating", "Dual Chop", "Dynamax Cannon", "Dynamic Punch", "Earth Power", "Earthquake", "Echoed Voice", "Eerie Impulse", "Egg Bomb", "Electric Terrain", "Electrify", "Electro Ball", "Electroweb", "Embargo", "Ember", "Encore", "Endeavor", "Endure", "Energy Ball", "Entrainment", "Eruption", "Eternabeam", "Excavate", "Explosion", "Extrasensory", "Extreme Evoboost", "Extreme Speed", "Facade", "Fairy Lock", "Fairy Wind", "Fake Out", "Fake Tears", "False Surrender", "False Swipe", "Feather Dance", "Feint", "Feint Attack", "Fell Stinger", "Fiery Dance", "Final Gambit", "Fire Blast", "Fire Fang", "Fire Lash", "Fire Pledge", "Fire Punch", "Fire Spin", "First Impression", "Fishious Rend", "Fissure", "Flail", "Flame Burst", "Flame Charge", "Flame Wheel", "Flamethrower", "Flare Blitz", "Flash", "Flash Cannon", "Flatter", "Fleur Cannon", "Fling", "Floaty Fall", "Floral Healing", "Flower Shield", "Fly", "Flying Press", "Focus Blast", "Focus Energy", "Focus Punch", "Follow Me", "Force Palm", "Foresight", "Forest's Curse", "Foul Play", "Freeze Shock", "Freeze-Dry", "Freezy Frost", "Frenzy Plant", "Frost Breath", "Frustration", "Fury Attack", "Fury Cutter", "Fury Swipes", "Fusion Bolt", "Fusion Flare", "Future Sight", "Gastro Acid", "Gear Grind", "Gear Up", "Genesis Supernova", "Geomancy", "Giga Drain", "Giga Impact", "Gigavolt Havoc", "Glaciate", "Glare", "Glitzy Glow", "Grass Knot", "Grass Pledge", "Grass Whistle", "Grassy Terrain", "Grav Apple", "Gravity", "Growl", "Growth", "Grudge", "Guard Split", "Guard Swap", "Guardian of Alola", "Guillotine", "Gunk Shot", "Gust", "Gyro Ball", "Hail", "Hammer Arm", "Happy Hour", "Harden", "Haze", "Head Charge", "Head Smash", "Headbutt", "Heal Bell", "Heal Block", "Heal Order", "Heal Pulse", "Healing Wish", "Heart Stamp", "Heart Swap", "Heat Crash", "Heat Wave", "Heavy Slam", "Helping Hand", "Hex", "Hidden Power", "High Horsepower", "High Jump Kick", "Hold Back", "Hold Hands", "Hone Claws", "Horn Attack", "Horn Drill", "Horn Leech", "Howl", "Hurricane", "Hydro Cannon", "Hydro Pump", "Hydro Vortex", "Hyper Beam", "Hyper Fang", "Hyper Voice", "Hyperspace Fury", "Hyperspace Hole", "Hypnosis", "Ice Ball", "Ice Beam", "Ice Burn", "Ice Fang", "Ice Hammer", "Ice Punch", "Ice Shard", "Icicle Crash", "Icicle Spear", "Icy Wind", "Imprison", "Incinerate", "Inferno", "Inferno Overdrive", "Infestation", "Ingrain", "Instruct", "Ion Deluge", "Iron Defense", "Iron Head", "Iron Tail", "Jaw Lock", "Judgment", "Jump Kick", "Jungle Healing", "Karate Chop", "Kinesis", "King's Shield", "Knock Off", "Land's Wrath", "Laser Focus", "Last Resort", "Lava Plume", "Leaf Blade", "Leaf Storm", "Leaf Tornado", "Leafage", "Leech Life", "Leech Seed", "Leer", "Let's Snuggle Forever", "Lick", "Life Dew", "Light of Ruin", "Light Screen", "Light That Burns the Sky", "Liquidation", "Lock-On", "Lovely Kiss", "Low Kick", "Low Sweep", "Lucky Chant", "Lunar Dance", "Lunge", "Luster Purge", "Mach Punch", "Magic Coat", "Magic Powder", "Magic Room", "Magical Leaf", "Magma Storm", "Magnet Bomb", "Magnet Rise", "Magnetic Flux", "Magnitude", "Malicious Moonsault", "Mat Block", "Me First", "Mean Look", "Meditate", "Mega Drain", "Mega Kick", "Mega Punch", "Megahorn", "Memento", "Menacing Moonraze Maelstrom", "Metal Burst", "Metal Claw", "Metal Sound", "Meteor Assault", "Meteor Mash", "Metronome", "Milk Drink", "Mimic", "Mind Blown", "Mind Reader", "Minimize", "Miracle Eye", "Mirror Coat", "Mirror Move", "Mirror Shot", "Mist", "Mist Ball", "Misty Terrain", "Moonblast", "Moongeist Beam", "Moonlight", "Morning Sun", "Mud Bomb", "Mud Shot", "Mud Sport", "Mud-Slap", "Muddy Water", "Multi-Attack", "Mystical Fire", "Nasty Plot", "Natural Gift", "Nature Power", "Nature's Madness", "Needle Arm", "Never-Ending Nightmare", "Night Daze", "Night Shade", "Night Slash", "Nightmare", "No Retreat", "Noble Roar", "Nuzzle", "Oblivion Wing", "Obstruct", "Oceanic Operetta", "Octazooka", "Octolock", "Odor Sleuth", "Ominous Wind", "Origin Pulse", "Outrage", "Overdrive", "Overheat", "Pain Split", "Parabolic Charge", "Parting Shot", "Pay Day", "Payback", "Peck", "Perish Song", "Petal Blizzard", "Petal Dance", "Phantom Force", "Photon Geyser", "Pika Papow", "Pin Missile", "Plasma Fists", "Play Nice", "Play Rough", "Pluck", "Poison Fang", "Poison Gas", "Poison Jab", "Poison Powder", "Poison Sting", "Poison Tail", "Pollen Puff", "Pound", "Powder", "Powder Snow", "Power Gem", "Power Split", "Power Swap", "Power Trick", "Power Trip", "Power Whip", "Power-Up Punch", "Precipice Blades", "Present", "Prismatic Laser", "Protect", "Psybeam", "Psych Up", "Psychic", "Psychic Fangs", "Psychic Terrain", "Psycho Boost", "Psycho Cut", "Psycho Shift", "Psyshock", "Psystrike", "Psywave", "Pulverizing Pancake", "Punishment", "Purify", "Pursuit", "Pyro Ball", "Quash", "Quick Attack", "Quick Guard", "Quiver Dance", "Rage", "Rage Powder", "Rain Dance", "Rapid Spin", "Razor Leaf", "Razor Shell", "Razor Wind", "Recover", "Recycle", "Reflect", "Reflect Type", "Refresh", "Relic Song", "Rest", "Retaliate", "Return", "Revelation Dance", "Revenge", "Reversal", "Roar", "Roar of Time", "Rock Blast", "Rock Climb", "Rock Polish", "Rock Slide", "Rock Smash", "Rock Throw", "Rock Tomb", "Rock Wrecker", "Role Play", "Rolling Kick", "Rollout", "Roost", "Rototiller", "Round", "Sacred Fire", "Sacred Sword", "Safeguard", "Sand Attack", "Sand Tomb", "Sandstorm", "Sappy Seed", "Savage Spin-Out", "Scald", "Scary Face", "Scratch", "Screech", "Searing Shot", "Searing Sunraze Smash", "Secret Power", "Secret Sword", "Seed Bomb", "Seed Flare", "Seismic Toss", "Self-Destruct", "Shadow Ball", "Shadow Blast", "Shadow Blitz", "Shadow Bolt", "Shadow Bone", "Shadow Break", "Shadow Chill", "Shadow Claw", "Shadow Down", "Shadow End", "Shadow Fire", "Shadow Force", "Shadow Half", "Shadow Hold", "Shadow Mist", "Shadow Panic", "Shadow Punch", "Shadow Rave", "Shadow Rush", "Shadow Shed", "Shadow Sky", "Shadow Sneak", "Shadow Storm", "Shadow Wave", "Sharpen", "Shattered Psyche", "Sheer Cold", "Shell Smash", "Shell Trap", "Shift Gear", "Shock Wave", "Shore Up", "Signal Beam", "Silver Wind", "Simple Beam", "Sing", "Sinister Arrow Raid", "Sizzly Slide", "Sketch", "Skill Swap", "Skull Bash", "Sky Attack", "Sky Drop", "Sky Uppercut", "Slack Off", "Slam", "Slash", "Sleep Powder", "Sleep Talk", "Sludge", "Sludge Bomb", "Sludge Wave", "Smack Down", "Smart Strike", "Smelling Salts", "Smog", "Smokescreen", "Snap Trap", "Snarl", "Snatch", "Snipe Shot", "Snore", "Soak", "Soft-Boiled", "Solar Beam", "Solar Blade", "Sonic Boom", "Spacial Rend", "Spark", "Sparkling Aria", "Sparkly Swirl", "Spectral Thief", "Speed Swap", "Spider Web", "Spike Cannon", "Spikes", "Spiky Shield", "Spin Slash", "Spirit Break", "Spirit Shackle", "Spit Up", "Spite", "Splash", "Splintered Stormshards", "Splishy Splash", "Spore", "Spotlight", "Stealth Rock", "Steam Eruption", "Steamroller", "Steel Beam", "Steel Wing", "Sticky Web", "Stockpile", "Stoked Sparksurfer", "Stomp", "Stomping Tantrum", "Stone Edge", "Stored Power", "Storm Throw", "Strange Steam", "Strength", "Strength Sap", "String Shot", "Struggle", "Struggle Bug", "Stuff Cheeks", "Stun Spore", "Submission", "Substitute", "Subzero Slammer", "Sucker Punch", "Sunny Day", "Sunsteel Strike", "Super Fang", "Superpower", "Supersonic", "Supersonic Skystrike", "Surf", "Swagger", "Swallow", "Sweet Kiss", "Sweet Scent", "Swift", "Switcheroo", "Swords Dance", "Synchronoise", "Synthesis", "Tackle", "Tail Glow", "Tail Slap", "Tail Whip", "Tailwind", "Take Down", "Tar Shot", "Taunt", "Tearful Look", "Teatime", "Techno Blast", "Tectonic Rage", "Teeter Dance", "Telekinesis", "Teleport", "Thief", "Thousand Arrows", "Thousand Waves", "Thrash", "Throat Chop", "Thunder", "Thunder Fang", "Thunder Punch", "Thunder Shock", "Thunder Wave", "Thunderbolt", "Tickle", "Topsy-Turvy", "Torment", "Toxic", "Toxic Spikes", "Toxic Thread", "Transform", "Tri Attack", "Trick", "Trick Room", "Trick-or-Treat", "Triple Kick", "Trop Kick", "Trump Card", "Twineedle", "Twinkle Tackle", "Twister", "U-turn", "Uproar", "V-create", "Vacuum Wave", "Vacuum-Cut", "Veevee Volley", "Venom Drench", "Venoshock", "Vine Whip", "Vise Grip", "Vital Throw", "Volt Switch", "Volt Tackle", "Wake-Up Slap", "Water Gun", "Water Pledge", "Water Pulse", "Water Shuriken", "Water Sport", "Water Spout", "Waterfall", "Weather Ball", "Whirlpool", "Whirlwind", "Wide Guard", "Wide Slash", "Wild Charge", "Will-O-Wisp", "Wing Attack", "Wish", "Withdraw", "Wonder Room", "Wood Hammer", "Work Up", "Worry Seed", "Wrap", "Wring Out", "X-Scissor", "Yawn", "Zap Cannon", "Zen Headbutt", "Zing Zap", "Zippy Zap"];
    const ABILITIES = ["Adaptability", "Aerilate", "Aftermath", "Air Lock", "Analytic", "Anger Point", "Anger Shell", "Anticipation", "Arena Trap", "Armor Tail", "Aroma Veil", "As One", "Aura Break", "Aura Guard", "Bad Dreams", "Ball Fetch", "Battery", "Battle Armor", "Battle Bond", "Beads of Ruin", "Beast Boost", "Berserk", "Big Pecks", "Blaze", "Bulletproof", "Cheek Pouch", "Chilling Neigh", "Chlorophyll", "Clear Body", "Cloud Nine", "Color Change", "Comatose", "Commander", "Competitive", "Compound Eyes", "Contrary", "Corrosion", "Costar", "Cotton Down", "Cud Chew", "Curious Medicine", "Cursed Body", "Cute Charm", "Damp", "Dancer", "Dark Aura", "Dauntless Shield", "Dazzling", "Defeatist", "Defiant", "Delta Stream", "Desolate Land", "Disguise", "Download", "Dragon's Maw", "Dragonize", "Drizzle", "Drought", "Dry Skin", "Early Bird", "Earth Eater", "Eelevate", "Effect Spore", "Electric Surge", "Electromorphosis", "Embody Aspect", "Emergency Exit", "Fairy Aura", "Filter", "Fire Mane", "Flame Body", "Flare Boost", "Flash Fire", "Flower Gift", "Flower Veil", "Fluffy", "Forecast", "Forewarn", "Friend Guard", "Frisk", "Full Metal Body", "Fur Coat", "Gale Wings", "Galvanize", "Gluttony", "Good as Gold", "Gooey", "Gorilla Tactics", "Grass Pelt", "Grassy Surge", "Grim Neigh", "Guard Dog", "Gulp Missile", "Guts", "Hadron Engine", "Harvest", "Healer", "Heatproof", "Heavy Metal", "Honey Gather", "Hospitality", "Huge Power", "Hunger Switch", "Hustle", "Hydration", "Hyper Cutter", "Ice Body", "Ice Face", "Ice Scales", "Illuminate", "Illusion", "Immunity", "Imposter", "Infiltrator", "Innards Out", "Inner Focus", "Insomnia", "Intimidate", "Intrepid Sword", "Iron Barbs", "Iron Fist", "Justified", "Keen Eye", "Klutz", "Leaf Guard", "Levitate", "Libero", "Light Metal", "Lightning Rod", "Limber", "Lingering Aroma", "Liquid Ooze", "Liquid Voice", "Long Reach", "Magic Bounce", "Magic Guard", "Magician", "Magma Armor", "Magnet Pull", "Marvel Scale", "Mega Launcher", "Mega Sol", "Merciless", "Mimicry", "Mind's Eye", "Minus", "Mirror Armor", "Misty Surge", "Mold Breaker", "Moody", "Motor Drive", "Moxie", "Multiscale", "Multitype", "Mummy", "Mycelium Might", "Natural Cure", "Neuroforce", "Neutralizing Gas", "No Guard", "Normalize", "Oblivious", "Opportunist", "Orichalcum Pulse", "Overcoat", "Overgrow", "Own Tempo", "Parental Bond", "Pastel Veil", "Perish Body", "Pickpocket", "Pickup", "Piercing Drill", "Pixilate", "Plus", "Poison Heal", "Poison Point", "Poison Puppeteer", "Poison Touch", "Power Construct", "Power of Alchemy", "Power Spot", "Prankster", "Pressure", "Primordial Sea", "Prism Armor", "Propeller Tail", "Protean", "Protosynthesis", "Psychic Surge", "Punk Rock", "Pure Power", "Purifying Salt", "Quark Drive", "Queenly Majesty", "Quick Draw", "Quick Feet", "Rain Dish", "Rattled", "Receiver", "Reckless", "Refrigerate", "Regenerator", "Ripen", "Rivalry", "RKS System", "Rock Head", "Rocky Payload", "Rough Skin", "Run Away", "Sand Force", "Sand Rush", "Sand Spit", "Sand Stream", "Sand Veil", "Sap Sipper", "Schooling", "Scrappy", "Screen Cleaner", "Seed Sower", "Serene Grace", "Shadow Shield", "Shadow Tag", "Sharpness", "Shed Skin", "Sheer Force", "Shell Armor", "Shield Dust", "Shields Down", "Simple", "Skill Link", "Slow Start", "Slush Rush", "Sniper", "Snow Cloak", "Snow Warning", "Solar Power", "Solid Rock", "Soul-Heart", "Soundproof", "Speed Boost", "Spicy Spray", "Stakeout", "Stall", "Stalwart", "Stamina", "Stance Change", "Static", "Steadfast", "Steam Engine", "Steelworker", "Steely Spirit", "Stench", "Sticky Hold", "Storm Drain", "Strong Jaw", "Sturdy", "Suction Cups", "Super Luck", "Supersweet Syrup", "Supreme Overlord", "Surge Surfer", "Swarm", "Sweet Veil", "Swift Swim", "Sword of Ruin", "Symbiosis", "Synchronize", "Tablets of Ruin", "Tangled Feet", "Tangling Hair", "Technician", "Telepathy", "Tera Shell", "Tera Shift", "Teraform Zero", "Teravolt", "Thermal Exchange", "Thick Fat", "Tinted Lens", "Torrent", "Tough Claws", "Toxic Boost", "Toxic Chain", "Toxic Debris", "Trace", "Transistor", "Triage", "Truant", "Turboblaze", "Unaware", "Unburden", "Unnerve", "Unseen Fist", "Vessel of Ruin", "Victory Star", "Vital Spirit", "Volt Absorb", "Wandering Spirit", "Water Absorb", "Water Bubble", "Water Compaction", "Water Veil", "Weak Armor", "Well-Baked Body", "White Smoke", "Wimp Out", "Wind Power", "Wind Rider", "Wonder Guard", "Wonder Skin", "Zen Mode", "Zero to Hero"];

    // This function is serialized and injected into the page as a <script>
    // element, so it runs in the page's own JS context — identical to pasting
    // the two-liner into the devtools console. Userscript sandboxing
    // (Tampermonkey/Greasemonkey isolated worlds) never touches it.
    function pageFill(prompts) {
        prompts
            .map(text => ({ key: Math.random(), text }))
            .sort((a, b) => a.key - b.key)
            .slice(0, 50)
            .map(({ text }) => text)
            .forEach(text => {
                document.getElementById("input-text-textarea").value = text;
                document.getElementsByClassName("inlineSubmitButton")[0].click();
            });
        setTimeout(() => {
            const done = document.querySelector('button.button_done[data-action="done"]');
            if (done) done.click();
        }, 4000);
    }

    const SETTINGS_KEY = 'jackbox-prompt-filler:settings';
    const GEN_COUNT = POKEMON_BY_GEN.length;

    // Fills in defaults and repairs anything invalid, whether it came from storage or the form.
    function normalizeSettings(raw) {
        const s = { pokemon: true, moves: true, abilities: true, genFrom: 1, genTo: GEN_COUNT, blur: true, ...raw };
        const gen = (n, fallback) => (Number.isInteger(n) && n >= 1 && n <= GEN_COUNT ? n : fallback);
        const from = gen(s.genFrom, 1);
        const to = gen(s.genTo, GEN_COUNT);
        return {
            pokemon: Boolean(s.pokemon),
            moves: Boolean(s.moves),
            abilities: Boolean(s.abilities),
            genFrom: Math.min(from, to),
            genTo: Math.max(from, to),
            blur: Boolean(s.blur),
        };
    }

    function loadSettings() {
        try {
            return normalizeSettings(JSON.parse(localStorage.getItem(SETTINGS_KEY)));
        } catch (e) {
            return normalizeSettings({});
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            // Storage blocked: settings still apply, they just won't survive a reload.
        }
    }

    const buildPool = settings => [...new Set([
        ...(settings.pokemon ? POKEMON_BY_GEN.slice(settings.genFrom - 1, settings.genTo).flat() : []),
        ...(settings.moves ? MOVES : []),
        ...(settings.abilities ? ABILITIES : []),
    ])];

    function fillPrompts(btn, prompts) {
        if (!prompts.length) {
            btn.textContent = 'Nothing selected';
            // A run started in the meantime resets the label itself when it finishes.
            setTimeout(() => { if (!btn.disabled) btn.textContent = 'Fill prompts'; }, 1500);
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Running…';

        const s = document.createElement('script');
        s.textContent = '(' + pageFill.toString() + ')(' + JSON.stringify(prompts) + ');';
        document.documentElement.appendChild(s);
        s.remove();

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Fill prompts';
        }, 4500);
    }

    // The widget lives in a shadow root so jackbox's page styles can't
    // restyle its buttons, checkboxes and inputs.
    const host = document.createElement('div');
    host.style.display = 'none';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
        <style>
            :host { all: initial; }
            [hidden] { display: none !important; }
            .widget { position: fixed; top: 10px; right: 10px; z-index: 2147483647; font: 14px sans-serif; color: #fff; }
            .buttons { display: flex; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,.4); }
            button { padding: 8px 14px; background: #146ef5; color: #fff; border: none; font: bold 14px sans-serif; cursor: pointer; }
            button:disabled { cursor: default; opacity: .8; }
            .toggle { padding: 8px 10px; border-left: 1px solid rgba(255,255,255,.35); }
            form { position: absolute; top: calc(100% + 6px); right: 0; margin: 0; padding: 8px 12px; white-space: nowrap; background: #1e2127; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,.5); }
            label { display: block; padding: 4px 0; cursor: pointer; }
            .gens { padding: 0 0 4px 22px; }
            .gens input { width: 3.5em; font: inherit; }
            hr { margin: 6px 0; border: none; border-top: 1px solid rgba(255,255,255,.2); }
        </style>
        <div class="widget">
            <div class="buttons">
                <button type="button" class="fill">Fill prompts</button>
                <button type="button" class="toggle" title="Settings">▾</button>
            </div>
            <form hidden>
                <label><input type="checkbox" name="pokemon"> Pokémon</label>
                <div class="gens">
                    Gen <input type="number" name="genFrom" min="1" max="${GEN_COUNT}">
                    to <input type="number" name="genTo" min="1" max="${GEN_COUNT}">
                </div>
                <label><input type="checkbox" name="moves"> Moves</label>
                <label><input type="checkbox" name="abilities"> Abilities</label>
                <hr>
                <label><input type="checkbox" name="blur"> Blur added prompts</label>
            </form>
        </div>`;
    document.body.appendChild(host);

    const fillBtn = root.querySelector('.fill');
    const form = root.querySelector('form');
    const inputs = Object.fromEntries(['pokemon', 'moves', 'abilities', 'genFrom', 'genTo', 'blur']
        .map(name => [name, root.querySelector(`[name="${name}"]`)]));

    let settings = loadSettings();

    function renderSettings() {
        inputs.pokemon.checked = settings.pokemon;
        inputs.moves.checked = settings.moves;
        inputs.abilities.checked = settings.abilities;
        inputs.genFrom.value = settings.genFrom;
        inputs.genTo.value = settings.genTo;
        inputs.genFrom.disabled = inputs.genTo.disabled = !settings.pokemon;
        inputs.blur.checked = settings.blur;
        document.documentElement.classList.toggle(BLUR_CLASS, settings.blur);
    }
    renderSettings();

    form.addEventListener('change', () => {
        settings = normalizeSettings({
            pokemon: inputs.pokemon.checked,
            moves: inputs.moves.checked,
            abilities: inputs.abilities.checked,
            genFrom: Number(inputs.genFrom.value),
            genTo: Number(inputs.genTo.value),
            blur: inputs.blur.checked,
        });
        saveSettings(settings);
        renderSettings();
    });
    form.addEventListener('submit', e => e.preventDefault());

    fillBtn.addEventListener('click', () => fillPrompts(fillBtn, buildPool(settings)));
    root.querySelector('.toggle').addEventListener('click', () => { form.hidden = !form.hidden; });
    // Clicks inside the shadow root are retargeted to the host, so any other
    // target means the click landed outside the widget.
    document.addEventListener('click', e => {
        if (e.target !== host) form.hidden = true;
    }, true);

    // jackbox.tv is a single-page app, so poll for the add-prompt UI and
    // only show the widget while it's on screen.
    setInterval(() => {
        const onPromptPage = document.getElementById('input-text-textarea')
            && document.getElementsByClassName('inlineSubmitButton')[0];
        host.style.display = onPromptPage ? 'block' : 'none';
    }, 500);
})();
