// 엔딩 시스템 - ending.js (고품질 2D 그래픽 업그레이드 버전)
// main.js와 완벽하게 호환되는 버전

// 고급 파티클 시스템 클래스 (엔딩 전용)
class EndingParticleSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.particles = [];
    }
    
    create(x, y, type = 'star', count = 1) {
        for (let i = 0; i < count; i++) {
            const configs = {
                star: {
                    size: Math.random() * 5 + 2,
                    color: `hsl(${Math.random() * 60 + 30}, 100%, ${70 + Math.random() * 30}%)`,
                    velocity: { x: (Math.random() - 0.5) * 4, y: Math.random() * -5 - 1 },
                    lifetime: 150,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.1
                },
                confetti: {
                    size: Math.random() * 12 + 6,
                    color: ['#FF6B9D', '#FFD700', '#00D9FF', '#7FFF00', '#FF1493'][Math.floor(Math.random() * 5)],
                    velocity: { x: (Math.random() - 0.5) * 10, y: Math.random() * -12 - 3 },
                    lifetime: 200,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.3
                },
                sparkle: {
                    size: Math.random() * 8 + 4,
                    color: '#FFFFFF',
                    velocity: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 },
                    lifetime: 80,
                    rotation: 0,
                    rotationSpeed: 0.2
                },
                comet: {
                    size: Math.random() * 6 + 3,
                    color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
                    velocity: { x: Math.random() * 4 + 2, y: Math.random() * 2 - 1 },
                    lifetime: 100,
                    rotation: 0,
                    rotationSpeed: 0,
                    trail: []
                }
            };
            
            const config = configs[type] || configs.star;
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                type,
                ...config,
                age: 0,
                opacity: 1,
                scale: 1
            });
        }
    }
    
    update() {
        this.particles = this.particles.filter(p => {
            p.age++;
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            p.velocity.y += 0.1; // 중력
            p.velocity.x *= 0.99; // 공기 저항
            p.rotation += p.rotationSpeed;
            
            // 페이드 효과
            if (p.age > p.lifetime * 0.7) {
                p.opacity = Math.max(0, 1 - (p.age - p.lifetime * 0.7) / (p.lifetime * 0.3));
            }
            
            // 스케일 애니메이션
            if (p.type === 'sparkle') {
                p.scale = 1 + Math.sin(p.age * 0.2) * 0.3;
            }
            
            // 코멧 트레일
            if (p.type === 'comet') {
                if (p.trail) {
                    p.trail.push({ x: p.x, y: p.y, age: 0 });
                    p.trail = p.trail.filter(t => {
                        t.age++;
                        return t.age < 15;
                    });
                }
            }
            
            return p.age < p.lifetime && p.opacity > 0;
        });
    }
    
    render() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            
            // 코멧 트레일 렌더링
            if (p.type === 'comet' && p.trail) {
                p.trail.forEach((t, i) => {
                    this.ctx.globalAlpha = p.opacity * (1 - t.age / 15) * 0.5;
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, p.size * (1 - t.age / 15), 0, Math.PI * 2);
                    this.ctx.fill();
                });
                this.ctx.globalAlpha = p.opacity;
            }
            
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.scale(p.scale, p.scale);
            
            if (p.type === 'star') {
                // 글로우 효과가 있는 별
                this.ctx.shadowColor = p.color;
                this.ctx.shadowBlur = p.size * 4;
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    const innerAngle = angle + Math.PI / 5;
                    const outerX = Math.cos(angle) * p.size;
                    const outerY = Math.sin(angle) * p.size;
                    const innerX = Math.cos(innerAngle) * p.size * 0.5;
                    const innerY = Math.sin(innerAngle) * p.size * 0.5;
                    
                    if (i === 0) this.ctx.moveTo(outerX, outerY);
                    else this.ctx.lineTo(outerX, outerY);
                    this.ctx.lineTo(innerX, innerY);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                
            } else if (p.type === 'confetti') {
                // 3D 회전 효과가 있는 컨페티
                const scaleX = Math.cos(p.age * 0.1);
                this.ctx.scale(scaleX, 1);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size * 0.6);
                
            } else if (p.type === 'sparkle') {
                // 반짝이는 효과
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = 2;
                this.ctx.shadowColor = '#FFFFFF';
                this.ctx.shadowBlur = p.size * 2;
                this.ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const angle = (Math.PI / 2) * i;
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
                }
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                
            } else if (p.type === 'comet') {
                // 혜성 효과
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.3, p.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.shadowColor = p.color;
                this.ctx.shadowBlur = p.size * 3;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.restore();
        });
    }
}

// 전역 파티클 시스템 변수
let endingParticleSystem = null;

