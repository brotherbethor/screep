var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // gather in a neutral position when there is nothing to harvest
        if (Memory.current_state.energy_available == Memory.current_state.energy_capacity) {
            var standby_position = Game.spawns.Spawn1.pos;
            // here's to hoping that the spawn is not too near to a wall ...
            standby_position.x +=2;
            standby_position.y +=2;
            console.log('moving creep to standby position');
            creep.moveTo(standby_position.x, standby_position.y, {visualizePathStyle: {stroke: '#ff0000'}});
        } else if(creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(creep.memory.target_source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', strokeWidth: 0.5}});
            }
        } else {
            var targets = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00aaff', strokeWidth: 0.5}});
                }
            }
        }
        if (creep.ticksToLive <= 10) {
            console.log("about to die in " + creep.ticksToLive + " ticks: " + creep.name);
            creep.say('💥 bye bye');
        }
    }
};

module.exports = roleHarvester;