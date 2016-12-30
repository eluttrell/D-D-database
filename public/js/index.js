const app = angular.module('rpg', ['ui.router', 'ngCookies']);


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

app.controller('CharacterGenController', function($scope, $state, $RpgFactory) {

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
        $scope.subraces = $scope.allSubraces[$scope.selectedRace]
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
        // console.log('characterClasses:', $scope.characterClasses);
    }

    function getSubclassNames(clazz) {
        $scope.subclassName = $scope.subClasses[clazz.selectedClass].subClasses;
        $scope.subs.splice(clazz.id, 0, $scope.subclassName);
        // console.log('characterClasses:', $scope.characterClasses);
    }

    $scope.classChanged = function(clazz) {
        console.log('clazz:', clazz);
        $scope.subClassShow = true;
        getSubclass(clazz);
        getSubclassNames(clazz);
        if (clazz.selectedClass === 'Fighter') {
            $scope.ifFighter = true;
        } else {
            $scope.ifFighter = false;
        }
    }

    $scope.fightStyle = [
        'Archery',
        'Defense',
        'Dueling',
        'Great-Weapon Fighting',
        'Protection',
        'Two-Weapon Fighting'
    ];



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
        // console.log($scope.characterClasses);

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
    }

    $scope.subtractPoint = function(score) {
        if (score >= 14) {
            $scope.buyPoints -= 2;
        }
        $scope.buyPoints--;
        if ($scope.buyPoints < 27) {
            $scope.buyMax = false;
        }
    }

    $scope.getTotals = function() {
        $scope.strTotal = $scope.strBase + $scope.strRace + $scope.strSubrace + $scope.strFeats;
        $scope.dexTotal = $scope.dexBase + $scope.dexRace + $scope.dexSubrace + $scope.dexFeats;
        $scope.conTotal = $scope.conBase + $scope.conRace + $scope.conSubrace + $scope.conFeats;
        $scope.intTotal = $scope.intBase + $scope.intRace + $scope.intSubrace + $scope.intFeats;
        $scope.wisTotal = $scope.wisBase + $scope.wisRace + $scope.wisSubrace + $scope.wisFeats;
        $scope.chaTotal = $scope.chaBase + $scope.chaRace + $scope.chaSubrace + $scope.chaFeats;
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
        $scope.mods
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
    $scope.savingThrows = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma'
    ];

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
    ]

    // Totals
    $scope.getTotals();

    // Hit points Logic
    // ================

    

    // angular.element(document).ready(function () {
    //     if (document.getElementById('msg').innerHTML = 'Hello')
    //     document.getElementById('msg').innerHTML = 'Hello';
    // });



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

    $urlRouterProvider.otherwise('/');
});
