
import React from 'react';

import './RoomCreator.scss';

import TeamSelector from './TeamSelector';

import config from './config';

class RoomCreator extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let teams = [];
		for (let [team, roles] of config) {
			teams.push(<TeamSelector
				key={team}
				team={team}
				roles={roles}
			/>);
		}

		return <div className="room-creator">
			{teams}

			<div className="button-area">
				<button type="button">create</button>
			</div>
		</div>;
	}

}

export default RoomCreator;
