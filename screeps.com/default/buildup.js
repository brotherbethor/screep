var extension_coordinates = require('positions.extensions');

function road_data(){
    var spawn = Game.spawns.Spawn1;
    var controller = Game.spawns.Spawn1.room.controller;
    var froms = [spawn, controller];
    var tos = Game.spawns.Spawn1.room.find(FIND_SOURCES_ACTIVE);
    var roads = {};
    froms.forEach(
        function(origin){
            tos.forEach(
                function(destination){
                    var name = origin.id + "_to_" + destination.id;
                    console.log('road name' + name);
                    roads[name] = {
                        'from': origin,
                        'to': destination
                    };
                }
            );
        }
    );
    console.log('road length ' + roads.length);
    return roads;
}

module.exports = {   
    roads: function() {
        if (typeof Memory.roads_built == 'undefined') {
            Memory.roads_built = 0;
            Memory.road_building_probability = 0.999; // rebuild every 1000 ticks or so
            console.log('Initialized road building data.');
        } else {

            if (Memory.current_state['extensions'] >= 5) {
                if ((Memory.roads_built == 0) ||
                    (Math.random() >= Memory.road_building_probability)) {
                    var roads = road_data();
                    for (var road_name in roads) {
                        console.log(road_name + 'is a road');
                        var coordinates = roads[road_name];
                        var origin = coordinates['from'];
                        var destination = coordinates['to'];
                        var waypoints = Game.spawns.Spawn1.room.findPath(
                            origin.pos,
                            destination.pos,
                            {'ignoreCreeps': true} // only ever build the default roads
                        );
                        console.log('waypoints: ' + waypoints.length);
                        waypoints.forEach(
                            function(waypoint){
                                Game.spawns.Spawn1.room.createConstructionSite(
                                    waypoint.x,
                                    waypoint.y,
                                    STRUCTURE_ROAD
                                );
                            }
                        );
                        console.log('road built');
                    }
                    Memory.roads_built += 1;
                }
            }

        }
    },
    extensions: function() {
        if (
            (Memory.current_state['extensions'] < 5) &&
            (Memory.current_state['rcl'] == 2) && 
            (Memory.current_state['construction_sites_extensions'] == 0)
            ) {	
            var extension_positions = extension_coordinates.extension_positions_2;
        	var sx = Game.spawns.Spawn1.pos.x;
    	    var sy = Game.spawns.Spawn1.pos.y;
            var new_extension_position = extension_positions[Memory.current_state['extensions']];


    	    var ex = new_extension_position[0] + sx;
    	    var ey = new_extension_position[1] + sy;
    	    
            Game.spawns.Spawn1.room.createConstructionSite(
    	      	ex,ey,STRUCTURE_EXTENSION
    	    );
            Memory.current_state['extensions'] += 1;
    	    console.log('Built extension at ' + ex + ':' + ey);
        }
    }
};