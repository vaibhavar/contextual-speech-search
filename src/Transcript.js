import React, { Component } from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

class Transcript extends React.Component {
	render() {
		return (
			<List>
				{this.props.messages.map(oMessage => (
					<ListItem
						disabled={true}
						leftAvatar={
							<Avatar src="https://www.linkteachers.com/frontend/foundation/images/dummy_user/default_image.jpg" />
						}
					>
						{oMessage.message}
					</ListItem>
				))}
			</List>
		);
	}
}

Transcript.defaultProps = {
	messages: [],
};

export default Transcript;
