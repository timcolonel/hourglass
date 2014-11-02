/** @jsx React.DOM */
//= require global

var RepositoriesBox = React.createClass({
    loadCommentsFromServer: function (callback) {
        var url = Routes.list_user_repositories_path({user_id: this.props.user_id, enabled: true});
        console.log("URL: " + url);
        $.get(url).success(function (data) {
            this.setState({data: data});
            callback();
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
            callback();
        }.bind(this));
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        var pollInterval = 10000;
        this.loadCommentsFromServer();
    },
    navigateBack: function () {
        console.log("Navigating backwards");
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    handleChange: function (event) {
        console.log("Searching Repositories...");
        var searchKey = event.target.value;
        console.log("Search key: " + searchKey);
        var containsString = function (repository) {
            return repository.name.indexOf(searchKey) > -1;
        };
        var allRepositories = this.state.data.map(function (repository) {
            if (containsString(repository)) {

            }
        });
        this.setState({data: allRepositories});
        this.setState({data: this.state.data.filter(containsString)});
    },
    render: function () {
        var boundClick = this.props.onClick;
        var repositoryNodes = this.state.data.map(function (repository) {
            return (
                <Repository name={repository.name} id={repository.id} enabled={repository.enabled} onClick={boundClick}>
                </Repository>
            );
        });
        return (
            <div id="repositories" className="sidebar-column">
                <h2 className="sidebar-nav">
                    <span className="sidebar-title">Repositories</span>
                    <a className="sidebar-button" href="/settings">
                        <i className="fa fa-cog" ></i>
                    </a>
                </h2>
                <ol className="repositories repository-alternate sidebar-content">
                    {repositoryNodes}
                </ol>
                <div className="search-repositories">
                    <input type="search" placeholder="Search" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});

var Repository = React.createClass({
    toggleRepository: function (e) {
        var id = this.props.id;
        var url;
        console.log("Enabling repository with id " + id);
        if (e.target.checked) {
            console.log('e is checked');
            url = Routes.enable_user_repository_path(current_user, id);
        } else {
            console.log('e is NOT checked');
            url = Routes.disable_user_repository_path(current_user, id);
        }

        $.post(url).done(function (data) {
            console.log("Great succuss");
        }).fail(function (xhr, status, err) {
            console.log("Failure");
            console.error(url, status, err.toString());
        });
    },
    selectRepository: function () {
        console.log("Repository clicked with id: " + this.props.id);
        this.props.onClick(this.props.id);
    },
    render: function () {
        return (
            <li className="repository" onClick={this.selectRepository}>
                {this.props.name}
                <div class="right">
                    <i className="fa fa-angle-right fa-lg"></i>
                </div>
            </li>
        );
    }
});
