const app = angular.module('rpg', ['ui.router', 'ngCookies']);

// if you want to include the multi-select thing, add this to module dependencies:
// , 'angularjs-dropdown-multiselect'

// ========================
// SERVICE
// ========================

app.factory('$RpgFactory', function($http, $state, $cookies) {
    let service = {};

    service.signupPage = function(data) {
        let url = '/signup';
        return $http({
            method: 'POST',
            data: data,
            url: url
        });
    };

    service.showLogin = function(data) {
        let url = '/login';
        return $http({
                method: 'POST',
                data: data,
                url: url
            })
            .then(function(loggedIn) {
                // Put information to be stored as cookies here:
                $cookies.putObject('username', loggedIn.data.info.user_id);
                $cookies.putObject('token', loggedIn.data.info.token);
                $cookies.putObject('expiry', loggedIn.data.info.timestamp);
                console.log("Info:", loggedIn.data.info);
            });
    };

    service.genChar = function(data) {
        let url = '/newChar';
        return $http({
            method: 'POST',
            data: data,
            url: url
        });
    };

    return service;
});


// ========================
// CONTROLLERS
// ========================

app.controller('SignupController', function($scope, $state, $RpgFactory) {

    $scope.signUp = function() {
        let data = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
        };
        $RpgFactory.showSignup(data)
            .then(function(results) {
                console.log('showSignup step 1');
                return results;
            })
            .then(function() {
                return $RpgFactory.showLogin(data);
            })
            .then(function() {
                $state.go('home');
            })
            .catch(function(err) {
                console.log("Failed:", err.stack);
            });
    };
});

