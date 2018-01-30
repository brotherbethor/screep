const _X = 0;
const  _Y = 1;

const _UP = 1;
const _DOWN = -1;

const _SPACING_BY_STRUCTURE_TYPE = {
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
    map[coords[X]][coords[ _Y]] = 'X';
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


function walkAroundCenter(center, radius, structure_type, test=false){
    var map = test == true ? _asciiBox() : undefined;
    var spacing = _SPACING_BY_STRUCTURE_TYPE[structure_type];
    var pos = [0, 0]; // init
    pos[_X] = center[_X] + radius;
    pos[ _Y] = center[ _Y] + radius;
    var fields = [];
    [_DOWN, _UP].forEach(function(direction) {
        [ _X, _Y].forEach(function(axis){
            for (step=0;step < radius*2;step++){
                pos[axis] += direction;
               if (Math.abs((pos[Y] - center[ _Y]) % 2) == spacing){
                   if (test == true) {map = _paint(pos, map);}
                   else {fields.push([pos[ _X], pos[ _Y]]);}
               }
            }
        });
    });
    return fields;
}


// test this module
function _testDrawing(){
    map = walkAroundCenterDrawVersion([7,7], 2, 'test', true);
    _draw(map);
}


exports.walkAroundCenter = walkAroundCenter;