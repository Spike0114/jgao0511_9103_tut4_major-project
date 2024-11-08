# Major-project

## 1.Work Description
This work does not require mouse or keyboard interaction. After opening the webpage, wait for a few seconds, and the animation effect will automatically start and loop.


## 2.Details of individual approach

### Method
I use Perlin noise and random values or seeds to drive animations.

### Animation and differentiation
I choose to divide the entire shape into rectangles of the same size, and then let these rectangles move freely. After a period of time, these rectangles return to their original positions.
The effect of my team member's code is that small squares move in an orderly manner and gradually disappear, and another effect is to use a mouse to control and change the position, color, and size of graphics.


### Source of inspiration
My inspiration comes from the following works:
[Link-01](https://reas.com/youtube/)
[Link-02](https://reas.com/century_xxx/)

![Pic-01](README_images/1.jpg)
![Pic-02](README_images/2.jpg)
From these two works, I learned about deconstruction and reconstruction, order and chaos, the opposition and unity between dynamic and static.

Firstly, the splitting of 'Broadway Boogie woogie' into small squares and its movement represents a break from tradition and existing forms. By decomposing a fixed, static structure - Mondrian's geometric composition - into independent dynamic elements.

After a period of movement, these blocks returned to their original positions, forming the original appearance of Mondrian's works This kind of regression is a process of reconstruction, which is the re establishment of order and the original state. This process implies the plasticity of art, that is, art works can reconstruct their original structure and meaning through decomposition and dynamic changes.


### Short technical explanation
**Drawing static rectangles**:
Create and draw multiple static rectangles using the MyRect class, simulating a grid layout similar to that in Mondrian's paintings. These rectangles are filled with different colors (yellow, red, gray, blue) to form a static geometric structure.
The program stores these rectangles through the array staticRects and draws them on the canvas.

**Dynamic blocks and wake effects**:
The Square class is defined in the program to represent small squares that can move. Each block has color, position, and velocity, and will move accordingly based on the current mode (flight or return).
During the movement of a block, it will leave a trailing effect, which gradually disappears by recording the block's historical position and transparency.

**Two motion modes of blocks**:
Flight mode: Generate smooth random motion using the Perlin noise function (noise()), allowing blocks to move freely on the canvas. When the block exceeds the canvas boundary, it will re-enter from the other side.
Homing mode: Use the lerp() function to gradually interpolate the position of the block back to its initial fixed position, simulating the effect of the block "going home".

**Change in background color**:
The background color gradually changes with the movement of the blocks:
Flight mode: The background gradually turns black.
Return mode: The background gradually turns white.
This gradient is implemented through the lerp() function, and each frame smoothly transitions the background color.

**Timer control mode switching**:
Use the millis() function to obtain the running time of the program, and control the switching between flight mode and home mode through the timer variable. Switching between two modes every 10 seconds brings dynamic visual effects.

**Yellow area detection and random rectangle generation**:
The program detects yellow regions in a static layout using the detectability YellowRegion() function and stores the coordinates of these yellow regions in the yellowRegions array.
In these yellow areas, use generateRandomRectangles () to randomly generate colored rectangles (gray, red, blue) to add more dynamic elements to the image.