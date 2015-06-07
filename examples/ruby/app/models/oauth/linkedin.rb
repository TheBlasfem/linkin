module OAuth
  class Linkedin < OAuth::Base
    HOST = 'https://www.linkedin.com'
    ACCESS_TOKEN_URL = HOST + '/uas/oauth2/accessToken'
    API_URL = 'https://api.linkedin.com/v1'

    attr_reader :access_token

    def get_access_token
      response = @client.post(ACCESS_TOKEN_URL, @params.merge(grant_type: 'authorization_code'))
      JSON.parse(response.body)['access_token']
    end
  end
end