/**
 * Created by OLEG on 31.01.2016.
 */

var React = require('react');

module.exports = React.createClass({
	propTypes:{
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array,
		onItemSelected: React.PropTypes.func,
		itemComponent: React.PropTypes.func.isRequired, //react class
		keyFunc: React.PropTypes.func
	},

	getDefaultProps: function(){
		return{
			items: [],
			selectedItems: [],
			onItemSelected: function(){},
			keyFunc: function(item){
				return JSON.stringify(item);
			}
		}
	},

	onItemClick: function(item){
		this.props.onItemSelected(item);
	},

	render: function(){
		var ItemComponent =  this.props.itemComponent;
		return (
			<div className="ItemsList">
				<div className="ItemsList-container">
					{( () => {
						return this.props.items.map(item => {
							let selected = this.props.selectedItems.indexOf(item) > -1;
							return (<div className={'ItemsList-item ' + (selected ? 'ItemsList-item--selected' : '')} onClick={this.onItemClick.bind(this, item)} key={this.props.keyFunc(item)}>
										<ItemComponent selected={selected} model={item}></ItemComponent>
									</div>
									);
						})
					})()}
				</div>
			</div>
		);
	}

});