module.exports = {   
    roads: function() {
        // TODO: erst nach mindestens 5 extensions
        var roadName = "controllerToSource2";
        if (typeof Memory.roads == "undefined"){
            Memory.roads.controllerToSource2 = false;
        }
        if (Memory.roads.controllerToSource2 == true) {
            return;
        }
        // var xpos = Game.spawns.Spawn1.pos;
        // xpos.y = xpos.y - 1;
        var waypoints = Game.spawns.Spawn1.room.findPath(
            Game.spawns.Spawn1.room.controller.pos,
            Game.spawns.Spawn1.room.find(FIND_SOURCES_ACTIVE)[0].pos,
            {"ignoreCreeps": true}
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
        Memory.roads.controllerToSource2 = true;
    },
    extensions: function() {
        if (
            (Memory.current_state["extensions"] <5) &&
            (Memory.current_state["rcl"] == 2) && 
            (Memory.current_state["construction_sites_extensions"] == 0)
            ) {	
        	var sx = Game.spawns.Spawn1.pos.x;
    	    var sy = Game.spawns.Spawn1.pos.y;
    	    var ex = sx - 2 + Memory.current_state["extensions"];
    	    var ey = sy + 2;
    	    
            Game.spawns.Spawn1.room.createConstructionSite(
    	      	ex,ey,STRUCTURE_EXTENSION
    	    );
            Memory.current_state["extensions"] += 1;
    	    console.log("Built extension at " + ex + ":" + ey);
        }
    }
};