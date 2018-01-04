var roleAll = require('role.all');

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[creep.memory.target_source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.target_source]);
            }
        } else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        if (creep.ticksToLive <= 10) {
            console.log("about to die in " + creep.ticksToLive + " ticks: " + creep.name);
        }
        if (creep.ticksToLive == 1) { creep.say('💥 bye bye');}
    }
};

module.exports = roleUpgrader;