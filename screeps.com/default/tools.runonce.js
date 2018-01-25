var algorithms_extensions = require('algorithms.extensions');
var algorithms_walls = require('algorithms.walls');


module.exports = { 

    removeAllFlags: function() {
        for (var f in Game.flags) {Game.flags[f].remove();}
    }

    initVariables: function(){
        Memory.probabilities = {};
        Memory.probabilities.walls = 0.999;
        Memory.probabilities.roads = 0.999;

        Memory.saved_walls = [];
        Memory.saved_ramparts = [];
        Memory.counters = {};
        Memory.counters.roads = 0;
    },

    walls: function() {
        algorithms_walls.markOuterWalls();
        Memory.outer_walls_triggered = true;
        console.log('Memorized walls and ramparts');
    },

    // remember to put new things in Memory here
    deleteMemory: function(){
        delete Memory.current_state;
        delete Memory.roads_built;
        delete Memory.road_building_probability;
        delete Memory.last_built_creeper;
        delete Memory.exits_counted;
        delete Memory.wall_building_probability;
        delete Memory.outer_walls_triggered;
        for (var f in Game.flags) {Game.flags[f].remove();}
        for (var c in Game.creeps) {console.log(Game.creeps[c].suicide());}
    }
};