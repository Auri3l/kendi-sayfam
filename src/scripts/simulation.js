// ==========================================================================
// ENGINEERING SIMULATION & METRAJ LAB ENGINE
// ==========================================================================

(function() {
    // --- TAB SWITCHER LOGIC ---
    const tabBtns = document.querySelectorAll('.sim-tab-btn');
    const tabPanels = document.querySelectorAll('.sim-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`)?.classList.add('active');

            if (targetTab === 'fem') updateFEMCalculations();
            else if (targetTab === 'cephe') updateFacadeCalculations();
            else if (targetTab === 'beton') updateConcreteCalculations();
            else if (targetTab === 'duvar') updateMasonryCalculations();
            else if (targetTab === 'sap') updateScreedWetCalculations();
        });
    });

    // --- TAB 1: 3D FEM SIMULATION CODE ---
    const canvas = document.getElementById('facadeCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
        
    const windSlider = document.getElementById('windSlider');
    const solarSlider = document.getElementById('solarSlider');
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightSlider');
    const glassSelect = document.getElementById('glassSelect');
    
    const windVal = document.getElementById('windVal');
    const solarVal = document.getElementById('solarVal');
    const widthVal = document.getElementById('widthVal');
    const heightVal = document.getElementById('heightVal');
    const pressureVal = document.getElementById('pressureVal');
    const deflectionVal = document.getElementById('deflectionVal');
    const heatVal = document.getElementById('heatVal');
    const savingVal = document.getElementById('savingVal');
    
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    
    const hudNode = document.getElementById('hudNode');
    const hudCoord = document.getElementById('hudCoord');
    const hudDeflect = document.getElementById('hudDeflect');
    const hudStress = document.getElementById('hudStress');
    
    const GLASS_PROPS = {
        'single': { name: 'Tek Kat Düz Cam (4mm)', u: 5.8, shgc: 0.82, E: 70000, t: 4, saving: 0 },
        'double': { name: 'Standart Çift Cam (24mm)', u: 2.7, shgc: 0.70, E: 70000, t: 7.56, saving: 45 },
        'double-lowe': { name: 'Çift Cam Low-E (Argon)', u: 1.4, shgc: 0.40, E: 70000, t: 10.0, saving: 72 },
        'triple-lowe': { name: 'Üç Cam Low-E (Argon Dolgulu)', u: 0.8, shgc: 0.32, E: 70000, t: 11.45, saving: 85 }
    };
    
    let particles = [];
    
    class WindParticle3D {
        constructor() {
            this.reset();
            this.x3d = (Math.random() - 0.5) * 4.0;
            this.y3d = (Math.random() - 0.5) * 4.0;
        }
        
        reset() {
            this.x3d = (Math.random() - 0.5) * 3.0;
            this.y3d = (Math.random() - 0.5) * 4.0;
            this.z3d = 2.5 + Math.random() * 2.0;
            this.speed = 0.05 + Math.random() * 0.08;
            this.opacity = 0.15 + Math.random() * 0.35;
        }
        
        update(windSpeed) {
            const speedMultiplier = windSpeed / 60;
            this.z3d -= this.speed * (speedMultiplier > 0.1 ? speedMultiplier : 0.1);
            if (this.z3d < -1.5) {
                this.reset();
            }
        }
    }
    
    const resizeCanvas = () => {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        particles = [];
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new WindParticle3D());
        }
    };
    
    if (canvas) {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    let mouseX = -100;
    let mouseY = -100;
    let isMouseOver = false;
    
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            isMouseOver = true;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isMouseOver = false;
            if (hudNode) hudNode.innerText = "-";
            if (hudCoord) hudCoord.innerText = "-";
            if (hudDeflect) hudDeflect.innerText = "-";
            if (hudStress) hudStress.innerText = "-";
        });
    }
        
    const pitch = 0.45;
    const yaw = -0.55;
    const scale3d = 95;
    
    function project3D(x3d, y3d, z3d) {
        const r = canvas ? canvas.getBoundingClientRect() : {width:400,height:300};
        const cX = r.width * 0.48;
        const cY = r.height * 0.52;
        const rx = x3d * Math.cos(yaw) - z3d * Math.sin(yaw);
        const rz = x3d * Math.sin(yaw) + z3d * Math.cos(yaw);
        const ry = y3d;
        const px = rx;
        const py = ry * Math.cos(pitch) - rz * Math.sin(pitch);
        const pz = ry * Math.sin(pitch) + rz * Math.cos(pitch);
        return { x: cX + px * scale3d, y: cY - py * scale3d, depth: pz };
    }

    const drawLoop = () => {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        
        if (w === 0 || h === 0) {
            requestAnimationFrame(drawLoop);
            return;
        }

        ctx.clearRect(0, 0, w, h);
        
        const windSpeed = windSlider ? parseFloat(windSlider.value) : 90;
        const solarRad = solarSlider ? parseFloat(solarSlider.value) : 400;
        const glassWidth = widthSlider ? parseFloat(widthSlider.value) : 1.5;
        const glassHeight = heightSlider ? parseFloat(heightSlider.value) : 3.0;
        const glassType = glassSelect ? glassSelect.value : 'double-lowe';
        const props = GLASS_PROPS[glassType] || GLASS_PROPS['double-lowe'];
        
        const windSpeedMS = windSpeed / 3.6;
        const pressure = 0.613 * windSpeedMS * windSpeedMS;
        
        const E_Pa = props.E * 1e6;
        const t_m = props.t / 1000;
        const nu = 0.22;
        const D = (E_Pa * Math.pow(t_m, 3)) / (12 * (1 - nu * nu));
        
        const b_m = Math.min(glassWidth, glassHeight);
        const a_m = Math.max(glassWidth, glassHeight);
        
        const deflectionM = (5 * pressure * Math.pow(b_m, 4)) / (384 * D) * (1 / (1 + Math.pow(b_m / a_m, 4)));
        const realDeflectionMM = deflectionM * 1000;
        const maxDeflectionPixels = Math.min(80, realDeflectionMM * 4.5);
        
        const netHeatGain = (solarRad * props.shgc) + (20 * props.u);
        
        if (windVal) windVal.innerText = `${windSpeed} km/h`;
        if (solarVal) solarVal.innerText = `${solarRad} W/m²`;
        if (widthVal) widthVal.innerText = `${glassWidth.toFixed(2)} m`;
        if (heightVal) heightVal.innerText = `${glassHeight.toFixed(2)} m`;
        if (pressureVal) pressureVal.innerText = `${Math.round(pressure)}`;
        if (deflectionVal) deflectionVal.innerText = realDeflectionMM.toFixed(2);
        if (heatVal) heatVal.innerText = Math.round(netHeatGain);
        if (savingVal) savingVal.innerText = `${props.saving}%`;
        
        const limitSpan = (b_m * 1000) / 300;
        const dangerLimit = (b_m * 1000) / 200;
        
        if (statusBadge && statusText) {
            statusBadge.className = 'sim-status-badge';
            if (realDeflectionMM <= limitSpan) {
                statusBadge.classList.add('status-safe');
                statusText.innerText = `Statik Limit: GÜVENLİ (Limit L/300: ${limitSpan.toFixed(1)} mm)`;
            } else if (realDeflectionMM <= dangerLimit) {
                statusBadge.classList.add('status-warning');
                statusText.innerText = `UYARI: SEHİM LİMİTİ AŞILDI (L/300: ${limitSpan.toFixed(1)} mm)`;
            } else {
                statusBadge.classList.add('status-danger');
                statusText.innerText = `TEHLİKE: YAPISAL KAPASİTE YETERSİZ (L/200: ${dangerLimit.toFixed(1)} mm)`;
            }
        }
        
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        particles.forEach(p => {
            p.update(windSpeed);
            const pt1 = project3D(p.x3d, p.y3d, p.z3d);
            const pt2 = project3D(p.x3d, p.y3d, p.z3d + 0.15);
            if (pt1.x >= 0 && pt1.x <= w && pt1.y >= 0 && pt1.y <= h) {
                ctx.strokeStyle = `rgba(156, 163, 175, ${p.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pt1.x, pt1.y);
                ctx.lineTo(pt2.x, pt2.y);
                ctx.stroke();
            }
        });
        
        ctx.fillStyle = 'rgba(47, 50, 58, 0.45)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        
        const slabW = glassWidth + 0.6;
        const slabD = 0.8;
        const halfH = glassHeight / 2;
        
        const bSlabNodes = [
            project3D(-slabW/2, -halfH, -slabD),
            project3D(slabW/2, -halfH, -slabD),
            project3D(slabW/2, -halfH, 0),
            project3D(-slabW/2, -halfH, 0),
            project3D(-slabW/2, -halfH - 0.25, -slabD),
            project3D(slabW/2, -halfH - 0.25, -slabD),
            project3D(slabW/2, -halfH - 0.25, 0),
            project3D(-slabW/2, -halfH - 0.25, 0)
        ];
        
        ctx.beginPath();
        ctx.moveTo(bSlabNodes[4].x, bSlabNodes[4].y);
        ctx.lineTo(bSlabNodes[5].x, bSlabNodes[5].y);
        ctx.lineTo(bSlabNodes[6].x, bSlabNodes[6].y);
        ctx.lineTo(bSlabNodes[7].x, bSlabNodes[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(bSlabNodes[7].x, bSlabNodes[7].y);
        ctx.lineTo(bSlabNodes[6].x, bSlabNodes[6].y);
        ctx.lineTo(bSlabNodes[2].x, bSlabNodes[2].y);
        ctx.lineTo(bSlabNodes[3].x, bSlabNodes[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        const tSlabNodes = [
            project3D(-slabW/2, halfH + 0.25, -slabD),
            project3D(slabW/2, halfH + 0.25, -slabD),
            project3D(slabW/2, halfH + 0.25, 0),
            project3D(-slabW/2, halfH + 0.25, 0),
            project3D(-slabW/2, halfH, -slabD),
            project3D(slabW/2, halfH, -slabD),
            project3D(slabW/2, halfH, 0),
            project3D(-slabW/2, halfH, 0)
        ];
        
        ctx.beginPath();
        ctx.moveTo(tSlabNodes[4].x, tSlabNodes[4].y);
        ctx.lineTo(tSlabNodes[5].x, tSlabNodes[5].y);
        ctx.lineTo(tSlabNodes[6].x, tSlabNodes[6].y);
        ctx.lineTo(tSlabNodes[7].x, tSlabNodes[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(tSlabNodes[7].x, tSlabNodes[7].y);
        ctx.lineTo(tSlabNodes[6].x, tSlabNodes[6].y);
        ctx.lineTo(tSlabNodes[2].x, tSlabNodes[2].y);
        ctx.lineTo(tSlabNodes[3].x, tSlabNodes[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        const gridDivs = 10;
        const meshNodes = [];
        let closestNode = null;
        let minDist = 99999;
        
        for (let i = 0; i <= gridDivs; i++) {
            meshNodes[i] = [];
            const u = i / gridDivs;
            const x3d = (u - 0.5) * glassWidth;
            for (let j = 0; j <= gridDivs; j++) {
                const v = j / gridDivs;
                const y3d = (v - 0.5) * glassHeight;
                const nodeDeflectRatio = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
                const nodeDeflectMM = nodeDeflectRatio * realDeflectionMM;
                const z3dOffset = -(nodeDeflectRatio * maxDeflectionPixels) / scale3d;
                const pt2d = project3D(x3d, y3d, z3dOffset);
                const nodeStress = Math.round((windSpeed / 240) * 115 * nodeDeflectRatio);
                
                meshNodes[i][j] = {
                    px: pt2d.x,
                    py: pt2d.y,
                    stress: nodeStress,
                    deflect: nodeDeflectMM,
                    u, v, x3d, y3d
                };
                
                if (isMouseOver) {
                    const dist = Math.hypot(pt2d.x - mouseX, pt2d.y - mouseY);
                    if (dist < minDist && dist < 22) {
                        minDist = dist;
                        closestNode = { i, j, ...meshNodes[i][j] };
                    }
                }
            }
        }
        
        for (let i = 0; i < gridDivs; i++) {
            for (let j = 0; j < gridDivs; j++) {
                const n00 = meshNodes[i][j];
                const n10 = meshNodes[i+1][j];
                const n11 = meshNodes[i+1][j+1];
                const n01 = meshNodes[i][j+1];
                
                const avgRatio = (n00.deflect + n10.deflect + n11.deflect + n01.deflect) / (4 * (realDeflectionMM || 1));
                const r = Math.min(255, Math.floor(255 * avgRatio * 2));
                const g = Math.min(255, Math.floor(255 * (1 - avgRatio) * 1.5));
                const b = 50;
                
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.15 + avgRatio * 0.35})`;
                ctx.beginPath();
                ctx.moveTo(n00.px, n00.py);
                ctx.lineTo(n10.px, n10.py);
                ctx.lineTo(n11.px, n11.py);
                ctx.lineTo(n01.px, n01.py);
                ctx.closePath();
                ctx.fill();
                
                ctx.strokeStyle = realDeflectionMM > dangerLimit ? 'rgba(231, 76, 60, 0.15)' : 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
        
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(meshNodes[0][0].px, meshNodes[0][0].py);
        for (let j = 1; j <= gridDivs; j++) ctx.lineTo(meshNodes[0][j].px, meshNodes[0][j].py);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(meshNodes[gridDivs][0].px, meshNodes[gridDivs][0].py);
        for (let j = 1; j <= gridDivs; j++) ctx.lineTo(meshNodes[gridDivs][j].px, meshNodes[gridDivs][j].py);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(meshNodes[0][gridDivs].px, meshNodes[0][gridDivs].py);
        for (let i = 1; i <= gridDivs; i++) ctx.lineTo(meshNodes[i][gridDivs].px, meshNodes[i][gridDivs].py);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(meshNodes[0][0].px, meshNodes[0][0].py);
        for (let i = 1; i <= gridDivs; i++) ctx.lineTo(meshNodes[i][0].px, meshNodes[i][0].py);
        ctx.stroke();
        
        if (solarRad > 10) {
            const hitNode = meshNodes[Math.floor(gridDivs/2)][Math.floor(gridDivs/2)];
            const sunSourcePt = project3D(-glassWidth*1.5, glassHeight*1.5, 2.0);
            
            ctx.lineWidth = 2.0;
            ctx.strokeStyle = `rgba(212, 163, 115, ${0.25 + (solarRad/1500)})`;
            ctx.shadowColor = '#d4a373';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(sunSourcePt.x, sunSourcePt.y);
            ctx.lineTo(hitNode.px, hitNode.py);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            const reflectPt = project3D(-glassWidth*2.5, glassHeight*1.0, 3.5);
            ctx.strokeStyle = `rgba(212, 163, 115, ${0.1 + (solarRad/3000)})`;
            ctx.beginPath();
            ctx.moveTo(hitNode.px, hitNode.py);
            ctx.lineTo(reflectPt.x, reflectPt.y);
            ctx.stroke();
            
            const transmitPt = project3D(glassWidth*0.8, -glassHeight*0.6, -1.5);
            ctx.strokeStyle = `rgba(255, 100, 100, ${0.15 * props.shgc})`;
            ctx.beginPath();
            ctx.moveTo(hitNode.px, hitNode.py);
            ctx.lineTo(transmitPt.x, transmitPt.y);
            ctx.stroke();
        }
        
        if (closestNode) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(closestNode.px, closestNode.py, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#1d1f24';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            if (hudNode) hudNode.innerText = `#${closestNode.i}_${closestNode.j}`;
            if (hudCoord) hudCoord.innerText = `x: ${closestNode.x3d.toFixed(2)}m, y: ${closestNode.y3d.toFixed(2)}m`;
            if (hudDeflect) hudDeflect.innerText = `${closestNode.deflect.toFixed(2)} mm`;
            if (hudStress) hudStress.innerText = `${closestNode.stress} MPa`;
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(closestNode.px, 0);
            ctx.lineTo(closestNode.px, h);
            ctx.moveTo(0, closestNode.py);
            ctx.lineTo(w, closestNode.py);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.fillText(`GEOMETRİ: ${glassWidth.toFixed(2)}m x ${glassHeight.toFixed(2)}m`, 20, 20);
        ctx.fillText(`EN/BOY ORANI: 1 : ${(glassHeight/glassWidth).toFixed(1)}`, 20, 32);
        
        requestAnimationFrame(drawLoop);
    };

    if (canvas) {
        drawLoop();
    }

    function updateFEMCalculations() {
        if (!windSlider || !solarSlider || !widthSlider || !heightSlider || !glassSelect) return;
        
        const windSpeed = parseFloat(windSlider.value) || 90;
        const solarRad = parseFloat(solarSlider.value) || 400;
        const glassWidth = parseFloat(widthSlider.value) || 1.5;
        const glassHeight = parseFloat(heightSlider.value) || 3.0;
        const glassType = glassSelect.value || 'double-lowe';
        const props = GLASS_PROPS[glassType] || GLASS_PROPS['double-lowe'];
        
        const windSpeedMS = windSpeed / 3.6;
        const pressure = 0.613 * windSpeedMS * windSpeedMS;
        
        const E_Pa = props.E * 1e6;
        const t_m = props.t / 1000;
        const nu = 0.22;
        const D = (E_Pa * Math.pow(t_m, 3)) / (12 * (1 - nu * nu));
        
        const b_m = Math.min(glassWidth, glassHeight);
        const a_m = Math.max(glassWidth, glassHeight);
        
        const deflectionM = (5 * pressure * Math.pow(b_m, 4)) / (384 * D) * (1 / (1 + Math.pow(b_m / a_m, 4)));
        const realDeflectionMM = deflectionM * 1000;
        
        const netHeatGain = (solarRad * props.shgc) + (20 * props.u);
        
        if (windVal) windVal.innerText = `${windSpeed} km/h`;
        if (solarVal) solarVal.innerText = `${solarRad} W/m²`;
        if (widthVal) widthVal.innerText = `${glassWidth.toFixed(2)} m`;
        if (heightVal) heightVal.innerText = `${glassHeight.toFixed(2)} m`;
        if (pressureVal) pressureVal.innerText = `${Math.round(pressure)}`;
        if (deflectionVal) deflectionVal.innerText = realDeflectionMM.toFixed(2);
        if (heatVal) heatVal.innerText = Math.round(netHeatGain);
        if (savingVal) savingVal.innerText = `${props.saving}%`;
        
        const limitSpan = (b_m * 1000) / 300;
        const dangerLimit = (b_m * 1000) / 200;
        
        if (statusBadge && statusText) {
            statusBadge.className = 'sim-status-badge';
            if (realDeflectionMM <= limitSpan) {
                statusBadge.classList.add('status-safe');
                statusText.innerText = `Statik Limit: GÜVENLİ (Limit L/300: ${limitSpan.toFixed(1)} mm)`;
            } else if (realDeflectionMM <= dangerLimit) {
                statusBadge.classList.add('status-warning');
                statusText.innerText = `UYARI: SEHİM LİMİTİ AŞILDI (L/300: ${limitSpan.toFixed(1)} mm)`;
            } else {
                statusBadge.classList.add('status-danger');
                statusText.innerText = `TEHLİKE: YAPISAL KAPASİTE YETERSİZ (L/200: ${dangerLimit.toFixed(1)} mm)`;
            }
        }
    }

    [windSlider, solarSlider, widthSlider, heightSlider, glassSelect].filter(Boolean).forEach(el => {
        el.addEventListener('input', updateFEMCalculations);
        el.addEventListener('change', updateFEMCalculations);
    });

    // --- TAB 2: FACADE QUANTITY CALCULATIONS (10 METRICS) ---
    const inpFacWidth = document.getElementById('inpFacWidth');
    const inpFacHeight = document.getElementById('inpFacHeight');
    const inpPanWidth = document.getElementById('inpPanWidth');
    const inpPanHeight = document.getElementById('inpPanHeight');
    const inpFloorCount = document.getElementById('inpFloorCount');
    const inpMullionWeight = document.getElementById('inpMullionWeight');
    const inpTransomWeight = document.getElementById('inpTransomWeight');
    const inpGlassThk = document.getElementById('inpGlassThk');

    function updateFacadeCalculations() {
        if (!inpFacWidth || !inpFacHeight || !inpPanWidth || !inpPanHeight) return;

        const fw = parseFloat(inpFacWidth.value) || 30;
        const fh = parseFloat(inpFacHeight.value) || 45;
        const pw = parseFloat(inpPanWidth.value) || 1.5;
        const ph = parseFloat(inpPanHeight.value) || 3.5;
        const floors = parseFloat(inpFloorCount ? inpFloorCount.value : '12') || 1;
        const mw = parseFloat(inpMullionWeight ? inpMullionWeight.value : '4.2') || 1;
        const tw = parseFloat(inpTransomWeight ? inpTransomWeight.value : '3.1') || 1;
        const glassThkVal = parseFloat(inpGlassThk ? inpGlassThk.value : '8') || 8;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

        setEl('inpFacWidthVal', `${fw} m`);
        setEl('inpFacHeightVal', `${fh} m`);
        setEl('inpPanWidthVal', `${pw.toFixed(2)} m`);
        setEl('inpPanHeightVal', `${ph.toFixed(2)} m`);

        // 1. Total Panels
        const cols = Math.ceil(fw / pw);
        const rows = Math.ceil(fh / ph);
        const panCount = cols * rows;
        setEl('outPanCount', panCount.toLocaleString('tr-TR'));

        // 2. Net Glass Area
        const netGlassArea = panCount * Math.max(0.1, (pw - 0.06)) * Math.max(0.1, (ph - 0.06));
        setEl('outGlassArea', netGlassArea.toFixed(1).toLocaleString('tr-TR'));

        // 3. Glass Weight
        const glassWeight = netGlassArea * glassThkVal * 2.5;
        setEl('outGlassWeight', Math.round(glassWeight).toLocaleString('tr-TR'));

        // 4. Mullion length
        const mullionCount = cols + 1;
        const mullionLen = mullionCount * fh;
        setEl('outMullionLen', Math.round(mullionLen).toLocaleString('tr-TR'));

        // 5. Transom length
        const transomLen = panCount * pw;
        setEl('outTransomLen', Math.round(transomLen).toLocaleString('tr-TR'));

        // 6. Aluminum weight
        const aluWeight = (mullionLen * mw) + (transomLen * tw);
        setEl('outAluWeight', Math.round(aluWeight).toLocaleString('tr-TR'));

        // 7. Anchors
        const anchorCount = mullionCount * (floors + 1) * 2;
        setEl('outAnchorCount', anchorCount.toLocaleString('tr-TR'));

        // 8. T-Connectors
        const tConnCount = panCount * 2;
        setEl('outTConnCount', tConnCount.toLocaleString('tr-TR'));

        // 9. EPDM Fitil
        const epdmLen = panCount * (2 * pw + 2 * ph) * 2;
        setEl('outEPDMLen', Math.round(epdmLen).toLocaleString('tr-TR'));

        // 10. Silicone sausage
        const silVolLtr = panCount * (2 * pw + 2 * ph) * 0.02;
        const silCount = Math.ceil(silVolLtr / 0.60);
        setEl('outSiliconeCount', silCount.toLocaleString('tr-TR'));
    }

    [inpFacWidth, inpFacHeight, inpPanWidth, inpPanHeight, inpFloorCount, inpMullionWeight, inpTransomWeight, inpGlassThk].filter(Boolean).forEach(el => {
        el.addEventListener('input', updateFacadeCalculations);
        el.addEventListener('change', updateFacadeCalculations);
    });

    // --- TAB 3: CONCRETE & FORMWORK CALCULATIONS (10 METRICS) ---
    const inpSlabLen = document.getElementById('inpSlabLen');
    const inpSlabWidth = document.getElementById('inpSlabWidth');
    const inpSlabThk = document.getElementById('inpSlabThk');
    const inpColCount = document.getElementById('inpColCount');
    const inpColDim = document.getElementById('inpColDim');
    const inpColHeight = document.getElementById('inpColHeight');
    const inpShearWallCount = document.getElementById('inpShearWallCount');
    const inpShearWallLen = document.getElementById('inpShearWallLen');
    const inpShearWallThk = document.getElementById('inpShearWallThk');
    const inpRebarRatio = document.getElementById('inpRebarRatio');

    function updateConcreteCalculations() {
        if (!inpSlabLen || !inpSlabWidth || !inpSlabThk) return;

        const sl = parseFloat(inpSlabLen.value) || 25;
        const sw = parseFloat(inpSlabWidth.value) || 15;
        const st = parseFloat(inpSlabThk.value) || 0.25;
        const colCount = parseFloat(inpColCount ? inpColCount.value : '16') || 0;
        const colDim = parseFloat(inpColDim ? inpColDim.value : '0.60') || 0.6;
        const colH = parseFloat(inpColHeight ? inpColHeight.value : '3.20') || 0;
        const wallCount = parseFloat(inpShearWallCount ? inpShearWallCount.value : '4') || 0;
        const wallLen = parseFloat(inpShearWallLen ? inpShearWallLen.value : '4.5') || 0;
        const wallThk = parseFloat(inpShearWallThk ? inpShearWallThk.value : '0.30') || 0;
        const rebRatio = parseFloat(inpRebarRatio ? inpRebarRatio.value : '110') || 0;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

        setEl('inpSlabLenVal', `${sl} m`);
        setEl('inpSlabWidthVal', `${sw} m`);
        setEl('inpSlabThkVal', `${st.toFixed(2)} m`);
        setEl('inpColDimVal', `${colDim.toFixed(2)} m`);

        // 1. Slab concrete volume
        const slabConc = sl * sw * st;
        setEl('outSlabConcrete', slabConc.toFixed(1).toLocaleString('tr-TR'));

        // 2. Slab formwork
        const slabForm = sl * sw;
        setEl('outSlabForm', slabForm.toFixed(1).toLocaleString('tr-TR'));

        // 3. Column concrete
        const colConc = colCount * colDim * colDim * colH;
        setEl('outColConcrete', colConc.toFixed(1).toLocaleString('tr-TR'));

        // 4. Column formwork
        const colForm = colCount * 4 * colDim * colH;
        setEl('outColForm', colForm.toFixed(1).toLocaleString('tr-TR'));

        // 5. Shear wall concrete
        const wallConc = wallCount * wallLen * wallThk * colH;
        setEl('outWallConcrete', wallConc.toFixed(1).toLocaleString('tr-TR'));

        // 6. Shear wall formwork
        const wallForm = wallCount * 2 * wallLen * colH;
        setEl('outWallForm', wallForm.toFixed(1).toLocaleString('tr-TR'));

        // 7. Total Concrete Volume
        const totalConc = slabConc + colConc + wallConc;
        setEl('outTotalConcrete', totalConc.toFixed(1).toLocaleString('tr-TR'));

        // 8. Total Concrete Weight
        const totalConcWeight = totalConc * 2.5;
        setEl('outTotalConcreteWeight', totalConcWeight.toFixed(1).toLocaleString('tr-TR'));

        // 9. Rebar weight
        const rebarWeight = (totalConc * rebRatio) / 1000;
        setEl('outTotalRebarWeight', rebarWeight.toFixed(2).toLocaleString('tr-TR'));

        // 10. Tie wire
        const tieWire = rebarWeight * 1.5;
        setEl('outTieWire', tieWire.toFixed(1).toLocaleString('tr-TR'));
    }

    [inpSlabLen, inpSlabWidth, inpSlabThk, inpColCount, inpColDim, inpColHeight, inpShearWallCount, inpShearWallLen, inpShearWallThk, inpRebarRatio].filter(Boolean).forEach(el => {
        el.addEventListener('input', updateConcreteCalculations);
        el.addEventListener('change', updateConcreteCalculations);
    });

    // --- TAB 4: MASONRY & PLASTER CALCULATIONS (11 METRICS) ---
    const inpWallLen = document.getElementById('inpWallLen');
    const inpWallHeight = document.getElementById('inpWallHeight');
    const inpWallType = document.getElementById('inpWallType');
    const inpOpeningsCount = document.getElementById('inpOpeningsCount');
    const inpPlasterThk = document.getElementById('inpPlasterThk');

    function updateMasonryCalculations() {
        if (!inpWallLen || !inpWallHeight || !inpWallType) return;

        const wl = parseFloat(inpWallLen.value) || 20;
        const wh = parseFloat(inpWallHeight.value) || 3.0;
        const wt = inpWallType.value || 'brick';
        const openings = parseFloat(inpOpeningsCount ? inpOpeningsCount.value : '2') || 0;
        const plasT = (parseFloat(inpPlasterThk ? inpPlasterThk.value : '2.0') || 2) / 100;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

        setEl('inpWallLenVal', `${wl} m`);
        setEl('inpWallHeightVal', `${wh.toFixed(1)} m`);
        setEl('inpPlasterThkVal', `${(plasT * 100).toFixed(1)} cm`);

        const openingsArea = openings * 2.0;
        const rawArea = wl * wh;
        const wallArea = Math.max(2, rawArea - openingsArea);
        setEl('outWallArea', wallArea.toFixed(1).toLocaleString('tr-TR'));

        let blockArea = 0.0256;
        let wThickness = 0.19;
        if (wt === 'brick') {
            blockArea = 0.19 * 0.135;
            wThickness = 0.19;
        } else if (wt === 'ytong') {
            blockArea = 0.60 * 0.25;
            wThickness = 0.15;
        } else if (wt === 'bims') {
            blockArea = 0.39 * 0.19;
            wThickness = 0.19;
        }

        const wallVol = wallArea * wThickness;
        setEl('outWallVolume', wallVol.toFixed(2).toLocaleString('tr-TR'));

        const blocks = Math.ceil((wallArea / blockArea) * 1.05);
        setEl('outBlockCount', blocks.toLocaleString('tr-TR'));

        const mortarVol = wallVol * 0.22;
        setEl('outMortarVol', mortarVol.toFixed(2).toLocaleString('tr-TR'));

        const mortarCement = (mortarVol * 250) / 25;
        setEl('outMortarCement', Math.ceil(mortarCement).toLocaleString('tr-TR'));

        const mortarSand = mortarVol * 0.9;
        setEl('outMortarSand', mortarSand.toFixed(2).toLocaleString('tr-TR'));

        const lintelConc = openings * 0.05;
        setEl('outLintelConcrete', lintelConc.toFixed(2).toLocaleString('tr-TR'));

        const plasterVol = wallArea * 2 * plasT;
        setEl('outPlasterVol', plasterVol.toFixed(2).toLocaleString('tr-TR'));

        const plasterCement = (plasterVol * 300) / 25;
        setEl('outPlasterCement', Math.ceil(plasterCement).toLocaleString('tr-TR'));

        const plasterSand = plasterVol * 0.95;
        setEl('outPlasterSand', plasterSand.toFixed(2).toLocaleString('tr-TR'));

        const plasterBead = (openings * 5.0) + (wl * 0.25 * wh);
        setEl('outPlasterBead', Math.round(plasterBead).toLocaleString('tr-TR'));
    }

    [inpWallLen, inpWallHeight, inpWallType, inpOpeningsCount, inpPlasterThk].filter(Boolean).forEach(el => {
        el.addEventListener('input', updateMasonryCalculations);
        el.addEventListener('change', updateMasonryCalculations);
    });

    // --- TAB 5: SCREED, WATERPROOFING & TILES (19 METRICS) ---
    const inpWetArea = document.getElementById('inpWetArea');
    const inpWetPerimeter = document.getElementById('inpWetPerimeter');
    const inpScreedThk = document.getElementById('inpScreedThk');
    const inpScreedGrade = document.getElementById('inpScreedGrade');
    const inpIsoHeight = document.getElementById('inpIsoHeight');
    const inpTileSize = document.getElementById('inpTileSize');
    const inpIsoCoats = document.getElementById('inpIsoCoats');
    const inpTileWaste = document.getElementById('inpTileWaste');

    function updateScreedWetCalculations() {
        if (!inpWetArea || !inpWetPerimeter || !inpScreedThk) return;

        const wa = parseFloat(inpWetArea.value) || 40;
        const wp = parseFloat(inpWetPerimeter.value) || 28;
        const stVal = (parseFloat(inpScreedThk.value) || 5) / 100;
        const scGrade = parseFloat(inpScreedGrade ? inpScreedGrade.value : '350') || 350;
        const isoH = parseFloat(inpIsoHeight ? inpIsoHeight.value : '1.80') || 1.8;
        const tileSize = inpTileSize ? inpTileSize.value : '6060';
        const coats = parseFloat(inpIsoCoats ? inpIsoCoats.value : '2') || 2;
        const waste = parseFloat(inpTileWaste ? inpTileWaste.value : '8') || 8;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };

        setEl('inpWetAreaVal', `${wa} m²`);
        setEl('inpWetPerimeterVal', `${wp} m`);
        setEl('inpScreedThkVal', `${(stVal * 100).toFixed(1)} cm`);
        setEl('inpIsoHeightVal', `${isoH.toFixed(2)} m`);

        const screedVol = wa * stVal;
        setEl('outScreedVol', screedVol.toFixed(2).toLocaleString('tr-TR'));

        const screedCement = (screedVol * scGrade) / 25;
        setEl('outScreedCement', Math.ceil(screedCement).toLocaleString('tr-TR'));

        const screedSand = screedVol * 1.6;
        setEl('outScreedSand', screedSand.toFixed(1).toLocaleString('tr-TR'));

        const screedWater = (screedVol * scGrade) * 0.5;
        setEl('outScreedWater', Math.round(screedWater).toLocaleString('tr-TR'));

        const screedFiber = screedVol * 0.9;
        setEl('outScreedFiber', screedFiber.toFixed(2).toLocaleString('tr-TR'));

        const screedAdditive = (screedVol * scGrade) * 0.012;
        setEl('outScreedAdditive', screedAdditive.toFixed(1).toLocaleString('tr-TR'));

        const screedMesh = wa * 1.10;
        setEl('outScreedMesh', screedMesh.toFixed(1).toLocaleString('tr-TR'));

        const screedJointTape = wp * 1.05;
        setEl('outScreedJointTape', screedJointTape.toFixed(1).toLocaleString('tr-TR'));

        const waterproofArea = wa + (wp * isoH);
        setEl('outWaterproofArea', waterproofArea.toFixed(1).toLocaleString('tr-TR'));

        const totalWaterproofWeight = waterproofArea * 1.2 * coats;
        const waterproofLiquid = totalWaterproofWeight * 0.33;
        setEl('outWaterproofLiquid', waterproofLiquid.toFixed(1).toLocaleString('tr-TR'));

        const waterproofPowder = totalWaterproofWeight * 0.67;
        setEl('outWaterproofPowder', waterproofPowder.toFixed(1).toLocaleString('tr-TR'));

        const waterproofMesh = wp * 0.2;
        setEl('outWaterproofMesh', waterproofMesh.toFixed(1).toLocaleString('tr-TR'));

        const waterproofBand = wp * 1.05;
        setEl('outWaterproofBand', waterproofBand.toFixed(1).toLocaleString('tr-TR'));

        const primerW = (wa + wp * isoH) * 0.20;
        setEl('outPrimerWeight', primerW.toFixed(1).toLocaleString('tr-TR'));

        const tilesArea = (wa + wp * isoH) * (1 + waste / 100);
        setEl('outTileArea', tilesArea.toFixed(1).toLocaleString('tr-TR'));

        const tileBoxes = Math.ceil(tilesArea / 1.44);
        setEl('outTileBoxes', tileBoxes.toLocaleString('tr-TR'));

        const tileAdhesive = (tilesArea * 5) / 25;
        setEl('outTileAdhesive', Math.ceil(tileAdhesive).toLocaleString('tr-TR'));

        const tileGrout = (tilesArea * 0.5) / 5;
        setEl('outTileGrout', Math.ceil(tileGrout).toLocaleString('tr-TR'));

        let tSizeM2 = 0.36;
        if (tileSize === '3060') tSizeM2 = 0.3 * 0.6;
        else if (tileSize === '6012') tSizeM2 = 0.6 * 1.2;
        const tileCount = tilesArea / tSizeM2;
        const tileSpacers = Math.ceil(tileCount * 4);
        setEl('outTileSpacers', tileSpacers.toLocaleString('tr-TR'));
    }

    [inpWetArea, inpWetPerimeter, inpScreedThk, inpScreedGrade, inpIsoHeight, inpTileSize, inpIsoCoats, inpTileWaste].filter(Boolean).forEach(el => {
        el.addEventListener('input', updateScreedWetCalculations);
        el.addEventListener('change', updateScreedWetCalculations);
    });

    // Button Click Listeners with feedback
    function flashTableUpdate(panelId, toastTitle, toastMsg) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const cells = panel.querySelectorAll('td[id^="out"], .sim-stat-value');
            cells.forEach(cell => {
                cell.classList.remove('table-updated');
                void cell.offsetWidth; // trigger reflow
                cell.classList.add('table-updated');
            });
        }
        if (typeof window.showToast === 'function') {
            window.showToast(toastTitle, toastMsg);
        }
    }

    document.getElementById('btnCalcFEM')?.addEventListener('click', () => {
        updateFEMCalculations();
        flashTableUpdate('tab-fem', 'FEM Analizi Güncellendi', '3D Sehim ve rüzgar gerilmeleri yeniden hesaplandı.');
    });

    document.getElementById('btnCalcCephe')?.addEventListener('click', () => {
        updateFacadeCalculations();
        flashTableUpdate('tab-cephe', 'Cephe Metrajı Hesaplandı', '10 farklı profil, cam ve fitil kalemi güncellendi.');
    });

    document.getElementById('btnCalcBeton')?.addEventListener('click', () => {
        updateConcreteCalculations();
        flashTableUpdate('tab-beton', 'Beton & Kalıp Metrajı Hesaplandı', 'Beton hacimleri, kalıp alanları ve donatı tonajı güncellendi.');
    });

    document.getElementById('btnCalcDuvar')?.addEventListener('click', () => {
        updateMasonryCalculations();
        flashTableUpdate('tab-duvar', 'Duvar & Sıva Metrajı Hesaplandı', 'Blok adedi, örgü ve sıva harç metrajları hesaplandı.');
    });

    document.getElementById('btnCalcSap')?.addEventListener('click', () => {
        updateScreedWetCalculations();
        flashTableUpdate('tab-sap', 'Şap & Seramik Metrajı Hesaplandı', '19 adet şap, izolasyon ve seramik malzemesi hesaplandı.');
    });

    // Export Table to CSV & Print Listeners
    function exportTableToCSV(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) return;

        let csvContent = "\uFEFF"; // UTF-8 BOM for Turkish character support in Excel
        const rows = table.querySelectorAll("tr");

        rows.forEach((row) => {
            const cols = row.querySelectorAll("th, td");
            const rowData = [];
            cols.forEach((col) => {
                let text = col.innerText.replace(/"/g, '""').trim();
                rowData.push(`"${text}"`);
            });
            csvContent += rowData.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof window.showToast === 'function') {
            window.showToast("Excel İndirildi", `${filename}.csv bilgisayarınıza aktarıldı.`);
        }
    }

    document.querySelectorAll('.btn-export-csv').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                const filename = btn.getAttribute('data-filename') || 'Metraj_Cetveli';
                exportTableToCSV(targetId, filename);
            }
        });
    });

    document.querySelectorAll('.btn-print-pdf').forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    // Run calculations immediately on script load
    function initAllTakeoffs() {
        updateFEMCalculations();
        updateFacadeCalculations();
        updateConcreteCalculations();
        updateMasonryCalculations();
        updateScreedWetCalculations();
    }

    initAllTakeoffs();
    window.addEventListener('load', initAllTakeoffs);
})();