// 엔딩 표시 함수 (main.js와 호환 - 가로화면 최적화)
function showEnding() {
    // 게임 상태 정리
    if (typeof gameState !== 'undefined') {
        gameState.running = false;
        gameState.isMoving = false;
    }
    
    // 화면 방향 체크
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 가로 모드 강제 권장
    if (!isLandscape && isMobile) {
        showRotateDeviceMessage();
    }
    
    // 엔딩 화면 생성 - 고급 그라데이션 배경
    const endingDiv = document.createElement('div');
    endingDiv.id = 'endingScreen';
    endingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, 
            #1a1a2e 0%, 
            #16213e 25%, 
            #0f3460 50%, 
            #533483 75%,
            #e94560 100%);
        z-index: 10000;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        font-family: 'Jua', sans-serif;
        padding: 20px;
        gap: 20px;
        overflow: hidden;
    `;
    
    // 배경 애니메이션 오버레이
    const bgOverlay = document.createElement('div');
    bgOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 50% 50%, 
            rgba(138, 43, 226, 0.2) 0%, 
            transparent 60%);
        animation: pulseGlow 3s ease-in-out infinite;
        pointer-events: none;
    `;
    endingDiv.appendChild(bgOverlay);
    
    // 캔버스 컨테이너
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        ${isLandscape ? 'flex: 1.2; max-width: 55%;' : 'width: 100%;'}
    `;
    
    // 엔딩 캔버스 크기 조정
    const endingCanvas = document.createElement('canvas');
    let canvasSize;
    
    if (isLandscape) {
        canvasSize = {
            width: Math.min(window.innerWidth * 0.5, 800),
            height: Math.min(window.innerHeight * 0.7, 600)
        };
    } else {
        canvasSize = {
            width: Math.min(window.innerWidth * 0.9, 600),
            height: Math.min(window.innerHeight * 0.35, 400)
        };
    }
    
    endingCanvas.width = canvasSize.width;
    endingCanvas.height = canvasSize.height;
    endingCanvas.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(30, 30, 60, 0.9) 0%, 
            rgba(60, 30, 90, 0.9) 50%,
            rgba(90, 30, 120, 0.9) 100%);
        border: 4px solid transparent;
        background-clip: padding-box;
        border-radius: 25px;
        box-shadow: 
            0 20px 60px rgba(233, 69, 96, 0.4),
            0 0 120px rgba(138, 43, 226, 0.3),
            inset 0 0 80px rgba(255, 255, 255, 0.1);
        width: 100%;
        height: auto;
        max-height: ${isLandscape ? '70vh' : '40vh'};
        position: relative;
        image-rendering: auto;
    `;
    
    // 텍스트 컨테이너
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: ${isLandscape ? '20px' : '15px'};
        ${isLandscape ? 'flex: 1; max-width: 45%;' : 'width: 100%;'}
        ${isLandscape ? 'justify-content: center;' : ''}
        position: relative;
        z-index: 1;
    `;
    
    // 엔딩 스토리 텍스트 (프리미엄 디자인)
    const storyText = document.createElement('div');
    storyText.style.cssText = `
        font-size: ${isLandscape ? (isMobile ? '16px' : '20px') : '16px'};
        color: #FFFFFF;
        text-shadow: 0 0 20px rgba(233, 69, 96, 0.8);
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1), 
            rgba(138, 43, 226, 0.2));
        backdrop-filter: blur(10px);
        padding: ${isLandscape ? '30px' : '25px'};
        border-radius: 20px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.3),
            inset 0 0 60px rgba(138, 43, 226, 0.1);
        animation: fadeInUp 1s ease-out;
    `;
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes floatUpDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes sparkleAnimation {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
        }
        @keyframes glowPulse {
            0%, 100% { 
                box-shadow: 0 0 20px rgba(233, 69, 96, 0.5); 
            }
            50% { 
                box-shadow: 0 0 40px rgba(233, 69, 96, 0.8),
                           0 0 60px rgba(138, 43, 226, 0.6); 
            }
        }
    `;
    document.head.appendChild(style);
    
    // 캐릭터별 스토리 (기존 구조 유지)
    const endingStories = {
        jiyul: {
            title: "✨ 지율이의 세계일주 영어 대모험 완료! ✨",
            story: [
                "🚀 영어 마스터가 된 지율이는 우주 여권을 받았어요!",
                "🌟 전 세계 친구들과 영어로 대화할 수 있게 되었답니다!",
                "🏆 다음 목표는 은하계 영어 챔피언십 우승!",
                "💫 모든 별자리의 친구들이 지율이를 응원해요!",
                "🎉 지구 최고의 영어 마스터 탄생!"
            ],
            achievement: "🏆 글로벌 영어 마스터 인증 획득!",
            special: "🎁 보너스: 키위와 화이트하우스가 특별 파티를 준비했어요!"
        },
        kiwi: {
            title: "🌈 키위의 마법 영어 변신 성공! 🌈",
            story: [
                "✨ 키위가 100개 언어를 마스터한 슈퍼 도마뱀이 되었어요!",
                "🌍 UN 동시통역관으로 초대받았답니다!",
                "🎪 마법의 숲에서 영어 축제가 열렸어요!",
                "🦎 모든 동물 친구들이 키위에게 영어를 배우러 와요!",
                "👑 동물 왕국의 영어 대사로 임명되었어요!"
            ],
            achievement: "🏆 최연소(?) UN 명예 통역관 달성!",
            special: "🎁 보너스: 키위 영어학원 오픈! 지율이가 첫 선생님이에요!"
        },
        whitehouse: {
            title: "🏰 화이트하우스의 영어 왕국 완성! 🏰",
            story: [
                "👑 화이트하우스가 드디어 꿈의 영어 왕국을 건설했어요!",
                "📚 텐트 안이 마법의 영어 도서관으로 변신!",
                "✨ 매일 밤 영어 단어들이 살아나서 파티를 열어요!",
                "🎭 세계 각국의 언어들과 친구가 되었답니다!",
                "🌟 영어 왕국의 평화로운 왕이 되었어요!"
            ],
            achievement: "🏆 영어 왕국의 초대 국왕 즉위!",
            special: "🎁 보너스: 지율이와 키위가 왕국의 명예 기사가 되었어요!"
        }
    };
    
    const selectedCharacter = (typeof gameState !== 'undefined' && gameState.selectedCharacter) ? 
                              gameState.selectedCharacter : 'jiyul';
    const story = endingStories[selectedCharacter] || endingStories.jiyul;
    
    // 스토리 HTML 생성 (프리미엄 스타일)
    storyText.innerHTML = `
        <h2 style="
            margin-bottom: 25px; 
            font-size: ${isLandscape ? (isMobile ? '22px' : '28px') : '22px'};
            background: linear-gradient(90deg, #FFD700, #FF69B4, #00D9FF);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
            background-size: 200% auto;
            text-shadow: none;
            font-weight: bold;
        ">${story.title}</h2>
        <div style="text-align: left; line-height: 1.8;">
            ${story.story.map((line, i) => `
                <p style="
                    margin: 12px 0; 
                    opacity: 0; 
                    animation: fadeInUp 0.6s ease-out ${i * 0.3}s forwards;
                    color: #E0E0E0;
                    font-size: ${isLandscape ? (isMobile ? '15px' : '17px') : '15px'};
                ">${line}</p>
            `).join('')}
        </div>
        <div style="
            margin-top: 20px; 
            padding: 20px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(233, 69, 96, 0.2));
            border-radius: 15px;
            border: 2px solid rgba(255, 215, 0, 0.4);
            animation: glowPulse 2s ease-in-out infinite;
        ">
            <p style="color: #FFD700; font-weight: bold; margin-bottom: 10px;">${story.achievement}</p>
            <p style="color: #FF69B4; font-size: 14px;">${story.special}</p>
        </div>
    `;
    
    // 게임 통계 (프리미엄 디자인)
    const statsText = document.createElement('div');
    const accuracy = (typeof gameStats !== 'undefined' && gameStats.totalQuestions > 0) ? 
        Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 100;
    const playTime = (typeof gameStats !== 'undefined' && gameStats.startTime) ?
        Math.round((Date.now() - gameStats.startTime) / 1000) : 180;
    
    // 정답률에 따른 등급
    let grade, gradeEmoji, gradeColor;
    if (accuracy >= 95) {
        grade = "레전더리";
        gradeEmoji = "👑";
        gradeColor = "#FFD700";
    } else if (accuracy >= 85) {
        grade = "마스터";
        gradeEmoji = "⭐";
        gradeColor = "#FF69B4";
    } else if (accuracy >= 70) {
        grade = "엑스퍼트";
        gradeEmoji = "💎";
        gradeColor = "#00D9FF";
    } else {
        grade = "챌린저";
        gradeEmoji = "🌱";
        gradeColor = "#7FFF00";
    }
    
    statsText.style.cssText = `
        font-size: ${isLandscape ? '15px' : '13px'};
        color: #FFFFFF;
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1), 
            rgba(138, 43, 226, 0.2));
        backdrop-filter: blur(10px);
        padding: ${isLandscape ? '25px' : '20px'};
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 0 40px rgba(138, 43, 226, 0.1);
        animation: fadeInUp 1s ease-out 0.3s both;
    `;
    
    const finalScore = (typeof gameState !== 'undefined' && gameState.score) ? gameState.score : 1000;
    const characterName = selectedCharacter === 'jiyul' ? '지율이' : 
                         selectedCharacter === 'kiwi' ? '키위' : '화이트하우스';
    
    statsText.innerHTML = `
        <h3 style="
            color: #FFFFFF;
            margin-bottom: 15px;
            font-size: 18px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        ">📊 ${characterName}의 최종 성적표</h3>
        <div style="
            display: grid; 
            grid-template-columns: 1fr auto; 
            gap: 12px; 
            text-align: left;
        ">
            <p style="color: #B0B0B0;">🎯 최종 점수</p>
            <p style="text-align: right; font-weight: bold; color: #FFD700;">
                ${finalScore.toLocaleString()}점
            </p>
            
            <p style="color: #B0B0B0;">📝 정답률</p>
            <p style="text-align: right; font-weight: bold; color: #FF69B4;">
                ${accuracy}%
            </p>
            
            <p style="color: #B0B0B0;">⏱️ 플레이 시간</p>
            <p style="text-align: right; font-weight: bold; color: #00D9FF;">
                ${Math.floor(playTime / 60)}분 ${playTime % 60}초
            </p>
            
            <p style="color: #B0B0B0;">${gradeEmoji} 등급</p>
            <p style="
                text-align: right; 
                font-weight: bold; 
                color: ${gradeColor};
                text-shadow: 0 0 10px ${gradeColor};
                animation: floatUpDown 2s ease-in-out infinite;
            ">${grade}</p>
        </div>
        
        <div style="
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        ">
            <div style="
                width: 100%;
                height: 25px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                overflow: hidden;
                position: relative;
            ">
                <div style="
                    width: ${accuracy}%;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        #FF69B4 0%, 
                        #FFD700 50%, 
                        #00D9FF 100%);
                    border-radius: 12px;
                    transition: width 2s ease-out;
                    animation: shimmer 2s linear infinite;
                    background-size: 200% auto;
                "></div>
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #FFFFFF;
                    font-weight: bold;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                ">${accuracy}%</div>
            </div>
        </div>
    `;
    
    // 버튼 컨테이너 (프리미엄 스타일)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 20px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
    `;
    
    // 메인으로 버튼
    const mainBtn = document.createElement('button');
    mainBtn.textContent = '🏠 메인으로';
    mainBtn.style.cssText = `
        background: linear-gradient(135deg, #667EEA, #764BA2);
        border: none;
        color: white;
        padding: ${isLandscape ? '15px 35px' : '12px 28px'};
        font-size: ${isLandscape ? '17px' : '15px'};
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 30px;
        box-shadow: 
            0 10px 30px rgba(102, 126, 234, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        flex: 1;
        min-width: 130px;
        position: relative;
        overflow: hidden;
    `;
    
    // 다시하기 버튼
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 다시하기';
    retryBtn.style.cssText = `
        background: linear-gradient(135deg, #F093FB, #F5576C);
        border: none;
        color: white;
        padding: ${isLandscape ? '15px 35px' : '12px 28px'};
        font-size: ${isLandscape ? '17px' : '15px'};
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 30px;
        box-shadow: 
            0 10px 30px rgba(245, 87, 108, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        flex: 1;
        min-width: 130px;
        position: relative;
        overflow: hidden;
    `;
    
    // 버튼 호버 효과
    [mainBtn, retryBtn].forEach(btn => {
        // 반짝임 효과 추가
        const sparkle = document.createElement('span');
        sparkle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.3), 
                transparent);
            transform: translate(-50%, -50%) rotate(45deg) scale(0);
            transition: transform 0.6s ease;
        `;
        btn.appendChild(sparkle);
        
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-3px) scale(1.05)';
            btn.style.boxShadow = btn === mainBtn ?
                '0 15px 40px rgba(102, 126, 234, 0.5)' :
                '0 15px 40px rgba(245, 87, 108, 0.5)';
            sparkle.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(2)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = btn === mainBtn ?
                '0 10px 30px rgba(102, 126, 234, 0.4)' :
                '0 10px 30px rgba(245, 87, 108, 0.4)';
            sparkle.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(0)';
        };
    });
    
    mainBtn.onclick = () => {
        document.body.removeChild(endingDiv);
        if (typeof saveGameRecord === 'function') {
            saveGameRecord();
        }
        if (typeof showMenu === 'function') {
            showMenu();
        }
    };
    
    retryBtn.onclick = () => {
        document.body.removeChild(endingDiv);
        if (typeof restartGame === 'function') {
            restartGame();
        }
    };
    
    // 요소들 조립
    canvasContainer.appendChild(endingCanvas);
    
    buttonContainer.appendChild(retryBtn);
    buttonContainer.appendChild(mainBtn);
    
    textContainer.appendChild(storyText);
    textContainer.appendChild(statsText);
    textContainer.appendChild(buttonContainer);
    
    endingDiv.appendChild(canvasContainer);
    endingDiv.appendChild(textContainer);
    
    document.body.appendChild(endingDiv);
    
    // 엔딩 애니메이션 시작
    const endingCtx = endingCanvas.getContext('2d');
    endingCtx.imageSmoothingEnabled = true;
    
    // 파티클 시스템 초기화
    endingParticleSystem = new EndingParticleSystem(endingCanvas, endingCtx);
    
    // 캐릭터별 애니메이션 선택
    let animationFunction;
    switch(selectedCharacter) {
        case 'jiyul':
            animationFunction = animateJiyulEndingSceneHQ;
            break;
        case 'kiwi':
            animationFunction = animateKiwiEndingSceneHQ;
            break;
        case 'whitehouse':
            animationFunction = animateWhitehouseEndingSceneHQ;
            break;
        default:
            animationFunction = animateJiyulEndingSceneHQ;
    }
    
    // 애니메이션 실행
    animationFunction(endingCtx, endingCanvas);
    
    // 축하 파티클
    createEndingParticlesHQ();
    
    // 축하 효과
    createCelebrationEffectsHQ();
}

