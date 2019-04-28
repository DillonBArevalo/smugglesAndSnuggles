module UsersHelper
    def winOrLoss(game)
        if game.winner
            is_winner(game) ? 'W' : 'L'
        else
            raw('&mdash;')
        end
    end

    def is_winner(game)
        game.winner == current_user
    end
end
