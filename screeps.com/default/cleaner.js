module.exports = {
    tick: function(){
        // Always place at the top of the main loop
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    removeFlags: function(){

    	exports.remove_flags = remove_flags;
    }
};