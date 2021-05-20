import React, {Component, Fragment} from 'react';
import PropTypes from "prop-types";

class UserSuggest extends Component {
    static propTypes = {
        users: PropTypes.instanceOf(Array),
        select: PropTypes.instanceOf(Function)
    };

    static defaultProps = {
        users: [],
        select: function() { return true; }
    };

    constructor(props) {
        super(props);
        this.state = {
            activeUser: 0,
            filteredUsers: [],
            showUsers: false,
            userInput: ""
        };
    }

    onChange = e => {
        const { users } = this.props;
        const userInput = e.currentTarget.value;

        const filteredUsers = users.filter(
            user => user.username.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeUser: 0,
            filteredUsers,
            showUsers: true,
            userInput: e.currentTarget.value
        });
    };

    onClick = e => {
        e.preventDefault();
        const { activeUser, filteredUsers } = this.state;
        this.setState({
            activeUser: 0,
            filteredUsers: [],
            showUsers: false,
            userInput: filteredUsers[activeUser].username
        });
        this.props.select(filteredUsers[activeUser]);
    };

    onKeyDown = e => {
        const { activeUser, filteredUsers } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeUser: 0,
                showUsers: false,
                userInput: filteredUsers[activeUser].username
            });
            this.props.select(filteredUsers[activeUser]);
        }
        else if (e.keyCode === 38) {
            if (activeUser === 0)
                return;
            this.setState({
                activeUser: activeUser - 1
            });
        }
        else if (e.keyCode === 40) {
            if (activeUser - 1 === filteredUsers.length)
                return;
            this.setState({
                activeUser: activeUser + 1
            });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeUser,
                filteredUsers,
                showUsers,
                userInput
            }
        } = this;

        let usersListComponent;

        if (showUsers && userInput) {
            if (filteredUsers.length) {
                usersListComponent = (
                    <ul className="list-group suggestions">
                        {
                            filteredUsers.map((user, index) => {
                                let className = "list-group-item";

                                if (index === activeUser) {
                                    className = "list-group-item active suggestion-active";
                                }

                                return (
                                    <li className={className} key={user.id} onClick={onClick}>
                                        <strong>{user.name}</strong> <em>({user.email})</em>
                                    </li>
                                )
                            })
                        }
                    </ul>
                );
            } else {
                usersListComponent = (
                    <ul className="list-group suggestions">
                        <li className="list-group-item text-center"><em>No matching users found, please pre-stage this user above</em></li>
                    </ul>
                );
            }
        }

        return (
            <Fragment>
                <input type="text" className="input-field" onChange={onChange} onKeyDown={onKeyDown} value={userInput}
                       placeholder="Start typing a username..." autoComplete="no"/>
                {usersListComponent}
            </Fragment>
        );
    }
}

export default UserSuggest;