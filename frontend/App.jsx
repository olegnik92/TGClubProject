/**
 * Created by OLEG on 03.04.2016.
 */

var React = require('react');
var Provider = require('react-redux').Provider;
var store = require('./store').instance;
var AppLayout = require('./components/appLayout/AppLayout.jsx');

var Colors = require('material-ui/lib/styles/colors');
var ColorManipulator = require('material-ui/lib/utils/color-manipulator');
var Spacing = require('material-ui/lib/styles/spacing');
var zIndex = require('material-ui/lib/styles/zIndex');
var ThemeManager = require('material-ui/lib/styles/theme-manager');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var materialUITheme = {
	spacing: Spacing,
	zIndex: zIndex,
	fontFamily: '\'Roboto\', sans-serif',
	palette: {
		primary1Color: Colors.green500,
		primary2Color: Colors.green700,
		primary3Color: Colors.lightBlack,
		accent1Color: Colors.pinkA200,
		accent2Color: Colors.grey100,
		accent3Color: Colors.grey500,
		textColor: Colors.darkBlack,
		alternateTextColor: Colors.white,
		canvasColor: Colors.white,
		borderColor: Colors.grey300,
		disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
		pickerHeaderColor: Colors.green500,
	}
};

require('./common.styl')
module.exports = React.createClass({
	childContextTypes : {
		muiTheme: React.PropTypes.object,
	},

	getChildContext() {
		return {
			muiTheme: ThemeManager.getMuiTheme(materialUITheme),
		};
	},

	render: function(){
		return (
			<div id="app">
				<Provider store={store}>
					<AppLayout />
				</Provider>
			</div>
		);
	}
});