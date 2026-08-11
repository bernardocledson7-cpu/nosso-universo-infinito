/* =========================================================
   GALÁXIA DO AMOR 3D — VERSÃO 2
   Inspirada na referência enviada
========================================================= */

const intro = document.getElementById("intro");
const enterButton = document.getElementById("enterButton");

const galaxyContainer =
    document.getElementById("galaxy-container");

const heartContainer =
    document.getElementById("heart-container");

const musicButton =
    document.getElementById("musicButton");

const heartButton =
    document.getElementById("heartButton");

const messageButton =
    document.getElementById("messageButton");

const loveMessage =
    document.getElementById("love-message");

const notification =
    document.getElementById("notification");

const notificationText =
    document.getElementById("notificationText");

const notificationIcon =
    document.getElementById("notificationIcon");

const music =
    document.getElementById("loveMusic");


/* =========================================================
   VARIÁVEIS 3D
========================================================= */

let scene;
let camera;
let renderer;

let galaxyGroup;
let heartGroup;
let starField;

let diskParticles;
let innerParticles;
let dustParticles;
let heartParticles;

let blackHole;
let blackHoleGlow;

let animationFrame;

let clock;

let dragging = false;

let lastX = 0;
let lastY = 0;

let targetRotX = 0;
let targetRotY = 0;

let currentRotX = 0;
let currentRotY = 0;

let targetZoom = 360;
let currentZoom = 360;

let mouseX = 0;
let mouseY = 0;


/* =========================================================
   CORES
========================================================= */

const RED =
    0xff174f;

const HOT_RED =
    0xff003c;

const PINK =
    0xff3d91;

const LIGHT_PINK =
    0xffb6d2;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function init() {

    clock = new THREE.Clock();

    scene = new THREE.Scene();


    /* -----------------------------------------------------
       CÂMERA
    ----------------------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(
            48,
            window.innerWidth /
                window.innerHeight,
            0.1,
            3000
        );


    camera.position.set(
        0,
        150,
        currentZoom
    );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.outputEncoding =
        THREE.sRGBEncoding;


    galaxyContainer.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       GRUPO DA GALÁXIA
    ----------------------------------------------------- */

    galaxyGroup =
        new THREE.Group();


    scene.add(
        galaxyGroup
    );


    /* -----------------------------------------------------
       GRUPO DO CORAÇÃO
    ----------------------------------------------------- */

    heartGroup =
        new THREE.Group();


    scene.add(
        heartGroup
    );


    /* -----------------------------------------------------
       CRIA ELEMENTOS
    ----------------------------------------------------- */

    createGalaxyDisk();

    createInnerGalaxy();

    createGalaxyDust();

    createBlackHole();

    createSeparateHeart();

    createStars();

    createHeartGlow();


    /* -----------------------------------------------------
       POSIÇÃO INICIAL
    ----------------------------------------------------- */

    galaxyGroup.rotation.x =
        -0.12;


    heartGroup.position.set(
        0,
        105,
        5
    );


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
       COMEÇAR
    ----------------------------------------------------- */

    animate();
}


/* =========================================================
   GALÁXIA PRINCIPAL
========================================================= */

