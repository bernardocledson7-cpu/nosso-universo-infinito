/* =========================================================
   GALÁXIA DO AMOR — SCRIPT.JS
   Three.js
========================================================= */

const galaxyPage = document.getElementById("galaxyPage");
const galaxyContainer = document.getElementById("galaxy-container");

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enterButton");

const musicButton = document.getElementById("musicButton");
const heartButton = document.getElementById("heartButton");
const messageButton = document.getElementById("messageButton");

const loveMessage = document.getElementById("love-message");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");
const notificationIcon = document.getElementById("notificationIcon");

const memories = document.getElementById("memories");
const finalScreen = document.getElementById("final-screen");

const music = document.getElementById("loveMusic");


/* =========================================================
   CONFIGURAÇÃO 3D
========================================================= */

let scene;
let camera;
let renderer;

let galaxy;
let heartParticles;
let stars;

let animationId;

let mouseX = 0;
let mouseY = 0;

let targetRotationX = 0;
let targetRotationY = 0;

let rotationX = 0;
let rotationY = 0;

let isDragging = false;

let previousPointerX = 0;
let previousPointerY = 0;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function init() {

    scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(
        0x050005,
        0.0007
    );


    /* -----------------------------------------------------
       CÂMERA
    ----------------------------------------------------- */

    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );

    camera.position.set(
        0,
        0,
        360
    );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputEncoding = THREE.sRGBEncoding;

    galaxyContainer.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       GALÁXIA
    ----------------------------------------------------- */

    galaxy = new THREE.Group();

    scene.add(galaxy);


    createGalaxy();
    createHeart();
    createStars();
    createDust();


    /* -----------------------------------------------------
       EVENTOS
    ----------------------------------------------------- */

    window.addEventListener(
        "resize",
        onResize
    );

    window.addEventListener(
        "mousemove",
        onMouseMove
    );

    window.addEventListener(
        "mousedown",
        onPointerDown
    );

    window.addEventListener(
        "mouseup",
        onPointerUp
    );

    window.addEventListener(
        "touchstart",
        onTouchStart,
        { passive: false }
    );

    window.addEventListener(
        "touchmove",
        onTouchMove,
        { passive: false }
    );

    window.addEventListener(
        "touchend",
        onPointerUp
    );


    /* -----------------------------------------------------
       COMEÇA ANIMAÇÃO
    ----------------------------------------------------- */

    animate();
}


/* =========================================================
   CRIAR GALÁXIA ESPIRAL
========================================================= */

function createGalaxy() {

    const particleCount = 18000;

    const positions = new Float32Array(
        particleCount * 3
    );

    const sizes = new Float32Array(
        particleCount
    );

    const geometry = new THREE.BufferGeometry();

    const arms = 5;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 = i * 3;

        /*
         * Distância do centro
         */

        const radius =
            Math.pow(
                Math.random(),
                0.55
            ) * 190;


        /*
         * Ângulo principal
         */

        const arm =
            i % arms;

        const armAngle =
            (arm / arms) *
            Math.PI * 2;


        /*
         * Curvatura da galáxia
         */

        const spiral =
            radius * 0.045;


        const angle =
            armAngle +
            spiral +
            (Math.random() - 0.5) *
            0.45;


        /*
         * Espessura
         */

        const spread =
            Math.pow(
                Math.random(),
                1.8
            ) * 30;


        const x =
            Math.cos(angle) *
            (radius + spread);


        const z =
            Math.sin(angle) *
            (radius + spread);


        /*
         * Forma achatada
         */

        const y =
            (Math.random() - 0.5) *
            (10 + radius * 0.08);


        positions[i3] =
            x;

        positions[i3 + 1] =
            y;

        positions[i3 + 2] =
            z;


        /*
         * Tamanho das partículas
         */

        sizes[i] =
            Math.random() *
            2.2 +
            0.5;
    }


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );


    /*
     * Material
     */

    const material =
        new THREE.PointsMaterial({

            color: 0xff3d91,

            size: 1.7,

            transparent: true,

            opacity: 0.8,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    galaxy = new THREE.Points(
        geometry,
        material
    );

    scene.add(galaxy);


    /*
     * Núcleo brilhante
     */

    createGalaxyCore();
}


/* =========================================================
   NÚCLEO DA GALÁXIA
========================================================= */

function createGalaxyCore() {

    const coreGeometry =
        new THREE.SphereGeometry(
            20,
            32,
            32
        );

    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x070007
        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    galaxy.add(core);


    /*
     * Halo
     */

    const haloGeometry =
        new THREE.SphereGeometry(
            35,
            32,
            32
        );

    const haloMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xff005d,

            transparent: true,

            opacity: 0.07,

            blending:
                THREE.AdditiveBlending

        });

    const halo =
        new THREE.Mesh(
            haloGeometry,
            haloMaterial
        );

    galaxy.add(halo);
}


