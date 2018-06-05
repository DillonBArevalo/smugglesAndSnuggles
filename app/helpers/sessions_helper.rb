module SessionsHelper
  def logged_in?
    !!session[:id]
  end

  def current_user
    @current_user ||= User.find_by(id: session[:id]) if session[:id]
  end

  def current_user?(user)
    user == current_user
  end
end
