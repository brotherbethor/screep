var roleAll = require('role.all');

var roleUpgrader = {
    /** @param {Creep} creep **/
    build: function(creep){
        if((Memory.current_state["upgraders"] < 1) && (Memory.current_state["energy_available"] >= 300)) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE, MOVE], newName, 
                {memory: {role: 'upgrader'}});
            Memory.current_state["upgraders"] += 1;
        }
    },
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var sources = Memory.current_state["sources"];
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        if (creep.ticksToLive <= 10) {
            console.log("about to die in " + creep.ticksToLive + " ticks: " + creep.name);
        }
        // roleAll.buildRoad(creep);
    }
};

module.exports = roleUpgrader;