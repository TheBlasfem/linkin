module OAuth
  class Base
    attr_reader :provider, :data, :errors

    def initialize(params)
      @provider = self.class.name.split('::').last.downcase
      @errors = []

      if params[:state] == Rails.application.secrets["#{@provider}_state"]
        @params = {
          code: params[:code],
          redirect_uri: params[:redirect_uri],
          client_id: params[:client_id],
          client_secret: Rails.application.secrets["#{ @provider }_oauth_secret"]
        }
        @client = HTTPClient.new
        @access_token = params[:access_token].presence || get_access_token
      else
        @errors.push("Incorrect state.")
      end
    end

    def get_data
      response = @client.get(self.class::API_URL + "/people/~:(id,email-address,first-name,last-name,picture-url,positions)?format=json", nil, "Authorization": "Bearer #{@access_token}")

      if response.status == 401
        @errors.push("Invalid Token.")
      else
        @data = JSON.parse(response.body).with_indifferent_access
      end      
    end
  end
end