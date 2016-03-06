/**
 * Created by OLEG on 27.01.2016.
 */


require('./TextBox.styl')

var React = require('react');
module.exports = React.createClass({

	propTypes:{
		value: React.PropTypes.string,
		label: React.PropTypes.string,
		masked: React.PropTypes.bool,
		validator: React.PropTypes.func,
		strongValidation: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		readOnly: React.PropTypes.bool,
	},

	getDefaultProps: function(){
		return {
			value: '',
			onChange: function(){},
			validator: function(){}
		}
	},

	getInitialState: function(){
		return {
			inputType: this.props.masked ? 'password' : 'text'
		}
	},

	onValueChanged: function(event){
		this.props.onChange(event.target.value);
	},

	render: function(){
		var mainModifiers = this.props.value ? '' : ' TextBox--empty';
		return (

			<div className={'TextBox' + mainModifiers}>
				{(() =>{
					if(this.props.label){
						return (<label className="TextBox-label">{this.props.label}</label>)
					}
				})()}

				<input className="TextBox-input" type={this.state.inputType} value={this.props.value} onChange={this.onValueChanged}/>
				{(() =>{
					if(this.props.masked){
						return (<span className="TextBox-unmaskButton">unmask</span>)
					}
				})()}

				<span className="TextBox-validationInfo"></span>
			</div>
		);
	}

});