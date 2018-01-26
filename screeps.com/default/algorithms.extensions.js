const X = 0;
const Y = 1;

const UP = 1;
const DOWN = -1;

const spacing_by_structure_type = {
    'test': 0,
    'extension': 0,
    'road': 1
}

// used for testing
function _asciiBox(){
    var a = [];
    for (i = 0; i<15; i++){
        a.push(['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']);
    }
    return a;
}


// used for testing
function _paint(coords, map){
    map[coords[X]][coords[Y]] = 'X';
    return map;
}


// used for testing
function _draw(map){
    map.forEach(function(line){
        var printme = '';
        line.forEach(function(item){
            printme += item;
        });
        console.log(printme);
    });
}


// used for testing
function walkAroundCenterDrawVersion(center, radius, map){
    var pos = [0, 0]; // init
    pos[X] = center[X] + radius;
    pos[Y] = center[Y] + radius;
    [DOWN, UP].forEach(function(direction) {
        [X,Y].forEach(function(axis){
            for (step=0;step < radius*2;step++){
                pos[axis] += direction;
                // change after testing
               console.log(pos, center, (pos[X] - center[X]) % 2)
               if ((pos[X] - center[X]) % 2 == 0){
                   map = _paint(pos, map);
               }
            }
        });
    });
}


// test this module
function _testDrawing(){
	var map = _asciiBox();
	map = walkAroundCenterDrawVersion([7,7], 2, map);
	_draw(map);
}


function walkAroundCenter(center, radius, structure_type){
    var spacing = spacing_by_structure_type[structure_type];
    var pos = [0, 0]; // init
    pos[X] = center[X] + radius;
    pos[Y] = center[Y] + radius;
    var fields = [];
    [DOWN, UP].forEach(function(direction) {
        [X,Y].forEach(function(axis){
            for (step=0;step < radius*2;step++){
                pos[axis] += direction;
               if (Math.abs((pos[Y] - center[Y]) % 2) == spacing){
                   fields.push([pos[X], pos[Y]]);
               }
            }
        });
    });
    return fields;
}

exports.walkAroundCenter = walkAroundCenter;
