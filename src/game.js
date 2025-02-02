import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { PointerLockControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/controls/PointerLockControls.js';

class BlockWorld {
    constructor() {
        console.log('Iniciando BlockWorld...');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.blocks = [];
        this.blockSize = 1;
        this.worldSize = 16;

        this.initScene();
        this.createWorld();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
    }

    initScene() {
        console.log('Inicializando escena...');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);  // Sky blue

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('game-container').appendChild(this.renderer.domElement);
        } catch (error) {
            console.error('Error al crear renderer:', error);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    createWorld() {
        console.log('Creando mundo...');
        const grassTexture = new THREE.TextureLoader().load('assets/textures/grass.png');
        const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });

        for (let x = 0; x < this.worldSize; x++) {
            for (let z = 0; z < this.worldSize; z++) {
                const geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
                const block = new THREE.Mesh(geometry, grassMaterial);
                block.position.set(
                    x * this.blockSize - (this.worldSize * this.blockSize) / 2,
                    0,
                    z * this.blockSize - (this.worldSize * this.blockSize) / 2
                );
                this.scene.add(block);
                this.blocks.push(block);
            }
        }
    }

    setupControls() {
        console.log('Configurando controles...');
        try {
            this.controls = new PointerLockControls(this.camera, document.body);
            this.scene.add(this.controls.getObject());
        } catch (error) {
            console.error('Error al configurar controles:', error);
        }
    }

    setupEventListeners() {
        console.log('Configurando eventos...');
        document.getElementById('game-container').addEventListener('click', () => {
            try {
                this.controls.lock();
            } catch (error) {
                console.error('Error al bloquear cursor:', error);
            }
        });

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        console.log('Ajustando tamaño de ventana...');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error en renderizado:', error);
        }
    }
}

// Iniciar juego cuando se carga la página
window.addEventListener('load', () => {
    try {
        new BlockWorld();
    } catch (error) {
        console.error('Error al iniciar BlockWorld:', error);
    }
});
