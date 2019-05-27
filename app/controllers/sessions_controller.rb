class SessionsController < ApplicationController
  def new
    @user = User.new
    render layout: 'sessions'
  end

  def create
    @user = User.find_by(username: login_params[:username])
    if @user && @user.try(:authenticate, login_params[:password])
      session[:id] = @user.id
      redirect_to '/'
    else
      @errors = ['Username or password is incorrect!']
      @user = User.new({username: login_params[:username]}) unless @user
      render 'new'
    end
  end

  def destroy
    session[:id] = nil
    redirect_to '/'
  end

  private

  def login_params
    params.require(:user).permit(:username, :password)
  end
end
