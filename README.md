# GigaPet — COMP 484 Project 2

[Website](https://aimargz.github.io/comp484-project-2/)

Care for Miso using Treat, Play, Exercise, and Nap. Nap restores energy used by Play and Exercise. Stats cannot go below zero; happiness and energy are capped at 100.

## Features

- Blinking eyes, ear twitches, and a swishing tail.
- A rolling ball during Play, a bowl during Treat, and sleepy breathing at low energy.
- Three care milestones: play three times, nap below 20 energy, and try every activity. Reset clears them.
- Optional sounds made with the Web Audio API. Sound is off until enabled.
- Reduced-motion support for animations.

## jQuery methods

- [`.queue()`](https://api.jquery.com/queue/): lines up the cat’s visual reactions.
- [`.dequeue()`](https://api.jquery.com/dequeue/): runs the next reaction when the current one finishes.

Both methods are explained in `script.js`.

## Sources

- [Course starter code](https://github.com/csun-orm/comp484-project2)
- [jQuery documentation](https://api.jquery.com/)
- jQuery 3.7.1 is included under its [MIT license](vendor/jquery-LICENSE.txt).

The cat illustration is in `images/miso.svg`.
