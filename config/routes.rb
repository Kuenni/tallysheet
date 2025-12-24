Rails.application.routes.draw do
  resources :static_flashes

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  get 'login' => 'dashboard#login'

  get '/tallysheet_entries/latest'
  get '/tallysheet_entries/new_many'
  post '/tallysheet_entries/create_many'
  resources :tallysheet_entries

  get '/beverages/prices'
  resources :beverages

  get 'consumers/update_derived'
  resources :consumers do
    get 'pay'
    post 'pay'
    get 'transfer'
    post 'transfer'
    get 'mail_debt_reminder'
    get 'history'
    get 'payments'
    get 'mail'
    post 'mail'
  end
  
  get '/dashboard/weekly'
  get '/dashboard/hourly'
  get '/dashboard/mail'
  post '/dashboard/mail'
  resources :dashboard

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root 'dashboard#index'

end
