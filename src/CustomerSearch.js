import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';

class CustomerSearch extends React.Component {
	render() {
		const sCustomerId = this.props.customerId;
		return (
			<Dialog open={this.props.open}>
				<AppBar title="Customers" />
				<TextField
					floatingLabelText="Enter Customer's Phone Number"
					value={this.props.customerId}
				/>
				<List>
					{this.props.customers
						.filter(oCustomer => !sCustomerId || oCustomer.id === sCustomerId)
						.map(oCustomer => (
							<ListItem
								disabled={true}
								leftAvatar={
									<Avatar
										src={`https://ui-avatars.com/api/?name=${
											oCustomer.name
										}&rounded=true&background=ff9933&color=fff`}
									/>
								}
							>
								{oCustomer.name}
							</ListItem>
						))}
				</List>
			</Dialog>
		);
	}
}

CustomerSearch.defaultProps = {
	customerId: '',
	customers: [],
	open: false,
};

export default CustomerSearch;
