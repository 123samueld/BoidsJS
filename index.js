const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1080;
canvas.height = 640;

// Load background image
const background = new Image();
background.src = 'Resources/battlefield_terrain.jpg'; 


// Load the tank image
const tankImage = new Image();
tankImage.src = 'Resources/tank.png';  // Adjust the path as necessary

// Ensure the image is loaded before drawing
tankImage.onload = () => {
  console.log("Tank image loaded successfully.");
};


// Define arrays for agent data (separate position, angle, and other attributes)
const agentCount = 40;
let x = new Float32Array(agentCount);  // x positions
let y = new Float32Array(agentCount);  // y positions
let angle = new Float32Array(agentCount);  // angle

// Initialize agents at random positions and random angles
for (let i = 0; i < agentCount; i++) {
  x[i] = Math.random() * canvas.width;  // x position
  y[i] = Math.random() * canvas.height;  // y position
  angle[i] = Math.random() * Math.PI * 2;  // random angle (radians)
}

// Radar range for detecting nearby agents
const radarRange = 100; 

function radarSweep(agentIndex) {
    let nearbyAgents = [];
    
    let agentX = x[agentIndex];
    let agentY = y[agentIndex];
  
    // Loop through all agents and check if they are within radar range
    for (let i = 0; i < agentCount; i++) {
      if (i === agentIndex) continue; // Skip the agent itself
  
      let dist = Math.sqrt(
        Math.pow(x[i] - agentX, 2) + Math.pow(y[i] - agentY, 2)
      );
  
      // If the agent is within radar range, add it to the list
      if (dist < radarRange) {
        nearbyAgents.push(i); // Add index of nearby agent
      }
    }
  
    // Apply Separation, Alignment, and Cohesion behaviors if there are nearby agents
    let separationTargetAngle = null;
    let alignmentTargetAngle = null;
    let cohesionTargetAngle = null;

    if (nearbyAgents.length > 0) {
      separationTargetAngle = Separation(agentIndex, nearbyAgents);  // Get the Separation target angle
      alignmentTargetAngle = Alignment(agentIndex, nearbyAgents);  // Get the Alignment target angle
      cohesionTargetAngle = Cohesion(agentIndex, nearbyAgents);  // Get the Cohesion target angle
    }

    // Average the Separation, Alignment, and Cohesion target angles and pass it to tankYaw
    if (separationTargetAngle !== null && alignmentTargetAngle !== null && cohesionTargetAngle !== null) {
      // Sum the target angles and calculate the average (weighted or unweighted)
      let combinedTargetAngle = (separationTargetAngle + alignmentTargetAngle + cohesionTargetAngle) / 3;
      tankYaw(agentIndex, combinedTargetAngle);  // Smoothly adjust the angle using tankYaw
    }
  
    return nearbyAgents;
}



