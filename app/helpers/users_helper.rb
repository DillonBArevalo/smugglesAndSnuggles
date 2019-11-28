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

    def generateIcon(game)
        if game.completed_at
            image = image_tag('inspectIcon.png', alt: 'Revisit game', class: 'game-history-table__icon JSRevisitLink')
            link_to(image, "/games/#{game.id}", class: 'game-history-table__icon-link JSRevisitLink')
        else
            image = image_tag('redoIcon.png', alt: 'Resume game', class: 'game-history-table__icon')
            link_to(image, "/games/#{game.id}/play", class: 'game-history-table__icon-link')
        end
    end
end
