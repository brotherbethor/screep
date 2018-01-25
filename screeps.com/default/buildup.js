var algorithms_extensions = require('algorithms.extensions');
var algorithms_walls = require('algorithms.walls');

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

const _structures_dont_destroy = [
    'extension', 'spawn', 'controller',
    'wall', 'rampart'
    ];


function _destroyConstruction(cid){
    Game.getObjectById(cid).destroy();
}


function _clearTile(x, y) {
    var things = Game.spawns.Spawn1.room.lookAt(x, y);
    if (things.length == 1) {return;}
    for (var thing in things) {
        var t = thing['type'];
        if (t == 'flag'){continue;}
        else if (t == 'structure') {
            var structure_type = thing['structure']['structureType'];
            if (structure_type) in _structures_dont_destroy {
                continue;
            }
            if (structure_type in ['road']) {
                _destroyConstruction(thing['structure']['id']);
            } 
        }
    }
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
    return roads;
}


function _buildFortification(saved_objects, structure_type){
    for (var o in saved_objects){
        var x = o[0];
        var y = o[1];
        _clearTile(x, y);
        Game.spawns.Spawn1.room.createConstructionSite(
            x, y, structure_type
        );
    }
}

module.exports = {  

    walls: function() {
        if (Memory.construct_outer_walls == true) {
            _buildFortification(Memory.saved_walls, STRUCTURE_WALL);
            _buildFortification(Memory.saved_ramparts, STRUCTURE_RAMPART);
            Memory.outer_walls_constructed = true;
            console.log('Built first batch of walls and ramparts');
        } else {
            // we have marked the walls and we have marked the construction sites
            // now we need to
            // increase the wall's hp ...
            // but one step at a time
            // maybe put this somewhere else
        }
    },

    roads: function() {
        if (Memory.current_state.build_roads == true) {
            if ( Memory.current_state.roads == 0 || 
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
                    var build_places = algorithms_extensions.walk_around_center(spawn_point, radius, 'extension');
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