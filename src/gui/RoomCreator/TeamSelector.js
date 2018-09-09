
import React from 'react';

import './TeamSelector.scss';

import Team from '../../game/Team';
import RoleIcon from '../component/RoleIcon';

class TeamSelector extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let roles = this.props.roles.map(
			(role, i) => <li key={i}>
				<RoleIcon role={role} />
			</li>
		);

		return <div className="team-selector">
			<h4>Team {Team.fromNum(this.props.team)}</h4>
			<ul className="role">
				{roles}
			</ul>
		</div>;
	}

}

export default TeamSelector;
