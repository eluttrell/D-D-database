// ========================
// INITIAL SETUP
// ========================

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

mongoose.connect('mongodb://localhost/rpg');

mongoose.set('debug', true);

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());

// ========================
// DATABASE SETUP
// ========================

const userSchema = new mongoose.Schema({
    _id: String, // username
    first_name: String,
    last_name: String,
    email: String,
    password: String
});

const tokenSchema = new mongoose.Schema({
  user_id: String,
  token: String,
  timestamp: Date
})

const characterSchema = new mongoose.Schema({
    characterInfo: {
        name: String,
        background: String,
        experience: Number,
        nextLevel: Number,
        player: String,
        class: String,
        subclass: String,
        alignment: String,
        religion: String,
        level: Number,
        race: String,
        size: String,
        gender: String,
        age: Number {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        height: Number,
        weight: Number,
        skin: String,
        eyes: String,
        hair: String
    },
    abilities: {
        str: {
            score: Number,
            modifier: Number
        },
        dex: {
            score: Number,
            modifier: Number
        },
        con: {
            score: Number,
            modifier: Number
        },
        int: {
            score: Number,
            modifier: Number
        },
        wis: {
            score: Number,
            modifier: Number
        },
        cha: {
            score: Number,
            modifier: Number
        }
    },
    savingThrows: {
        str: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        dex: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        con: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        int: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        wis: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        cha: {
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        }
    },
    skills: {
        acrobatics: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        animalHandling: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        arcana: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        athletics: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        deception: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        history: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        insight: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        intimidation: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        investigation: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        medicine: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        nature: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        perception: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        performance: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        persuasion: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        religion: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        slieghtOfHand: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        stealth: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        },
        survival: {
            ability: String,
            proficient: Boolean,
            abilityMod: Number,
            proficiencyBonus: Number,
            otherMod: Number
        }
    },
    healthArmour: {
        HP: {
            max: Number,
            tmp: Number
        },
        HD: {
            total: Number,
            used: Number
        },
        AC: {
            armour: Number,
            shield: Number,
            dexMod: Number,
            other: Number,
            dmgResist: Number,
            dmgReduct: Number
        },
        armour: {
            nameType: String,
            type: String,
            properties: {
                proficient: Boolean,
                don: Number,
                doff: Number
            },
            str: Number,
            weight: Number,
            dexMod: Number,
            str: Number,
            stealth: Number
        },
        shield: {
            nameType: String,
            armour: Number,
            weight: Number,
            properties: [String]
        }
    },
    proficiencies: Object {
        bonus: weapons: [String],
        tools: [String],
        languages: [String]
    },
    actions: {
        initiative: {
          dexMod: Number,
          other: Number
        },
        speed: Number,
        inspiration: Boolean,
        attacks: {
          standard: Number,
          extra: Number
        },
        perception: {
          base: Number,
          perception: Number,
          other: Number
        }
    },
    equipment: {
      weapons: {
        [
          {
            nameType: String,
            bonus: Number,
            damage: Number,
            type: String,
            range: Number,
            properties: [String]
          }
        ]
      },
      head: String,
      hands: String,
      eyes: String,
      armsWrists: String,
      neck: String,
      body: String,
      shoulders: String,
      torso: String,
      ringsL: String,
      waist: String,
      ringsR: String,
      feet: String
    },
    coinage: {
      plat: Number,
      gold: Number,
      electrum: Number,
      silver: Number,
      copper: Number
    }
});

// More schemas

const User = mongoose.model('User', userSchema);
const Character = mongoose.model('Character', characterSchema);
const Token = mongoose.model('Token', tokenSchema);

// ========================
// ROUTES
// ========================

// Signup page
app.post('/signup', function(req, res) {
  // Contains key-value pairs of data dsubmitted in the request body
  let userInfo = req.body;

  // Hash the password
  bcrypt.hash(userInfo.password, 12)
    .then(function(hash) {
      return User.Create({
        _id: userInfo.username,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        email: userInfo.email,
        password: hash
      });
    })
    .then(function() {
      res.json({status: "Success"});
    })
    .catch(function(err) {
      console.error('Error!');
      console.log(err);
      res.status(401).json({status: "Failed", error: err.message, stack: err.stack});
    });
});


// Login page
app.post('/login', function(req, res) {
  // Contains key-value pairs of data dsubmitted in the request body
  let userInfo = req.body;

  // Dig into the db for that sweet info
  User.findById(userInfo.username)
    .then((response) => {
      console.log('response:',response);
      return bcrypt.compare(userInfo.password, response.password);
    })
    .then(() => {
      var token = uuid();
      var username = userInfo.username;
      var expiration = new Date;
      expiration.setDate(expiration.getDate() + 30);
      return Token.create({
        user_id: username,
        token: token,
        timestamp: expiration
      });
    })
    .then((login) => {
      res.status(200).json({status: 'Success', info: login});
    })
    .catch((err) => {
      console.log("Failed:", err.message);
      console.log(err.errors);
      res.json({status: "Failed", error: err.message})
    });
});


// Character creation page
app.post('/newChar', function(req, res) {
  let userInfo = req.body;


});
