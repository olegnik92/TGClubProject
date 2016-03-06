/**
 * Created by OLEG on 27.01.2016.
 */

require('./DialogOverlay.styl')

var React = require('react');

var zDialogsCount = 0;
module.exports = React.createClass({

	propTypes:{
		caption: React.PropTypes.string,
		hideCloseButton: React.PropTypes.bool,
		onClose: React.PropTypes.func,
		cssModifier: React.PropTypes.string,
	},

	getDefaultProps: function(){
		return{
			caption: '',
			hideCloseButton: false,
			onClose: function(){},
			cssModifier: 'DialogOverlay-box--size--auto'
		};
	},


	componentWillMount: function(){
		this.setState({zIndex: 5 * zDialogsCount + 1});
		zDialogsCount++;
	},

	componentWillUnmount: function(){
		zDialogsCount--;
	},

	render: function() {
		var overlayStyle = {
			zIndex: this.state.zIndex
		};

		var closeButtonElement = undefined;
		if(!this.props.hideCloseButton){
			closeButtonElement = (<span className="DialogOverlay-headerCloseButton" onClick={this.props.onClose}>X</span>);
		}

		return (
			<div className="DialogOverlay" style={overlayStyle}>
				<div className={'DialogOverlay-box ' + this.props.cssModifier} >
					<div className="DialogOverlay-header">
						<span className="DialogOverlay-headerCaption">{this.props.caption}</span>
						{closeButtonElement}
					</div>
					<div className="DialogOverlay-body">
						{this.props.children}
					</div>
				</div>

			</div>
		);
	}


});