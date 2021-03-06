class User < ActiveRecord::Base
  has_secure_password

  def self.authorize!(env)
    token = sanitize_token(env)
    token.present? ? find_by_authentication_token(token) : false
  end

  def generate_authentication_token!
    begin
      self.authentication_token = SecureRandom.hex
    end while self.class.exists?(authentication_token: authentication_token)
    self.save!
  end

  def login_json_info
    as_json(only: [:id, :name, :email, :authentication_token])
  end

  def self.for_oauth(oauth)
    oauth.get_data
    if data = oauth.data
      user = find_by(oauth_id: data[:id]) || find_by(email: data[:emailAddress])
      user.update(oauth_token: oauth.access_token) if user
      user
    end
  end

  private

  def self.sanitize_token(env)
    token = env['HTTP_AUTHORIZATION']
    env['HTTP_AUTHORIZATION'].gsub!(/\A"|"\Z/, '') if token.present?
    token
  end
end
