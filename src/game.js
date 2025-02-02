import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { PointerLockControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/controls/PointerLockControls.js';

class BlockWorld {
    constructor() {
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
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);  // Sky blue

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    createWorld() {
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
        this.controls = new PointerLockControls(this.camera, document.body);
        this.scene.add(this.controls.getObject());

        document.getElementById('game-container').addEventListener('click', () => {
            this.controls.lock();
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Iniciar juego cuando se carga la página
window.addEventListener('load', () => {
    new BlockWorld();
});
