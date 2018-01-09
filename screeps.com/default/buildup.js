var algorithms = require('algorithms.extensions');

const EXTENSION_BUILT_EXCEPTION = 'extension_built_exception';
const extensions_by_rcl = {
    0: 0,
    1: 0,
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 40,
    7: 50,
    8: 60
}

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
        var rcl = Memory.current_state.rcl;
        var extensions_count = Memory.current_state.extensions;
        var max_extensions = extensions_by_rcl[rcl];
        var extensions_in_building = Memory.current_state.construction_sites_extensions;
        if ((extensions_count < max_extensions) && (extensions_in_building == 0)) {	
        	var sx = Game.spawns.Spawn1.pos.x;
    	    var sy = Game.spawns.Spawn1.pos.y;
            var spawn_point = [Game.spawns.Spawn1.pos.x, Game.spawns.Spawn1.pos.y];
            var radius = 1;
            try {
                while (true){
                    if (radius > rcl) {
                        console.log('WARNING!! please check your extension placing. radius > rcl!');
                        return false;
                    }
                    console.log('trying to build an extension in radius ' + radius);
                    var build_places = algorithms.walk_around_center(spawn_point, radius, 'extension');
                    // we just look at every place to build every time.
                    // things might be gone and allow building by now...
                    // and we only build on terrain that is empty.
                    build_places.forEach(function(b_place){
                        var things = Game.spawns.Spawn1.room.lookAt(b_place[0], b_place[1]);
                        if ((things.length == 1) && (things[0]['type'] == 'terrain') && (things[0]['terrain'] == 'plain')) {
                            Game.spawns.Spawn1.room.createConstructionSite(
                                b_place[0], b_place[1],STRUCTURE_EXTENSION
                            );
                            Memory.current_state.extensions += 1;
                            console.log('>>> Built extension at ' + b_place[0] + ':' + b_place[1]);
                            throw {'name': EXTENSION_BUILT_EXCEPTION};
                        }
                    });
                    radius += 1;
                }
            } catch (e) {
                if (e.name != EXTENSION_BUILT_EXCEPTION){ throw e; }
            }
        }
    }
};