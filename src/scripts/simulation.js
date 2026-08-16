// ==========================================================================
// ENGINEERING SIMULATION & METRAJ LAB ENGINE
// ==========================================================================

(function() {
    // --- CATEGORY & TAB SWITCHER LOGIC ---
    const catBtns = document.querySelectorAll('.sim-cat-btn');
    const groupTools = document.getElementById('group-tools');
    const groupMetraj = document.getElementById('group-metraj');
    const tabBtns = document.querySelectorAll('.sim-tab-btn');

    function switchTab(targetTab) {
        tabBtns.forEach(b => {
            const isMatch = b.getAttribute('data-tab') === targetTab;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        const allPanels = document.querySelectorAll('.sim-tab-panel, .sim-tab-pane');
        allPanels.forEach(p => p.classList.remove('active'));

        const activePanel = document.getElementById(`tab-${targetTab}`);
        if (activePanel) activePanel.classList.add('active');

        if (targetTab === 'fem') {
            resizeCanvas();
            updateFEMCalculations();
        }
        else if (targetTab === 'radar') updateRadarDecisions();
        else if (targetTab === 'karsilastirma') renderComparison(currentCompareCat);
        else if (targetTab === 'donati-hesap') { updateRebarCalculator(); updateProfileCalculator(); runRebarOptimizer(); }
        else if (targetTab === 'cephe') updateFacadeCalculations();
        else if (targetTab === 'beton') updateConcreteCalculations();
        else if (targetTab === 'duvar') updateMasonryCalculations();
        else if (targetTab === 'sap') updateScreedWetCalculations();
    }

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (cat === 'tools') {
                if (groupTools) groupTools.style.display = 'flex';
                if (groupMetraj) groupMetraj.style.display = 'none';
                switchTab('fem');
            } else if (cat === 'metraj') {
                if (groupTools) groupTools.style.display = 'none';
                if (groupMetraj) groupMetraj.style.display = 'flex';
                switchTab('cephe');
            }
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            if (targetTab) switchTab(targetTab);
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
        'single': { name: 'Tek Kat Düz Cam (6mm)', u: 5.8, shgc: 0.82, E: 70000, t: 6.0, saving: 0 },
        'double': { name: 'Standart Çift Cam (6+16+6mm)', u: 2.7, shgc: 0.70, E: 70000, t: 7.56, saving: 53 },
        'double-lowe': { name: 'Çift Cam Low-E (Argonlu 6+16+6mm)', u: 1.1, shgc: 0.38, E: 70000, t: 7.56, saving: 78 },
        'triple-lowe': { name: 'Üç Cam Çift Low-E (Argonlu 6+14+6+14+6mm)', u: 0.6, shgc: 0.30, E: 70000, t: 8.65, saving: 89 }
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
        if (rect.width === 0 || rect.height === 0) return;
        
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        
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
        const cX = (r.width || 400) * 0.48;
        const cY = (r.height || 300) * 0.52;
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

        // Auto-heal resolution and transform if dimensions changed
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (particles.length === 0) {
                for (let i = 0; i < 45; i++) particles.push(new WindParticle3D());
            }
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
        
        const limitSpan = Math.min(15, (b_m * 1000) / 300);
        const dangerLimit = Math.min(20, (b_m * 1000) / 200);
        
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
        let mortarFactor = 0.035;
        if (wt === 'brick') {
            blockArea = 0.19 * 0.135;
            wThickness = 0.19;
            mortarFactor = 0.035;
        } else if (wt === 'ytong') {
            blockArea = 0.60 * 0.25;
            wThickness = 0.15;
            mortarFactor = 0.012;
        } else if (wt === 'bims') {
            blockArea = 0.39 * 0.19;
            wThickness = 0.19;
            mortarFactor = 0.028;
        }

        const wallVol = wallArea * wThickness;
        setEl('outWallVolume', wallVol.toFixed(2).toLocaleString('tr-TR'));

        const blocks = Math.ceil((wallArea / blockArea) * 1.05);
        setEl('outBlockCount', blocks.toLocaleString('tr-TR'));

        const mortarVol = wallArea * mortarFactor;
        setEl('outMortarVol', mortarVol.toFixed(2).toLocaleString('tr-TR'));

        const mortarCement = (mortarVol * 250) / 25;
        setEl('outMortarCement', Math.ceil(mortarCement).toLocaleString('tr-TR'));

        const mortarSand = mortarVol * 1.1;
        setEl('outMortarSand', mortarSand.toFixed(2).toLocaleString('tr-TR'));

        const lintelConc = openings * 0.05;
        setEl('outLintelConcrete', lintelConc.toFixed(2).toLocaleString('tr-TR'));

        const plasterVol = wallArea * 2 * plasT;
        setEl('outPlasterVol', plasterVol.toFixed(2).toLocaleString('tr-TR'));

        const plasterCement = (plasterVol * 300) / 25;
        setEl('outPlasterCement', Math.ceil(plasterCement).toLocaleString('tr-TR'));

        const plasterSand = plasterVol * 1.15;
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

        const screedSand = screedVol * 1.5;
        setEl('outScreedSand', screedSand.toFixed(1).toLocaleString('tr-TR'));

        const screedWater = (screedVol * scGrade) * 0.45;
        setEl('outScreedWater', Math.round(screedWater).toLocaleString('tr-TR'));

        const screedFiber = screedVol * 0.90;
        setEl('outScreedFiber', screedFiber.toFixed(2).toLocaleString('tr-TR'));

        const screedAdditive = (screedVol * scGrade) * 0.010;
        setEl('outScreedAdditive', screedAdditive.toFixed(1).toLocaleString('tr-TR'));

        const screedMesh = wa * 1.10;
        setEl('outScreedMesh', screedMesh.toFixed(1).toLocaleString('tr-TR'));

        const screedJointTape = wp * 1.05;
        setEl('outScreedJointTape', screedJointTape.toFixed(1).toLocaleString('tr-TR'));

        const waterproofArea = wa + (wp * isoH);
        setEl('outWaterproofArea', waterproofArea.toFixed(1).toLocaleString('tr-TR'));

        const totalWaterproofWeight = waterproofArea * 1.2 * coats;
        const waterproofLiquid = totalWaterproofWeight * 0.30;
        setEl('outWaterproofLiquid', waterproofLiquid.toFixed(1).toLocaleString('tr-TR'));

        const waterproofPowder = totalWaterproofWeight * 0.70;
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

        const tileAdhesive = (tilesArea * 4.5) / 25;
        setEl('outTileAdhesive', Math.ceil(tileAdhesive).toLocaleString('tr-TR'));

        const tileGrout = (tilesArea * 0.4) / 5;
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

    // Button Click Listeners with visual table feedback
    function flashTableUpdate(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            const cells = panel.querySelectorAll('td[id^="out"], .sim-stat-value');
            cells.forEach(cell => {
                cell.classList.remove('table-updated');
                void cell.offsetWidth; // trigger reflow
                cell.classList.add('table-updated');
            });
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

    // =========================================================================
    // TAB 6: ŞANTİYE HAVA RADARI & İSG KARAR MOTORU
    // =========================================================================
    function updateRadarDecisions() {
        const temp = parseFloat(document.getElementById('radarTemp')?.value) || 18;
        const wind = parseFloat(document.getElementById('radarWind')?.value) || 15;
        const humidity = parseFloat(document.getElementById('radarHumidity')?.value) || 55;
        const precip = document.getElementById('radarPrecip')?.value || 'clear';

        const setDisplay = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };

        setDisplay('valRadarTemp', `${temp} °C`);
        setDisplay('valRadarWind', `${wind} km/h`);
        setDisplay('valRadarHumidity', `${humidity} %`);

        function setBadge(badgeId, descId, status, label, desc) {
            const badge = document.getElementById(badgeId);
            const descEl = document.getElementById(descId);
            if (badge) {
                badge.className = `radar-badge badge-${status}`;
                badge.innerText = label;
            }
            if (descEl) {
                descEl.innerText = desc;
            }
        }

        // 1. Beton Dökümü Kararı (TS 500 / TS EN 206)
        if (precip === 'snow' || temp < 0) {
            setBadge('badgeBeton', 'descBeton', 'danger', 'DÖKÜM YASAK', 'Hava sıcaklığı 0°C altında veya kar yağışı var. Don riski nedeniyle beton dökümü derhal durdurulmalıdır.');
        } else if (temp < 5) {
            setBadge('badgeBeton', 'descBeton', 'warn', 'TEDBİRLİ DÖKÜM', 'Sıcaklık +5°C altında. Sıcak karışım betonu, antifriz/hızlandırıcı katkı ve döküm sonrası termal don örtüsü zorunludur.');
        } else if (temp > 32) {
            setBadge('badgeBeton', 'descBeton', 'warn', 'AŞIRI SICAK', 'Sıcaklık +32°C üzerinde. Priz geciktirici katkı kullanılmalı, hızlı buharlaşma ve plastik rötreye karşı anlık ıslak kür yapılmalıdır.');
        } else {
            setBadge('badgeBeton', 'descBeton', 'ok', 'UYGUN', 'Sıcaklık ve hava koşulları TS 500 normlarına uygundur. Standart vibrasyon ve kürleme ile döküm yapılabilir.');
        }

        // 2. Kule Vinç & Ağır Kaldırma (İSG Yönetmeliği)
        if (wind >= 45) {
            setBadge('badgeCrane', 'descCrane', 'danger', 'OPERASYON YASAK', 'Rüzgar hızı 45 km/h fırtına sınırını aşmıştır. Kule vinç bomu serbest dönüşe (rüzgar moduna) alınmalı ve tüm kaldırmalar durdurulmalıdır.');
        } else if (wind >= 30) {
            setBadge('badgeCrane', 'descCrane', 'warn', 'GÖZETİMLİ ÇALIŞMA', 'Rüzgar 30-45 km/h aralığında. Geniş yüzeyli rüzgar tutan kalıp ve cam panellerin kaldırılmasında çift kılavuz halat ve İSG gözetimi şarttır.');
        } else {
            setBadge('badgeCrane', 'descCrane', 'ok', 'GÜVENLİ', 'Rüzgar hızı güvenli çalışma sınırları altındadır. Standart işaretçi kontrolünde operasyon sürdürülebilir.');
        }

        // 3. Dış Cephe Sepeti & İskele
        if (wind >= 40 || precip === 'heavy_rain' || precip === 'snow') {
            setBadge('badgeScaffold', 'descScaffold', 'danger', 'YÜKSEKTE ÇALIŞMA YASAK', 'Şiddetli rüzgar (≥40 km/h) veya yoğun yağış nedeniyle asma sepet ve iskelede çalışma hayati risk taşır.');
        } else if (wind >= 25 || precip === 'light_rain') {
            setBadge('badgeScaffold', 'descScaffold', 'warn', 'RÜZGAR / KAYMA RİSKİ', 'Hafif yağış ve rüzgar mevcuttur. Çift lanyard ve tam emniyet kemeri ile sınırlı çalışma yapılmalıdır.');
        } else {
            setBadge('badgeScaffold', 'descScaffold', 'ok', 'GÜVENLİ', 'İskele ve dış cephe montaj sepetleri için hava koşulları elverişlidir.');
        }

        // 4. Cephe Silikonu, Mastik & Yalıtım
        if (precip !== 'clear' && precip !== 'cloudy') {
            setBadge('badgeSilicone', 'descSilicone', 'danger', 'UYGULAMA YASAK', 'Yağışlı havalarda yüzey nemi nedeniyle sosis silikon, mastik ve sürme izolasyon aderans sağlayamaz.');
        } else if (humidity > 80 || temp < 5) {
            setBadge('badgeSilicone', 'descSilicone', 'warn', 'ADERANS RİSKİ', 'Yüksek bağıl nem (>%80) veya düşük sıcaklık (<+5°C) silikonun kürlenmesini bozar; yüzeyin tamamen kuru olduğu teyit edilmelidir.');
        } else {
            setBadge('badgeSilicone', 'descSilicone', 'ok', 'UYGUN', 'Yüzey kuru, bağıl nem ve ortam sıcaklığı fitil/silikon uygulaması için idealdir.');
        }

        // 5. Dış Sıva & Dış Cephe Boyası
        if (precip !== 'clear' && precip !== 'cloudy') {
            setBadge('badgePaint', 'descPaint', 'danger', 'UYGULAMA YASAK', 'Yağış esnasında dış cephe sıvası ve boyası akma ve lekelenme yapar.');
        } else if (temp < 5 || temp > 35) {
            setBadge('badgePaint', 'descPaint', 'warn', 'RİSKLİ SICAKLIK', 'Sıcaklık sınır dışındadır. Aşırı sıcakta boya erken kurur ve yanar; soğukta ise film oluşturamaz.');
        } else {
            setBadge('badgePaint', 'descPaint', 'ok', 'UYGUN', 'Dış cephe boya ve dekoratif sıva uygulamaları için ideal kuruma ortamı.');
        }
    }

    ['radarTemp', 'radarWind', 'radarHumidity', 'radarPrecip'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateRadarDecisions);
            el.addEventListener('change', updateRadarDecisions);
        }
    });

    document.getElementById('btnPresetNormal')?.addEventListener('click', () => {
        setVal('radarTemp', 22); setVal('radarWind', 12); setVal('radarHumidity', 50); setVal('radarPrecip', 'clear');
        updateRadarDecisions();
    });
    document.getElementById('btnPresetStorm')?.addEventListener('click', () => {
        setVal('radarTemp', 14); setVal('radarWind', 52); setVal('radarHumidity', 85); setVal('radarPrecip', 'heavy_rain');
        updateRadarDecisions();
    });
    document.getElementById('btnPresetCold')?.addEventListener('click', () => {
        setVal('radarTemp', -2); setVal('radarWind', 20); setVal('radarHumidity', 65); setVal('radarPrecip', 'snow');
        updateRadarDecisions();
    });
    document.getElementById('btnPresetRain')?.addEventListener('click', () => {
        setVal('radarTemp', 15); setVal('radarWind', 28); setVal('radarHumidity', 92); setVal('radarPrecip', 'heavy_rain');
        updateRadarDecisions();
    });

    function setVal(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }

    // =========================================================================
    // TAB 7: SİSTEM & MALZEME KARŞILAŞTIRICI (HEAD-TO-HEAD)
    // =========================================================================
    let currentCompareCat = 'duvar';

    const COMPARE_DATA = {
        'duvar': {
            title: 'Duvar Örgü Sistemleri Karşılaştırması',
            items: [
                {
                    name: 'Gazbeton (Ytong)',
                    weight: '500 - 600 kg/m³ (Çok Hafif)',
                    thermal: 'λ = 0.11 W/mK (En Yüksek Yalıtım)',
                    speed: '35 - 45 m² / gün (Çok Hızlı)',
                    fire: 'A1 Sınıfı Yanmaz (4 Saate kadar)',
                    mortar: 'İnce derz yapıştırıcısı (Düşük Harç)',
                    pros: 'Taşıyıcıya minimum ölü yük bindirir, ısı yalıtımı mükemmeldir, düzgün yüzeyi sayesinde kaba sıva ihtiyacını azaltır.',
                    cons: 'Su emme kapasitesi yüksektir; dış cephede aderans astarı ve su itici sıva gerektirir.'
                },
                {
                    name: 'Yatay Delikli Tuğla (19x19x13.5)',
                    weight: '800 - 950 kg/m³ (Orta Ağırlık)',
                    thermal: 'λ = 0.32 W/mK (Orta Yalıtım)',
                    speed: '20 - 25 m² / gün (Orta Hız)',
                    fire: 'A1 Sınıfı Yanmaz',
                    mortar: 'Geleneksel harç (2.5 cm kalınlık)',
                    pros: 'Ekonomik birim malzeme fiyatı, yüksek mekanik taşıma gücü ve şantiyede kolay temin.',
                    cons: 'Harç tüketimi ve sıva payı yüksektir; kırılganlığı nedeniyle elektrik/tesisat kırımında fire oranı fazladır.'
                },
                {
                    name: 'Bims Blok (Pomza Blok)',
                    weight: '650 - 750 kg/m³ (Hafif)',
                    thermal: 'λ = 0.18 W/mK (İyi Yalıtım)',
                    speed: '25 - 30 m² / gün (İyi Hız)',
                    fire: 'A1 Sınıfı Yanmaz',
                    mortar: 'Geleneksel veya hazır harç',
                    pros: 'Gözenekli yapısı sayesinde yüksek ses yutuculuk ve akustik yalıtım sağlar, elastik yapısı depremde çatlamayı azaltır.',
                    cons: 'Boyutsal toleransları tuğla ve gazbetona göre daha geniştir; sıva sarfiyatı artabilir.'
                }
            ],
            verdict: '<strong>Şantiye Mühendisi Değerlendirmesi:</strong> Deprem yönetmeliği açısından binanın toplam ölü yükünü hafifletmek ve mantolama kalınlığını optimize etmek için iç/dış bölme duvarlarda <em>Gazbeton</em> en verimli çözümdür. Daireler arası akustik ses yalıtımında ise <em>Bims Blok</em> tercih edilmelidir.'
        },
        'cephe': {
            title: 'Giydirme Cephe Sistemleri Karşılaştırması',
            items: [
                {
                    name: 'Unitized (Modüler Panel Cephe)',
                    weight: '60 - 85 kg/m² (Cam dahil)',
                    thermal: 'Isı bariyerli profiller (Ucw ≤ 1.2 W/m²K)',
                    speed: 'Günde 20 - 35 Panel (Vinçle Çok Hızlı)',
                    fire: 'Katlar arası galvaniz yangın bariyeri (Smoke Seal)',
                    mortar: 'İskele gerektirmez (İçeriden montaj)',
                    pros: 'Fabrikada %100 kontrollü montaj ve EPDM fitilleme; şantiyede hava şartlarından bağımsız yıldırım hızında montaj.',
                    cons: 'Yüksek ilk yatırım maliyeti, hassas 3D ankraj ölçümü ve sahada kule vinç / monoray vinç lojistik koordinasyonu gerektirir.'
                },
                {
                    name: 'Stick (Klasik Çubuklu Cephe)',
                    weight: '45 - 65 kg/m² (Cam dahil)',
                    thermal: 'Isı bariyerli profiller (Ucw ≤ 1.6 W/m²K)',
                    speed: 'Günde 8 - 12 Modül (İskele Üzerinden)',
                    fire: 'Taşyünü spandrel yalıtımı',
                    mortar: 'Dış iskele veya asma sepet zorunlu',
                    pros: 'Düşük ilk imalat maliyeti, küçük ve karmaşık açılı mimari geometrilere sahada kolay uyarlanabilirlik.',
                    cons: 'Dış ortam hava şartlarına aşırı bağımlıdır; sahada uygulanan silikon ve fitil hataları su sızıntısı riski doğurur.'
                }
            ],
            verdict: '<strong>Şantiye Mühendisi Değerlendirmesi:</strong> 15 kat ve üzeri yüksek kule projelerinde şantiye süresini yarı yarıya kısaltmak ve sıfır su sızıntısı garantisi almak için <em>Unitized Panel Cephe</em> zorunludur. Düşük katlı ve girintili-çıkıntılı mimarilerde ise <em>Stick Cephe</em> maliyet avantajı sağlar.'
        },
        'yalitim': {
            title: 'Islak Hacim & Teras Su Yalıtım Karşılaştırması',
            items: [
                {
                    name: '2 Komponentli Çimento-Akrilik Sürme',
                    weight: '2.5 - 3.5 kg/m² (Çift kat)',
                    thermal: 'Nefes alır (Buhar geçirgen)',
                    speed: '6 - 8 saatte katlar arası kuruma',
                    fire: 'Yanmaz mineral katman',
                    mortar: 'Seramik yapıştırıcısı doğrudan tutunur',
                    pros: 'Seramik ve şap altında en yüksek aderans gücü, eksiz monolitik kaplama, nemli yüzeylere dahi uygulanabilme.',
                    cons: 'Yüksek genleşmeli yapısal hareket derzlerinde elastik pah filesi olmadan tek başına yırtılabilir.'
                },
                {
                    name: 'Poliüretan Esaslı Likit Membran',
                    weight: '1.5 - 2.0 kg/m² (Çift kat)',
                    thermal: 'Yüksek UV ve elastisite direnci',
                    speed: '12 - 24 saat tam kuruma',
                    fire: 'B2 Sınıfı',
                    mortar: 'Açık teras veya üzerine seramik astarı',
                    pros: '%400 üzerinde kopma uzaması (elastisite), çatlak köprüleme kabiliyeti, açık teraslarda güneş ışığına (UV) tam dayanım.',
                    cons: 'Uygulama zemininin tamamen kuru (nem <%5) olması şarttır; ıslak zeminde kabarma ve baloncuk yapar.'
                },
                {
                    name: 'Bitümlü Rulo Membran (Şalümolu)',
                    weight: '3.5 - 4.5 kg/m²',
                    thermal: 'Buhar kesici bariyer',
                    speed: 'Şalümo alevi ile hızlı serim',
                    fire: 'Yanıcı (Açık alev riski)',
                    mortar: 'Üzerine koruma şapı dökülmelidir',
                    pros: 'Temel bohçalama ve toprak altı perde duvarlarda yüksek mekanik darbe ve kök dayanımı.',
                    cons: 'Ek yerlerinde (bindirmelerde) işçilik hatasına açıktır; yangın riski nedeniyle iç mekan ıslak hacimlerde tercih edilmez.'
                }
            ],
            verdict: '<strong>Şantiye Mühendisi Değerlendirmesi:</strong> Banyo, mutfak ve balkon seramik altlarında aderans ve yangın güvenliği için <em>2 Komponentli Çimento Esaslı Sürme Yalıtım</em>; açık gezinilen teras çatılarda ise yüksek UV ve elastisite için <em>Poliüretan Likit Membran</em> uygulanmalıdır.'
        },
        'kalip': {
            title: 'Taşıyıcı Kaba Yapı Kalıp Sistemleri Karşılaştırması',
            items: [
                {
                    name: 'Konvansiyonel Çelik Kuşaklı Ahşap/Plywood',
                    weight: 'Esnek / Manuel taşınabilir',
                    thermal: 'Standart betonarme prizi',
                    speed: 'Kat başına 10 - 14 gün',
                    fire: 'Standart betonarme güvenliği',
                    mortar: 'Kolon, kiriş, asmolen, kaset döşeme',
                    pros: 'Her türlü karmaşık ve değişken mimari plana sahada %100 uyarlanabilme kabiliyeti; düşük ilk kalıp yatırım maliyeti.',
                    cons: 'Ağır işçilik ve kalıpçı ustası bağımlılığı; kat döküm hızının yavaş olması.'
                },
                {
                    name: 'Endüstriyel Tünel Kalıp Sistemi',
                    weight: 'Ağır çelik paneller (Kule vinç zorunlu)',
                    thermal: 'Hızlı priz (Gerektiğinde ısıtma kürü)',
                    speed: 'Günde 1 Kat (24 saatte kat dökümü)',
                    fire: 'Monolitik perde-döşeme yüksek rijitlik',
                    mortar: 'Taşıyıcı perde duvar + döşeme tek döküm',
                    pros: 'Seri konut projelerinde inanılmaz yapım hızı, yüksek deprem dayanımı (tüm duvarlar taşıyıcı perde), sıfır sıva maliyeti (brüt yüzey).',
                    cons: 'Mimari plan esnekliği yoktur; daire içi duvarlar yıkılıp revize edilemez, ilk çelik kalıp yatırımı çok yüksektir.'
                }
            ],
            verdict: '<strong>Şantiye Mühendisi Değerlendirmesi:</strong> Tekrarlayan bloklardan oluşan büyük ölçekli toplu konut projelerinde (TOKİ, kentsel dönüşüm) süre ve maliyet avantajı için <em>Tünel Kalıp</em>; ofis, AVM ve özel villalarda ise mimari esneklik için <em>Plywood/Konvansiyonel Kalıp</em> tercih edilmelidir.'
        }
    };

    function renderComparison(cat) {
        currentCompareCat = cat;
        const container = document.getElementById('compareContentContainer');
        if (!container) return;

        const data = COMPARE_DATA[cat];
        if (!data) return;

        // Update active button state
        document.querySelectorAll('.compare-cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === cat);
        });

        let cardsHtml = '';
        data.items.forEach(item => {
            cardsHtml += `
                <div class="compare-card">
                    <h5 class="compare-card-title">${item.name}</h5>
                    <div>
                        <div class="compare-metric-row">
                            <span class="compare-metric-label">Öz Ağırlık / Yük:</span>
                            <span class="compare-metric-val">${item.weight}</span>
                        </div>
                        <div class="compare-metric-row">
                            <span class="compare-metric-label">Isı &amp; Yalıtım:</span>
                            <span class="compare-metric-val">${item.thermal}</span>
                        </div>
                        <div class="compare-metric-row">
                            <span class="compare-metric-label">Uygulama Hızı:</span>
                            <span class="compare-metric-val">${item.speed}</span>
                        </div>
                        <div class="compare-metric-row">
                            <span class="compare-metric-label">Yangın &amp; Standart:</span>
                            <span class="compare-metric-val">${item.fire}</span>
                        </div>
                        <div class="compare-metric-row">
                            <span class="compare-metric-label">Bağlayıcı / Harç:</span>
                            <span class="compare-metric-val">${item.mortar}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
                        <p style="margin-bottom: 0.35rem;"><strong style="color: #2ecc71;">✓ Avantajlar:</strong> ${item.pros}</p>
                        <p style="margin: 0;"><strong style="color: #e74c3c;">✗ Dikkat Edilmeli:</strong> ${item.cons}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="panel-header" style="margin-bottom: 1.5rem;">
                <span class="panel-tag">Detaylı Sistem Karşılaştırması</span>
                <h4 class="panel-title">${data.title}</h4>
            </div>
            <div class="compare-grid">
                ${cardsHtml}
            </div>
            <div class="compare-verdict-box">
                ${data.verdict}
            </div>
        `;
    }

    document.querySelectorAll('.compare-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-cat');
            if (cat) renderComparison(cat);
        });
    });

    // =========================================================================
    // TAB 8: DONATI, KUTU PROFİL & KESİM OPTİMİZASYONU CEP ARACI
    // =========================================================================
    function updateRebarCalculator() {
        const dia = parseFloat(document.getElementById('inpRebarDia')?.value) || 12;
        const len = parseFloat(document.getElementById('inpRebarLen')?.value) || 3.5;
        const qty = parseInt(document.getElementById('inpRebarQty')?.value) || 40;

        // Exact formula: q = dia^2 / 162 (kg/m)
        const unitWt = (dia * dia) / 162;
        const totalLen = len * qty;
        const totalKg = totalLen * unitWt;
        const totalTons = totalKg / 1000;
        const bars12m = Math.ceil(totalLen / 12);

        const setDisplay = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };

        setDisplay('outRebarUnitWt', `${unitWt.toFixed(3)} kg/m`);
        setDisplay('outRebarTotalLen', `${totalLen.toFixed(1)} m`);
        setDisplay('outRebarTotalKg', `${totalKg.toFixed(1)} kg (${totalTons.toFixed(3)} Ton)`);
        setDisplay('outRebarBars', `${bars12m} Adet (12m Boy)`);
    }

    function updateProfileCalculator() {
        const mat = document.getElementById('inpProfMat')?.value || 'steel';
        const thk = parseFloat(document.getElementById('inpProfThk')?.value) || 3.0;
        const w = parseFloat(document.getElementById('inpProfW')?.value) || 60;
        const h = parseFloat(document.getElementById('inpProfH')?.value) || 120;
        const len = parseFloat(document.getElementById('inpProfLen')?.value) || 24;

        // Density: Steel = 7.85 kg/dm3, Aluminum = 2.70 kg/dm3
        const density = (mat === 'steel') ? 7850 : 2700; // kg/m3

        // Cross section area approx: Area = 2*t*(w + h - 2*t) in mm2
        const tM = thk / 1000;
        const wM = w / 1000;
        const hM = h / 1000;
        const areaM2 = (wM * hM) - ((wM - 2 * tM) * (hM - 2 * tM));
        const unitWtKgM = areaM2 * density;
        const totalWtKg = unitWtKgM * len;

        const setDisplay = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };

        setDisplay('outProfUnitWt', `${unitWtKgM.toFixed(2)} kg/m`);
        setDisplay('outProfTotalWt', `${totalWtKg.toFixed(1)} kg`);
    }

    function runRebarOptimizer() {
        const inputStr = document.getElementById('inpOptPieces')?.value || '3.40, 2.80, 5.20';
        const parts = inputStr.split(/[,;\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0);

        if (parts.length === 0) return;

        const total12m = 12.00;
        let usedLen = 0;
        const segments = [];

        parts.forEach((p, idx) => {
            if (usedLen + p <= total12m) {
                usedLen += p;
                segments.push({ len: p, isWaste: false, idx });
            }
        });

        const wasteLen = Math.max(0, total12m - usedLen);
        const wastePct = (wasteLen / total12m) * 100;

        const setDisplay = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        };

        setDisplay('outOptUsedLen', `${usedLen.toFixed(2)} m`);
        setDisplay('outOptWasteLen', `${wasteLen.toFixed(2)} m (${Math.round(wasteLen * 100)} cm)`);
        
        const wastePctEl = document.getElementById('outOptWastePct');
        if (wastePctEl) {
            if (wastePct <= 5) {
                wastePctEl.innerText = `% ${wastePct.toFixed(1)} (Mükemmel Yerleşim)`;
                wastePctEl.style.color = '#2ecc71';
            } else if (wastePct <= 15) {
                wastePctEl.innerText = `% ${wastePct.toFixed(1)} (Kabul Edilebilir Fire)`;
                wastePctEl.style.color = '#f1c40f';
            } else {
                wastePctEl.innerText = `% ${wastePct.toFixed(1)} (Yüksek Fire - Parçaları Birleştirin)`;
                wastePctEl.style.color = '#e74c3c';
            }
        }

        // Render Visual Bar
        const barContainer = document.getElementById('optVisualBar');
        if (barContainer) {
            const colors = ['opt-seg-used', 'opt-seg-used-2', 'opt-seg-used-3'];
            let html = '';
            segments.forEach((seg, i) => {
                const pct = (seg.len / total12m) * 100;
                const cls = colors[i % colors.length];
                html += `<div class="opt-seg ${cls}" style="width: ${pct.toFixed(2)}%;" title="Parça ${i+1}: ${seg.len.toFixed(2)}m">${seg.len.toFixed(2)}m</div>`;
            });
            if (wasteLen > 0) {
                const wastePctBar = (wasteLen / total12m) * 100;
                html += `<div class="opt-seg opt-seg-waste" style="width: ${wastePctBar.toFixed(2)}%;" title="Fire / Artık: ${wasteLen.toFixed(2)}m (${Math.round(wasteLen*100)}cm)">Fire: ${Math.round(wasteLen*100)}cm</div>`;
            }
            barContainer.innerHTML = html;
        }
    }

    ['inpRebarDia', 'inpRebarLen', 'inpRebarQty'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateRebarCalculator);
            el.addEventListener('change', updateRebarCalculator);
        }
    });

    ['inpProfMat', 'inpProfThk', 'inpProfW', 'inpProfH', 'inpProfLen'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateProfileCalculator);
            el.addEventListener('change', updateProfileCalculator);
        }
    });

    document.getElementById('btnRunOptimizer')?.addEventListener('click', () => {
        runRebarOptimizer();
        if (typeof window.showToast === 'function') {
            window.showToast("Kesim Planı Güncellendi", "12m donatı yerleşimi ve fire hesabı yapıldı.");
        }
    });

    document.getElementById('btnCopyRebarPlan')?.addEventListener('click', () => {
        const dia = document.getElementById('inpRebarDia')?.value || '12';
        const used = document.getElementById('outOptUsedLen')?.innerText || '11.40 m';
        const waste = document.getElementById('outOptWasteLen')?.innerText || '0.60 m';
        const inputStr = document.getElementById('inpOptPieces')?.value || '';

        const text = `📋 *ŞANTİYE DONATI KESİM PLANI (12M BOY ÇUBUK)*\n• Donatı Çapı: Φ ${dia} mm\n• Kesilecek Parçalar: ${inputStr}\n• Kullanılan Net Boy: ${used}\n• Kalan Fire/Artık: ${waste}\n(Ata Yiğit Telli - Şantiye Asistanı)`;

        navigator.clipboard.writeText(text).then(() => {
            if (typeof window.showToast === 'function') {
                window.showToast("Panoya Kopyalandı", "Kesim planı WhatsApp formatında kopyalandı.");
            } else {
                alert("Kesim planı panoya kopyalandı!");
            }
        });
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
        updateRadarDecisions();
        renderComparison('duvar');
        updateRebarCalculator();
        updateProfileCalculator();
        runRebarOptimizer();
        updateFacadeCalculations();
        updateConcreteCalculations();
        updateMasonryCalculations();
        updateScreedWetCalculations();
    }

    initAllTakeoffs();
    window.addEventListener('load', initAllTakeoffs);
})();
