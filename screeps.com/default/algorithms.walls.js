const room_size = 50; // - 4 for not building there
const wall_offset = 2;
const X = 0;
const Y = 1;
const UP = 1;
const DOWN = -1;

function remove_flags() {
    for (var f in Game.flags) {Game.flags[f].remove();}
}

function set_flag(x, y) {
    var things = Game.spawns.Spawn1.room.lookAt(x, y);
    if (things.length != 1) {return false;}
    if ((things[0]['type'] == 'terrain') && (things[0]['terrain'] == 'wall')) {
        return false;
    } else {
        Game.spawns.Spawn1.room.createFlag(x, y);
    }
}

function markExits(){
    if (typeof Memory.exits_marked != 'undefined') {
        return false;
    }
    for (x = wall_offset; x < (room_size - wall_offset); x++) {
        for (y = wall_offset; y < (room_size - wall_offset); y++){
            if ((x == 0) || (x == (room_size - wall_offset -1))) {
                set_flag(x,y);
            } else if ((y == 0) || (y == (room_size - wall_offset -1))) {
                set_flag(x,y);
            }
        }
    }
    Memory.exits_marked = true;
}

function is_wall(x, y){
    var things = Game.spawns.Spawn1.room.lookAt(x, y);
    if (things.length != 1) {return false;}
    if ((things[0]['type'] == 'terrain') && (things[0]['terrain'] == 'wall')) {
        return true;
    }
    return false;
}



function collectRampartPositions(known_exits){
    var ramparts = [];
    for (var c in known_exits) {
        e = known_exits[c];
        // console.log('>>>' + c + ':' + e.start.x + ':' + e.start.y);
        if (e.size >= 10) {
            // if x is the same for start and end, the exit must be
            // on the y-axis
            var direction = e.start.x == e.end.x ? Y : X;
            var half = {
                'x': Math.round((e.start.x + e.end.x) / 2),
                'y': Math.round((e.start.y + e.end.y) / 2)
            };
            // set_flag(half.x, half.y);
            // set_flag(half.x + (direction == X ? 1 : 0), half.y + (direction == Y ? 1 : 0));
            // set_flag(half.x - (direction == X ? 1 : 0), half.y - (direction == Y ? 1 : 0));
            ramparts.push([half.x, half.y]);
            ramparts.push([(half.x + (direction == X ? 1 : 0)), (half.y + (direction == Y ? 1 : 0))]);
            ramparts.push([(half.x - (direction == X ? 1 : 0)), (half.y - (direction == Y ? 1 : 0))]);
        }
    }
    return ramparts;
}


// WARNING: This only works when there is a wall at all four corners
// of the room. It seems to be a design criteria that this is always the case.
// But if this changes or is wrong this function will fail in interesting ways.
function checkTile(x, y, direction, vars){
    if (!is_wall(x, y)){
        if (!vars.exit_active) {
            vars.exit_count += 1;
            vars.exit_active = true;
            vars.exits[vars.exit_count] = {
                'direction': direction,
                'size': 1,
                'start': {
                    'x': x,
                    'y': y},
                'end': {
                    'x': x, // just to have a value here
                    'y': y} // just to have a value here
            };
        } else {
            vars.exits[vars.exit_count]['size'] += 1;
            vars.exits[vars.exit_count].end.x = x;
            vars.exits[vars.exit_count].end.y = y;
        }
    } else {
        vars.exit_active = false;
    }
    return vars;
}


function buildExitData() {
    var exit_data = {
        exit_count: 0,
        exit_active: false,
        exits: {}
    };
    var y = wall_offset;
    var x = wall_offset;
    // console.log('>>>' + exit_data.exit_count + ':' + exit_data.exit_active);
    // TODO this probably has a nicer way of doing it ...
    while (x < (room_size - wall_offset -1)) {
        exit_data = checkTile(x, y, X, exit_data);
        x += UP;
    }
    while (y < (room_size - wall_offset -1)) {
        exit_data = checkTile(x, y, Y, exit_data);
        y += UP;
    }
    while (x > wall_offset) {
        exit_data = checkTile(x, y, X, exit_data);
        x += DOWN;
    }
    while (y > wall_offset) {
        exit_data = checkTile(x, y, Y, exit_data);
        y += DOWN;
    }
    return exit_data;
}


function buildWall(x, y, ramparts){
    for (var i in ramparts){
        r = ramparts[i];
        if ((r[0] == x) && (r[1] == y)) {
            // build a rampart here at a later point in time
            // save the rampart position for later reference
            return;
        }
    }
    if (!is_wall(x, y)){
        set_flag(x, y);
        /*Game.spawns.Spawn1.room.createConstructionSite(
            x,
            y,
            STRUCTURE_WALL
        );*/
    }
}


function buildWalls(ramparts) {
    var y = wall_offset;
    var x = wall_offset;
    // console.log('>>>' + exit_data.exit_count + ':' + exit_data.exit_active);
    // TODO this probably has a nicer way of doing it ...
    while (x < (room_size - wall_offset -1)) {
        buildWall(x, y, ramparts);
        x += UP;
    }
    while (y < (room_size - wall_offset -1)) {
        buildWall(x, y, ramparts);
        y += UP;
    }
    while (x > wall_offset) {
        buildWall(x, y, ramparts);
        x += DOWN;
    }
    while (y > wall_offset) {
        buildWall(x, y, ramparts);
        y += DOWN;
    }
}


function buildOuterWalls(){
    // if (typeof Memory.exits_counted != 'undefined') {return false;}
    // JETZT kommt der Sonderfall, daß die Ecken nicht immer schon bebaut sind
    // fixen!
    remove_flags();
    var exit_data = buildExitData();
    var rampart_positions = collectRampartPositions(exit_data.exits);
    buildWalls(rampart_positions);
}

exports.markExits = markExits;
exports.remove_flags = remove_flags;
exports.buildOuterWalls = buildOuterWalls;