# Reaction-Diffusion Simulation
This is a **Reaction-Diffusion** simulation I made using shaders with WebGL and Three.js, you can play with the **website** at https://daedalusoa.github.io/Reaction-Diffusion/

<img width="1223" alt="RDD" src="https://github.com/user-attachments/assets/0f286bf5-c071-4241-bfd3-b2bd989e2995">

### How it works

It works by using two shaders that interchange themselves with a **ping-pong** system, 
each cell computes its future value by adding up its current neighbors with the weights of the **reaction-diffusion** simulation, 
and inputting them into the **reaction-diffusion** equations, with blue representing **B** and red representing **A**.

For the simulation to avoid certain areas of the website I coded it to put green in the areas it should avoid, it then multiplies the kill variable by a small amount to make the area inhospitable **AKA** make it avoid areas.

 - This is my main source of information which helped a lot with the algorithm https://www.karlsims.com/rd.html 
 - This is one that helped to set up WebGL and three.js: https://tympanus.net/codrops/2022/11/25/conways-game-of-life-cellular-automata-and-renderbuffers-in-three-js/