// 고품질 지율이 엔딩 애니메이션
function animateJiyulEndingSceneHQ(ctx, canvas) {
    let frame = 0;
    const landmarks = ['🗼', '🗽', '🏰', '🗿', '🎆', '🌉', '🕌'];
    let currentLandmark = 0;
    const stars = [];
    
    // 별 초기화
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.01
        });
    }
    
    function draw() {
        // 우주 배경 그라데이션
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(0.3, '#004E92');
        gradient.addColorStop(0.6, '#1A237E');
        gradient.addColorStop(1, '#E91E63');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 은하수 효과
        ctx.save();
        ctx.globalAlpha = 0.3;
        const galaxyGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        galaxyGradient.addColorStop(0, 'transparent');
        galaxyGradient.addColorStop(0.5, '#9C27B0');
        galaxyGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = galaxyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // 반짝이는 별들
        stars.forEach(star => {
            const brightness = (Math.sin(star.twinkle + frame * star.speed) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 별 글로우
            if (brightness > 0.8) {
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = star.size * 4;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        // 움직이는 구름
        drawAnimatedCloudsHQ(ctx, canvas, frame);
        
        // 비행기와 지율이 (고품질)
        drawFlyingAirplaneWithJiyulHQ(ctx, canvas, frame);
        
        // 세계 랜드마크 회전
        if (frame % 90 === 0) {
            currentLandmark = (currentLandmark + 1) % landmarks.length;
            
            // 랜드마크 변경 시 파티클 효과
            if (endingParticleSystem) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height - 80;
                endingParticleSystem.create(centerX, centerY, 'star', 10);
                endingParticleSystem.create(centerX, centerY, 'sparkle', 5);
            }
        }
        
        // 랜드마크 표시 (애니메이션)
        ctx.save();
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        
        const landmarkY = canvas.height - 60 + Math.sin(frame * 0.05) * 10;
        ctx.fillText(landmarks[currentLandmark], canvas.width / 2, landmarkY);
        
        ctx.shadowBlur = 0;
        ctx.restore();
        
        // 영어 단어들이 날아다니는 효과 (고품질)
        drawFloatingEnglishWordsHQ(ctx, canvas, frame);
        
        // 파티클 시스템 업데이트 및 렌더링
        if (endingParticleSystem) {
            endingParticleSystem.update();
            endingParticleSystem.render();
        }
        
        // 땅 (그라데이션)
        const groundGradient = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
        groundGradient.addColorStop(0, '#2E7D32');
        groundGradient.addColorStop(1, '#1B5E20');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// 고품질 키위 엔딩 애니메이션
function animateKiwiEndingSceneHQ(ctx, canvas) {
    let frame = 0;
    const friends = [];
    const musicNotes = [];
    
    // 친구들과 음표 초기화
    for (let i = 0; i < 8; i++) {
        friends.push({
            x: (canvas.width / 8) * i + canvas.width / 16,
            y: canvas.height - 80 - Math.random() * 40,
            color: ['#FF6B9D', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF'][i % 5],
            jumpPhase: Math.random() * Math.PI * 2,
            jumpSpeed: Math.random() * 0.05 + 0.03,
            scale: 1
        });
    }
    
    for (let i = 0; i < 20; i++) {
        musicNotes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10,
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.05 - 0.025,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }
    
    function draw() {
        // 파티 배경 (네온 효과)
        const bgGradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        bgGradient.addColorStop(0, '#FF006E');
        bgGradient.addColorStop(0.3, '#8338EC');
        bgGradient.addColorStop(0.6, '#3A86FF');
        bgGradient.addColorStop(1, '#06FFB4');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 디스코 효과
        ctx.save();
        ctx.globalAlpha = 0.3;
        const discoAngle = frame * 0.02;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + discoAngle;
            ctx.strokeStyle = `hsl(${i * 30}, 100%, 50%)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.lineTo(
                canvas.width / 2 + Math.cos(angle) * canvas.width,
                canvas.height / 2 + Math.sin(angle) * canvas.width
            );
            ctx.stroke();
        }
        ctx.restore();
        
        // 디스코 볼 (고품질)
        drawDiscoBallHQ(ctx, canvas, frame);
        
        // 음표 애니메이션
        musicNotes.forEach(note => {
            note.y -= note.speed;
            note.rotation += note.rotationSpeed;
            
            if (note.y < -note.size) {
                note.y = canvas.height + note.size;
                note.x = Math.random() * canvas.width;
            }
            
            ctx.save();
            ctx.translate(note.x, note.y);
            ctx.rotate(note.rotation);
            ctx.font = `${note.size}px Arial`;
            ctx.fillStyle = note.color;
            ctx.shadowColor = note.color;
            ctx.shadowBlur = 10;
            ctx.fillText('♪', 0, 0);
            ctx.restore();
        });
        
        // 춤추는 키위 (고품질)
        drawDancingKiwiHQ(ctx, canvas, frame);
        
        // 춤추는 친구들 (고품질)
        friends.forEach((friend, i) => {
            const jumpHeight = Math.abs(Math.sin(frame * friend.jumpSpeed + friend.jumpPhase)) * 40;
            friend.scale = 1 + Math.sin(frame * 0.1 + i) * 0.1;
            
            ctx.save();
            ctx.translate(friend.x, friend.y - jumpHeight);
            ctx.scale(friend.scale, friend.scale);
            
            // 친구 몸통 (그라데이션)
            const friendGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
            friendGradient.addColorStop(0, friend.color);
            friendGradient.addColorStop(1, friend.color + '80');
            
            ctx.fillStyle = friendGradient;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // 글로우 효과
            ctx.shadowColor = friend.color;
            ctx.shadowBlur = 20;
            ctx.fill();
            
            ctx.restore();
        });
        
        // 파티클 시스템
        if (endingParticleSystem) {
            // 주기적으로 파티클 생성
            if (frame % 10 === 0) {
                endingParticleSystem.create(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    'confetti',
                    2
                );
            }
            
            endingParticleSystem.update();
            endingParticleSystem.render();
        }
        
        // 무대 바닥 (반사 효과)
        const stageGradient = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
        stageGradient.addColorStop(0, 'rgba(139, 69, 19, 0.8)');
        stageGradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.9)');
        stageGradient.addColorStop(1, 'rgba(101, 67, 33, 1)');
        ctx.fillStyle = stageGradient;
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        
        // 스포트라이트 효과
        drawSpotlightsHQ(ctx, canvas, frame);
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// 고품질 화이트하우스 엔딩 애니메이션
function animateWhitehouseEndingSceneHQ(ctx, canvas) {
    let frame = 0;
    const alphabetKnights = [];
    const fireworks = [];
    const castleFlags = [];
    
    // 알파벳 기사단 초기화
    for (let i = 0; i < 26; i++) {
        alphabetKnights.push({
            letter: String.fromCharCode(65 + i),
            x: (canvas.width / 13) * (i % 13) + canvas.width / 26,
            y: Math.floor(i / 13) * 60 + 120,
            color: `hsl(${i * 14}, 70%, 60%)`,
            marchPhase: Math.random() * Math.PI * 2,
            scale: 1
        });
    }
    
    // 깃발 초기화
    for (let i = 0; i < 5; i++) {
        castleFlags.push({
            x: (canvas.width / 5) * i + canvas.width / 10,
            y: 100,
            color: `hsl(${i * 72}, 60%, 50%)`,
            wave: Math.random() * Math.PI * 2
        });
    }
    
    function draw() {
        // 왕국 배경 (황혼 그라데이션)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#1A237E');
        skyGradient.addColorStop(0.3, '#3949AB');
        skyGradient.addColorStop(0.6, '#7E57C2');
        skyGradient.addColorStop(0.8, '#AB47BC');
        skyGradient.addColorStop(1, '#4CAF50');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 별이 빛나는 밤하늘 (고품질)
        drawStarryNightHQ(ctx, canvas, frame);
        
        // 영어 왕국 성 (고품질)
        drawEnglishCastleHQ(ctx, canvas, frame);
        
        // 왕 화이트하우스 (고품질)
        drawKingWhitehouseHQ(ctx, canvas, frame);
        
        // 알파벳 기사단 행진 (고품질)
        alphabetKnights.forEach((knight, i) => {
            const marchOffset = Math.sin(frame * 0.05 + knight.marchPhase) * 10;
            const jumpHeight = Math.abs(Math.sin(frame * 0.1 + i * 0.2)) * 15;
            
            ctx.save();
            ctx.translate(knight.x + marchOffset, knight.y - jumpHeight);
            
            // 기사 갑옷 (메탈릭 효과)
            const armorGradient = ctx.createLinearGradient(-15, -20, 15, 20);
            armorGradient.addColorStop(0, knight.color);
            armorGradient.addColorStop(0.5, '#FFFFFF');
            armorGradient.addColorStop(1, knight.color);
            
            ctx.fillStyle = armorGradient;
            ctx.fillRect(-15, -10, 30, 30);
            
            // 알파벳 (3D 효과)
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 4;
            ctx.fillText(knight.letter, 0, 5);
            
            ctx.restore();
        });
        
        // 왕국 깃발들 (고품질)
        castleFlags.forEach(flag => {
            const wave = Math.sin(frame * 0.03 + flag.wave) * 15;
            
            ctx.save();
            ctx.translate(flag.x, flag.y);
            
            // 깃대
            const poleGradient = ctx.createLinearGradient(-2, 0, 2, 0);
            poleGradient.addColorStop(0, '#654321');
            poleGradient.addColorStop(0.5, '#8B7355');
            poleGradient.addColorStop(1, '#654321');
            ctx.fillStyle = poleGradient;
            ctx.fillRect(-2, 0, 4, 150);
            
            // 깃발 (물결 효과)
            ctx.beginPath();
            ctx.moveTo(2, 0);
            for (let i = 0; i <= 40; i++) {
                const x = 2 + i;
                const y = Math.sin(i * 0.2 + frame * 0.05) * 5 + Math.sin(frame * 0.03 + flag.wave) * 3;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(42, 30);
            ctx.lineTo(2, 30);
            ctx.closePath();
            
            const flagGradient = ctx.createLinearGradient(2, 0, 42, 0);
            flagGradient.addColorStop(0, flag.color);
            flagGradient.addColorStop(1, flag.color + '80');
            ctx.fillStyle = flagGradient;
            ctx.fill();
            
            ctx.restore();
        });
        
        // 불꽃놀이 시스템
        if (frame % 60 === 0) {
            fireworks.push({
                x: Math.random() * canvas.width,
                y: canvas.height,
                targetY: Math.random() * canvas.height * 0.4 + 50,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                exploded: false,
                particles: []
            });
        }
        
        // 불꽃놀이 업데이트 및 렌더링
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            
            if (!fw.exploded) {
                fw.y -= 5;
                
                // 상승 트레일
                ctx.strokeStyle = fw.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = fw.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(fw.x, fw.y);
                ctx.lineTo(fw.x, fw.y + 20);
                ctx.stroke();
                ctx.shadowBlur = 0;
                
                if (fw.y <= fw.targetY) {
                    fw.exploded = true;
                    
                    // 파티클 생성
                    for (let j = 0; j < 50; j++) {
                        const angle = (Math.PI * 2 / 50) * j;
                        const velocity = Math.random() * 4 + 2;
                        fw.particles.push({
                            x: fw.x,
                            y: fw.y,
                            vx: Math.cos(angle) * velocity,
                            vy: Math.sin(angle) * velocity,
                            life: 60
                        });
                    }
                    
                    // 엔딩 파티클 시스템에도 추가
                    if (endingParticleSystem) {
                        endingParticleSystem.create(fw.x, fw.y, 'star', 15);
                    }
                }
            } else {
                fw.particles = fw.particles.filter(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.vx *= 0.99;
                    p.life--;
                    
                    const alpha = p.life / 60;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = fw.color;
                    ctx.shadowColor = fw.color;
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    
                    return p.life > 0;
                });
                
                if (fw.particles.length === 0) {
                    fireworks.splice(i, 1);
                }
            }
        }
        
        // 파티클 시스템
        if (endingParticleSystem) {
            endingParticleSystem.update();
            endingParticleSystem.render();
        }
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// === 고품질 보조 함수들 ===

// 고품질 구름 애니메이션
function drawAnimatedCloudsHQ(ctx, canvas, frame) {
    const clouds = [
        { x: (frame * 0.3) % (canvas.width + 200) - 100, y: 50, size: 1.5, opacity: 0.7 },
        { x: (frame * 0.2 + 300) % (canvas.width + 200) - 100, y: 90, size: 1, opacity: 0.5 },
        { x: (frame * 0.4 + 600) % (canvas.width + 200) - 100, y: 30, size: 1.2, opacity: 0.6 }
    ];
    
    clouds.forEach(cloud => {
        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        
        // 구름 그라데이션
        const cloudGradient = ctx.createRadialGradient(
            cloud.x, cloud.y, 0,
            cloud.x, cloud.y, 40 * cloud.size
        );
        cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = cloudGradient;
        
        // 부드러운 구름 모양
        for (let i = 0; i < 5; i++) {
            const offsetX = (i - 2) * 25 * cloud.size;
            const offsetY = Math.sin(i) * 10 * cloud.size;
            ctx.beginPath();
            ctx.arc(cloud.x + offsetX, cloud.y + offsetY, 20 * cloud.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// 고품질 비행기와 지율이
function drawFlyingAirplaneWithJiyulHQ(ctx, canvas, frame) {
    const planeX = canvas.width / 2 + Math.sin(frame * 0.01) * 150;
    const planeY = 120 + Math.sin(frame * 0.03) * 30;
    const tilt = Math.sin(frame * 0.02) * 0.1;
    
    ctx.save();
    ctx.translate(planeX, planeY);
    ctx.rotate(tilt);
    
    // 비행기 그림자
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(0, 100, 80, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 비행기 몸체 (메탈릭 효과)
    const bodyGradient = ctx.createLinearGradient(-80, -20, -80, 20);
    bodyGradient.addColorStop(0, '#F0F0F0');
    bodyGradient.addColorStop(0.5, '#FFFFFF');
    bodyGradient.addColorStop(1, '#D0D0D0');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-80, -15, 160, 30);
    
    // 비행기 날개
    const wingGradient = ctx.createLinearGradient(0, -40, 0, 40);
    wingGradient.addColorStop(0, '#4169E1');
    wingGradient.addColorStop(1, '#1E90FF');
    ctx.fillStyle = wingGradient;
    ctx.fillRect(-30, -40, 60, 80);
    
    // 비행기 꼬리
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.moveTo(80, -15);
    ctx.lineTo(100, -30);
    ctx.lineTo(100, 30);
    ctx.lineTo(80, 15);
    ctx.closePath();
    ctx.fill();
    
    // 창문들 (반사 효과)
    for (let i = 0; i < 10; i++) {
        const windowX = -70 + i * 15;
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(windowX, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 창문 반사광
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(windowX - 1, -1, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 엔진 불꽃
    const flameGradient = ctx.createLinearGradient(-100, 0, -80, 0);
    flameGradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
    flameGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.5)');
    flameGradient.addColorStop(1, 'rgba(255, 100, 0, 0.8)');
    
    ctx.fillStyle = flameGradient;
    for (let i = 0; i < 3; i++) {
        const flameOffset = Math.sin(frame * 0.2 + i) * 5;
        ctx.beginPath();
        ctx.moveTo(-80, -5 + i * 5);
        ctx.lineTo(-100 - flameOffset, 0 + i * 3);
        ctx.lineTo(-80, 5 + i * 5);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
    
    // 비행운
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const trailX = planeX - 100 - i * 50;
        const trailY = planeY + Math.sin((frame - i * 10) * 0.03) * 30;
        if (i === 0) ctx.moveTo(trailX, trailY);
        else ctx.lineTo(trailX, trailY);
    }
    ctx.stroke();
}

// 고품질 영어 단어 애니메이션
function drawFloatingEnglishWordsHQ(ctx, canvas, frame) {
    const words = [
        { text: 'AMAZING', color: '#FF6B9D' },
        { text: 'WONDERFUL', color: '#FFD93D' },
        { text: 'EXCELLENT', color: '#6BCB77' },
        { text: 'FANTASTIC', color: '#4ECDC4' },
        { text: 'BRILLIANT', color: '#C44569' },
        { text: 'PERFECT', color: '#F8B195' },
        { text: 'GREAT', color: '#F67280' },
        { text: 'SUPER', color: '#355C7D' }
    ];
    
    words.forEach((word, i) => {
        const x = (canvas.width / words.length * i + frame * 2) % (canvas.width + 200) - 100;
        const y = 200 + Math.sin(frame * 0.03 + i * 0.5) * 40;
        const scale = 1 + Math.sin(frame * 0.04 + i) * 0.3;
        const rotation = Math.sin(frame * 0.02 + i) * 0.2;
        const opacity = (Math.sin(frame * 0.03 + i) + 1) / 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;
        
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 텍스트 글로우
        ctx.shadowColor = word.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = word.color;
        ctx.fillText(word.text, 0, 0);
        
        // 아웃라인
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeText(word.text, 0, 0);
        
        ctx.restore();
    });
}

// 고품질 디스코볼
function drawDiscoBallHQ(ctx, canvas, frame) {
    const centerX = canvas.width / 2;
    const centerY = 80;
    const radius = 40;
    
    ctx.save();
    
    // 디스코볼 본체 (메탈릭)
    const ballGradient = ctx.createRadialGradient(
        centerX - radius/3, centerY - radius/3, 0,
        centerX, centerY, radius
    );
    ballGradient.addColorStop(0, '#FFFFFF');
    ballGradient.addColorStop(0.3, '#C0C0C0');
    ballGradient.addColorStop(1, '#808080');
    
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 미러 타일들
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i + frame * 0.02;
        const tileX = centerX + Math.cos(angle) * (radius - 5);
        const tileY = centerY + Math.sin(angle) * (radius - 5);
        
        const tileColor = `hsl(${(frame * 2 + i * 18) % 360}, 100%, 70%)`;
        ctx.fillStyle = tileColor;
        ctx.fillRect(tileX - 4, tileY - 4, 8, 8);
        
        // 반사광
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(tileX - 2, tileY - 2, 2, 2);
    }
    
    // 빛줄기
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + frame * 0.01;
        const lightGradient = ctx.createLinearGradient(
            centerX, centerY,
            centerX + Math.cos(angle) * 300,
            centerY + Math.sin(angle) * 300
        );
        lightGradient.addColorStop(0, `hsl(${i * 30}, 100%, 60%)`);
        lightGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = lightGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * 300,
            centerY + Math.sin(angle) * 300
        );
        ctx.stroke();
    }
    
    ctx.restore();
}

// 고품질 춤추는 키위
function drawDancingKiwiHQ(ctx, canvas, frame) {
    const kiwiX = canvas.width / 2;
    const kiwiY = canvas.height - 100 + Math.abs(Math.sin(frame * 0.1)) * -30;
    const rotation = Math.sin(frame * 0.08) * 0.3;
    const scale = 1 + Math.sin(frame * 0.06) * 0.1;
    
    ctx.save();
    ctx.translate(kiwiX, kiwiY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    // 키위 몸체 (그라데이션)
    const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
    bodyGradient.addColorStop(0, '#8BC34A');
    bodyGradient.addColorStop(0.7, '#689F38');
    bodyGradient.addColorStop(1, '#558B2F');
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 키위 눈 (반짝임)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-10, -10, 8, 0, Math.PI * 2);
    ctx.arc(10, -10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-8, -10, 5, 0, Math.PI * 2);
    ctx.arc(8, -10, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 반짝임
    const sparkle = (Math.sin(frame * 0.1) + 1) / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkle})`;
    ctx.beginPath();
    ctx.arc(-6, -12, 2, 0, Math.PI * 2);
    ctx.arc(6, -12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 음표 효과
    for (let i = 0; i < 3; i++) {
        const noteX = -40 + i * 40;
        const noteY = -40 - Math.sin(frame * 0.15 + i) * 20;
        
        ctx.font = '20px Arial';
        ctx.fillStyle = `hsl(${frame * 3 + i * 120}, 100%, 60%)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillText('♪', noteX, noteY);
    }
    
    ctx.restore();
}

// 고품질 스포트라이트
function drawSpotlightsHQ(ctx, canvas, frame) {
    const lights = [
        { x: canvas.width * 0.2, color: 'rgba(255, 105, 180, 0.4)', angle: 0.3 },
        { x: canvas.width * 0.5, color: 'rgba(255, 215, 0, 0.4)', angle: 0 },
        { x: canvas.width * 0.8, color: 'rgba(135, 206, 235, 0.4)', angle: -0.3 }
    ];
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    lights.forEach((light, i) => {
        const angle = Math.sin(frame * 0.03 + i * Math.PI / 3) * light.angle;
        
        const lightGradient = ctx.createLinearGradient(
            light.x, 0,
            light.x + angle * 200, canvas.height
        );
        lightGradient.addColorStop(0, light.color);
        lightGradient.addColorStop(0.5, light.color.replace('0.4', '0.2'));
        lightGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = lightGradient;
        ctx.beginPath();
        ctx.moveTo(light.x - 20, 0);
        ctx.lineTo(light.x + 20, 0);
        ctx.lineTo(light.x + angle * 200 + 100, canvas.height);
        ctx.lineTo(light.x + angle * 200 - 100, canvas.height);
        ctx.closePath();
        ctx.fill();
    });
    
    ctx.restore();
}

// 고품질 별이 빛나는 밤
function drawStarryNightHQ(ctx, canvas, frame) {
    // 은하수
    ctx.save();
    ctx.globalAlpha = 0.4;
    const galaxyGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    galaxyGradient.addColorStop(0, 'transparent');
    galaxyGradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.3)');
    galaxyGradient.addColorStop(0.7, 'rgba(75, 0, 130, 0.3)');
    galaxyGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = galaxyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
    ctx.restore();
    
    // 별들
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 37) % (canvas.height / 2);
        const brightness = (Math.sin(frame * 0.03 + i * 0.5) + 1) / 2;
        const size = 1 + brightness;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 밝은 별에 글로우
        if (brightness > 0.7) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = size * 5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // 유성
    if (Math.random() < 0.01) {
        const meteorX = Math.random() * canvas.width;
        const meteorY = Math.random() * canvas.height * 0.3;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(meteorX, meteorY);
        ctx.lineTo(meteorX + 50, meteorY + 20);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // 달
    const moonGradient = ctx.createRadialGradient(
        canvas.width - 100, 80, 0,
        canvas.width - 100, 80, 30
    );
    moonGradient.addColorStop(0, '#FFFACD');
    moonGradient.addColorStop(0.7, '#FFF8DC');
    moonGradient.addColorStop(1, 'rgba(255, 248, 220, 0.3)');
    
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(canvas.width - 100, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // 달 표면 디테일
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.beginPath();
    ctx.arc(canvas.width - 105, 75, 5, 0, Math.PI * 2);
    ctx.arc(canvas.width - 95, 85, 3, 0, Math.PI * 2);
    ctx.arc(canvas.width - 100, 90, 4, 0, Math.PI * 2);
    ctx.fill();
}

// 고품질 영어 성
function drawEnglishCastleHQ(ctx, canvas, frame) {
    const castleX = canvas.width / 2;
    const castleY = canvas.height - 200;
    
    // 성 본체 (그라데이션과 텍스처)
    const castleGradient = ctx.createLinearGradient(
        castleX - 120, castleY,
        castleX - 120, castleY + 120
    );
    castleGradient.addColorStop(0, '#8B7355');
    castleGradient.addColorStop(0.5, '#A0826D');
    castleGradient.addColorStop(1, '#6B5437');
    
    ctx.fillStyle = castleGradient;
    ctx.fillRect(castleX - 120, castleY, 240, 120);
    
    // 성벽 디테일
    ctx.strokeStyle = '#5C4A39';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(castleX - 120, castleY + i * 25);
        ctx.lineTo(castleX + 120, castleY + i * 25);
        ctx.stroke();
    }
    
    // 성 탑들
    const towers = [-100, -50, 0, 50, 100];
    towers.forEach((offset, i) => {
        // 탑 본체
        const towerGradient = ctx.createLinearGradient(
            castleX + offset - 20, castleY - 50,
            castleX + offset + 20, castleY - 50
        );
        towerGradient.addColorStop(0, '#8B6F47');
        towerGradient.addColorStop(0.5, '#A0826D');
        towerGradient.addColorStop(1, '#8B6F47');
        
        ctx.fillStyle = towerGradient;
        ctx.fillRect(castleX + offset - 20, castleY - 50, 40, 170);
        
        // 탑 지붕 (원뿔형)
        const roofGradient = ctx.createLinearGradient(
            castleX + offset, castleY - 80,
            castleX + offset, castleY - 50
        );
        roofGradient.addColorStop(0, '#4169E1');
        roofGradient.addColorStop(1, '#1E90FF');
        
        ctx.fillStyle = roofGradient;
        ctx.beginPath();
        ctx.moveTo(castleX + offset - 25, castleY - 50);
        ctx.lineTo(castleX + offset, castleY - 90);
        ctx.lineTo(castleX + offset + 25, castleY - 50);
        ctx.closePath();
        ctx.fill();
        
        // 깃발 (애니메이션)
        const flagWave = Math.sin(frame * 0.04 + i) * 10;
        
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(castleX + offset, castleY - 90);
        ctx.lineTo(castleX + offset, castleY - 120);
        ctx.stroke();
        
        ctx.fillStyle = ['#FF1493', '#FFD700', '#00CED1', '#32CD32', '#FF6347'][i];
        ctx.beginPath();
        ctx.moveTo(castleX + offset, castleY - 120);
        ctx.quadraticCurveTo(
            castleX + offset + 15 + flagWave, castleY - 115,
            castleX + offset + 20 + flagWave, castleY - 110
        );
        ctx.lineTo(castleX + offset + 20 + flagWave, castleY - 100);
        ctx.quadraticCurveTo(
            castleX + offset + 15 + flagWave, castleY - 105,
            castleX + offset, castleY - 100
        );
        ctx.closePath();
        ctx.fill();
    });
    
    // 성문 (아치형)
    const gateGradient = ctx.createRadialGradient(
        castleX, castleY + 80, 0,
        castleX, castleY + 80, 40
    );
    gateGradient.addColorStop(0, '#2F1F0F');
    gateGradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = gateGradient;
    ctx.beginPath();
    ctx.arc(castleX, castleY + 60, 35, Math.PI, 0);
    ctx.lineTo(castleX + 35, castleY + 120);
    ctx.lineTo(castleX - 35, castleY + 120);
    ctx.closePath();
    ctx.fill();
}

// 고품질 왕 화이트하우스
function drawKingWhitehouseHQ(ctx, canvas, frame) {
    const whX = canvas.width / 2;
    const whY = canvas.height - 220;
    const floatY = Math.sin(frame * 0.04) * 5;
    
    ctx.save();
    ctx.translate(whX, whY + floatY);
    
    // 왕좌 (뒤쪽)
    const throneGradient = ctx.createLinearGradient(-40, 20, 40, 20);
    throneGradient.addColorStop(0, '#8B0000');
    throneGradient.addColorStop(0.5, '#DC143C');
    throneGradient.addColorStop(1, '#8B0000');
    
    ctx.fillStyle = throneGradient;
    ctx.fillRect(-40, 20, 80, 60);
    ctx.fillRect(-50, -10, 100, 40);
    
    // 화이트하우스 텐트 (왕 복장)
    const tentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
    tentGradient.addColorStop(0, '#FFFFFF');
    tentGradient.addColorStop(0.5, '#F0F0F0');
    tentGradient.addColorStop(1, '#D0D0D0');
    
    ctx.fillStyle = tentGradient;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(-35, 30);
    ctx.lineTo(35, 30);
    ctx.closePath();
    ctx.fill();
    
    // 왕실 망토
    const capeGradient = ctx.createLinearGradient(-50, -30, 50, -30);
    capeGradient.addColorStop(0, '#4B0082');
    capeGradient.addColorStop(0.5, '#6A0DAD');
    capeGradient.addColorStop(1, '#4B0082');
    
    ctx.fillStyle = capeGradient;
    ctx.beginPath();
    ctx.moveTo(-35, -20);
    ctx.quadraticCurveTo(-60, 0, -50, 40);
    ctx.lineTo(50, 40);
    ctx.quadraticCurveTo(60, 0, 35, -20);
    ctx.closePath();
    ctx.fill();
    
    // 왕관 (고급 버전)
    ctx.save();
    ctx.translate(0, -55);
    ctx.rotate(Math.sin(frame * 0.03) * 0.05);
    
    const crownGradient = ctx.createLinearGradient(-25, 0, 25, 0);
    crownGradient.addColorStop(0, '#FFD700');
    crownGradient.addColorStop(0.3, '#FFED4E');
    crownGradient.addColorStop(0.7, '#FFED4E');
    crownGradient.addColorStop(1, '#FFD700');
    
    ctx.fillStyle = crownGradient;
    ctx.fillRect(-25, 10, 50, 20);
    
    // 왕관 포인트
    const crownPoints = [
        [-25, 10], [-20, -5], [-15, 10], [-10, -8],
        [-5, 10], [0, -10], [5, 10], [10, -8],
        [15, 10], [20, -5], [25, 10]
    ];
    
    ctx.beginPath();
    crownPoints.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.fill();
    
    // 보석들
    const gems = [
        { x: -15, y: 15, color: '#FF1493', size: 4 },
        { x: 0, y: 13, color: '#00CED1', size: 5 },
        { x: 15, y: 15, color: '#32CD32', size: 4 }
    ];
    
    gems.forEach(gem => {
        // 보석 본체
        ctx.fillStyle = gem.color;
        ctx.beginPath();
        ctx.arc(gem.x, gem.y, gem.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 보석 반짝임
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(gem.x - 1, gem.y - 1, gem.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.restore();
    
    // 왕홀
    ctx.save();
    ctx.translate(45, -10);
    ctx.rotate(-0.3);
    
    // 왕홀 막대
    const scepterGradient = ctx.createLinearGradient(0, 0, 0, 50);
    scepterGradient.addColorStop(0, '#FFD700');
    scepterGradient.addColorStop(1, '#B8860B');
    ctx.fillStyle = scepterGradient;
    ctx.fillRect(-2, 0, 4, 50);
    
    // 왕홀 보석
    ctx.fillStyle = '#FF1493';
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.restore();
    
    ctx.restore();
}

// 고품질 축하 파티클
function createEndingParticlesHQ() {
    const container = document.getElementById('endingScreen');
    if (!container) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;
    
    // 다양한 파티클 타입
    const particleTypes = ['⭐', '💖', '✨', '🎊', '🎉', '💫', '🌟'];
    
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        const size = Math.random() * 25 + 15;
        const startX = Math.random() * 100;
        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 5;
        
        particle.textContent = type;
        particle.style.cssText = `
            position: absolute;
            font-size: ${size}px;
            left: ${startX}%;
            top: -50px;
            animation: 
                particleFall ${duration}s linear ${delay}s infinite,
                particleRotate ${duration}s linear ${delay}s infinite;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        `;
        
        particleContainer.appendChild(particle);
    }
    
    container.appendChild(particleContainer);
    
    // 파티클 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent += `
        @keyframes particleFall {
            0% {
                transform: translateY(-50px);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 50px));
                opacity: 0;
            }
        }
        @keyframes particleRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // 15초 후 제거
    setTimeout(() => {
        if (particleContainer.parentElement) {
            particleContainer.remove();
        }
    }, 15000);
}

// 고품질 축하 효과
function createCelebrationEffectsHQ() {
    // 화면 플래시 효과 (고급)
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, 
            rgba(255, 255, 255, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(138, 43, 226, 0.4),
            transparent 70%);
        pointer-events: none;
        z-index: 10002;
        animation: superFlash 1s ease-out;
    `;
    
    const flashStyle = document.createElement('style');
    flashStyle.textContent = `
        @keyframes superFlash {
            0% { 
                opacity: 0; 
                transform: scale(0.5);
            }
            50% { 
                opacity: 1; 
                transform: scale(1.2);
            }
            100% { 
                opacity: 0;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(flashStyle);
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 1000);
    
    // 축하 메시지 팝업들 (고급 버전)
    const celebrationEmojis = ['🎉', '🎊', '🏆', '⭐', '💯', '👑', '🌟'];
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF6347'];
    
    celebrationEmojis.forEach((emoji, i) => {
        setTimeout(() => {
            const popup = document.createElement('div');
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 100);
            const rotation = Math.random() * 720 - 360;
            const scale = Math.random() * 1.5 + 1;
            
            popup.textContent = emoji;
            popup.style.cssText = `
                position: fixed;
                font-size: 60px;
                left: ${x}px;
                top: ${y}px;
                z-index: 10003;
                animation: megaPopup 1.5s ease-out forwards;
                pointer-events: none;
                filter: drop-shadow(0 0 20px ${colors[i % colors.length]});
                transform: rotate(${rotation}deg) scale(${scale});
            `;
            
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 1500);
        }, i * 200);
    });
    
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        @keyframes megaPopup {
            0% { 
                transform: scale(0) rotate(0deg);
                opacity: 0;
            }
            50% {
                transform: scale(2) rotate(180deg);
                opacity: 1;
            }
            100% { 
                transform: scale(1) rotate(360deg);
                opacity: 0;
                filter: blur(10px);
            }
        }
    `;
    document.head.appendChild(popupStyle);
    
    // 무지개 웨이브 효과
    const rainbowWave = document.createElement('div');
    rainbowWave.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
            transparent,
            rgba(255, 0, 0, 0.3),
            rgba(255, 165, 0, 0.3),
            rgba(255, 255, 0, 0.3),
            rgba(0, 255, 0, 0.3),
            rgba(0, 0, 255, 0.3),
            rgba(75, 0, 130, 0.3),
            rgba(238, 130, 238, 0.3),
            transparent
        );
        pointer-events: none;
        z-index: 10001;
        animation: rainbowWave 3s ease-in-out;
    `;
    
    const waveStyle = document.createElement('style');
    waveStyle.textContent = `
        @keyframes rainbowWave {
            0% {
                transform: translateX(-100%);
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(waveStyle);
    document.body.appendChild(rainbowWave);
    
    setTimeout(() => rainbowWave.remove(), 3000);
}