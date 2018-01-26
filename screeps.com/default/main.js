var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAll = require('role.all');

var wall_building = require('algorithms.walls');

var cleaner = require('cleaner');
var buildup = require('buildup');
var status = require('tools.status');

var once = require('tools.runonce');


const _roles = {
    'builder': roleBuilder,
    'upgrader': roleUpgrader,
    'harvester': roleHarvester
}



function _init(){
    once.deleteMemory();
    once.initVariables();
    once.removeAllFlags();
    once.walls(); // memorize wall coordinates
    Memory.run_main_init = false;
    console.log('run-once: done');
}


module.exports.loop = function () {
    // only run this once at the beginning of the game.
    if ((typeof Memory.spawn_id == 'undefined') || (Memory.spawn_id != Game.spawns['Spawn1'].id)) {
        _init();
    }
    status.globalState();
    cleaner.tick();
    buildup.extensions();
    buildup.roads();
    // TODO mauern gleich zu anfang markieren aber
    // aus der bauliste herausfiltern bis extensions und strassen gebaut sind
    buildup.walls();

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    } else {roleAll.build();}

    /*var tower = Game.getObjectById('a13b4afd88f562b0d9084200');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        _roles[creep.memory.role].run(creep);
    }
}