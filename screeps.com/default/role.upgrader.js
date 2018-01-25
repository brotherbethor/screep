var roleAll = require('role.all');

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var source = Game.getObjectById(creep.memory.target_source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            if(creep.upgradeController(Game.spawns.Spawn1.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1.room.controller);
            }
        }
        if (creep.ticksToLive <= 10) {
            console.log("about to die in " + creep.ticksToLive + " ticks: " + creep.name);
            creep.say('💥 bye bye');
        }
        
    }
};

module.exports = roleUpgrader;