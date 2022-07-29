# js-engine
A basic work-in-progress 2D pure JS Game Engine.  
> **Note**: This documentation is incomplete.  
# Contents
[Basic Usage](#basic-usage)  
[Event Handling](#event-handling)  
[Time](#time)  
[Physics](#physics)
[Input](#input)
[Planned Updates](#planned-updates)  

# Basic Usage
This engine helps with drawing to the screen, managing time, physics (thanks to *matter.js*) and handling inputs.
include all files in [`engine`](js/engine/) in your HTML file before any other code, like so:
```html
<script src="js/engine/matter.js"></script>
<script src="js/engine/vector.js"></script>
<script src="js/engine/helper-functions.js"></script>
<script src="js/engine/ui.js"></script>
<script src="js/engine/setup.js"></script>
<script src="js/engine/globals.js"></script>
```
the files outside of `engine` are not required.
redefine the functions `init`, `calc` and `draw` to suit your needs. `init` is run once when the page has loaded (resources like audio and images may not be ready yet. A future update will deal with resource loading.) `calc` is run once every frame (while the game is not paused), and `draw` is run *at least* once every frame. Right now, `draw` is always called once every frame after `calc`, but in future updates `draw` may be called multiple times between `calc` or before `calc`, at any point in time.  
> **Note**: `init`, `calc` and `draw` have already been declared, so you can't use `let` or a *function statement* to redefine them.
> Use *arrow function syntax* instead (e.g. `init = () => { /* function body here */ }`) or a *function expression* (e.g. `init = function() { /* function body goes here */ }`)

`init` is intended to set the inital game state and event handlers. `calc` is intended to update the game state. `draw` is intended to only *draw to the screen*. **Don't update the game state at all in `draw`**, as future versions of this engine may not allow that.  

# Event Handling
Use the global `events` object to handle events. It has multiple properties:
* mousemove
* mousedown
* mouseup
* keydown
* keyup
* wheel
which are all arrays of callback functions (`Function[]`) Modify these arrays however you like, whenever you like. When an event is triggered, every function in the relevant array of callback functions (e.g. `events.mousemove` for a `mousemove` event) is called and given relevant data. In a future update, they will be given *all* function data, and touch-based events will also be added.  

# Time
read (but don't write to) the following global variables after `init` has been run (intended for use in `calc` and `draw`, but these can be used anywhere if you're careful):
* `time` the number of ms since `init` was called.
* `deltaTime` the time between the current frame and the previous frame. It is set to the time since `init` was called for the first frame
* `lastDeltaTime` the time between the previous two frames. It is set to `1` for the first frame
* `currentFrameTime` the time (calculated using `Date.now()`) when the current frame began.
* `previousFrameTime` the time (calculated using `Date.now()`) when the previous frame began.  

# Physics
`Matter`, and some of its properties (`Engine`, `Render`, `Runner`, `Bodies`, `Body` and `Composite`) are global variables.
See `matter.js` for information about how to use them
`engine` is a global variable (a `Matter.Engine`) which is updated automatically in increments of `10ms` or less (it may be updated multiple times betwen frames).
> **Note**: This will change in a future update.  

# Input
for event handling, see [the section on **Event Handling**](#event-handling).
## Keyboard input
use the global `keymap` object to see if keys are held down. for example:
```js
if (keymap[' ']) {
    console.log("The spacebar is currently held down");
}
```

## Mouse input
use the global `Mouse` object to see if the mouse's left/right buttons are held down, as well as for touch input.
you can read:
* `Mouse.position` ([`Vector`](#vector)) - the current position of the mouse on the canvas (don't use this for touch input)
* `Mouse.leftclick` ([`MouseButton`](#mouse-buttons)) - representing the left mouse button
* `Mouse.rightclick` ([`MouseButton`](#mouse-buttons)) - representing the right mouse button
* `Mouse.selected` (`null`) - currently unused
* `Mouse.touches` ([`MouseButton`](#mouse-buttons)[]) - each element in this array represents a finger/stylus on the screen  
You can also use the global `leftDrag()` and `rightDrag()` functions to get the displacement of the mouse while the mouse's left and right buttons were held respectively.

## Mouse Buttons
every `MouseButton` represents a mouse button or touchscreen input and has the following properties:
* `MouseButton.down` (`boolean`) - wether or not the button is being currently held down
* `MouseButton.start` ([`Vector`](#vector)) - the position of the button the last time it began to be held down
* `MouseButton.path` ([`Vector`](#vector)[]) - the path traced by this button while held (only stores the current / most recent path)
* `MouseButton.identifier` (`Number | null`) - the unique [touch identifier](https://developer.mozilla.org/en-US/docs/Web/API/Touch/identifier) of this button. Null for mouse input.

# Planned Updates  
These are in no particular order.
* Event handling functions should be given all event info
* Touch based event handlers
* Level / Scene system and transition system
* Namespaces to avoid polluting the global scope
* Confirming that this engine works even if `js/engine/globals.js` is not included
* Giving `MouseButton`s a `drag()` property which returns a vector (this distance travelled while held) (and removing `leftDrag()` and `rightDrag()`)
