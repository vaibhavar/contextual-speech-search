import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import { GridList, GridTile } from 'material-ui/GridList';

import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
	},
	gridList: {
		width: 500,
		height: 450,
		overflowY: 'auto',
	},
};

const tilesData = [
	{
		img: 'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
		title: 'Breakfast',
		orderId: 'jill111',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/burger-827309_640.jpg',
		title: 'Tasty burger',
		orderId: 'pashminu',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
		title: 'Camera',
		orderId: 'Danson67',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg',
		title: 'Morning',
		orderId: 'fancycrave1',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/hats-829509_640.jpg',
		title: 'Hats',
		orderId: 'Hans',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/honey-823614_640.jpg',
		title: 'Honey',
		orderId: 'fancycravel',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/vegetables-790022_640.jpg',
		title: 'Vegetables',
		orderId: 'jill111',
	},
	{
		img: 'http://www.material-ui.com/images/grid-list/water-plant-821293_640.jpg',
		title: 'Water plant',
		orderId: 'BkrmadtyaKarki',
	},
];

class CustomerProfile extends React.Component {
	render() {
		const sCustomerId = this.props.customerId;
		return (
			<Dialog open={this.props.open}>
				<AppBar title={`Customers ${this.props.customer.name}`} />
				<div style={styles.root}>
					<GridList cellHeight={180} style={styles.gridList}>
						<Subheader>Past Orders</Subheader>
						{tilesData.map(tile => (
							<GridTile
								key={tile.img}
								title={tile.title}
								subtitle={
									<span>
										Order - <b>{tile.orderId}</b>
									</span>
								}
								actionIcon={
									<IconButton>
										<StarBorder color="white" />
									</IconButton>
								}
							>
								<img src={tile.img} />
							</GridTile>
						))}
					</GridList>
				</div>
			</Dialog>
		);
	}
}

CustomerProfile.defaultProps = {
	customerId: '',
	customer: {},
	open: false,
};

export default CustomerProfile;
