Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  resource :sessions, only: [:new, :create, :destroy]

  resources :users, only: [:new, :create, :show]

  resources :games, only: [:new, :create, :show]
  get 'games/:id/play', to: 'games#play'

  root 'index#home'
end
