/**
 * Created by OLEG on 10.04.2016.
 */

const actions = {
	chatBoxStateChange: 'CL_CHAT_BOX_STATE_CHANGE'
};

const creators = {
	chatBoxStateChange: (isOpen) => new Object({type: actions.chatBoxStateChange, isOpen: isOpen}),
};

module.exports.actions = actions;
module.exports.creators = creators;