/* =========================================================
   CORAÇÃO DE PARTÍCULAS
========================================================= */

function createHeart() {

    const count = 6500;

    const positions =
        new Float32Array(
            count * 3
        );

    const geometry =
        new THREE.BufferGeometry();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 = i * 3;

        /*
         * Parâmetro da curva
         */

        const t =
            Math.random() *
            Math.PI * 2;


        /*
         * Equação clássica do coração
         */

        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        const y =
            13 *
                Math.cos(t) -
            5 *
                Math.cos(2 * t) -
            2 *
                Math.cos(3 * t) -
            Math.cos(4 * t);


        /*
         * Preenche o interior
         */

        const fill =
            Math.sqrt(
                Math.random()
            );


        const finalX =
            x * fill * 4.2;

        const finalY =
            y * fill * 4.2;


        /*
         * Pequena profundidade
         */

        const finalZ =
            (Math.random() - 0.5) *
            22 *
            fill;


        positions[i3] =
            finalX;

        positions[i3 + 1] =
            finalY;

        positions[i3 + 2] =
            finalZ;
    }


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xff174f,

            size: 1.5,

            transparent: true,

            opacity: 0.9,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    heartParticles =
        new THREE.Points(
            geometry,
            material
        );


    /*
     * O coração fica no centro.
     */

    heartParticles.position.set(
        0,
        0,
        15
    );


    scene.add(
        heartParticles
    );
}


/* =========================================================
   ESTRELAS DISTANTES
========================================================= */

function createStars() {

    const count = 4500;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 = i * 3;

        const radius =
            350 +
            Math.random() * 900;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        positions[i3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i3 + 1] =
            radius *
            Math.cos(phi);

        positions[i3 + 2] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);
    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size: 1.4,

            transparent: true,

            opacity: 0.65,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    stars =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(stars);
}


/* =========================================================
   POEIRA ROSA
========================================================= */

function createDust() {

    const count = 5000;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 = i * 3;

        const radius =
            Math.random() *
            250;

        const angle =
            Math.random() *
            Math.PI * 2;


        positions[i3] =
            Math.cos(angle) *
            radius;

        positions[i3 + 1] =
            (Math.random() - 0.5) *
            60;

        positions[i3 + 2] =
            Math.sin(angle) *
            radius;
    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xff8dbb,

            size: 0.8,

            transparent: true,

            opacity: 0.3,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    const dust =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(dust);
}


/* =========================================================
   ANIMAÇÃO
========================================================= */

