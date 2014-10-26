class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    can :read, :all

    can [:list, :sync, :enable, :disable], Repository, user_id: user.id
  end
end
