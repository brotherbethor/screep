var algorithms_extensions = require('algorithms.extensions');
var algorithms_walls = require('algorithms.walls');


module.exports = { 

    removeAllFlags: function() {
        for (var f in Game.flags) {Game.flags[f].remove();}
    },

    initVariables: function(){
        Memory.respawned = false;
        Memory.probabilities = {};
        Memory.probabilities.walls = 0.999;
        Memory.probabilities.roads = 0.999;

        Memory.saved_walls = [];
        Memory.saved_ramparts = [];
        Memory.counters = {};
        Memory.counters.roads = 0;
        Memory.construct_outer_walls = true;
        Memory.run_main_init = false;
        Memory.current_state = {};
        Memory.sources_active = Game.spawns.Spawn1.room.find(FIND_SOURCES_ACTIVE).map(x => x.id);
        Memory.spawn_id = Game.spawns['Spawn1'].id;
        Memory.last_built_creeper = -1;
        Memory.last_source_active = -1;
        Memory.pokemon_index = -1;
        Memory.outer_walls_were_constructed = false;
        Memory.construct_outer_walls = false;
        Memory.outer_walls_constructed = 0;
    },

    walls: function() {
        algorithms_walls.markOuterWalls();
        Memory.outer_walls_triggered = true;
        console.log('Memorized walls and ramparts');
    },

    // remember to put new things in Memory here
    deleteMemory: function(){
        for (var m in Memory){delete Memory[m];}
    }
};