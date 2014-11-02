class CompareController < ApplicationController
  def index
    
  end

  def compare
    authorize! :compare, Repository

    user = User.find(params[:user_id])
    repository = Repository.find(params[:repository_id])
    left_revision = Revision.find(params[:left_revision_id])
    @params = {user_id: user.id, repository_id: repository.id,
               page: params[:page], left_revision_id: left_revision.id, type: params[:type]}
    @params[:right_revision_id] = Revision.find(Revision.find(params[:right_revision_id])) if params[:right_revision_id]
  end
end
