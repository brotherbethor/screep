const X = 0;
const Y = 1;

const UP = 1;
const DOWN = -1;

// used for testing
function asciibox(){
    var a = [];
    for (i = 0; i<15; i++){
        a.push(['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']);
    }
    return a;
}


// used for testing
function paint(coords, map){
    map[coords[X]][coords[Y]] = 'X';
    return map;
}


// used for testing
function draw(map){
    map.forEach(function(line){
        var printme = '';
        line.forEach(function(item){
            printme += item;
        });
        console.log(printme);
    });
}


// used for testing
function walk_around_center_draw_version(center, radius, map){
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
                   map = paint(pos, map);
               }
            }
        });
    });
}


// used for testing
function test_drawing(){
	var map = asciibox();
	map = walk_around_center_draw_version([7,7], 2, map);
	draw(map);
}


function walk_around_center(center, radius){
    var pos = [0, 0]; // init
    pos[X] = center[X] + radius;
    pos[Y] = center[Y] + radius;
    [DOWN, UP].forEach(function(direction) {
        [X,Y].forEach(function(axis){
            for (step=0;step < radius*2;step++){
                pos[axis] += direction;
               if ((pos[Y] - center[Y]) % 2 == 0){
                   console.log('build_structure at' + pos);
               }
            }
        });
    });
}

walk_around_center([7,7], 2);
