// 간소화된 파티클 시스템 - particles.js
// 전역 파티클 배열들
let particles = [];
if (!window.textParticles) {
    window.textParticles = [];
}

// 기본 파티클 생성 (게임에서 실제 사용되는 것만)
function createParticles(x, y, type) {
    const colors = {
        'hit': ['#FFD700', '#FFA500'],
        'defeat': ['#32CD32', '#00FF00'],
        'hurt': ['#FF0000', '#DC143C'],
        'hint': ['#FFFF00', '#FFD700']
    };
    
    const particleColors = colors[type] || colors['hit'];
    const particleCount = type === 'hint' ? 3 : 6; // 파티클 수 감소
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * -8 - 3,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            life: 20, // 수명 단축
            size: Math.random() * 3 + 2
        });
    }
}

// 파티클 업데이트
function updateParticles() {
    particles = particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // 중력 감소
        particle.life--;
        particle.vx *= 0.98; // 마찰력
        
        return particle.life > 0;
    });
}

// 파티클 렌더링
function renderParticles(ctx) {
    particles.forEach(particle => {
        const alpha = particle.life / 20;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
    });
    ctx.globalAlpha = 1.0; // 알파 복원
}

// 떠다니는 텍스트 효과
function showFloatingText(x, y, text, color, size = 16) {
    const textParticle = {
        x: x,
        y: y,
        text: text,
        color: color,
        life: 40, // 수명 단축
        maxLife: 40,
        vy: -1.5,
        alpha: 1.0,
        size: size
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
        
        if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.font = `bold ${particle.size}px Jua`;
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            
            // 텍스트 외곽선
            ctx.strokeText(particle.text, particle.x, particle.y);
            // 텍스트 본체
            ctx.fillText(particle.text, particle.x, particle.y);
            
            ctx.restore();
        }
        
        return particle.life > 0;
    });
}

// 파티클 시스템 초기화
function initParticleSystem() {
    particles = [];
    window.textParticles = [];
}

// 파티클 정리
function clearParticles() {
    particles = [];
    if (window.textParticles) {
        window.textParticles = [];
    }
}

// 파티클 개수 제한 (성능 최적화)
function limitParticles() {
    if (particles.length > 50) { // 제한 수 감소
        particles = particles.slice(-50);
    }
    
    if (window.textParticles && window.textParticles.length > 10) {
        window.textParticles = window.textParticles.slice(-10);
    }
}

// 전체 파티클 렌더링 (메인 함수)
function renderAllParticles(ctx) {
    renderParticles(ctx);
    updateTextParticles(ctx);
    limitParticles();
}

// 파티클 시스템 업데이트 (메인 함수)
function updateParticleSystem() {
    updateParticles();
    limitParticles();
}
