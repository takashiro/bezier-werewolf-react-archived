
import React from 'react';

import './Lobby.scss';

class Lobby extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return <div className="lobby">
			<div className="form-dialog">
				<div className="inline-message">Create a new room</div>
				<button type="button">create</button>
			</div>
			<div className="form-dialog">
				<div className="inline-message">Or join an existing room</div>
				<input type="number" placeholder="Room Number" />
				<button type="button">join</button>
			</div>
		</div>;
	}

}

export default Lobby;
