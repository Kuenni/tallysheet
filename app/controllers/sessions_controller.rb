class SessionsController < ApplicationController

  def new
  end

  def create
    if params[:user] == 'tally' && params[:password] == 'sheet!'
      session[:admin] = true
      redirect_to root_path, notice: "Welcome admin"
    else
      redirect_to root_path, alert: "Login failed"
    end
  end

  def destroy
    reset_session
    redirect_to root_path, notice: "Logged out"
  end
end
