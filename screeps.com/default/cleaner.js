module.exports = {
    tick: function(){
        // Always place at the top of the main loop
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    removeAllFlags: function(){
    	for (var f in Game.flags) {Game.flags[f].remove();}
    }
};