function animate() {

    animationId =
        requestAnimationFrame(
            animate
        );


    /*
     * Movimento suave da galáxia
     */

    if (galaxy) {

        galaxy.rotation.y +=
            0.0008;

        galaxy.rotation.x =
            Math.sin(
                Date.now() * 0.00015
            ) * 0.05;
    }


    /*
     * Coração pulsando
     */

    if (heartParticles) {

        const pulse =
            1 +
            Math.sin(
                Date.now() * 0.003
            ) *
            0.07;

        heartParticles.scale.set(
            pulse,
            pulse,
            pulse
        );

        heartParticles.rotation.y +=
            0.0015;
    }


    /*
     * Estrelas se movimentam lentamente
     */

    if (stars) {

        stars.rotation.y +=
            0.0001;
    }


    /*
     * Movimento da câmera
     */

    targetRotationX =
        mouseY * 0.08;

    targetRotationY =
        mouseX * 0.12;


    rotationX +=
        (targetRotationX -
            rotationX) *
        0.03;

    rotationY +=
        (targetRotationY -
            rotationY) *
        0.03;


    camera.position.x =
        rotationY * 80;

    camera.position.y =
        -rotationX * 50;


    camera.lookAt(
        0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   MOUSE
========================================================= */

function onMouseMove(event) {

    mouseX =
        (event.clientX /
            window.innerWidth) *
            2 -
        1;

    mouseY =
        (event.clientY /
            window.innerHeight) *
            2 -
        1;


    if (isDragging) {

        const deltaX =
            event.clientX -
            previousPointerX;

        const deltaY =
            event.clientY -
            previousPointerY;


        galaxy.rotation.y +=
            deltaX * 0.004;

        galaxy.rotation.x +=
            deltaY * 0.004;


        previousPointerX =
            event.clientX;

        previousPointerY =
            event.clientY;
    }
}


function onPointerDown(event) {

    isDragging = true;

    previousPointerX =
        event.clientX;

    previousPointerY =
        event.clientY;
}


function onPointerUp() {

    isDragging = false;
}


/* =========================================================
   TOUCH
========================================================= */

function onTouchStart(event) {

    if (!event.touches.length)
        return;


    const touch =
        event.touches[0];


    previousPointerX =
        touch.clientX;

    previousPointerY =
        touch.clientY;

    isDragging = true;
}


function onTouchMove(event) {

    if (!event.touches.length)
        return;


    event.preventDefault();


    const touch =
        event.touches[0];


    const deltaX =
        touch.clientX -
        previousPointerX;

    const deltaY =
        touch.clientY -
        previousPointerY;


    galaxy.rotation.y +=
        deltaX * 0.006;

    galaxy.rotation.x +=
        deltaY * 0.006;


    previousPointerX =
        touch.clientX;

    previousPointerY =
        touch.clientY;
}


/* =========================================================
   RESPONSIVIDADE
========================================================= */

function onResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* =========================================================
   TELA DE ENTRADA
========================================================= */

enterButton.addEventListener(
    "click",
    () => {

        intro.classList.add(
            "hidden"
        );

        showNotification(
            "❤️",
            "Bem-vinda ao nosso universo..."
        );

        /*
         * O navegador permite iniciar
         * música depois de um clique.
         */

        if (music.src) {

            music.play()
                .then(() => {

                    musicButton.textContent =
                        "🔊";

                })
                .catch(() => {

                    musicButton.textContent =
                        "🎵";

                });
        }
    }
);


/* =========================================================
   BOTÃO DE MÚSICA
========================================================= */

musicButton.addEventListener(
    "click",
    () => {

        if (!music.src) {

            showNotification(
                "🎵",
                "Ainda precisamos colocar a música aqui ❤️"
            );

            return;
        }


        if (
            music.paused
        ) {

            music.play();

            musicButton.textContent =
                "🔊";

            showNotification(
                "🎵",
                "Nossa música começou..."
            );

        } else {

            music.pause();

            musicButton.textContent =
                "🔇";

            showNotification(
                "🔇",
                "Música pausada"
            );
        }
    }
);


/* =========================================================
   BOTÃO DO CORAÇÃO
========================================================= */

heartButton.addEventListener(
    "click",
    createFloatingHearts
);


/* =========================================================
   CORAÇÕES FLUTUANTES
========================================================= */

function createFloatingHearts() {

    const amount = 18;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        heart.textContent =
            [
                "❤️",
                "💕",
                "💗",
                "💖",
                "💘"
            ][
                Math.floor(
                    Math.random() * 5
                )
            ];


        heart.style.position =
            "fixed";


        heart.style.left =
            (40 +
                Math.random() * 20) +
            "%";


        heart.style.top =
            (45 +
                Math.random() * 15) +
            "%";


        heart.style.fontSize =
            (15 +
                Math.random() * 25) +
            "px";


        heart.style.zIndex =
            "300";


        heart.style.pointerEvents =
            "none";


        heart.style.filter =
            "drop-shadow(0 0 10px #ff0066)";


        document.body.appendChild(
            heart
        );


        const x =
            (Math.random() - 0.5) *
            250;

        const y =
            -100 -
            Math.random() * 300;


        const rotation =
            (Math.random() - 0.5) *
            100;


        heart.animate(

            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0.5) rotate(0deg)",
                    opacity: 0
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1.2) rotate(" +
                        rotation +
                        "deg)",
                    opacity: 1
                },

                {
                    transform:
                        "translate(calc(-50% + " +
                        x +
                        "px), calc(-50% + " +
                        y +
                        "px)) scale(0.7) rotate(" +
                        rotation +
                        "deg)",
                    opacity: 0
                }
            ],

            {
                duration:
                    1800 +
                    Math.random() *
                    1200,

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );


        setTimeout(
            () => {
                heart.remove();
            },
            3200
        );
    }


    /*
     * Efeito de coração pulsando
     */

    if (heartParticles) {

        heartParticles.scale.set(
            1.35,
            1.35,
            1.35
        );


        setTimeout(
            () => {

                heartParticles.scale.set(
                    1,
                    1,
                    1
                );

            },
            350
        );
    }


    showNotification(
        "❤️",
        "Meu coração sempre será seu."
    );
}


/* =========================================================
   BOTÃO DE MENSAGEM
========================================================= */

messageButton.addEventListener(
    "click",
    () => {

        loveMessage.classList.toggle(
            "show"
        );

        if (
            loveMessage.classList.contains(
                "show"
            )
        ) {

            showNotification(
                "💌",
                "Uma mensagem para você..."
            );
        }
    }
);


/* =========================================================
   FECHAR MENSAGEM AO CLICAR FORA
========================================================= */

loveMessage.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            loveMessage
        ) {

            loveMessage.classList.remove(
                "show"
            );
        }
    }
);


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

let notificationTimeout;


function showNotification(
    icon,
    text
) {

    notificationIcon.textContent =
        icon;

    notificationText.textContent =
        text;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimeout
    );


    notificationTimeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   DUPLO CLIQUE / TOQUE NO UNIVERSO
========================================================= */

galaxyContainer.addEventListener(
    "dblclick",
    () => {

        createFloatingHearts();

        showNotification(
            "💖",
            "Você encontrou um pedacinho do nosso amor."
        );
    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

init();