function createGalaxyDisk() {

    const count = 26000;

    const positions =
        new Float32Array(
            count * 3
        );


    const sizes =
        new Float32Array(
            count
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        /*
         * Distribuição concentrada
         * no centro.
         */

        const random =
            Math.random();


        const radius =
            Math.pow(
                random,
                0.72
            ) * 205;


        /*
         * Cinco braços espirais.
         */

        const arms = 5;


        const arm =
            Math.floor(
                Math.random() * arms
            );


        const armAngle =
            (arm / arms) *
            Math.PI * 2;


        /*
         * Curvatura dos braços.
         */

        const spiralAngle =
            armAngle +
            radius * 0.038;


        /*
         * Espalhamento.
         */

        const spread =
            (Math.random() - 0.5) *
            (
                10 +
                radius * 0.13
            );


        const angle =
            spiralAngle +
            spread * 0.012;


        const finalRadius =
            radius +
            spread;


        let x =
            Math.cos(angle) *
            finalRadius;


        let z =
            Math.sin(angle) *
            finalRadius;


        /*
         * Disco muito achatado,
         * como na imagem.
         */

        let y =
            (Math.random() - 0.5) *
            (
                3 +
                radius * 0.055
            );


        /*
         * Pequena deformação vertical
         * perto do centro.
         */

        y +=
            Math.sin(
                angle * 2
            ) *
            radius *
            0.012;


        positions[i3] =
            x;

        positions[i3 + 1] =
            y;

        positions[i3 + 2] =
            z;


        /*
         * Partículas maiores
         * perto do centro.
         */

        sizes[i] =
            radius < 45
                ? 2.3 +
                  Math.random() * 2
                : 0.7 +
                  Math.random() * 1.8;
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


    geometry.setAttribute(
        "size",
        new THREE.BufferAttribute(
            sizes,
            1
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: PINK,

            size: 1.55,

            transparent: true,

            opacity: 0.82,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    diskParticles =
        new THREE.Points(
            geometry,
            material
        );


    galaxyGroup.add(
        diskParticles
    );
}


/* =========================================================
   PARTE INTERNA — BRILHO VERMELHO
========================================================= */

function createInnerGalaxy() {

    const count = 10000;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        const radius =
            Math.pow(
                Math.random(),
                1.7
            ) * 70;


        const angle =
            radius * 0.11 +
            Math.random() *
            Math.PI * 2;


        const spread =
            (Math.random() - 0.5) *
            8;


        positions[i3] =
            Math.cos(angle) *
            (radius + spread);


        positions[i3 + 1] =
            (Math.random() - 0.5) *
            7;


        positions[i3 + 2] =
            Math.sin(angle) *
            (radius + spread);
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

            color: RED,

            size: 2.3,

            transparent: true,

            opacity: 0.8,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    innerParticles =
        new THREE.Points(
            geometry,
            material
        );


    galaxyGroup.add(
        innerParticles
    );
}


/* =========================================================
   POEIRA DA GALÁXIA
========================================================= */

function createGalaxyDust() {

    const count = 7000;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        const radius =
            20 +
            Math.random() *
            230;


        const angle =
            Math.random() *
            Math.PI * 2;


        positions[i3] =
            Math.cos(angle) *
            radius;


        positions[i3 + 1] =
            (
                Math.random() -
                0.5
            ) *
            18;


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

            color: LIGHT_PINK,

            size: 0.75,

            transparent: true,

            opacity: 0.27,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    dustParticles =
        new THREE.Points(
            geometry,
            material
        );


    galaxyGroup.add(
        dustParticles
    );
}


/* =========================================================
   BURACO NEGRO
========================================================= */

function createBlackHole() {

    /*
     * Disco luminoso atrás do buraco negro.
     */

    const ringGeometry =
        new THREE.RingGeometry(
            19,
            37,
            96
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color: RED,

            transparent: true,

            opacity: 0.36,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending
        });


    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    ring.rotation.x =
        -Math.PI / 2;


    galaxyGroup.add(
        ring
    );


    /*
     * Halo externo.
     */

    const glowGeometry =
        new THREE.RingGeometry(
            31,
            55,
            96
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: PINK,

            transparent: true,

            opacity: 0.10,

            side:
                THREE.DoubleSide,

            blending:
                THREE.AdditiveBlending
        });


    blackHoleGlow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    blackHoleGlow.rotation.x =
        -Math.PI / 2;


    galaxyGroup.add(
        blackHoleGlow
    );


    /*
     * Buraco negro.
     */

    const holeGeometry =
        new THREE.CircleGeometry(
            23,
            64
        );


    const holeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x000000
        });


    blackHole =
        new THREE.Mesh(
            holeGeometry,
            holeMaterial
        );


    blackHole.rotation.x =
        -Math.PI / 2;


    blackHole.position.y =
        0.8;


    galaxyGroup.add(
        blackHole
    );
}


