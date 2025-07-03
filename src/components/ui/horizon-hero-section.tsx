import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Lazy load Three.js and GSAP to reduce initial bundle size
const loadThreeJS = () => import('three');
const loadGSAP = () => import('gsap').then(module => ({ gsap: module.gsap, ScrollTrigger: module.ScrollTrigger }));

export const Component = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLButtonElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const totalSections = 3;
  
  const threeRefs = useRef<{
    scene: any | null;
    camera: any | null;
    renderer: any | null;
    composer: any | null;
    stars: any[];
    nebula: any | null;
    mountains: any[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js with lazy loading
  useEffect(() => {
    let mounted = true;

    const initThree = async () => {
      try {
        const THREE = await loadThreeJS();
        if (!mounted) return;

        const { current: refs } = threeRefs;
        
        // Scene setup
        refs.scene = new THREE.Scene();
        refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

        // Camera
        refs.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          2000
        );
        refs.camera.position.z = 100;
        refs.camera.position.y = 20;

        // Renderer
        if (!canvasRef.current) return;
        refs.renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true
        });
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        refs.renderer.toneMappingExposure = 0.5;

        // Create scene elements
        createStarField(THREE);
        createNebula(THREE);
        createMountains(THREE);
        createAtmosphere(THREE);
        getLocation();

        // Start animation
        animate();
        
        setThreeLoaded(true);
        setIsReady(true);
      } catch (error) {
        console.warn('Three.js failed to load, falling back to CSS-only version:', error);
        setIsReady(true);
      }
    };

    const createStarField = (THREE: any) => {
      const { current: refs } = threeRefs;
      const starCount = 2000; // Reduced for better performance
      
      for (let i = 0; i < 2; i++) { // Reduced layers
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = (THREE: any) => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.PlaneGeometry(6000, 3000, 50, 50); // Reduced complexity
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = (THREE: any) => {
      const { current: refs } = threeRefs;
      
      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 30; // Reduced for performance
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height + 
                   Math.sin(i * 0.05) * layer.height * 0.5 +
                   Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = (THREE: any) => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.SphereGeometry(600, 16, 16); // Reduced complexity
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene!.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      refs.animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Update stars
      refs.stars.forEach((starField, i) => {
        if (starField.material.uniforms) {
          starField.material.uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula && refs.nebula.material.uniforms) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      // Smooth camera movement
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.renderer) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Dispose Three.js resources
      refs.stars.forEach(starField => {
        if (starField.geometry) starField.geometry.dispose();
        if (starField.material) starField.material.dispose();
      });

      refs.mountains.forEach(mountain => {
        if (mountain.geometry) mountain.geometry.dispose();
        if (mountain.material) mountain.material.dispose();
      });

      if (refs.nebula) {
        if (refs.nebula.geometry) refs.nebula.geometry.dispose();
        if (refs.nebula.material) refs.nebula.material.dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // GSAP Animations with lazy loading
  useEffect(() => {
    if (!isReady) return;
    
    const initAnimations = async () => {
      try {
        const { gsap, ScrollTrigger } = await loadGSAP();
        gsap.registerPlugin(ScrollTrigger);

        gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current, getStartedRef.current], {
          visibility: 'visible'
        });

        const tl = gsap.timeline();

        if (menuRef.current) {
          tl.from(menuRef.current, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });
        }

        if (getStartedRef.current) {
          tl.from(getStartedRef.current, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          }, "-=0.8");
        }

        if (titleRef.current) {
          tl.from(titleRef.current, {
            y: 200,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
          }, "-=0.5");
        }

        if (subtitleRef.current) {
          const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
          tl.from(subtitleLines, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          }, "-=0.8");
        }

        if (scrollProgressRef.current) {
          tl.from(scrollProgressRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out"
          }, "-=0.5");
        }
      } catch (error) {
        console.warn('GSAP failed to load, using CSS animations fallback');
        // Fallback to CSS animations
        if (menuRef.current) menuRef.current.style.visibility = 'visible';
        if (titleRef.current) titleRef.current.style.visibility = 'visible';
        if (subtitleRef.current) subtitleRef.current.style.visibility = 'visible';
        if (scrollProgressRef.current) scrollProgressRef.current.style.visibility = 'visible';
        if (getStartedRef.current) getStartedRef.current.style.visibility = 'visible';
      }
    };

    initAnimations();
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      
      const sectionProgress = progress * (totalSections - 1);
      const newSection = Math.floor(sectionProgress);
      setCurrentSection(newSection);

      if (!threeLoaded) return;

      const { current: refs } = threeRefs;
      
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 }
      ];
      
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      const localProgress = sectionProgress - newSection;
      
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * localProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * localProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * localProgress;
      
      if (heroContentRef.current) {
        const heroOpacity = newSection === 0 ? 1 - localProgress : 0;
        heroContentRef.current.style.opacity = heroOpacity.toString();
        heroContentRef.current.style.pointerEvents = newSection === 0 ? 'auto' : 'none';
      }
      
      if (sectionsRef.current) {
        const sections = sectionsRef.current.querySelectorAll('.content-section');
        sections.forEach((section, index) => {
          const sectionElement = section as HTMLElement;
          const sectionIndex = index + 1;
          
          if (sectionIndex === newSection) {
            sectionElement.style.opacity = localProgress.toString();
            sectionElement.classList.add('in-view');
          } else if (sectionIndex === newSection + 1) {
            sectionElement.style.opacity = localProgress.toString();
            sectionElement.classList.add('in-view');
          } else {
            sectionElement.style.opacity = '0';
            sectionElement.classList.remove('in-view');
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections, threeLoaded]);

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div ref={containerRef} className="hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />
      
      <button
        ref={getStartedRef}
        onClick={handleGetStarted}
        className="get-started-btn"
        style={{ visibility: 'hidden' }}
      >
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">ROUTINESYNC</div>
      </div>

      <div ref={heroContentRef} className="hero-content cosmos-content">
        <h1 ref={titleRef} className="hero-title" style={{ visibility: 'hidden' }}>
          ROUTINESYNC
        </h1>
        
        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle" style={{ visibility: 'hidden' }}>
          <p className="subtitle-line">
            Transform your daily routines into powerful habits
          </p>
          <p className="subtitle-line">
            and achieve extraordinary results
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button className="px-8 py-4 border-2 border-white/30 rounded-full text-white font-semibold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </div>

      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter">
          {String(currentSection).padStart(2, '0')} / {String(totalSections - 1).padStart(2, '0')}
        </div>
      </div>

      <div ref={sectionsRef} className="scroll-sections">
        {[
          {
            title: 'PRODUCTIVITY',
            subtitle: {
              line1: 'Track your progress with beautiful analytics',
              line2: 'and stay motivated on your journey'
            }
          },
          {
            title: 'SUCCESS',
            subtitle: {
              line1: 'Build lasting habits that lead to success',
              line2: 'one day at a time'
            }
          }
        ].map((section, i) => (
          <section key={i} className="content-section" style={{ opacity: 0 }}>
            <h1 className="hero-title">
              {section.title}
            </h1>
        
            <div className="hero-subtitle cosmos-subtitle">
              <p className="subtitle-line">
                {section.subtitle.line1}
              </p>
              <p className="subtitle-line">
                {section.subtitle.line2}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};