/** @jsx React.DOM */
//= require global

var Sidebar = React.createClass({
    getInitialState: function () {
        return {};
    },
    navigateToFilesView: function () {
        EventManager.trigger('sidebar-showing-pages');
        $(".sidebar").animate({left: '-100%'}, 350);
    },
    navigateToRevisionsView: function () {
        EventManager.trigger('sidebar-showing-revisions');
        $(".sidebar").animate({left: '-200%'}, 350);
    },
    selectRepository: function (repository) {
        if (this.state.repository === repository) {
            EventManager.trigger('sidebar-pages-loaded');
            this.navigateToFilesView();
        }
        this.setState({
            repository: repository
        });
        CompareViewData.setData({repository: repository});
    },
    selectFile: function (repository, page) {
        if (this.state.page === page) {
            this.navigateToRevisionsView();
        }
        this.setState({
            repository: repository,
            page: page
        });
        CompareViewData.setData({repository: repository, page: page});
    },
    onFileLoaded: function () {
        this.navigateToFilesView();
    },
    componentDidMount: function () {
        this.compare_listener = CompareViewData.onUpdate(function (data) {
            if (isNull(this.state.page) && isDefined(data.page)) {
                //this.navigateToRevisionsView();
            } else if (isNull(this.state.repository) && isDefined(data.repository)) {
                //this.navigateToFilesView();
            }
            this.setState({
                repository: data.repository,
                page: data.page
            });
        }.bind(this));
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return nextState.page !== this.state.page || nextState.repository !== this.state.repository
    },
    componentWillUnmount: function () {
        this.compare_listener.destroy()
    },
    render: function () {
        var classes = React.addons.classSet({
            'sidebar-container': true,
            'display': isNull(this.state.repository) || isNull(this.state.page)
        });
        return (
            <div className={classes}>
                <div className='sidebar'>
                    <RepositoriesBox user_id={this.props.user_id} onClick={this.selectRepository} />
                    <FilesBox user_id={this.props.user_id} onClick={this.selectFile}
                        repository={this.state.repository} onFilesLoaded={this.onFileLoaded}/>
                    <Revisions user_id={this.props.user_id} repository={this.state.repository}
                        page={this.state.page} onRevisionsLoaded={this.navigateToRevisionsView}/>
                </div>
            </div>
        );
    }
});