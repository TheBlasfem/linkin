class AuthController < ApplicationController
  
  def linkedin
    @oauth = OAuth::Linkedin.new params
    
    if @oauth.access_token
      @user = User.for_oauth @oauth
      if @user.present?
        @user.generate_authentication_token!
        render json: { user: @user.login_json_info }
      else
        @oauth.data ? render(json: { oauth_token: @oauth.access_token, oauthdata: @oauth.data }) : error_json_response(@oauth, 401)
      end
    else
      error_json_response(@oauth, 422)
    end
  end
end