class SessionsController < ApplicationController

  def new
  end

  def create
    if params[:user] == 'tally' && params[:password] == 'sheet!'
      session[:admin] = true
      redirect_to root_path, notice: "Willkommen, Admin!"
    else
      redirect_to root_path, alert: "Anmeldung fehlgeschlagen"
    end
  end

  def destroy
    reset_session
    redirect_to root_path, notice: "Erfolgreich abgemeldet"
  end
end