/* =========================================================
   CORAÇÃO SEPARADO
========================================================= */

function createSeparateHeart() {

    const count = 6000;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        /*
         * Ângulo.
         */

        const t =
            Math.random() *
            Math.PI * 2;


        /*
         * Equação do coração.
         */

        let x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        let y =
            13 *
                Math.cos(t) -
            5 *
                Math.cos(2 * t) -
            2 *
                Math.cos(3 * t) -
            Math.cos(4 * t);


        /*
         * Preenchimento.
         */

        const fill =
            Math.sqrt(
                Math.random()
            );


        x *=
            fill *
            3.15;


        y *=
            fill *
            3.15;


        /*
         * Pequena profundidade.
         */

        const z =
            (
                Math.random() -
                0.5
            ) *
            12 *
            fill;


        positions[i3] =
            x;


        positions[i3 + 1] =
            y;


        positions[i3 + 2] =
            z;
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

            color: 0xff102e,

            size: 1.25,

            transparent: true,

            opacity: 0.95,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });


    heartParticles =
        new THREE.Points(
            geometry,
            material
        );


    heartGroup.add(
        heartParticles
    );
}


/* =========================================================
   BRILHO DO CORAÇÃO
========================================================= */

function createHeartGlow() {

    const geometry =
        new THREE.CircleGeometry(
            35,
            64
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0xff0033,

            transparent: true,

            opacity: 0.035,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const glow =
        new THREE.Mesh(
            geometry,
            material
        );


    glow.position.z =
        -8;


    heartGroup.add(
        glow
    );
}


/* =========================================================
   ESTRELAS DO ESPAÇO
========================================================= */

function createStars() {

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

        const i3 =
            i * 3;


        const radius =
            500 +
            Math.random() *
            900;


        const theta =
            Math.random() *
            Math.PI * 2;


        const phi =
            Math.acos(
                2 *
                Math.random() -
                1
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

            size: 1.2,

            transparent: true,

            opacity: 0.55,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    starField =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        starField
    );
}


/* =========================================================
   ANIMAÇÃO
========================================================= */

function animate() {

    animationFrame =
        requestAnimationFrame(
            animate
        );


    const time =
        clock.getElapsedTime();


    /* -----------------------------------------------------
       ROTAÇÃO DA GALÁXIA
    ----------------------------------------------------- */

    if (galaxyGroup) {

        galaxyGroup.rotation.y +=
            0.0014;


        galaxyGroup.rotation.x +=
            (
                -0.16 -
                galaxyGroup.rotation.x
            ) *
            0.008;


        /*
         * Pequena ondulação.
         */

        galaxyGroup.position.y =
            Math.sin(
                time * 0.35
            ) *
            2;
    }


    /* -----------------------------------------------------
       CORAÇÃO
    ----------------------------------------------------- */

    if (heartGroup) {

        /*
         * Coração fica separado
         * e flutua suavemente.
         */

        heartGroup.position.y =
            105 +
            Math.sin(
                time * 1.2
            ) *
            3;


        heartGroup.rotation.z =
            Math.sin(
                time * 0.7
            ) *
            0.035;


        const pulse =
            1 +
            Math.sin(
                time * 3
            ) *
            0.055;


        heartGroup.scale.set(
            pulse,
            pulse,
            pulse
        );
    }


    /* -----------------------------------------------------
       BURACO NEGRO
    ----------------------------------------------------- */

    if (blackHoleGlow) {

        const glow =
            0.08 +
            Math.sin(
                time * 2
            ) *
            0.035;


        blackHoleGlow.material.opacity =
            glow;
    }


    /* -----------------------------------------------------
       ESTRELAS
    ----------------------------------------------------- */

    if (starField) {

        starField.rotation.y +=
            0.00008;
    }


    /* -----------------------------------------------------
       CÂMERA
    ----------------------------------------------------- */

    currentRotX +=
        (
            targetRotX -
            currentRotX
        ) *
        0.035;


    currentRotY +=
        (
            targetRotY -
            currentRotY
        ) *
        0.035;


    currentZoom +=
        (
            targetZoom -
            currentZoom
        ) *
        0.05;


    /*
     * Movimento de câmera.
     */

    camera.position.x =
        currentRotY * 65;


    camera.position.y =
        150 +
        currentRotX * 55;


    camera.position.z =
        currentZoom;


    camera.lookAt(
        0,
        0,
        0
    );


    /* -----------------------------------------------------
       TEXTOS
    ----------------------------------------------------- */

    updateOrbitTexts(
        time
    );


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   TEXTOS ORBITAIS
========================================================= */

function updateOrbitTexts(time) {

    const texts =
        document.querySelectorAll(
            ".orbit-text"
        );


    if (!texts.length)
        return;


    const positions = [

        {
            x: 9,
            y: 43,
            delay: 0
        },

        {
            x: 76,
            y: 36,
            delay: 0.8
        },

        {
            x: 13,
            y: 66,
            delay: 1.4
        },

        {
            x: 78,
            y: 68,
            delay: 2
        },

        {
            x: 2,
            y: 53,
            delay: 0.4
        },

        {
            x: 82,
            y: 52,
            delay: 1.2
        },

        {
            x: 31,
            y: 27,
            delay: 2.4
        },

        {
            x: 53,
            y: 77,
            delay: 1.8
        }
    ];


    texts.forEach(
        (text, index) => {

            const p =
                positions[index];

            if (!p)
                return;


            const float =
                Math.sin(
                    time * 0.9 +
                    p.delay
                ) *
                4;


            text.style.left =
                p.x + "%";


            text.style.top =
                (
                    p.y +
                    float * 0.08
                ) + "%";


            text.style.transform =
                "translateY(" +
                float +
                "px)";
        }
    );
}


/* =========================================================
   MOUSE
========================================================= */

function onMouseMove(event) {

    mouseX =
        (
            event.clientX /
            window.innerWidth
        ) * 2 - 1;


    mouseY =
        (
            event.clientY /
            window.innerHeight
        ) * 2 - 1;


    if (!dragging) {

        targetRotY =
            mouseX * 0.35;

        targetRotX =
            mouseY * 0.20;
    }


    if (dragging) {

        const dx =
            event.clientX -
            lastX;


        const dy =
            event.clientY -
            lastY;


        galaxyGroup.rotation.y +=
            dx * 0.004;


        galaxyGroup.rotation.x +=
            dy * 0.003;


        lastX =
            event.clientX;


        lastY =
            event.clientY;
    }
}


/* =========================================================
   MOUSE DOWN
========================================================= */

function onPointerDown(event) {

    dragging = true;


    lastX =
        event.clientX;


    lastY =
        event.clientY;
}


/* =========================================================
   MOUSE UP
========================================================= */

function onPointerUp() {

    dragging = false;
}


/* =========================================================
   TOUCH START
========================================================= */

function onTouchStart(event) {

    if (!event.touches.length)
        return;


    const touch =
        event.touches[0];


    dragging = true;


    lastX =
        touch.clientX;


    lastY =
        touch.clientY;
}


/* =========================================================
   TOUCH MOVE
========================================================= */

function onTouchMove(event) {

    if (!event.touches.length)
        return;


    event.preventDefault();


    const touch =
        event.touches[0];


    const dx =
        touch.clientX -
        lastX;


    const dy =
        touch.clientY -
        lastY;


    galaxyGroup.rotation.y +=
        dx * 0.005;


    galaxyGroup.rotation.x +=
        dy * 0.003;


    lastX =
        touch.clientX;


    lastY =
        touch.clientY;
}


/* =========================================================
   ZOOM COM RODA DO MOUSE
========================================================= */

window.addEventListener(
    "wheel",
    function(event) {

        targetZoom +=
            event.deltaY *
            0.35;


        targetZoom =
            Math.max(
                230,
                Math.min(
                    550,
                    targetZoom
                )
            );
    },
    {
        passive: true
    }
);


/* =========================================================
   REDIMENSIONAMENTO
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
   ENTRAR NA GALÁXIA
========================================================= */

enterButton.addEventListener(
    "click",
    function() {

        intro.classList.add(
            "hidden"
        );


        showNotification(
            "❤️",
            "Bem-vinda ao nosso universo..."
        );


        if (
            music &&
            music.src
        ) {

            music.play()
                .then(
                    function() {

                        musicButton.textContent =
                            "🔊";
                    }
                )
                .catch(
                    function() {

                        musicButton.textContent =
                            "🎵";
                    }
                );
        }
    }
);


/* =========================================================
   MÚSICA
========================================================= */

musicButton.addEventListener(
    "click",
    function() {

        if (
            !music ||
            !music.src
        ) {

            showNotification(
                "🎵",
                "A música ainda será adicionada ❤️"
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
   BOTÃO CORAÇÃO
========================================================= */

heartButton.addEventListener(
    "click",
    function() {

        createFloatingHearts();


        showNotification(
            "❤️",
            "Meu coração sempre será seu."
        );
    }
);


/* =========================================================
   CORAÇÕES FLUTUANTES
========================================================= */

function createFloatingHearts() {

    const emojis = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "💘",
        "💓"
    ];


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        element.style.position =
            "fixed";


        element.style.left =
            (
                35 +
                Math.random() * 30
            ) + "%";


        element.style.top =
            (
                45 +
                Math.random() * 15
            ) + "%";


        element.style.fontSize =
            (
                16 +
                Math.random() * 25
            ) + "px";


        element.style.zIndex =
            "400";


        element.style.pointerEvents =
            "none";


        element.style.filter =
            "drop-shadow(0 0 10px #ff0055)";


        document.body.appendChild(
            element
        );


        const x =
            (
                Math.random() -
                0.5
            ) * 280;


        const y =
            -150 -
            Math.random() * 350;


        element.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(.4)",
                    opacity: 0
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1.2)",
                    opacity: 1
                },

                {
                    transform:
                        "translate(calc(-50% + " +
                        x +
                        "px), calc(-50% + " +
                        y +
                        "px)) scale(.6)",
                    opacity: 0
                }
            ],
            {
                duration:
                    1800 +
                    Math.random() * 1300,

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );


        setTimeout(
            function() {

                element.remove();

            },
            3300
        );
    }
}


/* =========================================================
   MENSAGEM
========================================================= */

messageButton.addEventListener(
    "click",
    function() {

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
   FECHAR MENSAGEM
========================================================= */

loveMessage.addEventListener(
    "click",
    function(event) {

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

let notificationTimer;


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
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function() {

                notification.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =========================================================
   DUPLO CLIQUE
========================================================= */

galaxyContainer.addEventListener(
    "dblclick",
    function() {

        createFloatingHearts();


        showNotification(
            "💖",
            "Nosso amor é infinito."
        );
    }
);


/* =========================================================
   AJUSTE DO CORAÇÃO ANTIGO DO HTML
========================================================= */

/*
 * O index.html possui um #heart-container
 * que originalmente tinha um coração CSS no centro.
 *
 * Agora o coração verdadeiro é 3D e fica acima
 * da galáxia.
 *
 * Portanto, escondemos o coração CSS antigo.
 */

const oldHeartStyle =
    document.createElement(
        "style"
    );


oldHeartStyle.textContent = `
    #heart-container {
        width: 1px !important;
        height: 1px !important;
        left: 50% !important;
        top: 25% !important;
        z-index: 5 !important;
        pointer-events: none !important;
    }

    #heart-container::before {
        display: none !important;
    }
`;


document.head.appendChild(
    oldHeartStyle
);


/* =========================================================
   INICIAR
========================================================= */

init();
