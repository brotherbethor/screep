const room_size = 50;
const wall_offset = 2;
const X = 0;
const Y = 1;
const UP = 1;
const DOWN = -1;

function _removeFlags() {
    for (var f in Game.flags) {Game.flags[f].remove();}
}


function _setFlag(x, y, color) {
    Game.spawns.Spawn1.room.createFlag(x, y, undefined, color);
}


function _isWall(x, y){
    var things = Game.spawns.Spawn1.room.lookAt(x, y);
    if (things.length != 1) {return false;}
    if ((things[0]['type'] == 'terrain') && (things[0]['terrain'] == 'wall')) {
        return true;
    }
    return false;
}


function _collectRampartPositions(known_exits){
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
            // from the half point, add and subtract one to get
            // a 3-tiles big rampart. that should be enough for now.
            ramparts.push([half.x, half.y]);
            ramparts.push([(half.x + (direction == X ? 1 : 0)), (half.y + (direction == Y ? 1 : 0))]);
            ramparts.push([(half.x - (direction == X ? 1 : 0)), (half.y - (direction == Y ? 1 : 0))]);
        }
    }
    return ramparts;
}


function _saveExitToMemory(x, y){
    Memory.saved_walls.push([x, y]);
}


function _saveRampartToMemory(x, y){
    Memory.saved_ramparts.push([x, y]);
}


// so, this only works because it is run right at the start
// after respawning
function _checkTile(x, y, direction, vars){
    if (!_isWall(x, y)){
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


function _buildExitData() {
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
        exit_data = _checkTile(x, y, X, exit_data);
        x += UP;
    }
    exit_data.exit_active = false;
    while (y < (room_size - wall_offset -1)) {
        exit_data = _checkTile(x, y, Y, exit_data);
        y += UP;
    }
    exit_data.exit_active = false;
    while (x > wall_offset) {
        exit_data = _checkTile(x, y, X, exit_data);
        x += DOWN;
    }
    exit_data.exit_active = false;
    while (y > wall_offset) {
        exit_data = _checkTile(x, y, Y, exit_data);
        y += DOWN;
    }
    exit_data.exit_active = false;
    return exit_data;
}


function _markWall(x, y, ramparts){
    for (var i in ramparts){
        r = ramparts[i];
        if ((r[0] == x) && (r[1] == y)) {
            // build a rampart here at a later point in time
            // save the rampart position for later reference
            _setFlag(x, y, COLOR_BLUE);
            _saveRampartToMemory(x, y);
            return;
        }
    }
    if (!_isWall(x, y)){
        _setFlag(x, y, COLOR_RED);
        _saveExitToMemory(x, y);
    }
}


function _markWalls(ramparts) {
    var y = wall_offset;
    var x = wall_offset;
    // console.log('>>>' + exit_data.exit_count + ':' + exit_data.exit_active);
    // TODO this probably has a nicer way of doing it ...
    while (x < (room_size - wall_offset -1)) {
        _markWall(x, y, ramparts);
        x += UP;
    }
    while (y < (room_size - wall_offset -1)) {
        _markWall(x, y, ramparts);
        y += UP;
    }
    while (x > wall_offset) {
        _markWall(x, y, ramparts);
        x += DOWN;
    }
    while (y > wall_offset) {
        _markWall(x, y, ramparts);
        y += DOWN;
    }
}


function markOuterWalls(){
    // if (typeof Memory.exits_counted != 'undefined') {return false;}
    // JETZT kommt der Sonderfall, daß die Ecken nicht immer schon bebaut sind
    // fixen!
    var exit_data = _buildExitData();
    var rampart_positions = _collectRampartPositions(exit_data.exits);
    _markWalls(rampart_positions);
}

exports.markOuterWalls = markOuterWalls;