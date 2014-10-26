Rails.application.routes.draw do


  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

  root 'welcome#index'

  get 'preview/:user_id/:repository_id/:revision_id/:path' => 'preview#show', as: :preview, constraints: {path: /.*/}

  get 'compare' => 'compare#index'

  get 'test' => 'welcome#test'
  resources :users do
    resources :repositories do
      member do
        post 'enable'
        post 'disable'
      end

      collection do
        get 'list'
        get 'sync'
      end

      resources :pages do

        member do
          get 'show'
        end
        collection do
          get 'list'
        end
      end
    end
  end
end
