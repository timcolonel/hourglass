class Ability
  include CanCan::Ability

  def initialize(user)
    if user.nil?
      return
    end
    can :read, :all

    can [:list, :sync, :enable, :disable, :subscribe, :refresh], Repository, user_id: user.id
    can [:list], Page, repository: {user_id: user.id}
    can [:list], Revision, repository: {user_id: user.id}

    can :compare, Repository
  end
end
