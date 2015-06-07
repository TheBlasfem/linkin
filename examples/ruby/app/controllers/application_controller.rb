class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  def error_json_response(subject, status_code)
    render json: subject.errors, status: status_code
  end
end
