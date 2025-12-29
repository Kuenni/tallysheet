class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery :with => :exception
  helper_method :rendering_time
  before_action :set_rendering_start_time, :set_default_url_options_host, :set_static_flashes

  helper_method :admin_logged_in?

  def admin_logged_in?
    session[:admin] == true
  end

  def require_admin
    redirect_to login_path, alert: "Bitte einloggen!" unless admin_logged_in?
  end

  def rendering_time
    millis = (Time.now.usec - @rendering_start_time).abs / 1000.0
    "Rendered in %d ms" % millis
  end

  private

  def authenticate
    session[:authenticated] = authenticate_or_request_with_http_basic do |username, password|
      username == "tally" && password == "sheet!"
    end
  end

  def set_rendering_start_time
    @rendering_start_time = Time.now.usec
  end

  def set_default_url_options_host
    if request != nil
      Rails.application.routes.default_url_options[:host] = request.host_with_port
    end
  end
  
  def set_static_flashes
     @static_flashes = StaticFlash.where("expires > \"#{Time.zone.now.to_s()}\"").order("expires ASC").all
  end
end
