Rails.application.routes.draw do
  namespace :auth do
    post :linkedin
  end
end
