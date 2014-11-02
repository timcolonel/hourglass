Rails.application.routes.draw do


  devise_for :users, controllers: {omniauth_callbacks: 'users/omniauth_callbacks'}

  root 'welcome#index'

  get 'preview/:user_id/:repository_id/:revision_id/:path' => 'preview#show', as: :preview, constraints: {path: /.*/}

  get 'compare/:user_id/:repository_id/:page' => 'compare#index', as: :compare, constraints: {page: /.*/}

  get 'settings/:user_id' => 'settings#index', as: :settings, constraints: {page: /.*/}

  get 'test' => 'welcome#test'
  resources :users do
    resources :repositories do
      member do
        get 'enable'
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
