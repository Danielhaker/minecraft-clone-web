import * as THREE from 'https://unpkg.com/three@0.137.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.137.0/examples/jsm/controls/PointerLockControls.js';

function debugLog(message) {
    console.log(`[BlockWorld Debug] ${message}`);
    const debugElement = document.getElementById('debug-output');
    if (debugElement) {
        debugElement.innerHTML += `<p>${message}</p>`;
    }
}

class BlockWorld {
    constructor() {
        debugLog('Iniciando BlockWorld...');
        
        // Verificar soporte de WebGL
        if (!this.isWebGLSupported()) {
            this.showError('Tu navegador no soporta WebGL');
            return;
        }

        try {
            this.initScene();
            this.createWorld();
            this.setupControls();
            this.setupEventListeners();
            this.animate();
        } catch (error) {
            this.showError(`Error de inicialización: ${error.message}`);
            debugLog(`Error completo: ${error.stack}`);
        }
    }

    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `<p>${message}</p>`;
            errorContainer.style.display = 'block';
        }
        console.error(message);
    }

    initScene() {
        debugLog('Inicializando escena...');
        
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);  // Sky blue

        // Configurar cámara
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);

        // Crear renderer con verificaciones
        try {
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true 
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                throw new Error('Contenedor de juego no encontrado');
            }
            gameContainer.innerHTML = ''; // Limpiar contenedor
            gameContainer.appendChild(this.renderer.domElement);
            
            debugLog('Renderer creado exitosamente');
        } catch (error) {
            this.showError(`Error al crear renderer: ${error.message}`);
            throw error;
        }

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    createWorld() {
        debugLog('Creando mundo básico...');
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

        // Crear un suelo básico
        for (let x = -5; x < 5; x++) {
            for (let z = -5; z < 5; z++) {
                const block = new THREE.Mesh(geometry, material);
                block.position.set(x, 0, z);
                this.scene.add(block);
            }
        }
    }

    setupControls() {
        debugLog('Configurando controles...');
        try {
            this.controls = new PointerLockControls(this.camera, document.body);
            this.scene.add(this.controls.getObject());
        } catch (error) {
            this.showError(`Error al configurar controles: ${error.message}`);
        }
    }

    setupEventListeners() {
        debugLog('Configurando eventos...');
        const gameContainer = document.getElementById('game-container');
        
        if (gameContainer) {
            gameContainer.addEventListener('click', () => {
                try {
                    this.controls.lock();
                } catch (error) {
                    this.showError(`Error al bloquear cursor: ${error.message}`);
                }
            });
        }

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onWindowResize() {
        debugLog('Ajustando tamaño de ventana...');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        try {
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            this.showError(`Error en renderizado: ${error.message}`);
        }
    }
}

// Iniciar juego cuando se carga la página
window.addEventListener('load', () => {
    debugLog('Página cargada, iniciando BlockWorld...');
    try {
        new BlockWorld();
    } catch (error) {
        console.error('Error al iniciar BlockWorld:', error);
    }
});
