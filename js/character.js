
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ======================
// Container
// ======================
const container = document.getElementById("character-container");

// ======================
// Scene
// ======================
const scene = new THREE.Scene();
scene.background = null;

// ======================
// Camera
// ======================
const camera = new THREE.PerspectiveCamera(
    25,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 9);
camera.lookAt(0, 2, 0);

// ======================
// Renderer
// ======================
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

container.appendChild(renderer.domElement);

// ======================
// Controls
// ======================
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;

// ======================
// Lights
// ======================
scene.add(
    new THREE.AmbientLight(0xffffff, 3)
);

const light = new THREE.DirectionalLight(
    0xffffff,
    5
);

light.position.set(5, 10, 5);

scene.add(light);

// ======================
// Mouse Movement
// ======================
let mouseX = 0;
let mouseY = 0;
let mouseZ = 0;

window.addEventListener("mousemove", (event) => {

    mouseX =
        (event.clientX / window.innerWidth) * 2 - 1;

    mouseY =
        (event.clientY / window.innerHeight) * 2 - 1;

    // Mouse is moving
    if (!isMouseMoving) {

        isMouseMoving = true;

        // Pause current animation
        if (mixer) {
            mixer.timeScale = 0;
        }

    }

    // Reset the "mouse stopped" timer
    clearTimeout(mouseStopTimer);

    mouseStopTimer = setTimeout(() => {

        isMouseMoving = false;

        // Resume animation
        if (mixer) {
            mixer.timeScale = 1;
        }

    }, MOUSE_IDLE_DELAY);

});

// ======================
// Variables
// ======================
let avatar;
let mixer;

let headBone = null;

let targetHeadX = 0;
let targetHeadY = 0;
let targetHeadZ = 0;

let currentAnimation = null;

let isMouseMoving = false;
let mouseStopTimer = null;

const MOUSE_IDLE_DELAY = 1000;

// Store all animations
const actions = {};

// Animation order
const automaticAnimations = [
    "Sit",
    "Golf"
    
];

let automaticIndex = 0;

// Idle/rest time between animations
const IDLE_TIME = 6000;

let idleTimer = null;

// ======================
// Clock
// ======================
const clock = new THREE.Clock();

// ======================
// Loader
// ======================
const loader = new FBXLoader();

// ======================
// Starting Position
// ======================
let startPosition = new THREE.Vector3();

// ======================
// Responsive Character
// ======================
function updateCharacterResponsive() {

    if (!avatar) return;

    const width = window.innerWidth;

    let scale;
    let positionX;
    let rotationY;

    // Mobile
    if (width <= 480) {

        scale = 0.50;
        positionX = 1.9;
        rotationY = -0.15;

    }

    // Tablet
    else if (width <= 768) {

        scale = 0.5;
        positionX = 4;
        rotationY = -0.25;

    }

    // Small laptop / tablet landscape
    else if (width <= 1200) {

        scale = 0.47;
        positionX = 3.9;
        rotationY = -0.35;

    }

    // Desktop
    else {

        scale = 0.5;
        positionX = 6.5;
        rotationY = -0.5;

    }

    // Apply scale
    avatar.scale.set(
        scale,
        scale,
        scale
    );

    // Recalculate character bounds
    const box =
        new THREE.Box3().setFromObject(avatar);

    const center =
        box.getCenter(
            new THREE.Vector3()
        );

    // Apply responsive position
    avatar.position.set(
        positionX,
        -box.min.y + 0.1,
        -center.z
    );
    avatar.rotation.y = rotationY;

    // Update animation starting position
    startPosition.copy(
        avatar.position
    );
}

// ======================
// Load Character
// ======================
loader.load(

    "character/models/avatar.fbx",

    (fbx) => {

        console.log("Character Loaded");

        avatar = fbx;

        

        scene.add(avatar);

        

        // ======================
        // Find Head Bone
        // ======================
        avatar.traverse((obj) => {

            if (obj.isBone) {

                console.log(
                    "Bone:",
                    obj.name
                );

                if (
                    obj.name === "mixamorigHead" &&
                    headBone === null
                ) {

                    headBone = obj;

                    console.log(
                        "Using Head Bone:",
                        headBone
                    );

                }

            }

        });

        // ======================
        // Center Character
        // ======================
        const box =
            new THREE.Box3().setFromObject(avatar);

        const center =
            box.getCenter(
                new THREE.Vector3()
            );


       updateCharacterResponsive();

       

        

        // ======================
        // Camera Target
        // ======================
        controls.target.set(
            0,
            1.5,
            0
        );

        controls.update();

        // ======================
        // Animation Mixer
        // ======================
        mixer =
            new THREE.AnimationMixer(avatar);

        // ======================
        // Animation Finished Event
        // ======================
        mixer.addEventListener(
            "finished",
            onAnimationFinished
        );

        // ======================
        // Load Animations
        // ======================
        loadAnimation(
            "Idle",
            "character/animations/Idle (1).fbx"
        );

        loadAnimation(
            "Golf",
            "character/animations/GolfDrive.fbx"
        );

        loadAnimation(
            "Wave",
            "character/animations/Waving (3).fbx"
        );

        loadAnimation(
            "Point",
            "character/animations/Pointing (2).fbx"
        );

        loadAnimation(
            "Sit",
            "character/animations/Sitting (2).fbx"
        );

    },

    (xhr) => {

        console.log(
            ((xhr.loaded / xhr.total) * 100).toFixed(0) +
            "%"
        );

    },

    (err) => {

        console.error(err);

    }

);

