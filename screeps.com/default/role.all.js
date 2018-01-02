var pokenames = require('names.pokemon');

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
    buildRoad: function(creep){
        if (Math.random() >= 0.9) {
            Game.spawns.Spawn1.room.createConstructionSite(
                    creep.pos.x, creep.pos.y, STRUCTURE_ROAD
            );
        creep.say('🚧');
        }
    },
    build: function(role) {
        /*
        immer mindestens einen harvester
        wenn ein harvester, dann mindestens einen upgrader
        dann der rest nach belieben
        */
        var pokemon_names = pokenames.pokemon_names;
        var no_construction_sites = Memory.current_state.construction_sites == 0;
        var upgraders = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'upgrader');
        var harvesters = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'builder');
        var all_creeps = _.filter(Game.creeps, (_creep) => _creep.memory.role != '876trzfghvbnkjiuo');
        var max_energy = Memory.current_state.energy_available == Memory.current_state.energy_capacity;

        var desired_builders = no_construction_sites ? 0 : 4;
        var desired_upgraders = ((4 - desired_builders) < 1 ? 1 : (4 - desired_builders));
        var desired_harvesters = 3;

        // when there is nothing to build, create more upgraders
        if (no_construction_sites) {
            if (builders.length > 0) {
                creepers_type_change(builders, 'upgrader');
            }
            if ((max_energy) && (harvesters.length >= desired_harvesters)) {
                var harvesters_to_change = harvesters.slice(desired_harvesters -1);
                creepers_type_change(harvesters_to_change, 'builder');
            }
        } else if ((builders.length < desired_builders) && (upgraders.length > desired_upgraders)) {
                var upgraders_to_change = upgraders.slice(desired_upgraders);
                creepers_type_change(upgraders_to_change, 'builder');
        } else {
            desired_numbers = {
                "harvester": desired_harvesters,
                "upgrader": desired_upgraders,
                "builder": desired_builders
            };
            var desired_number = desired_numbers[role];
            var profiles = [
                [550, [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
                [500, [WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]],
                [400, [WORK,WORK,CARRY,CARRY,MOVE,MOVE]],
                [300, [WORK,CARRY,CARRY,MOVE,MOVE]]
            ];
            var energy_available = Memory.current_state["energy_available"];
            var role_name_in_memory = role + "s";
            var role_count = Memory.current_state[role_name_in_memory];
            if(role_count < desired_number) {
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
    }
};

module.exports = roleAll;