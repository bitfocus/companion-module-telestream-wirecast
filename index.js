var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions
	
	return self;
}

instance.prototype.init = function () {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_OK);
	
	self.initModule();
};

instance.prototype.updateConfig = function (config) {
	var self = this;
	self.config = config;

	self.status(self.STATUS_OK);

	self.initModule();
};

instance.prototype.initModule = function () {
	var self = this;

};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: '<strong>PLEASE READ THIS!</strong><br /><br /> This module requires EventsController app, you can download it from <a target="_blank" href="https://github.com/CVMEventi/EventsController">https://github.com/CVMEventi/EventsController</a>'
		},
		{
			type: 'textinput',
			id: 'ip',
			label: 'IP',
			width: 12,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 12,
			regex: self.REGEX_PORT
		}
	]
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
}

instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'set-shot': {
			label: 'Set Shot on Layer',
			options: [
				{
					type: 'number',
					label: 'Layer',
					id: 'layer',
					default: 1,
					min: 1,
					max: 5,
					required: true,
					range: false,
				},
				{
					type: 'textinput',
					label: 'Shot',
					id: 'shot',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'checkbox',
					label: 'AutoLive',
					id: 'autolive',
					default: false
				},
			]
		},
		'set-all': {
			label: 'Set Shots on All Layers',
			options: [
				{
					type: 'textinput',
					label: 'Shot on Layer 1',
					id: 'shot1',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'textinput',
					label: 'Shot on Layer 2',
					id: 'shot2',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'textinput',
					label: 'Shot on Layer 3',
					id: 'shot3',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'textinput',
					label: 'Shot on Layer 4',
					id: 'shot4',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'textinput',
					label: 'Shot on Layer 5',
					id: 'shot5',
					tooltip: 'Shot 1 is black',
					default: 1,
					min: 1,
					max: 100,
					required: true,
					range: false,
				},
				{
					type: 'checkbox',
					label: 'AutoLive',
					id: 'autolive',
					default: false
				},
			]
		},
		'take': {
			label: 'Go',
			options: []
		},
		'start-recording': {
			label: 'Start Recording',
			options: []
		},
		'stop-recording': {
			label: 'Stop Recording',
			options: []
		},
		'start-broadcasting': {
			label: 'Start Broadcasting',
			options: []
		},
		'stop-broadcasting': {
			label: 'Stop Broadcasting',
			options: [],
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;

	var url = `http://${self.config.ip}:${self.config.port}/wirecast`;

	switch (action.action) {
		case 'set-shot':
			url = url + `/layer/${action.options.layer}/shot/${action.options.shot}/autolive/${action.options.autolive ? 1 : 0}`;
			break;
		case 'set-all':
			url = url + `/shots/${action.options.shot1}/${action.options.shot2}/${action.options.shot3}/${action.options.shot4}/${action.options.shot5}/autolive/${action.options.autolive ? 1 : 0}`
			break;
		case 'take':
			url = url + '/take';
			break;
		case 'start-recording':
			url = url + '/start-recording';
			break;
		case 'stop-recording':
			url = url + '/stop-recording';
			break;
		case 'start-broadcasting':
			url = url + '/start-broadcasting';
			break;
		case 'stop-broadcasting':
			url = url + '/stop-broadcasting';
			break;
	}

	self.system.emit('rest_get', url, function (err, result) {
		console.log("result:");
		console.error(result.data);
		if (err !== null) {
			self.log('error', 'HTTP GET Request failed (' + result.error.code + ')');
			self.status(self.STATUS_ERROR, result.error.code);
		} else {
			if (result.data.ok) {
				self.status(self.STATUS_OK);
			} else {
				self.status(self.STATUS_ERROR);
				self.log('error', `Error from application: ${result.data.description}`)
			}
		}
	});
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;