function Separation(agentIndex, nearbyAgents) {
    let agentX = x[agentIndex];
    let agentY = y[agentIndex];
    let separationForceX = 0;
    let separationForceY = 0;
  
    // Calculate the separation force
    for (let i = 0; i < nearbyAgents.length; i++) {
      let otherAgentIndex = nearbyAgents[i];
      let otherAgentX = x[otherAgentIndex];
      let otherAgentY = y[otherAgentIndex];
      let distance = Math.sqrt(
        Math.pow(agentX - otherAgentX, 2) + Math.pow(agentY - otherAgentY, 2)
      );
  
      // Calculate the vector pointing away from the neighbor
      let separationX = agentX - otherAgentX;
      let separationY = agentY - otherAgentY;
  
      // Apply the separation force based on the inverse of distance
      let strength = Math.max(0, (radarRange - distance) / radarRange);  // Force strength
  
      separationForceX += separationX * strength;
      separationForceY += separationY * strength;
    }
  
    // Calculate the target angle based on the separation vector
    let SeparationTargetAngle = Math.atan2(separationForceY, separationForceX);
  
    return SeparationTargetAngle;
  }

  function Alignment(agentIndex, nearbyAgents) {
    let agentAngle = angle[agentIndex];  // Current angle of the agent
    let alignmentForceX = 0;
    let alignmentForceY = 0;
  
    // Sum the angles of nearby agents for alignment
    for (let i = 0; i < nearbyAgents.length; i++) {
      let otherAgentIndex = nearbyAgents[i];
      let otherAgentAngle = angle[otherAgentIndex];
  
      // Convert the angle into vector components (cosine and sine)
      alignmentForceX += Math.cos(otherAgentAngle);
      alignmentForceY += Math.sin(otherAgentAngle);
    }
  
    // Calculate the average direction vector
    let alignmentLength = nearbyAgents.length;
    if (alignmentLength > 0) {
      alignmentForceX /= alignmentLength;
      alignmentForceY /= alignmentLength;
    }
  
    // Calculate the target angle based on the average direction
    let AlignmentTargetAngle = Math.atan2(alignmentForceY, alignmentForceX);
  
    return AlignmentTargetAngle;
  }
  
    
  function Cohesion(agentIndex, nearbyAgents) {
    let agentX = x[agentIndex];
    let agentY = y[agentIndex];
    let cohesionForceX = 0;
    let cohesionForceY = 0;
  
    // Sum the positions of nearby agents for cohesion
    for (let i = 0; i < nearbyAgents.length; i++) {
      let otherAgentIndex = nearbyAgents[i];
      let otherAgentX = x[otherAgentIndex];
      let otherAgentY = y[otherAgentIndex];
  
      cohesionForceX += otherAgentX;
      cohesionForceY += otherAgentY;
    }
  
    // Calculate the center of mass
    let cohesionLength = nearbyAgents.length;
    if (cohesionLength > 0) {
      cohesionForceX /= cohesionLength;
      cohesionForceY /= cohesionLength;
    }
  
    // Calculate the vector pointing towards the center of mass
    let cohesionX = cohesionForceX - agentX;
    let cohesionY = cohesionForceY - agentY;
  
    // Calculate the target angle towards the center of mass
    let CohesionTargetAngle = Math.atan2(cohesionY, cohesionX);
  
    return CohesionTargetAngle;
  }
  

  function tankYaw(agentIndex, targetAngle) {
    let maxRotationSpeed = Math.PI / 40;  // Maximum amount to rotate per frame (in radians)
    let agentAngle = angle[agentIndex];  // The current angle of the agent
  
    // Calculate the difference between the current angle and target angle
    let angleDifference = targetAngle - agentAngle;
  
    // Ensure the smallest angle difference for smooth rotation
    if (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
    if (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;
  
    // Apply a fraction of the angle difference for smooth turning
    let rotationStep = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), maxRotationSpeed);
  
    // Update the agent's angle with the gradual change
    angle[agentIndex] += rotationStep;
  }
  
  
  
  

// Game loop timing
let lastTime = 0;

// The actual game loop
function gameLoop(timestamp) {
  // Calculate deltaTime (time since last frame in seconds)
  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image, scaling it to fit the canvas
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Update game entities based on deltaTime
  updateAgents(deltaTime);

  // Manage animations or renderings
  AnimationManager(deltaTime);

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

function updateAgents(deltaTime) {
    for (let i = 0; i < agentCount; i++) {
      // Get nearby agents detected by radar
      radarSweep(i);
  
      // Move the agent based on the updated angle
      let speed = 50;  // px per second
      x[i] += Math.cos(angle[i]) * speed * deltaTime;
      y[i] += Math.sin(angle[i]) * speed * deltaTime;
  
      // Wrap agents around the canvas edges
      if (x[i] < 0) x[i] = canvas.width;
      if (x[i] > canvas.width) x[i] = 0;
      if (y[i] < 0) y[i] = canvas.height;
      if (y[i] > canvas.height) y[i] = 0;
    }
  }
  


  
  function drawAgent(xPos, yPos, angleValue) {
    const tankWidth = 50; // Original width of the tank image (in pixels)
    const tankHeight = 133; // Original height of the tank image (in pixels)
    const scale = 0.5; // Adjust the scale factor as needed (1 = original size, 0.5 = half size, etc.)
    const offsetRotation = 270; // Rotation offset in degrees (adjust this value as needed)

    // Convert offsetRotation from degrees to radians
    const offsetRotationRadians = offsetRotation * (Math.PI / 180);
  
    const imageWidth = tankWidth * scale;
    const imageHeight = tankHeight * scale;
  
    ctx.save();
    ctx.translate(xPos, yPos);
  
    // Apply the angle value and the offset rotation (in radians)
    ctx.rotate(angleValue - offsetRotationRadians);
  
    // Draw the tank image, centered at (xPos, yPos)
    ctx.drawImage(tankImage, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
  
    ctx.restore();
  }
  
  
  

// Animation rendering and other tasks
function AnimationManager(deltaTime) {
  for (let i = 0; i < agentCount; i++) {
    let nearbyAgents = radarSweep(i);  // Radar sweep to detect nearby agents

    // Access agent data from separate arrays (x[], y[], angle[])
    let xPos = x[i];
    let yPos = y[i];
    let angleValue = angle[i];

    // Draw agents as triangles
    drawAgent(xPos, yPos, angleValue);
  }
}

// Start the animation loop
requestAnimationFrame(gameLoop);
