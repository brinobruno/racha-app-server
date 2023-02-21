# Funcional requirements
- [ ] User must be allowed to create a new account
- [ ] User must be allowed to obtain a summary of their account
- [ ] User must be allowed to list all players/teams made

# Business rules
- [ ] Teams may have an even amount of players, in which case, there'd be no subs, or odd amount of players, in which case, there'd be sub(s)
- [ ] It must be possible to identify the user amongst the requests
- [ ] User must only visualize teams and players created by them - Use check-session-id to identify it

# Non-funcional requirements
- [ ] 

# TODO
- [ ] Uniform naming on tests/controllers/services
- [ ] Add repository info for tests

# Note:
Player rating algorithm:
Attack and defense-oriented position players overall will be calculated as:
All stats sum / 5

Midfield and fullbacks will be calculated as:
All stats sum / 5.5

The thinking process is that attackers' defending stat is not too important for their overall. And that goes vice-versa to defenders' shooting for example.

Meanwhile, it's arguable that midfield and fullback players' stats are all important, however, according to simulation and comparison with other FIFA cards, analyzing players from 60 to 90 OVR, it wouldn't reflect well to divide all stats by 6, players with overall of 85 would get almost 10 points off.

On the other hand, good results were obtained by diving it by 5.5, the discrepancy was very small considering that this will be a very basic formula.

For now, on the MVP version, Goalkeepers will have only the overall attribute set.

This measure will be the one used for now