class Repository < ActiveRecord::Base
  belongs_to :user, class_name: User

  has_many :revisions, class_name: Revision, dependent: :destroy
  has_many :pages, class_name: Page, dependent: :destroy

  validates_uniqueness_of :name, scope: :user_id

  def master
    revisions.order(:order).last
  end

  def sync_revisions
    commits = Github.octokit.commits("#{user.username}/#{name}")
    commits.each_with_index do |commit, i|
      revision = revisions.find_by_sha(commit.sha)
      if revision.nil?
        revision = self.revisions.build
      end
      revision.order = commits.size - i
      revision.sha = commit.sha
      revision.message = commit.commit.message
      revision.date = commit.commit.committer.date
      revision.save
    end
  end

  def sync_pages
    Dir.chdir(local_path) do
      Dir['**/*.html'].each do |html_page|
        if pages.find_by_path(html_page).nil?
          page = Page.new
          page.name = File.basename(html_page)
          page.path = html_page
          page.repository = self
          page.save
        end
      end
    end
  end

  def local_path
    File.join(user.local_path, name)
  end
end
