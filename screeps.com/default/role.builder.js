var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            if (creep.room.name != Game.spawns.Spawn1.room.name){
                creep.moveTo(Game.spawns.Spawn1.pos, {visualizePathStyle: 
                        {strokeWidth: 1.0, stroke: '#00ff00'}});
            } else {
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: 
                        {strokeWidth: 1.0, opacity: 0.0, stroke: '#00ff00'}});
                }
            }
        }
        else {
            var source = Game.getObjectById(creep.memory.target_source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if (creep.ticksToLive <= 10) {
            console.log("about to die in " + creep.ticksToLive + " ticks: " + creep.name);
            creep.say('💥 bye bye');
        }
    }
};

module.exports = roleBuilder;