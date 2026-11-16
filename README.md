# Miso · GigaPet

[Play with Miso](https://aimargz.github.io/comp484-project-2/)

A virtual cat for COMP 484 Project 2. Give Miso treats, play, exercise, or take a nap. Each activity changes the stats and gets a response from Miso.

| Activity | Happiness | Weight | Energy |
| --- | --- | --- | --- |
| Treat | +10 | +1 lb | No change |
| Play | +15 | −1 lb | −15 |
| Exercise | −5 | −1 lb | −20 |
| Nap | +5 | No change | +25 |

Happiness and energy stay between 0 and 100. Weight cannot fall below zero. Play and exercise need enough energy and at least 1 lb of weight; Miso asks for a nap or treat when needed. Start fresh resets the game after confirmation. Refreshing the page also starts a new game.

## jQuery methods

- [`.queue()`](https://api.jquery.com/queue/) stores Miso’s visual reactions in a named queue so they run in order. Rapid clicks keep at most four waiting reactions; every accepted action still updates the stats immediately.
- [`.dequeue()`](https://api.jquery.com/dequeue/) starts the first reaction and runs the next after the current reaction finishes.

Both methods are explained where they are used in `script.js`.

## Run locally

Open `index.html` in Chrome. jQuery is included locally, so the game also works without an internet connection.

## Sources

- [Course starter code](https://github.com/csun-orm/comp484-project2): original page structure, action handlers, and stat-update functions, expanded for this project.
- [jQuery 3.7.1](https://github.com/jquery/jquery/tree/3.7.1): included in `vendor/` under the [MIT license](vendor/jquery-LICENSE.txt).
- [jQuery API documentation](https://api.jquery.com/): method references above.

The Miso SVG illustration and room styling were created for this project.
