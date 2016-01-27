/**
 * Created by OLEG on 27.01.2016.
 */


require('./TextBox.styl')

var React = require('react');
module.exports = React.createClass({

	propTypes:{
		placeholder: React.PropTypes.string,
		label: React.PropTypes.string,
		defaultValue: React.PropTypes.string,
		masked: React.PropTypes.bool,
		validator: React.PropTypes.func,
		onChange: React.PropTypes.func,
		readOnly: React.PropTypes.bool
	},

	getDefaultProps: function(){
		return {
			onChange: function(){}
		}
	},

	getInitialState: function(){
		return {
			value: this.props.defaultValue || '',
			inputType: this.props.masked ? 'password' : 'text'
		}
	},

	onValueChanged: function(event){
		this.setState({value: event.target.value});
		this.props.onChange(event.target.value);
	},

	render: function(){
		return (
			<div className="TextBox">
				{(() =>{
					if(this.props.label){
						return (<span className="TextBox-label">{this.props.label}</span>)
					}
				})()}

				<input className="TextBox-input" type={this.state.inputType} placeholder={this.props.placeholder} value={this.state.value} onChange={this.onValueChanged}/>
				{(() =>{
					if(this.props.masked){
						return (<span className="TextBox-unmaskButton">unmask</span>)
					}
				})()}
			</div>
		);
	}

});