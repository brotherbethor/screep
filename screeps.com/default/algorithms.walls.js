const room_size = 50;

function remove_flags() {
    Game.spawns.Spawn1.room.createFlag(x, y);
}

function set_flag(x, y) {
    Game.spawns.Spawn1.room.createFlag(x, y);
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

exports.markExits = markExits;
exports.remove_flags = remove_flags;