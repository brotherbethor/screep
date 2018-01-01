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
        /*var all_creeps = _.filter(Game.creeps, (_creep) => _creep.memory.role != 'asdfasdfasdf').length;
        var upgraders = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'upgrader').length;
        var harvesters = _.filter(Game.creeps, (_creep) => _creep.memory.role == 'harvester').length;
        if((upgraders == 0) && (harvesters > 1)){
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role != "upgrader");
            if (creeps.length > 0) {
                var changeling = creeps[0];
                console.log("converting " + changeling.name + " to upgrader");
                changeling.memory.role = "upgrader";
            }
        }*/

        var no_construction_sites = Memory.current_state["construction_sites"] == 0;
        var max_energy = Memory.current_state["energy_available"] == Memory.current_state["energy_capacity"];

        var desired_builders = no_construction_sites ? 0 : 4;
        var desired_upgraders = ((3 - desired_builders) < 1 ? 1 : (3 - desired_builders));
        var desired_harvesters = 3;

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
			            var newName = role + Game.time;
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