class Revision < ActiveRecord::Base
  belongs_to :repository, class_name: Repository
end
