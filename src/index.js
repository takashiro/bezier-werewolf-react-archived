
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './gui/Lobby';

import './global.scss';

document.getElementById('message-box').innerHTML = '';

ReactDOM.render(
	<Lobby />,
	document.getElementById('root')
);
