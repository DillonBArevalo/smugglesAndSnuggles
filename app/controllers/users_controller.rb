class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:id] = @user.id
      redirect_to @user
    else
      @errors = @user.errors.full_messages
      render 'new'
    end
  end

  def show
    redirect_to '/sessions/new' unless current_user && current_user.id == params[:id].to_i
    render layout: 'profile'
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :avatar)
  end
end