app.controller('CharacterGenController', function($scope, $state, $RpgFactory, $cookies) {

    let newChar = {};

    // Race Logic
    // ==========

    $scope.races = [
        'Dragonborn',
        'Dwarf',
        'Elf',
        'Gnome',
        'Half-Elf',
        'Half-Orc',
        'Halfling',
        'Human',
        'Tiefling'
    ]

    $scope.raceChanged = function() {
        let race = $scope.selectedRace;
        $scope.subraces = $scope.allSubraces[race];
        if (race == 'Dwarf' || race == 'Halfling' || race == 'Gnome') {
          newChar.speed = 25;
        } else {
          newChar.speed = 30;
        }
        newChar.race = race;
    };

    $scope.subraceChanged = function() {
      newChar.subRace = $scope.selectedSubrace;
    };

    $scope.allSubraces = {
        Dwarf: {
            '1': 'Hill Dwarf',
            '2': 'Mountain Dwarf'
        },
        Elf: {
            '1': 'Dark Elf (Drow)',
            '2': 'High Elf',
            '3': 'Wood Elf'
        },
        Gnome: {
            '1': 'Rock Gnome',
            '2': 'Forest Gnome'
        },
        Halfling: {
            '1': 'Lightfoot',
            '2': 'Stout'
        }
    }

    // Alignment Logic
    // ===============

    $scope.alignments = [
        'Lawful Good',
        'Lawful Neutral',
        'Lawful Evil',
        'Neutral Good',
        'True Neutral',
        'Neutral Evil',
        'Chaotic Good',
        'Chaotic Neutral',
        'Chaotic Evil'
    ]

    $scope.alignChange = function() {
        newChar.alignment = $scope.charAlign;
        console.log(newChar.alignment);
    }

    // Class/Subclass Logic
    // ====================

    $scope.classes = [{
        name: 'Barbarian'
    }, {
        name: 'Bard'
    }, {
        name: 'Cleric'
    }, {
        name: 'Druid'
    }, {
        name: 'Fighter'
    }, {
        name: 'Monk'
    }, {
        name: 'Paladin'
    }, {
        name: 'Ranger'
    }, {
        name: 'Rogue'
    }, {
        name: 'Sorcerer'
    }, {
        name: 'Warlock'
    }, {
        name: 'Wizard'
    }]

    function getSubclass(clazz) {
        $scope.subClass = $scope.subClasses[clazz.selectedClass].name;
        $scope.characterClasses[clazz.id].subClassName = $scope.subClass;
        $scope.characterClasses[clazz.id].className = clazz.selectedClass;
        // console.log('characterClasses:', $scope.characterClasses);
    }

    function getSubclassNames(clazz) {
        $scope.subclassName = $scope.subClasses[clazz.selectedClass].subClasses;
        $scope.subs.splice(clazz.id, 0, $scope.subclassName);
        // console.log('characterClasses:', $scope.characterClasses);
    }

    function getHitPoints() {
        let curClass = $scope.characterClasses[0].selectedClass;
        if (curClass == 'Barbarian') {
            $scope.hitBase = 12;
        } else if (curClass == 'Sorcerer' || curClass == 'Wizard') {
            $scope.hitBase = 6;
        } else if (curClass == 'Fighter' || curClass == 'Paladin' || curClass == 'Ranger') {
            $scope.hitBase = 10;
        } else {
            $scope.hitBase = 8;
        }
        $scope.conMod = $scope.characterClasses.length * (Math.floor(($scope.conTotal - 10) / 2));
        $scope.hitMax = $scope.hitBase + $scope.conMod;
    }

    $scope.saveSubclassNames = function(name, loc) {
        $scope.characterClasses[loc].subclassSub = name;
        console.log($scope.characterClasses);
    }

    function getSaves(clazz) {
        let x = clazz.selectedClass;
        if (x == 'Barbarian' || x == 'Fighter') {
          $scope.save1 = 'Strength';
          $scope.save2 = 'Constitution';
        } else if (x == 'Bard') {
          $scope.save1 = 'Dexterity';
          $scope.save2 = 'Charisma';
        } else if (x == 'Cleric' || x == 'Paladin' || x == 'Warlock') {
          $scope.save1 = 'Wisdom';
          $scope.save2 = 'Charisma';
        } else if (x == 'Druid' || x == 'Wizard') {
          $scope.save1 = 'Intelligence';
          $scope.save2 = 'Wisdom';
        } else if (x == 'Monk' || x == 'Ranger') {
          $scope.save1 = 'Strength';
          $scope.save2 = 'Dexterity';
        } else if (x == 'Rogue') {
          $scope.save1 = 'Dexterity';
          $scope.save2 = 'Intelligence';
        } else if (x == 'Sorcerer') {
          $scope.save1 = 'Constitution';
          $scope.save2 = 'Charisma';
        }

    }

    // function getAbilities(class) {
    //
    // }

    function getFinalHD(classs) {
      if (classs == 'Barbarian') {
        $scope.damageDice = 12;
      } else if (classs == 'Sorcerer' || classs == 'Wizard') {
        $scope.damageDice = 6;
      } else if (classs == 'Fighter' || classs == 'Paladin' || classs == 'Ranger') {
        $scope. damageDice = 10;
      } else {
        $scope.damageDice = 8;
      }
      newChar.damageDice = $scope.damageDice;
      console.log($scope.damageDice);
    }

    $scope.classChanged = function(clazz, loc) {
        $scope.subClassShow = true;
        let classs = clazz.selectedClass;
        getSubclass(clazz);
        getSubclassNames(clazz);
        if (clazz.selectedClass === 'Fighter') {
            $scope.ifFighter = true;
        } else {
            $scope.ifFighter = false;
        }
        getHitPoints();
        getSaves(clazz);
        getFinalHD(classs);
    }

    $scope.fightStyle = [
        'Archery',
        'Defense',
        'Dueling',
        'Great-Weapon Fighting',
        'Protection',
        'Two-Weapon Fighting'
    ];

    function finalClasses() {
        let finalClassesArr = [];
        $scope.characterClasses.forEach(function(object) {
            finalClassesArr.push(object.className = {
              class: object.selectedClass,
              subclassName: object.subClassName,
              subclass: object.subclassSub
            });
        });
        newChar.classes = finalClassesArr;
    };

    $scope.characterClasses = [{
        id: 0,
        subClassName: undefined
    }];

    $scope.subs = [];


    $scope.addNewClass = function() {
        let newItemNo = $scope.characterClasses.length;
        $scope.characterClasses.push({
            id: newItemNo,
            subClassName: undefined,
            subs: undefined
        });
        // console.log($scope.characterClasses);
        $scope.showMinus = true;
        console.log('this');
    };

    $scope.removeClass = function(num) {
        if ($scope.characterClasses.length <= 2) {
            $scope.showMinus = false;
            // console.log($scope.showMinus);
        }
        let lastItem = num;
        // console.log(lastItem);
        $scope.characterClasses.splice(lastItem, 1);
        $scope.subs.splice(lastItem, 1);
        newCharLevels.splice(lastItem, 1);
        // console.log($scope.characterClasses);
        console.log('characterClasses:', $scope.characterClasses);
    };


    $scope.subClasses = {
        Barbarian: {
            name: 'Primal Path',
            subClasses: {
                '1': 'Path of the Beserker',
                '2': 'Path of the Totem Warrior'
            }
        },
        Bard: {
            name: 'Bard College',
            subClasses: {
                '1': 'College of Lore',
                '2': 'College of Valor'
            }
        },
        Cleric: {
            name: 'Divine Domain',
            subClasses: {
                '1': 'Knowledge Domain',
                '2': 'Life Domain',
                '3': 'Light Domain',
                '4': 'Nature Domain',
                '5': 'Tempest Domain',
                '6': 'Trickery Domain',
                '7': 'War Domain'
            }
        },
        Druid: {
            name: 'Druid Circle',
            subClasses: {
                '1': 'Circle of the Land',
                '2': 'Circle of the Moon'
            }
        },
        Fighter: {
            name: 'Martial Archetype',
            subClasses: {
                '1': 'Battle Master',
                '2': 'Champion',
                '3': 'Eldritch Knight'
            }
        },
        Monk: {
            name: 'Monastic Tradition',
            subClasses: {
                '1': 'Way of Shadow',
                '2': 'Way of the Four Elements',
                '3': 'Way of the Open Hand'
            }
        },
        Paladin: {
            name: 'Sacred Oath',
            subClasses: {
                '1': 'Oath of Devotion',
                '2': 'Oath of Vengeance',
                '3': 'Oath of the Ancients'
            }
        },
        Ranger: {
            name: 'Ranger Archetype',
            subClasses: {
                '1': 'Beast Master',
                '2': 'Hunter'
            }
        },
        Rogue: {
            name: 'Roguish Archetype',
            subClasses: {
                '1': 'Arcane Trickster',
                '2': 'Assassin',
                '3': 'Thief'
            }
        },
        Sorcerer: {
            name: 'Subclass',
            subClasses: {
                '1': 'Draconic Ancestry',
                '2': 'Wild Magic'
            }
        },
        Warlock: {
            name: 'Otherworldly Patrons',
            subClasses: {
                '1': 'The Archfey',
                '2': 'The Fiend',
                '3': 'The Great Old One'
            }
        },
        Wizard: {
            name: 'Arcane Tradition',
            subClasses: {
                '1': 'School of Abjuratiom',
                '2': 'School of Conjuration',
                '3': 'School of Divination',
                '4': 'School of Enchantment',
                '5': 'School of Evocation',
                '6': 'School of Illusion',
                '7': 'School of Necromancy',
                '8': 'School of Transmutation'
            }
        }
    }

    // Level Logic
    // ===========
    $scope.levels = [];
    for (var i = 1; i <= 20; i++) {
        $scope.levels.push(i);
    }
    // $scope.proficiencyBonus = undefined;
    function getProf(level) {
      console.log(Number(level.level));
      let x = Number(level.level);
      if (x >= 1 && x <= 4) {
          $scope.proficiencyBonus = 2;
      }
      if (x >= 5 && x <= 8) {
          $scope.proficiencyBonus = 3;
      }
      if (x >= 9 && x <= 12) {
          $scope.proficiencyBonus = 4;
      }
      if (x >= 13 && x <= 16) {
          $scope.proficiencyBonus = 5;
      }
      if (x >= 17 && x <= 20) {
          $scope.proficiencyBonus = 6;
      }
    }

    let newCharLevels = [{}];



    $scope.levelChanged = function(level, loc) {
        $scope.selectedLevel = level;
        newCharLevels.splice(loc, 1, {level: '('+level.level+')'})
        getProf(level);
        console.log($scope.selectedLevel, $scope.proficiencyBonus, 'levels:', newCharLevels);
    }

    // Backgrounds


    // Ability Scores
    // ==============
    $scope.buyPoints = 0;

    $scope.addPoint = function(score) {
        if (score <= 13) {
            $scope.buyPoints++;
        } else {
            $scope.buyPoints += 2;
        }
        if ($scope.buyPoints >= 27) {
            $scope.buyMax = true;
        }
        getModifiers();
        getHitPoints();
    }

    $scope.subtractPoint = function(score) {
        if (score >= 14) {
            $scope.buyPoints -= 2;
        }
        $scope.buyPoints--;
        if ($scope.buyPoints < 27) {
            $scope.buyMax = false;
        }
        getModifiers();
        getHitPoints();
    }

    $scope.getTotals = function() {
        $scope.strTotal = $scope.strBase + $scope.strRace + $scope.strSubrace + $scope.strFeats;
        $scope.dexTotal = $scope.dexBase + $scope.dexRace + $scope.dexSubrace + $scope.dexFeats;
        $scope.conTotal = $scope.conBase + $scope.conRace + $scope.conSubrace + $scope.conFeats;
        $scope.intTotal = $scope.intBase + $scope.intRace + $scope.intSubrace + $scope.intFeats;
        $scope.wisTotal = $scope.wisBase + $scope.wisRace + $scope.wisSubrace + $scope.wisFeats;
        $scope.chaTotal = $scope.chaBase + $scope.chaRace + $scope.chaSubrace + $scope.chaFeats;
        newChar.strScore = $scope.strTotal;
        newChar.dexScore = $scope.dexTotal;
        newChar.conScore = $scope.conTotal;
        newChar.intScore = $scope.intTotal;
        newChar.wisScore = $scope.wisTotal;
        newChar.chaScore = $scope.chaTotal;
    }

    function getModifiers() {
        $scope.strMod = Math.floor(($scope.strTotal - 10) / 2);
        $scope.dexMod = Math.floor(($scope.dexTotal - 10) / 2);
        $scope.conMod = Math.floor(($scope.conTotal - 10) / 2);
        $scope.intMod = Math.floor(($scope.intTotal - 10) / 2);
        $scope.wisMod = Math.floor(($scope.wisTotal - 10) / 2);
        $scope.chaMod = Math.floor(($scope.chaTotal - 10) / 2);
        newChar.strMod = $scope.strMod;
        newChar.dexMod = $scope.dexMod;
        newChar.conMod = $scope.conMod;
        newChar.intMod = $scope.intMod;
        newChar.wisMod = $scope.wisMod;
        newChar.chaMod = $scope.chaMod;
    }

    $scope.randomScores = function() {
        $scope.random = true;
    };

    $scope.buyScores = function() {
        $scope.random = false;
        $scope.strBase = 8;
        $scope.dexBase = 8;
        $scope.conBase = 8;
        $scope.intBase = 8;
        $scope.wisBase = 8;
        $scope.chaBase = 8;
        $scope.getTotals();
        getModifiers();
        getHitPoints();
    };

    $scope.genRandom = function() {
        let rands = [];
        for (var i = 0; i < 6; i++) {
            let temp1 = Math.floor((Math.random() * 6) + 1);
            let temp2 = Math.floor((Math.random() * 6) + 1);
            let temp3 = Math.floor((Math.random() * 6) + 1);
            let temp4 = Math.floor((Math.random() * 6) + 1);
            let tempArr = [temp1, temp2, temp3, temp4];
            tempArr.sort();
            temp1 = tempArr.pop();
            temp2 = tempArr.pop();
            temp3 = tempArr.pop();
            rands.push(temp1 + temp2 + temp3);
        }
        $scope.strBase = rands[0];
        $scope.dexBase = rands[1];
        $scope.conBase = rands[2];
        $scope.intBase = rands[3];
        $scope.wisBase = rands[4];
        $scope.chaBase = rands[5];
        $scope.getTotals();
        getModifiers();
        getHitPoints();

    };

    // Base Scores
    $scope.strBase = 8;
    $scope.dexBase = 8;
    $scope.conBase = 8;
    $scope.intBase = 8;
    $scope.wisBase = 8;
    $scope.chaBase = 8;

    // Race Scores
    $scope.strRace = 0;
    $scope.dexRace = 0;
    $scope.conRace = 0;
    $scope.intRace = 0;
    $scope.wisRace = 0;
    $scope.chaRace = 0;

    // Subrace Scores
    $scope.strSubrace = 0;
    $scope.dexSubrace = 0;
    $scope.conSubrace = 0;
    $scope.intSubrace = 0;
    $scope.wisSubrace = 0;
    $scope.chaSubrace = 0;

    // Feats
    $scope.strFeats = 0;
    $scope.dexFeats = 0;
    $scope.conFeats = 0;
    $scope.intFeats = 0;
    $scope.wisFeats = 0;
    $scope.chaFeats = 0;

    // Saving Throws
    // $scope.savingThrows = [
    //     'Strength',
    //     'Dexterity',
    //     'Constitution',
    //     'Intelligence',
    //     'Wisdom',
    //     'Charisma'
    // ];

    // $scope.saveThrowsArr = [];
    // $scope.saveThrowMax = false;
    //
    // $scope.saveThrow = function(save, index) {
    //
    //     $scope.saveThrowsArr.push({
    //       save: save
    //     })
    //     if ($scope.saveThrowsArr.length > 1) {
    //       $scope.saveThrowMax = true;
    //     }
    //     console.log($scope.saveThrowsArr);
    // }

    // Skills
    $scope.skills = [
        'Acrobatics',
        'Animal Handling',
        'Arcana',
        'Athletics',
        'Deception',
        'History',
        'Insight',
        'Intimidation',
        'Investigation',
        'Medecine',
        'Nature',
        'Perception',
        'Performance',
        'Persuasion',
        'Religion',
        'Sleight of Hand',
        'Stealth',
        'Survival'
    ];

    $scope.skillChoice = [];

    function finalSkills() {
      let skillz = [];
      $scope.skillChoice.forEach(function(skill) {
        skillz.push(skill);
      });
      newChar.skills = skillz;
    }

    $scope.skillGrab = function(skill) {
        let id = $scope.skillChoice.indexOf(skill);
        if (id > -1) {
          $scope.skillChoice.splice(id, 1);
        } else {
          $scope.skillChoice.push(skill);
        }
        console.log($scope.skillChoice);
    }

    // Totals
    $scope.getTotals();
    getModifiers();
    getHitPoints();

    // Languages
    $scope.cLang = [
        'Common',
        'Dwarvish',
        'Elvish',
        'Giant',
        'Gnomish',
        'Goblin',
        'Halfling',
        'Orc'
    ];

    $scope.eLang = [
        'Aarakocra',
        'Abyssal',
        'Auran',
        'Celestial',
        'Deep Speech',
        'Draconic',
        'Infernal',
        'Primordial',
        'Sylvan',
        'Undercommon'
    ]

    // if you use the multi-select-dropdown thing, here is some stuff that has already been done, but needs more work:
    // $scope.eLangModel = [];
    // $scope.eLangData = [
    //   { id: 1, name: 'Aarakocra'},
    //   { id: 2, name: 'Abyssal'},
    //   { id: 3, name: 'Auran'},
    //   { id: 4, name: 'Celestial'},
    //   { id: 5, name: 'Deep Speech'},
    //   { id: 6, name: 'Draconic'},
    //   { id: 7, name: 'Infernal'},
    //   { id: 8, name: 'Primordial'},
    //   { id: 9, name: 'Sylvan'},
    //   { id: 10, name: 'Undercommon'}
    // ];
    // $scope.langSettings = {
    // smartButtonMaxItems: 3
    // };

    $scope.tools = [
        'Alchemist’s supplies',
        'Brewer’s supplies',
        'Calligrapher’s supplies',
        'Carpenter’s tools',
        'Cartographer’s tools',
        'Cobbler’s tools',
        'Cook’s utensils',
        'Glassblower’s tools',
        'Jeweler’s tools',
        'Leatherworker’s tools',
        'Mason’s tools',
        'Painter’s supplies',
        'Potter’s tools',
        'Smith’s tools',
        'Tinker’s tools',
        'Weaver’s tools',
        'Woodcarver’s tools'
    ];

    $scope.gameSets = [
        'Dice set',
        'Dragonchess set',
        'Playing card set',
        'Three-Dragon Ante set'
    ];

    $scope.instruments = [
        'Bagpipes',
        'Drum',
        'Dulcimer',
        'Flute',
        'Lute',
        'Lyre',
        'Horn',
        'Pan flute',
        'Shawm',
        'Viol'
    ];

    $scope.otherTools = [
        'Disguise kit',
        'Forgery kit',
        'Herbalism kit',
        'Navigator’s tools',
        'Poisoners kit',
        'Thieves’ tools'
    ]

    // Equipment Logic
    // ===============

    $scope.armourTypes = {
        'Padded': {
            category: 'Light',
            baseAC: 11,
            strength: null,
            stealth: 'Disadvantage',
            weight: 8,
            cost: 5
        },
        'Leather': {
            category: 'Light',
            baseAC: 11,
            strength: null,
            stealth: null,
            weight: 10,
            cost: 10
        },
        'Studded Leather': {
            category: 'Light',
            baseAC: 12,
            strength: null,
            stealth: null,
            weight: 13,
            cost: 45
        },
        'Hide': {
            category: 'Medium',
            baseAC: 12,
            strength: null,
            stealth: null,
            weight: 12,
            cost: 10
        },
        'Chain Shirt': {
            category: 'Medium',
            baseAC: 13,
            strength: null,
            stealth: null,
            weight: 20,
            cost: 50
        },
        'Scale Mail': {
            category: 'Medium',
            baseAC: 14,
            strength: null,
            stealth: 'Disadvantage',
            weight: 45,
            cost: 50
        },
        'Breastplate': {
            category: 'Medium',
            baseAC: 14,
            strength: null,
            stealth: null,
            weight: 20,
            cost: 400
        },
        'Half Plate': {
            category: 'Medium',
            baseAC: 15,
            strength: null,
            stealth: 'Disadvantage',
            weight: 40,
            cost: 750
        },
        'Ring Mail': {
            category: 'Heavy',
            baseAC: 14,
            strength: null,
            stealth: 'Disadvantage',
            weight: 40,
            cost: 30
        },
        'Chain Mail': {
            category: 'Heavy',
            baseAC: 16,
            strength: 13,
            stealth: 'Disadvantage',
            weight: 55,
            cost: 75
        },
        'Splint': {
            category: 'Heavy',
            baseAC: 17,
            strength: 15,
            stealth: 'Disadvantage',
            weight: 60,
            cost: 200
        },
        'Plate': {
            category: 'Heavy',
            baseAC: 18,
            strength: 15,
            stealth: 'Disadvantage',
            weight: 65,
            cost: 1500
        }
    };

    $scope.armourNames = [
        'Padded',
        'Leather',
        'Studded Leather',
        'Hide',
        'Chain Shirt',
        'Scale Mail',
        'Breastplate',
        'Half Plate',
        'Ring Mail',
        'Chain Mail',
        'Splint',
        'Plate'
    ];

    $scope.armourStuff = {baseAC : $scope.dexMod};

    function getArmour(armour) {
        $scope.armourStuff = $scope.armourTypes[armour];
    }

    $scope.armourChange = function(armour) {
        console.log(armour.choice);
        let x = armour.choice;
        getArmour(x);
    }

    $scope.noShield = true;
    $scope.shield = 0;

    $scope.shieldStatus = function() {
        $scope.noShield = !$scope.noShield;
        if ($scope.noShield === false) {
            $scope.shield = 2;
        } else {
            $scope.shield = 0;
        }
    }

    // Weapons

    $scope.weaponNames = [
        'Battleaxe',
        'Club',
        'Dagger',
        'Dwarven Urgosh',
        'Elven Crescent Blade',
        'Flail',
        'Glaive',
        'Greataxe',
        'Greatclub',
        'Greatsword',
        'Halberd',
        'Handaxe',
        'Javelin',
        'Lance',
        'Light Hammer',
        'Longsword',
        'Mace',
        'Maul',
        'Morningstar',
        'Pike',
        'Quarterstaff',
        'Rapier',
        'Scimitar',
        'Shortsword',
        'Sickle',
        'Spear',
        'Spiked Chain',
        'Trident',
        'Unarmed Strike',
        'War Pick',
        'Warhammer',
        'Whip',
        'War Scythe'
    ]

    $scope.meleeWeapons = {
        'Battleaxe': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage2': 10,
            'damage type': 'slashing',
            'properties': 'versatile (1d10)',
            'weight': 4,
            'cost': 10
        },
        'Club': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'bludgeoning',
            'properties': 'light',
            'weight': 2,
            'cost': .1
        },
        'Dagger': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'piercing',
            'properties': 'finesse, light, thrown',
            'weight': 1,
            'cost': 2
        },
        'Dwarven Urgosh': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage2': 10,
            'damage type': 'piercing',
            'damage type2': 'slashing',
            'properties': 'two-handed, special',
            'weight': 4,
            'cost': 22
        },
        'Elven Crescent Blade': {
            'category': 'martial',
            'dice': 2,
            'damage': 6,
            'damage type': 'slashing',
            'properties': 'heavy, special, two-handed',
            'weight': 6,
            'cost': 80
        },
        'Flail': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'bludgeoning',
            'properties': null,
            'weight': 2,
            'cost': 10
        },
        'Glaive': {
            'category': 'martial',
            'dice': 1,
            'damage': 10,
            'damage type': 'slashing',
            'properties': 'heavy, reach, two-handed',
            'weight': 6,
            'cost': 20
        },
        'Greataxe': {
            'category': 'martial',
            'dice': 1,
            'damage': 12,
            'damage type': 'slashing',
            'properties': 'heavy, two-handed',
            'weight': 7,
            'cost': 30
        },
        'Greatclub': {
            'category': 'simple',
            'dice': 1,
            'damage': 8,
            'damage type': 'bludgeoning',
            'properties': 'two-handed',
            'weight': 10,
            'cost': .2
        },
        'Greatsword': {
            'category': 'martial',
            'dice': 2,
            'damage': 6,
            'damage type': 'slashing',
            'properties': 'heavy, two-handed',
            'weight': 6,
            'cost': 50
        },
        'Halberd': {
            'category': 'martial',
            'dice': 1,
            'damage': 10,
            'damage type': 'slashing',
            'properties': 'heavy, reach, two-handed',
            'weight': 6,
            'cost': 20
        },
        'Handaxe': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'slashing',
            'properties': 'light, thrown',
            'weight': 2,
            'cost': 5
        },
        'Javelin': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'piercing',
            'properties': 'thrown',
            'weight': 2,
            'cost': .5
        },
        'Lance': {
            'category': 'martial',
            'dice': 1,
            'damage': 12,
            'damage type': 'piercing',
            'properties': 'reach, special',
            'weight': 6,
            'cost': 10
        },
        'Light Hammer': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'bludgeoning',
            'properties': 'light, thrown',
            'weight': 2,
            'cost': 2
        },
        'Longsword': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage2': 10,
            'damage type': 'slashing',
            'properties': 'versatile (1d10)',
            'weight': 3,
            'cost': 15
        },
        'Mace': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'bludgeoning',
            'properties': null,
            'weight': 4,
            'cost': 5
        },
        'Maul': {
            'category': 'martial',
            'dice': 2,
            'damage': 6,
            'damage type': 'bludgeoning',
            'properties': 'heavy, two-handed',
            'weight': 10,
            'cost': 10
        },
        'Morningstar': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'properties': null,
            'weight': 4,
            'cost': 15
        },
        'Pike': {
            'category': 'martial',
            'dice': 1,
            'damage': 10,
            'damage type': 'piercing',
            'properties': 'heavy, reach, two-handed',
            'weight': 18,
            'cost': 5
        },
        'Quarterstaff': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'bludgeoning',
            'properties': 'versatile (1d8)',
            'weight': 4,
            'cost': .2
        },
        'Rapier': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'properties': 'finesse',
            'weight': 2,
            'cost': 25
        },
        'Scimitar': {
            'category': 'martial',
            'dice': 1,
            'damage': 6,
            'damage type': 'slashing',
            'properties': 'finesse, light',
            'weight': 3,
            'cost': 25
        },
        'Shortsword': {
            'category': 'martial',
            'dice': 1,
            'damage': 6,
            'damage type': 'piercing',
            'properties': 'finesse, light',
            'weight': 2,
            'cost': 10
        },
        'Sickle': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'slashing',
            'properties': 'light',
            'weight': 2,
            'cost': 1
        },
        'Spear': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'piercing',
            'properties': 'thrown, versatile (1d8)',
            'weight': 3,
            'cost': 1
        },
        'Spiked Chain': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'properties': 'finesse, heavy, rach, two-handed, special',
            'weight': 10,
            'cost': 50
        },
        'Trident': {
            'category': 'martial',
            'dice': 1,
            'damage': 6,
            'damage2': 8,
            'damage type': 'piercing',
            'properties': 'thrown, versatile (1d8)',
            'weight': 4,
            'cost': 5
        },
        'Unarmed Strike': {
            'category': null,
            'dice': 1,
            'damage': 1,
            'damage type': 'bludgeoning',
            'properties': null,
            'weight': null,
            'cost': null
        },
        'War Pick': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'properties': null,
            'weight': 2,
            'cost': 5
        },
        'Warhammer': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage2': 10,
            'damage type': 'bludgeoning',
            'properties': 'versatile',
            'weight': 2,
            'cost': 15
        },
        'Whip': {
            'category': 'martial',
            'dice': 1,
            'damage': 4,
            'damage type': 'slashing',
            'properties': 'finesse, reach',
            'weight': 3,
            'cost': 2
        },
        'War Scythe': {
            'category': 'martial',
            'dice': 1,
            'damage': 10,
            'damage type': 'slashing',
            'properties': 'special, two-handed',
            'weight': 4,
            'cost': 25
        }
    }

    $scope.rangedWeaponNames = [
        'Blowgun',
        'Crossbow, hand',
        'Crossbow, heavy',
        'Crossbow, light',
        'Dart',
        'Great Bow',
        'Longbow',
        'Net',
        'Shortbow',
        'Sling'
    ]

    $scope.rangedWeapons = {
        'Blowgun': {
            'category': 'martial',
            'dice': 1,
            'damage': 1,
            'damage type': 'piercing',
            'rangeCLose': 25,
            'rangeFar': 100,
            'properties': 'ammunition, loading',
            'weight': 1,
            'cost': 10
        },
        'Crossbow, hand': {
            'category': 'martial',
            'dice': 1,
            'damage': 6,
            'damage type': 'piercing',
            'rangeCLose': 30,
            'rangeFar': 120,
            'properties': 'ammunition, light, loading',
            'weight': 3,
            'cost': 75
        },
        'Crossbow, heavy': {
            'category': 'martial',
            'dice': 1,
            'damage': 10,
            'damage type': 'piercing',
            'rangeCLose': 100,
            'rangeFar': 400,
            'properties': 'ammunition, heavy, loading, two-handed',
            'weight': 18,
            'cost': 50
        },
        'Crossbow, light': {
            'category': 'simple',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'rangeCLose': 80,
            'rangeFar': 320,
            'properties': 'ammunition, loading, two-handed',
            'weight': 5,
            'cost': 25
        },
        'Dart': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'piercing',
            'rangeCLose': 20,
            'rangeFar': 60,
            'properties': 'finesse, thrown',
            'weight': .25,
            'cost': .05
        },
        'Great Bow': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'rangeCLose': 150,
            'rangeFar': 600,
            'properties': 'ammunition, heavy, two-handed, special',
            'weight': 2,
            'cost': 100
        },
        'Longbow': {
            'category': 'martial',
            'dice': 1,
            'damage': 8,
            'damage type': 'piercing',
            'rangeCLose': 150,
            'rangeFar': 600,
            'properties': 'ammunition, heavy, two-handed',
            'weight': 2,
            'cost': 50
        },
        'Net': {
            'category': 'martial',
            'dice': 1,
            'damage': null,
            'damage type': null,
            'rangeCLose': 5,
            'rangeFar': 15,
            'properties': 'thrown, special',
            'weight': 3,
            'cost': 1
        },
        'Shortbow': {
            'category': 'simple',
            'dice': 1,
            'damage': 6,
            'damage type': 'piercing',
            'rangeCLose': 80,
            'rangeFar': 320,
            'properties': 'ammunition, two-handed',
            'weight': 2,
            'cost': 25
        },
        'Sling': {
            'category': 'simple',
            'dice': 1,
            'damage': 4,
            'damage type': 'bludgeoning',
            'rangeCLose': 30,
            'rangeFar': 120,
            'properties': 'ammunition',
            'weight': null,
            'cost': .1
        }
    }

    // Melee Weapons
    function getMeleeWeapon(choice, loc, weapon) {
        $scope.chosenMeleeWeapons[loc].id = loc;
        $scope.chosenMeleeWeapons[loc].name = weapon.weapon;
        $scope.chosenMeleeWeapons[loc].category = choice.category;
        $scope.chosenMeleeWeapons[loc].dice = choice.dice;
        $scope.chosenMeleeWeapons[loc].damage = choice.damage;
        $scope.chosenMeleeWeapons[loc]['damage type'] = choice['damage type'];
        $scope.chosenMeleeWeapons[loc].rangeCLose = choice.rangeCLose;
        $scope.chosenMeleeWeapons[loc].rangeFar = choice.rangeFar;
        $scope.chosenMeleeWeapons[loc].properties = choice.properties;
        $scope.chosenMeleeWeapons[loc].weight = choice.weight;
        $scope.chosenMeleeWeapons[loc].cost = choice.cost;
    }

    $scope.weaponChanged = function(weapon, loc) {
        let choice = $scope.meleeWeapons[weapon.weapon];
        getMeleeWeapon(choice, loc, weapon);
    }

    $scope.takeWeapon = false;

    $scope.addWeapon = function() {
        let newItemNo = $scope.chosenMeleeWeapons.length;
        $scope.chosenMeleeWeapons.push({
            id: newItemNo
        })
        if ($scope.chosenMeleeWeapons.length > 1) {
            $scope.takeWeapon = true;
        }
    }

    $scope.dropWeapon = function(index) {
        if ($scope.chosenMeleeWeapons.length <= 2) {
            $scope.takeWeapon = false;
        }
        $scope.chosenMeleeWeapons.splice(index, 1);
    };

    $scope.chosenMeleeWeapons = [{}];

    // Ranged Weapons
    $scope.rangedChanged = function(ranged, loc) {
        let choice = $scope.rangedWeapons[ranged.ranged];
        getRangedWeapon(choice, loc, ranged);
    }

    $scope.chosenRanged = [{}];

    $scope.takeRanged = false;

    $scope.addRanged = function() {

    }

    // angular.element(document).ready(function () {
    //     if (document.getElementById('msg').innerHTML = 'Hello')
    //     document.getElementById('msg').innerHTML = 'Hello';
    // });

    function getNewChar() {
      newChar.id = $scope.charName;
      newChar.playerName = $scope.playerName;
      newChar.age = $scope.charAge;
      newChar.sex = $scope.charSex;
      newChar.height = $scope.charHeight;
      newChar.weight = $scope.charWeight;
      newChar.level = newCharLevels;
      newChar.experience = $scope.charExp;
      newChar.ac = $scope.armourStuff.baseAC + $scope.dexMod + $scope.shield;
      newChar.hitPoints = $scope.hitMax;
      newChar.htiDice = newChar.level[0].level + 'd'
      finalClasses();
      finalSkills();
    }

    $scope.testCharGenTable = function() {
      getNewChar();
      console.log(newChar);
    }


    $scope.generateChar = function() {
        getNewChar();
        // For Testing
        // let data = {
        //   id: "elias",
        //   pName: $scope.playerName,
        //   race: $scope.selectedRace
        // }

        // Saved for later
        // $RpgFactory.genChar(newChar)
        //   .then(function(results) {
        //     console.log('Success', results);
        //   })
        //   .catch(function(err) {
        //     console.log('Failed:', err.stack);
        //   });

        $cookies.putObject('newChar', newChar)
        console.log('cookie generated');
        $state.go('newChar');
    };

});

app.controller('NewCharController', function($scope, $state, $RpgFactory, $cookies) {
    $scope.newChar = $cookies.getObject('newChar');
    $scope.newCharClasses = $scope.newChar.classes;
    $scope.newCharSkills = $scope.newChar.skills;
    console.log($scope.newChar);
});


// ========================
// STATES
// ========================

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: '/templates/home.html'
        })
        .state({
            name: 'signup',
            url: '/signup',
            templateUrl: '/templates/signup.html',
            controller: 'SignupController'
        })
        .state({
            name: 'characterGen',
            url: '/characterGen',
            templateUrl: '/templates/characterGen.html',
            controller: 'CharacterGenController'
        })
        .state({
            name: 'newChar',
            url: '/newChar',
            templateUrl: '/templates/newChar.html',
            controller: 'NewCharController'
        })

    $urlRouterProvider.otherwise('/');
});
