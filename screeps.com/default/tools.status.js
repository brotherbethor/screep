module.exports = {
    globalState: function(){
    		var current_state = {
	    		'energy_available': Game.spawns.Spawn1.room.energyAvailable,
	    		'energy_capacity': Game.spawns.Spawn1.room.energyCapacityAvailable,
	    		'builders': _.filter(Game.creeps, (creep) => creep.memory.role == "builder").length,
	    		'harvesters': _.filter(Game.creeps, (creep) => creep.memory.role == "harvester").length,
	    		'upgraders': _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader").length,
	    		'extensions': Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length,
	    		// build roads after 5 or more extensions have been built
	    		'build_roads': 5 <= Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length,
	    		'roads': Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}}).length,
	    		'walls': Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}}).length,
	    		'ramparts': Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_RAMPART}}).length,
	    		'construction_sites_extensions': Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}}).length,
	    		'construction_sites_roads': Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_ROAD}}).length,
	    		'construction_sites_walls': Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_WALL}}).length,
	    		'construction_sites_ramparts': Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_RAMPART}}).length,
	    		'construction_sites': Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES).length,
	    		'rcl': Game.spawns.Spawn1.room.controller.level,
	    		'pokemon_index': typeof Memory.current_state.pokemon_index == 'undefined' ? 0 : Memory.current_state.pokemon_index
    		}
    	Memory.current_state = current_state;
    	if (Game.time % 100 == 0) {
    		console.log("Current state:");
    		console.log("    Energy available: " + current_state["energy_available"]);
    		console.log("    Energy capacity: " + current_state["energy_capacity"]);
    		console.log("    Builders: " + current_state["builders"]);
    		console.log("    Harvesters: " + current_state["harvesters"]);
    		console.log("    Upgraders: " + current_state["upgraders"]);
    		console.log("    Extensions: " + current_state["extensions"]);
    		console.log("    Roads: " + current_state["roads"]);
    		console.log("    Walls: " + current_state["walls"]);
    		console.log("    Ramparts: " + current_state["ramparts"]);
    		console.log("Waiting for construction");
    		console.log("    Total: " + current_state["construction_sites"]);
    		console.log("    Roads: " + current_state["construction_sites_roads"]);
    		console.log("    Extensions: " + current_state["construction_sites_extensions"]);
    		console.log("    Walls: " + current_state["construction_sites_walls"]);
    		console.log("    Ramparts: " + current_state["construction_sites_ramparts"]);
    	}
    }
};