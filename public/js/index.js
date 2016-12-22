const app = angular.module('rpg', ['ui.router', 'ngCookies']);


// ========================
// SERVICE
// ========================

app.factory('$RpgFactory', function($http, $state, $cookies) {
    let service = {};

    // service.signupPage = function(data) {
    //   let url = '/signup';
    //     return $http({
    //       method: 'POST',
    //       data: data,
    //       url: url
    //     });
    // };
    //
    // service.showLogin = function(data) {
    //     let url = '/login';
    //     return $http({
    //             method: 'POST',
    //             data: data,
    //             url: url
    //         })
    //         .then(function(loggedIn) {
    //             // Put information to be stored as cookies here:
    //             $cookies.putObject('username', loggedIn.data.info.user_id);
    //             $cookies.putObject('token', loggedIn.data.info.token);
    //             $cookies.putObject('expiry', loggedIn.data.info.timestamp);
    //             console.log("Info:", loggedIn.data.info);
    //         });
    // };

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

    $scope.classes = [
        'Barbarian',
        'Bard',
        'Cleric',
        'Druid',
        'Fighter',
        'Monk',
        'Paladin',
        'Ranger',
        'Rogue',
        'Sorcerer',
        'Warlock',
        'Wizard'
    ]

    function getSubclass() {
        $scope.subClass = $scope.subClasses[$scope.selectedClass][0];
        console.log('getSubclass function results:', $scope.subClass);
        $scope.characterClasses.push({class: $scope.selectedClass, subclass: $scope.subClass});
        console.log($scope.characterClasses);
    }

    function getSubclassNames() {
        $scope.subclassName = $scope.subClasses[$scope.selectedClass][1];
        console.log($scope.subclassName);
    }

    $scope.classChanged = function() {
        $scope.subClassShow = true;
        console.log('selectedClass:', $scope.selectedClass);
        getSubclass();
        getSubclassNames();

        // console.log($scope.selectedClass);
        // $scope.subClass = $scope.selectedClass.subclasses[0]
            // $scope.subClasses = $scope.allSubClasses[$scope.selectedClass][0]
            // $scope.subClassName = $scope.allSubClasses[$scope.selectedClass][1]
    }



    $scope.characterClasses = [{'id': 'class1'}];

    $scope.addNewClass = function() {
        let newItemNo = $scope.characterClasses.length+1;
        $scope.characterClasses.push({'id':'class'+newItemNo});
        console.log($scope.characterClasses);
        $scope.showMinus = true;
    };

    $scope.removeClass = function() {
        if ($scope.characterClasses.length <= 2) {
          $scope.showMinus = false;
          console.log($scope.showMinus);
        }
        let lastItem = $scope.characterClasses.length-1;
        $scope.characterClasses.splice(lastItem);
        console.log($scope.characterClasses);

    };


    $scope.subClasses = {
        Barbarian: [
            'Primal Path', {
                '1': 'Path of the Beserker',
                '2': 'Path of the Totem Warrior'
            }
        ],
        Bard: [
            'Bard College', {
                '1': 'College of Lore',
                '2': 'College of Valor'
            }
        ],
        Cleric: [
            'Divine Domain', {
                '1': 'Knowledge Domain',
                '2': 'Life Domain',
                '3': 'Light Domain',
                '4': 'Nature Domain',
                '5': 'Tempest Domain',
                '6': 'Trickery Domain',
                '7': 'War Domain'
            }
        ],
        Druid: [
            'Druid Circle', {
                '1': 'Circle of the Land',
                '2': 'Circle of the Moon'
            }
        ],
        Fighter: [
            'Martial Archetype', {
                '1': 'Battle Master',
                '2': 'Champion',
                '3': 'Eldritch Knight'
            }
        ],
        Monk: [
            'Monastic Tradition', {
                '1': 'Way of Shadow',
                '2': 'Way of the Four Elements',
                '3': 'Way of the Open Hand'
            }
        ],
        Paladin: [
            'Sacred Oath', {
                '1': 'Oath of Devotion',
                '2': 'Oath of Vengeance',
                '3': 'Oath of the Ancients'
            }
        ],
        Ranger: [
            'Ranger Archetype', {
                '1': 'Beast Master',
                '2': 'Hunter'
            }
        ],
        Rogue: [
            'Roguish Archetype', {
                '1': 'Arcane Trickster',
                '2': 'Assassin',
                '3': 'Thief'
            }
        ],
        Sorcerer: [
            'Subclass', {
                '1': 'Draconic Ancestry',
                '2': 'Wild Magic'
            }
        ],
        Warlock: [
            'Otherworldly Patrons', {
                '1': 'The Archfey',
                '2': 'The Fiend',
                '3': 'The Great Old One'
            }
        ],
        Wizard: [
            'Arcane Tradition', {
                '1': 'School of Abjuratiom',
                '2': 'School of Conjuration',
                '3': 'School of Divination',
                '4': 'School of Enchantment',
                '5': 'School of Evocation',
                '6': 'School of Illusion',
                '7': 'School of Necromancy',
                '8': 'School of Transmutation'
            }
        ]
    }

    // Level Logic
    $scope.levels = [];
    for (var i = 1; i <= 20; i++) {
        $scope.levels.push(i);
    }



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
