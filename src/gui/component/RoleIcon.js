
import React from 'react';

import Role from '../../game/Role';

import './RoleIcon.scss';

class RoleIcon extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		let roleName = Role.fromNum(this.props.role);
		let style = {
			backgroundImage: `url(style/role/${roleName}.jpg)`
		};
		return <div className="role" style={style}></div>
	}

}

export default RoleIcon;
