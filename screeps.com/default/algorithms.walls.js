const room_size = 50;
const X = 0;
const Y = 1;
const UP = 1;
const DOWN = -1;

function remove_flags() {
    Game.spawns.Spawn1.room.createFlag(x, y);
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
    for (x = 0; x < room_size; x++) {
        for (y = 0; y < room_size; y++){
            if ((x == 0) || (x == (room_size -1))) {
                set_flag(x,y);
            } else if ((y == 0) || (y == (room_size -1))) {
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


function walkExits(){
    // WARNING: This only works when there is a wall at all four corners
    // of the room. It seems to be a design criteria that this is always the case.
    // But if this changes or is wrong this function will fail in interesting ways.
    function do_tile(x_, y_, direction){
        // console.log(x +':' + y +' before:' + exit_active + ':'+exits);
        if (!is_wall(x_, y_)){
            if (!exit_active) {
                exit_count += 1;
                exit_active = true;
                exits[exit_count] = {
                    'direction': direction,
                    'size': 1,
                    'start': {
                        'x': x_,
                        'y': y_},
                    'end': {
                        'x': x_, // just to have a value here
                        'y': y_} // just to have a value here
                };
            } else {
                exits[exit_count]['size'] += 1;
                exits[exit_count].end.x = x_;
                exits[exit_count].end.y = y_;
            }
        } else {
            exit_active = false;
        }
    }

    if (typeof Memory.exits_counted != 'undefined') {return false;}
    var exit_count = 0;
    var exit_active = false;
    var exits = {};
    var y = 0;
    var x = 0;

    // TODO this probably has a nicer way of doing it ...
    while (x < room_size - 1) {
        do_tile(x, y, X);
        x += UP;
    }
    while (y < room_size -1) {
        do_tile(x, y, Y);
        y += UP;
    }
    while (-x < 0) {
        do_tile(x, y, X);
        x += DOWN;
    }
    while (-y < 0) {
        do_tile(x, y, Y);
        y += DOWN;
    }

    for (var c in exits) {
        e = exits[c];
        // console.log('>>>' + c + ':' + e.start.x + ':' + e.start.y);
        if (e.size >= 4) {
            // if x is the same for start and end, the exit must be
            // on the y-axis
            var direction = e.start.x == e.end.x ? Y : X;
            var half = {
                'x': Math.round((e.start.x + e.end.x) / 2),
                'y': Math.round((e.start.y + e.end.y) / 2)
            };
            console.log('exit ' + c + ' has half point at x:' + half.x + ' y:' + half.y);
            set_flag(half.x, half.y);
        }

    }

    Memory.exits_counted = true;
    return exits;
}


function countExits(){
    function do_tile(x_, y_){
        // console.log(x +':' + y +' before:' + exit_active + ':'+exits);
        if (!is_wall(x_, y_)){
            if (!exit_active) {
                exits += 1;
                exit_active = true;
            }
        } else {
            exit_active = false;
        }
    }

    if (typeof Memory.exits_counted != 'undefined') {return false;}
    var exits = is_wall(0, 0) ? 0 : 1;
    var exit_active = is_wall(0, 0) ? false : true;
    var y = 0;
    var x = 0;

    // TODO this probably has a nicer way of doing it ...
    while (x < room_size - 1) {
        do_tile(x, y);
        x += UP;
    }
    while (y < room_size -1 ) {
        do_tile(x, y);
        y += UP;
    }
    while (-x < 0) {
        do_tile(x, y);
        x += DOWN;
    }
    while (-y < 0) {
        do_tile(x, y);
        y += DOWN;
    }

    Memory.exits_counted = true;
    return exits;
}


exports.walkExits = walkExits;
exports.countExits = countExits;
exports.markExits = markExits;
exports.remove_flags = remove_flags;