/** @jsx React.DOM */
//= require global

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Notifications = React.createClass({
    componentDidMount: function () {
        //this.add(NotificationTypes.notificationsRunning);

        this.notification_event = EventManager.on('notification', function (notification) {
            this.add(notification);
        }.bind(this));
    },
    add: function (newNotification) {
        var newNotifications = this.state.notifications.concat(newNotification);
        this.setState({notifications: newNotifications});
    },
    handleRemove: function (i) {
        var newNotifications = this.state.notifications;
        newNotifications.splice(i, 1);
        setTimeout(function () {
            this.setState({notifications: newNotifications});
        }.bind(this), 0);
    },
    getInitialState: function () {
        return {notifications: []};
    },
    componentWillUnmount: function () {
        this.notification_event.destroy();
    },
    render: function () {
        var notificationNodes = this.state.notifications.map(function (notification, i) {
            return (
                <Notification key={notification.id} notification={notification} onClick={this.handleRemove.bind(this, i)}>
                </Notification>
            );
        }.bind(this));
        return (
            <div className="notifications">

                <ReactCSSTransitionGroup transitionName="notification">

                {notificationNodes}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
});

var Notification = React.createClass({
    getInitialState: function () {
        return {
            dismissed: false
        }
    },
    dismiss: function () {
        this.setState({dismissed: true});
    },
    componentDidMount: function () {
        //this.timeout = setTimeout(this.dismiss, 3000);
    },
    componentWillUnmount: function () {
        clearInterval(this.timeout);
    },
    render: function () {
        var type = "fa fa-lg ";
        switch (this.props.notification.type) {
            case 'failure':
                type += "fa-close";
                break;
            case 'success':
                type += "fa-check";
                break;
            default:
                break;
        }

        var dismissed = (this.state.dismissed) ? "notification dismissed" : "notification";

        return (
            <div className={dismissed} onClick={this.props.onClick}>
                <span className="notification-image">
                    <i className={type}></i>
                </span>

                <div>
                    <span className="notification-title">{this.props.notification.title}</span>
                    <span className="notification-body">{this.props.notification.body}</span>
                </div>
            </div>
        );
    }
});
