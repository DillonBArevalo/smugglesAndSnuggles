Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resource :sessions, only: [:new, :create, :destroy]

  resources :users, only: [:new, :create, :show]

  resources :games, only: [:new, :create, :update, :show]
  get 'games/:id/play', to: 'games#play'
  get 'pnkeys', to: 'games#keys'

  root 'index#home'
end
