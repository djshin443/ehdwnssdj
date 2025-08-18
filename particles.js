// 파티클 시스템 - particles.js

// 전역 파티클 배열들
let particles = [];
if (!window.textParticles) {
    window.textParticles = [];
}

// 파티클 생성
function createParticles(x, y, type) {
    const colors = {
        'hit': ['#FFD700', '#FFA500', '#FF6347'],
        'defeat': ['#32CD32', '#00FF00', '#7FFF00'],
        'hurt': ['#FF0000', '#DC143C', '#8B0000'],
        'hint': ['#FFFF00', '#FFD700', '#FFA500']
    };
    
    const particleColors = colors[type] || colors['hit'];
    const particleCount = type === 'hint' ? 5 : 10;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * -10 - 5,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            life: type === 'hint' ? 20 : 30,
            size: Math.random() * 4 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

// 파티클 업데이트
function updateParticles() {
    particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.5; // 중력
        particle.life--;
        particle.rotation += particle.rotationSpeed;
        
        // 마찰력
        particle.vx *= 0.98;
        
        return particle.life > 0;
    });
}

// 파티클 렌더링
function renderParticles(ctx) {
    particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        // 생명력에 따른 투명도 조절
        const alpha = particle.life / 30;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        
        ctx.restore();
    });
}

// 떠다니는 텍스트 효과
function showFloatingText(x, y, text, color, size = 16) {
    const textParticle = {
        x: x,
        y: y,
        text: text,
        color: color,
        life: 60,
        maxLife: 60,
        vy: -2,
        alpha: 1.0,
        size: size,
        scale: 1.0,
        scaleSpeed: 0.02
    };
    
    window.textParticles.push(textParticle);
}

// 텍스트 파티클 업데이트
function updateTextParticles(ctx) {
    if (!window.textParticles) return;
    
    window.textParticles = window.textParticles.filter(particle => {
        particle.y += particle.vy;
        particle.life--;
        particle.alpha = particle.life / particle.maxLife;
        
        // 크기 애니메이션 (처음에 커졌다가 작아짐)
        if (particle.life > particle.maxLife * 0.8) {
            particle.scale += particle.scaleSpeed;
        } else {
            particle.scale = Math.max(0.5, particle.scale - particle.scaleSpeed);
        }
        
        if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.font = `bold ${Math.floor(particle.size * particle.scale)}px Jua`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            
            // 텍스트 외곽선
            ctx.strokeText(particle.text, particle.x, particle.y);
            // 텍스트 본체
            ctx.fillText(particle.text, particle.x, particle.y);
            
            ctx.restore();
        }
        
        return particle.life > 0;
    });
}

// 폭발 파티클 효과
function createExplosionParticles(x, y, color = '#FFD700', count = 20) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 8 + 4;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            life: 40,
            size: Math.random() * 6 + 3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3
        });
    }
}

// 반짝이는 파티클 효과
function createSparkleParticles(x, y, count = 8) {
    const sparkleColors = ['#FFFFFF', '#FFD700', '#FFFF00', '#87CEEB'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
            life: 25,
            size: Math.random() * 3 + 1,
            rotation: 0,
            rotationSpeed: 0.1
        });
    }
}

// 치유 파티클 효과
function createHealParticles(x, y, count = 12) {
    const healColors = ['#00FF00', '#32CD32', '#7FFF00', '#98FB98'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + Math.random() * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 5 - 2,
            color: healColors[Math.floor(Math.random() * healColors.length)],
            life: 35,
            size: Math.random() * 4 + 2,
            rotation: 0,
            rotationSpeed: 0.05
        });
    }
}

// 마법 파티클 효과 (무지개 색상)
function createMagicParticles(x, y, count = 15) {
    const magicColors = ['#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'];
    
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            color: magicColors[Math.floor(Math.random() * magicColors.length)],
            life: 45,
            size: Math.random() * 5 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

// 물 파티클 효과
function createWaterParticles(x, y, count = 10) {
    const waterColors = ['#0000FF', '#4169E1', '#87CEEB', '#ADD8E6'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 15,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * -8 - 3,
            color: waterColors[Math.floor(Math.random() * waterColors.length)],
            life: 30,
            size: Math.random() * 3 + 2,
            rotation: 0,
            rotationSpeed: 0
        });
    }
}

// 연기 파티클 효과
function createSmokeParticles(x, y, count = 8) {
    const smokeColors = ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 4 - 2,
            color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
            life: 50,
            size: Math.random() * 8 + 4,
            rotation: 0,
            rotationSpeed: 0.02
        });
    }
}

