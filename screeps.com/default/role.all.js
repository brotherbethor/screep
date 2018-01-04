var pokenames = require('names.pokemon');

var creeper_build_order = ['harvester', 'upgrader', 'builder'];

// [max, min]
var creeper_numbers_per_rcl = {
    1:{ 'harvester': [3, 1],
        'upgrader': [7, 1],
        'builder': [0, 0]},
    2:{ 'harvester': [3, 1], 
        'upgrader': [3, 1],
        'builder': [4, 0]},
    3:{ 'harvester': [3, 1], 
        'upgrader': [3, 1],
        'builder': [4, 0]}        
};

function next_creeper_round_robin(){
    if (typeof Memory.last_built_creeper == 'undefined'){
        Memory.last_built_creeper = 0;
        return 'harvester';
    }
    var build_index = Memory.last_built_creeper + 1;
    if (build_index == creeper_build_order.length) {
        build_index = 0;
    }
    Memory.last_built_creeper = build_index;
    return creeper_build_order[build_index];
}

function next_creeper_type_to_build(creepers){
    creeper_numbers = creeper_numbers_per_rcl[Memory.current_state.rcl];
    for (i = 0; i < creeper_build_order.length; i++){
        role = next_creeper_round_robin();
        [role_max, role_min] = creeper_numbers[role];
        var role_count = creepers[role];
        if (role_count < role_max){
            return role;
        }
    }
    return null;
}


function creepers_type_change(creepers, new_type){
    creepers.forEach(function(creeper){
        var old_type = creeper.memory.role;
        creeper.memory.role = new_type;
        Memory.current_state[new_type + 's'] +=1;
        Memory.current_state[old_type + 's'] -=1;
        console.log('Made ' + creeper.name + ' an ' + new_type + '.');
    });
}


var roleAll = {
    build: function(role) {
        // TODO ignore role
        /*
        immer mindestens einen harvester
        wenn ein harvester, dann mindestens einen upgrader
        dann der rest nach belieben
        */

        // - schauen, ob es nichts zu bauen gibt, aber builder
        // wenn ja, reduziere builder auf min, mache aus dem rest upgrader
        // - schauen, ob es nichts zu harvesten gibt, wenn ja, reduziere harvester auf 2
        // mache aus dem rest upgrader
        // schaue, ob es nichts zu 

        var pokemon_names = pokenames.pokemon_names;
        var no_construction_sites = Memory.current_state.construction_sites == 0;
        var upgraders = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'upgrader');
        var harvesters = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'builder');
        var all_creeps = _.filter(Game.creeps, (_creep) => _creep.memory.role != '876trzfghvbnkjiuo');
        var max_energy = Memory.current_state.energy_available == Memory.current_state.energy_capacity;

        // when there is nothing to build, create more upgraders
        // TODO better way to handle 0 harvesters ...
        // harvesters are the most important thing so far
        // first, the default: build all creeps in round robin fashion

        function re_assign_creepers(
            no_construction_sites, upgraders, harvesters, builders, max_energy){


        }

        if (true) {
            var role = next_creeper_type_to_build(
                {'harvester': harvesters.length, 'upgrader': upgraders.length, 'builder': builders.length}
            );
            if (creeper_build_order.indexOf(role) < 0){return null;};
            var profiles = [
                [550, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
                [500, [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
                [400, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]],
                [300, [WORK,CARRY,CARRY,MOVE,MOVE]]
            ];
            var energy_available = Memory.current_state["energy_available"];
            var role_name_in_memory = role + "s";
            var role_count = Memory.current_state[role_name_in_memory];
            var spawned = false;
        	profiles.forEach(
        		function(profile){
            		var p_energy = profile[0];
            		var p_attributes = profile[1];
            		var energy_available = Memory.current_state["energy_available"];
	            	if ((energy_available >= p_energy) && (spawned == false)) {
                        if (Memory.current_state.pokemon_index == pokemon_names.length) {Memory.current_state.pokemon_index = 0;}
			            var newName = pokemon_names[Memory.current_state.pokemon_index]+ Game.time;
                        Memory.current_state.pokemon_index += 1;
			            console.log('Spawning new ' + role + ': ' + newName + " with " + p_attributes);
			            Game.spawns['Spawn1'].spawnCreep(p_attributes, newName, 
			                {memory: {
			                	"role": role,
			                	"target_source": {true: 1, false: 0}[Math.random() >= 0.5]
                                }
			                });
                        Memory.current_state[role_name_in_memory] += 1;
			            spawned = true;
		        	}
        		}
        	);
        }
    }
};

module.exports = roleAll;