// ======================
// Load Animation
// ======================
function loadAnimation(name, path) {

    loader.load(

        path,

        (fbx) => {

            if (!fbx.animations.length) {

                console.warn(
                    name +
                    " animation not found"
                );

                return;
            }

            const clip =
                fbx.animations[0];

            // ======================
            // Fix Mixamo Bone Names
            // ======================
            clip.tracks.forEach((track) => {

                track.name =
                    track.name.replace(
                        "mixamorig:",
                        "mixamorig"
                    );

            });

            // ======================
            // Create Action
            // ======================
            const action =
                mixer.clipAction(clip);

            actions[name] = action;

            console.log(
                name,
                "Loaded",
                clip.tracks.length,
                "tracks",
                "Duration:",
                clip.duration.toFixed(2),
                "seconds"
            );

            // ======================
            // Start Wave Automatically
            // ======================
if (
    name === "Wave" &&
    !currentAnimation
) {

    setTimeout(() => {

        playAnimation("Wave");

    }, 3000); // 3 seconds

}

        },

        undefined,

        (error) => {

            console.error(
                "Error loading",
                name,
                error
            );

        }

    );

}

// ======================
// Play Animation
// ======================
function playAnimation(name) {

    const action = actions[name];

    if (!action) {

        console.log(
            "Animation missing:",
            name
        );

        return;
    }

    // Cancel any existing idle timer
    if (idleTimer) {

        clearTimeout(idleTimer);

        idleTimer = null;

    }

    const previousAction =
    currentAnimation &&
    actions[currentAnimation]
        ? actions[currentAnimation]
        : null;

// Prepare new animation
action.reset();

action.setLoop(
    THREE.LoopOnce,
    1
);

action.clampWhenFinished = true;

action.timeScale = 0.7;

action.play();

// Smoothly transition from previous animation
if (
    previousAction &&
    previousAction !== action
) {

    action.crossFadeFrom(
        previousAction,
        0.5,
        false
    );

}

  

    // Reset character position
    if (avatar) {

        avatar.position.copy(
            startPosition
        );

    }

    // Configure animation
   

    currentAnimation = name;

    console.log(
        "Playing:",
        name
    );

}

// ======================
// Start Idle / Rest
// ======================
function startIdle(nextAnimation) {

    const idleAction = actions["Idle"];

    if (!idleAction) {

        console.log(
            "Idle animation missing"
        );

        return;
    }

    // Cancel previous idle timer
    if (idleTimer) {

        clearTimeout(idleTimer);

        idleTimer = null;

    }

    // Remember the animation that is currently playing
    const previousAction =
        currentAnimation &&
        actions[currentAnimation]
            ? actions[currentAnimation]
            : null;

    // ======================
    // Prepare Idle
    // ======================
    idleAction.reset();

    idleAction.setLoop(
        THREE.LoopRepeat
    );

    idleAction.clampWhenFinished = false;

    idleAction.fadeIn(0.5);

    idleAction.play();

    // ======================
    // Smooth Transition
    // ======================
    if (
        previousAction &&
        previousAction !== idleAction
    ) {

        idleAction.crossFadeFrom(
            previousAction,
            0.5,
            false
        );

    }

    currentAnimation = "Idle";

    console.log(
        "Smooth transition → Idle"
    );

    // ======================
    // Wait Before Next Animation
    // ======================
    idleTimer = setTimeout(() => {

        if (!isMouseMoving) {

            playAnimation(
                nextAnimation
            );

        } else {

            // Wait until mouse stops
            const waitForMouse =
                setInterval(() => {

                    if (!isMouseMoving) {

                        clearInterval(
                            waitForMouse
                        );

                        playAnimation(
                            nextAnimation
                        );

                    }

                }, 100);

        }

    }, IDLE_TIME);

}



// ======================
// Animation Finished
// ======================
function onAnimationFinished(event) {

    const finishedAction =
        event.action;

    // ======================
    // Wave Finished
    // ======================
    if (
        currentAnimation === "Wave" &&
        finishedAction === actions.Wave
    ) {

        console.log(
            "Wave finished → Idle → Sit"
        );

        automaticIndex = 0;

        startIdle(
            automaticAnimations[
                automaticIndex
            ]
        );

        return;
    }

    // ======================
    // Sit / Golf Finished
    // ======================
    if (
        currentAnimation === "Sit" ||
        currentAnimation === "Golf"
    ) {

        automaticIndex++;

        if (
            automaticIndex >=
            automaticAnimations.length
        ) {

            automaticIndex = 0;

        }

        const nextAnimation =
            automaticAnimations[
                automaticIndex
            ];

        console.log(
            currentAnimation +
            " finished → Idle → " +
            nextAnimation
        );

        startIdle(
            nextAnimation
        );

    }

}

// ======================
// Resize
// ======================
window.addEventListener(
    "resize",
    () => {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;

        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );

        // Update character size and position
        updateCharacterResponsive();

    }
);
// ======================
// Render Loop
// ======================
function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        clock.getDelta();

    // ======================
    // Update Animation
    // ======================
    if (mixer) {

        mixer.update(delta);

    }

    // ======================
    // Head Tracking
    // ======================
    if (headBone) {

        targetHeadY =
            mouseX * 0.6;

        targetHeadX =
            mouseY * 0.6;

        targetHeadZ =
            mouseZ * 0.6;

        // Horizontal head movement
        headBone.rotation.y +=
            (
                targetHeadY -
                headBone.rotation.y
            ) * 0.5;

        // Vertical head movement
        headBone.rotation.x +=
            (
                targetHeadX -
                headBone.rotation.x
            ) * 0.5;

    }

    // ======================
    // Controls
    // ======================
    controls.update();

    // ======================
    // Render
    // ======================
    renderer.render(
        scene,
        camera
    );

}

animate();