// 불 파티클 효과
function createFireParticles(x, y, count = 12) {
    const fireColors = ['#FF0000', '#FF4500', '#FF6347', '#FFD700'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 8 - 4,
            color: fireColors[Math.floor(Math.random() * fireColors.length)],
            life: 25,
            size: Math.random() * 6 + 3,
            rotation: 0,
            rotationSpeed: 0.1
        });
    }
}

// 눈 파티클 효과
function createSnowParticles(x, y, count = 15) {
    const snowColors = ['#FFFFFF', '#F0F8FF', '#E6E6FA'];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y - Math.random() * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 1,
            color: snowColors[Math.floor(Math.random() * snowColors.length)],
            life: 60,
            size: Math.random() * 4 + 2,
            rotation: 0,
            rotationSpeed: 0.05
        });
    }
}

// 별 파티클 효과
function createStarParticles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: '#FFFF00',
            life: 40,
            size: Math.random() * 5 + 3,
            rotation: 0,
            rotationSpeed: 0.15,
            type: 'star'
        });
    }
}

// 하트 파티클 효과
function createHeartParticles(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 25,
            y: y + (Math.random() - 0.5) * 25,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 4 - 2,
            color: '#FF69B4',
            life: 50,
            size: Math.random() * 6 + 4,
            rotation: 0,
            rotationSpeed: 0.1,
            type: 'heart'
        });
    }
}

// 특수 모양 파티클 렌더링
function renderSpecialParticles(ctx) {
    particles.forEach(particle => {
        if (!particle.type) return;
        
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        const alpha = particle.life / 40;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'star') {
            drawStar(ctx, 0, 0, particle.size);
        } else if (particle.type === 'heart') {
            drawHeart(ctx, 0, 0, particle.size);
        }
        
        ctx.restore();
    });
}

// 별 모양 그리기
function drawStar(ctx, x, y, size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    ctx.fill();
}

// 하트 모양 그리기
function drawHeart(ctx, x, y, size) {
    const heartSize = size * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(x, y + heartSize * 0.3);
    
    // 왼쪽 상단 곡선
    ctx.bezierCurveTo(
        x, y,
        x - heartSize * 0.5, y,
        x - heartSize * 0.5, y + heartSize * 0.3
    );
    
    // 왼쪽 하단
    ctx.bezierCurveTo(
        x - heartSize * 0.5, y + heartSize * 0.6,
        x, y + heartSize * 0.6,
        x, y + heartSize
    );
    
    // 오른쪽 하단
    ctx.bezierCurveTo(
        x, y + heartSize * 0.6,
        x + heartSize * 0.5, y + heartSize * 0.6,
        x + heartSize * 0.5, y + heartSize * 0.3
    );
    
    // 오른쪽 상단 곡선
    ctx.bezierCurveTo(
        x + heartSize * 0.5, y,
        x, y,
        x, y + heartSize * 0.3
    );
    
    ctx.closePath();
    ctx.fill();
}

// 연쇄 폭발 효과
function createChainExplosion(x, y, depth = 3) {
    if (depth <= 0) return;
    
    createExplosionParticles(x, y, '#FF4500', 15);
    
    // 딜레이 후 주변에 작은 폭발들 생성
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 * i) / 3;
            const distance = 50;
            const newX = x + Math.cos(angle) * distance;
            const newY = y + Math.sin(angle) * distance;
            
            createChainExplosion(newX, newY, depth - 1);
        }
    }, 200);
}

// 파티클 시스템 초기화
function initParticleSystem() {
    particles = [];
    window.textParticles = [];
}

// 파티클 시스템 정리
function clearParticles() {
    particles = [];
    if (window.textParticles) {
        window.textParticles = [];
    }
}

// 파티클 개수 제한 (성능 최적화)
function limitParticles(maxCount = 200) {
    if (particles.length > maxCount) {
        particles = particles.slice(-maxCount);
    }
    
    if (window.textParticles && window.textParticles.length > 20) {
        window.textParticles = window.textParticles.slice(-20);
    }
}

// 전체 파티클 렌더링 (메인 함수)
function renderAllParticles(ctx) {
    renderParticles(ctx);
    renderSpecialParticles(ctx);
    updateTextParticles(ctx);
    limitParticles();
}

// 파티클 시스템 업데이트 (메인 함수)
function updateParticleSystem() {
    updateParticles();
    limitParticles();
}