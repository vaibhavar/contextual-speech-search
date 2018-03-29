import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';

const styles = {
	radioButton: {
		marginBottom: 16,
	},
};

class OrderDetails extends React.Component {
	constructor(props) {
		super(props);
		this.handleClose = this.handleClose.bind(this);
	}
	handleClose() {
		this.props.onClose();
	}

	render() {
		const sCustomerId = this.props.customerId;
		const actions = [
			<FlatButton label=" Save" primary={true} onClick={this.handleClose} />,
			<FlatButton label="Cancel" primary={false} onClick={this.handleClose} />,
		];
		return (
			<Dialog open={this.props.open} actions={actions}>
				<Toolbar>
					<ToolbarGroup>
						<ToolbarTitle text="Complaints" />
					</ToolbarGroup>
				</Toolbar>
				<Stepper activeStep={3}>
					<Step>
						<StepLabel>Order Placed</StepLabel>
					</Step>
					<Step>
						<StepLabel>Order Accepted</StepLabel>
					</Step>
					<Step>
						<StepLabel>Dispatched</StepLabel>
					</Step>
					<Step>
						<StepLabel>Delivered (27th March 2018)</StepLabel>
					</Step>
				</Stepper>
				<List>
					<Subheader>Reason of complaint</Subheader>
					<RadioButtonGroup name="complaint" valueSelected={this.props.reason}>
						<RadioButton
							value="wrong"
							label="Wrong Item Delivered"
							selec
							style={styles.radioButton}
						/>
						<RadioButton
							value="late"
							label="Late Delivery"
							style={styles.radioButton}
						/>
						<RadioButton
							value="broken"
							label="Defective Item Delivered"
							style={styles.radioButton}
						/>
						<RadioButton value="other" label="Others" style={styles.radioButton} />
					</RadioButtonGroup>
				</List>
			</Dialog>
		);
	}
}

OrderDetails.defaultProps = {
	order: {},
	open: false,
	reason: '',
	onClose: function() {},
};

export default OrderDetails;
