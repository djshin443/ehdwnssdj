// 엔딩 시스템 - ending_landscape.js (가로화면 최적화 & 대화형 스토리)

// 엔딩 대화 시스템 변수
let endingDialogues = null;
let endingDialogueIndex = 0;
let isEndingDialogueActive = false;
let endingAutoPlayInterval = null;
let endingCanvas = null;
let endingCtx = null;
let endingAnimationFrame = null;

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
            p.velocity.y += 0.1;
            p.velocity.x *= 0.99;
            p.rotation += p.rotationSpeed;
            
            if (p.age > p.lifetime * 0.7) {
                p.opacity = Math.max(0, 1 - (p.age - p.lifetime * 0.7) / (p.lifetime * 0.3));
            }
            
            return p.age < p.lifetime && p.opacity > 0;
        });
    }
    
    render() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.scale(p.scale, p.scale);
            
            if (p.type === 'star') {
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
                const scaleX = Math.cos(p.age * 0.1);
                this.ctx.scale(scaleX, 1);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size * 0.6);
            } else if (p.type === 'sparkle') {
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
            }
            
            this.ctx.restore();
        });
    }
}

let endingParticleSystem = null;

// 가로 화면 회전 메시지
function showRotateDeviceMessage() {
    const rotateMsg = document.createElement('div');
    rotateMsg.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(255, 165, 0, 0.9));
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-family: 'Jua', sans-serif;
        font-size: 14px;
        z-index: 10001;
        animation: bounce 2s ease-in-out infinite;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    rotateMsg.textContent = '📱 화면을 가로로 돌려주세요! 더 멋진 엔딩을 볼 수 있어요!';
    document.body.appendChild(rotateMsg);
    
    setTimeout(() => {
        if (rotateMsg.parentElement) {
            rotateMsg.remove();
        }
    }, 5000);
}

// 캐릭터별 엔딩 스토리 (대화형)
const endingStoryDialogues = {
    jiyul: [
        { speaker: 'narrator', text: '🌟 드디어 모든 스테이지를 클리어한 지율이!' },
        { speaker: 'jiyul', text: '와! 정말 해냈어! 영어 마스터가 된 기분이야!' },
        { speaker: 'narrator', text: '✨ 그 순간, 하늘에서 황금빛 편지가 날아왔습니다.' },
        { speaker: 'system', text: '🎯 "지율이님, 축하합니다! 세계 영어 마스터 자격증을 수여합니다!"' },
        { speaker: 'jiyul', text: '우와! 이제 전 세계 친구들과 영어로 대화할 수 있겠다!' },
        { speaker: 'narrator', text: '🚀 지율이 앞에 마법의 비행기가 나타났습니다.' },
        { speaker: 'pilot', text: '지율이님! 세계일주 영어 여행을 떠나실 준비가 되셨나요?' },
        { speaker: 'jiyul', text: '네! 런던 빅벤부터 시작해볼게요! "Hello, Big Ben!"' },
        { speaker: 'narrator', text: '🌍 지율이의 세계 영어 모험이 시작되었습니다!' },
        { speaker: 'kiwi', text: '지율아! 나도 같이 가고 싶어! 통역 도와줄게!' },
        { speaker: 'whitehouse', text: '나도 가방에 영어 사전 가득 챙겼어! 함께 가자!' },
        { speaker: 'jiyul', text: '좋아! 모두 함께 영어 모험을 떠나자! Let\'s go!' },
        { speaker: 'narrator', text: '🎊 그렇게 친구들과 함께 새로운 모험이 시작되었습니다!' },
        { speaker: 'achievement', text: '🏆 달성: 글로벌 영어 마스터 인증 완료!' },
        { speaker: 'achievement', text: '🎁 보너스: 세계 여행 티켓 & 친구들과의 우정!' }
    ],
    kiwi: [
        { speaker: 'narrator', text: '🦎 모든 영어 퀘스트를 완료한 키위!' },
        { speaker: 'kiwi', text: '끄아아! (번역: 드디어 해냈다! 영어 천재 도마뱀이 되었어!)' },
        { speaker: 'narrator', text: '✨ 갑자기 키위의 몸에서 무지개빛이 나기 시작했습니다!' },
        { speaker: 'system', text: '🌈 "키위님이 레전더리 도마뱀으로 진화합니다!"' },
        { speaker: 'kiwi', text: 'Wow! I can speak perfect English now! (완벽한 영어를 할 수 있어!)' },
        { speaker: 'narrator', text: '📢 소식을 들은 UN에서 긴급 연락이 왔습니다.' },
        { speaker: 'un', text: '키위님! 세계 최초 동물 통역관으로 모시고 싶습니다!' },
        { speaker: 'kiwi', text: '끄륵! (영광입니다! 세계 평화를 위해 일하겠습니다!)' },
        { speaker: 'jiyul', text: '키위야! 정말 대단해! 넌 이제 진짜 영어 천재야!' },
        { speaker: 'kiwi', text: 'Thank you, Jiyul! You\'re my best friend!' },
        { speaker: 'narrator', text: '🎪 키위는 영어 서커스단을 만들기로 했습니다.' },
        { speaker: 'kiwi', text: '모든 동물 친구들에게 영어를 가르쳐줄거야!' },
        { speaker: 'animals', text: '🐶🐱🐰 "키위 선생님! 우리도 영어 배우고 싶어요!"' },
        { speaker: 'achievement', text: '🏆 달성: 최연소(?) UN 명예 통역관!' },
        { speaker: 'achievement', text: '🎁 보너스: 키위 영어학원 설립! 첫 제자는 지율이!' }
    ],
    whitehouse: [
        { speaker: 'narrator', text: '🏰 모든 영어 미션을 완수한 화이트하우스!' },
        { speaker: 'whitehouse', text: '데이터 분석 완료... 영어 마스터리 100% 달성!' },
        { speaker: 'narrator', text: '✨ 화이트하우스의 텐트가 거대한 성으로 변신하기 시작했습니다!' },
        { speaker: 'system', text: '⚡ "영어 왕국 건설 시스템 활성화!"' },
        { speaker: 'whitehouse', text: '이제 내 꿈이 이루어졌어! 영어 왕국을 건설할 수 있게 됐어!' },
        { speaker: 'narrator', text: '📚 텐트 안이 마법의 영어 도서관으로 변했습니다.' },
        { speaker: 'books', text: '📖 "안녕하세요, 화이트하우스님! 우리는 살아있는 영어 단어들이에요!"' },
        { speaker: 'whitehouse', text: '놀라워! 이제 모든 영어 지식이 내 왕국에 있구나!' },
        { speaker: 'alphabet', text: '🔤 "A부터 Z까지, 우리 모두 당신의 기사가 되겠습니다!"' },
        { speaker: 'jiyul', text: '화이트하우스! 정말 멋진 왕국이야! 나도 놀러갈게!' },
        { speaker: 'kiwi', text: '나도 왕국의 친선대사가 되고 싶어!' },
        { speaker: 'whitehouse', text: '모두 환영이야! 함께 영어 왕국을 만들어가자!' },
        { speaker: 'narrator', text: '👑 화이트하우스는 평화로운 영어 왕국의 왕이 되었습니다.' },
        { speaker: 'achievement', text: '🏆 달성: 영어 왕국의 초대 국왕 즉위!' },
        { speaker: 'achievement', text: '🎁 보너스: 지율이와 키위가 왕국의 명예 기사 임명!' }
    ]
};

// 메인 엔딩 함수
function showEnding() {
    // 게임 상태 정리
    if (typeof gameState !== 'undefined') {
        gameState.running = false;
        gameState.isMoving = false;
    }
    
    // 화면 방향 체크
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 세로 모드일 경우 알림
    if (!isLandscape && isMobile) {
        showRotateDeviceMessage();
    }
    
    // 엔딩 화면 생성
    const endingDiv = document.createElement('div');
    endingDiv.id = 'endingScreen';
    endingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
            #0f0c29 0%, 
            #302b63 33%, 
            #24243e 66%,
            #0f0c29 100%);
        z-index: 10000;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-family: 'Jua', sans-serif;
        padding: 10px;
        gap: 10px;
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
            rgba(138, 43, 226, 0.1) 0%, 
            transparent 60%);
        animation: pulseGlow 3s ease-in-out infinite;
        pointer-events: none;
    `;
    endingDiv.appendChild(bgOverlay);
    
    // 왼쪽: 캔버스 영역 (50%)
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        flex: 1;
        max-width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    `;
    
    // 엔딩 캔버스
    endingCanvas = document.createElement('canvas');
    const maxCanvasWidth = window.innerWidth * 0.48;
    const maxCanvasHeight = window.innerHeight * 0.9;
    
    // 16:9 비율 유지
    let canvasWidth = maxCanvasWidth;
    let canvasHeight = canvasWidth * 9 / 16;
    
    if (canvasHeight > maxCanvasHeight) {
        canvasHeight = maxCanvasHeight;
        canvasWidth = canvasHeight * 16 / 9;
    }
    
    endingCanvas.width = canvasWidth;
    endingCanvas.height = canvasHeight;
    endingCanvas.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(30, 30, 60, 0.95) 0%, 
            rgba(60, 30, 90, 0.95) 100%);
        border: 3px solid rgba(138, 43, 226, 0.5);
        border-radius: 20px;
        box-shadow: 
            0 20px 60px rgba(138, 43, 226, 0.4),
            0 0 100px rgba(138, 43, 226, 0.2),
            inset 0 0 60px rgba(255, 255, 255, 0.05);
        max-width: 100%;
        max-height: 100%;
    `;
    
    canvasContainer.appendChild(endingCanvas);
    
    // 오른쪽: 대화 영역 (50%)
    const dialogueContainer = document.createElement('div');
    dialogueContainer.style.cssText = `
        flex: 1;
        max-width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        gap: 15px;
    `;
    
    // 상단: 게임 통계
    const statsPanel = createStatsPanel();
    
    // 중앙: 대화 박스
    const dialogueBox = createEndingDialogueBox();
    
    // 하단: 컨트롤 버튼들
    const controlPanel = createControlPanel(endingDiv);
    
    // 조립
    dialogueContainer.appendChild(statsPanel);
    dialogueContainer.appendChild(dialogueBox);
    dialogueContainer.appendChild(controlPanel);
    
    endingDiv.appendChild(canvasContainer);
    endingDiv.appendChild(dialogueContainer);
    
    document.body.appendChild(endingDiv);
    
    // 애니메이션 초기화
    endingCtx = endingCanvas.getContext('2d');
    endingCtx.imageSmoothingEnabled = true;
    
    // 파티클 시스템 초기화
    endingParticleSystem = new EndingParticleSystem(endingCanvas, endingCtx);
    
    // 캐릭터별 대화 시작
    const selectedCharacter = (typeof gameState !== 'undefined' && gameState.selectedCharacter) ? 
                              gameState.selectedCharacter : 'jiyul';
    
    endingDialogues = endingStoryDialogues[selectedCharacter] || endingStoryDialogues.jiyul;
    endingDialogueIndex = 0;
    isEndingDialogueActive = true;
    
    // 첫 대화 표시
    showNextEndingDialogue();
    
    // 캔버스 애니메이션 시작
    startEndingAnimation(selectedCharacter);
    
    // CSS 애니메이션 추가
    addEndingStyles();
}

// 통계 패널 생성
function createStatsPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08), 
            rgba(138, 43, 226, 0.15));
        backdrop-filter: blur(10px);
        padding: 15px;
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 0 30px rgba(138, 43, 226, 0.05);
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    `;
    
    const accuracy = (typeof gameStats !== 'undefined' && gameStats.totalQuestions > 0) ? 
        Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 100;
    const playTime = (typeof gameStats !== 'undefined' && gameStats.startTime) ?
        Math.round((Date.now() - gameStats.startTime) / 1000) : 180;
    const finalScore = (typeof gameState !== 'undefined' && gameState.score) ? gameState.score : 1000;
    
    // 등급 계산
    let grade, gradeColor;
    if (accuracy >= 95) {
        grade = "👑 레전더리";
        gradeColor = "#FFD700";
    } else if (accuracy >= 85) {
        grade = "⭐ 마스터";
        gradeColor = "#FF69B4";
    } else if (accuracy >= 70) {
        grade = "💎 엑스퍼트";
        gradeColor = "#00D9FF";
    } else {
        grade = "🌱 챌린저";
        gradeColor = "#7FFF00";
    }
    
    panel.innerHTML = `
        <h3 style="
            color: #FFFFFF;
            margin-bottom: 10px;
            font-size: 18px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        ">📊 게임 결과</h3>
        <div style="
            display: grid; 
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            font-size: 14px;
        ">
            <div style="color: #B0B0B0;">점수</div>
            <div style="text-align: right; color: #FFD700; font-weight: bold;">
                ${finalScore.toLocaleString()}점
            </div>
            
            <div style="color: #B0B0B0;">정답률</div>
            <div style="text-align: right; color: #FF69B4; font-weight: bold;">
                ${accuracy}%
            </div>
            
            <div style="color: #B0B0B0;">시간</div>
            <div style="text-align: right; color: #00D9FF; font-weight: bold;">
                ${Math.floor(playTime / 60)}분 ${playTime % 60}초
            </div>
            
            <div style="color: #B0B0B0;">등급</div>
            <div style="
                text-align: right; 
                color: ${gradeColor}; 
                font-weight: bold;
                text-shadow: 0 0 5px ${gradeColor};
            ">${grade}</div>
        </div>
    `;
    
    return panel;
}

// 대화 박스 생성
function createEndingDialogueBox() {
    const box = document.createElement('div');
    box.id = 'endingDialogueBox';
    box.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08), 
            rgba(138, 43, 226, 0.15));
        backdrop-filter: blur(10px);
        padding: 20px;
        border-radius: 15px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 0 30px rgba(138, 43, 226, 0.05);
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    `;
    
    // 화자 이름
    const speakerName = document.createElement('div');
    speakerName.id = 'endingSpeaker';
    speakerName.style.cssText = `
        color: #FFD700;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    `;
    
    // 대화 내용
    const dialogueText = document.createElement('div');
    dialogueText.id = 'endingDialogueText';
    dialogueText.style.cssText = `
        flex: 1;
        color: #E0E0E0;
        font-size: 18px;
        line-height: 1.6;
        overflow-y: auto;
        animation: fadeInText 0.5s ease-in-out;
    `;
    
    // 진행 표시
    const progressIndicator = document.createElement('div');
    progressIndicator.id = 'endingProgress';
    progressIndicator.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
    `;
    
    // 클릭 안내
    const clickHint = document.createElement('div');
    clickHint.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 20px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        animation: blink 2s ease-in-out infinite;
    `;
    clickHint.textContent = '▶ 클릭하여 계속...';
    
    box.appendChild(speakerName);
    box.appendChild(dialogueText);
    box.appendChild(progressIndicator);
    box.appendChild(clickHint);
    
    // 클릭 이벤트
    box.onclick = () => nextEndingDialogue();
    
    return box;
}

// 컨트롤 패널 생성
function createControlPanel(endingDiv) {
    const panel = document.createElement('div');
    panel.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: center;
    `;
    
    // 자동재생 버튼
    const autoBtn = document.createElement('button');
    autoBtn.id = 'endingAutoBtn';
    autoBtn.textContent = '▶ 자동';
    autoBtn.style.cssText = `
        background: linear-gradient(135deg, #4ECDC4, #7FDDDD);
        border: none;
        color: white;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
        transition: all 0.3s ease;
        flex: 1;
    `;
    
    // 스킵 버튼
    const skipBtn = document.createElement('button');
    skipBtn.textContent = '⏭️ 스킵';
    skipBtn.style.cssText = `
        background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
        border: none;
        color: white;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        transition: all 0.3s ease;
        flex: 1;
    `;
    
    // 메인으로 버튼
    const mainBtn = document.createElement('button');
    mainBtn.textContent = '🏠 메인으로';
    mainBtn.style.cssText = `
        background: linear-gradient(135deg, #667EEA, #764BA2);
        border: none;
        color: white;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        flex: 1;
    `;
    
    // 다시하기 버튼
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 다시하기';
    retryBtn.style.cssText = `
        background: linear-gradient(135deg, #F093FB, #F5576C);
        border: none;
        color: white;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 20px;
        box-shadow: 0 5px 15px rgba(245, 87, 108, 0.3);
        transition: all 0.3s ease;
        flex: 1;
    `;
    
    // 호버 효과
    [autoBtn, skipBtn, mainBtn, retryBtn].forEach(btn => {
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
            btn.style.filter = 'brightness(1.1)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.filter = 'brightness(1)';
        };
    });
    
    // 이벤트 핸들러
    autoBtn.onclick = () => toggleEndingAutoPlay();
    skipBtn.onclick = () => skipEndingDialogue();
    
    mainBtn.onclick = () => {
        if (endingAnimationFrame) {
            cancelAnimationFrame(endingAnimationFrame);
        }
        if (endingAutoPlayInterval) {
            clearInterval(endingAutoPlayInterval);
        }
        document.body.removeChild(endingDiv);
        if (typeof saveGameRecord === 'function') {
            saveGameRecord();
        }
        if (typeof showMenu === 'function') {
            showMenu();
        }
    };
    
    retryBtn.onclick = () => {
        if (endingAnimationFrame) {
            cancelAnimationFrame(endingAnimationFrame);
        }
        if (endingAutoPlayInterval) {
            clearInterval(endingAutoPlayInterval);
        }
        document.body.removeChild(endingDiv);
        if (typeof restartGame === 'function') {
            restartGame();
        }
    };
    
    panel.appendChild(autoBtn);
    panel.appendChild(skipBtn);
    panel.appendChild(retryBtn);
    panel.appendChild(mainBtn);
    
    return panel;
}

// 다음 대화 표시
function showNextEndingDialogue() {
    if (!endingDialogues || endingDialogueIndex >= endingDialogues.length) {
        return;
    }
    
    const dialogue = endingDialogues[endingDialogueIndex];
    const speakerElement = document.getElementById('endingSpeaker');
    const textElement = document.getElementById('endingDialogueText');
    const progressElement = document.getElementById('endingProgress');
    
    // 화자별 스타일
    const speakerStyles = {
        narrator: { name: '🎭 나레이터', color: '#B0B0B0' },
        jiyul: { name: '🌸 지율이', color: '#FF69B4' },
        kiwi: { name: '🦎 키위', color: '#7FFF00' },
        whitehouse: { name: '🏰 화이트하우스', color: '#4169E1' },
        system: { name: '📢 시스템', color: '#FFD700' },
        pilot: { name: '✈️ 파일럿', color: '#00CED1' },
        un: { name: '🌐 UN', color: '#1E90FF' },
        animals: { name: '🐾 동물친구들', color: '#FFA500' },
        books: { name: '📚 책들', color: '#9370DB' },
        alphabet: { name: '🔤 알파벳', color: '#FF1493' },
        achievement: { name: '🏆 달성', color: '#FFD700' }
    };
    
    const speakerInfo = speakerStyles[dialogue.speaker] || 
                       { name: dialogue.speaker, color: '#FFFFFF' };
    
    speakerElement.textContent = speakerInfo.name;
    speakerElement.style.color = speakerInfo.color;
    
    // 텍스트 타이핑 효과
    textElement.style.animation = 'none';
    setTimeout(() => {
        textElement.style.animation = 'fadeInText 0.5s ease-in-out';
        textElement.textContent = dialogue.text;
    }, 10);
    
    // 진행 상황
    progressElement.textContent = `${endingDialogueIndex + 1} / ${endingDialogues.length}`;
    
    // 특수 효과 트리거
    if (dialogue.speaker === 'achievement') {
        createCelebrationEffect();
    }
}

// 다음 대화로
function nextEndingDialogue() {
    endingDialogueIndex++;
    
    if (endingDialogueIndex >= endingDialogues.length) {
        // 대화 종료
        isEndingDialogueActive = false;
        showEndingComplete();
    } else {
        showNextEndingDialogue();
    }
}

// 대화 스킵
function skipEndingDialogue() {
    endingDialogueIndex = endingDialogues.length - 1;
    showNextEndingDialogue();
}

// 자동재생 토글
function toggleEndingAutoPlay() {
    const autoBtn = document.getElementById('endingAutoBtn');
    
    if (endingAutoPlayInterval) {
        clearInterval(endingAutoPlayInterval);
        endingAutoPlayInterval = null;
        autoBtn.textContent = '▶ 자동';
        autoBtn.style.background = 'linear-gradient(135deg, #4ECDC4, #7FDDDD)';
    } else {
        endingAutoPlayInterval = setInterval(() => {
            if (isEndingDialogueActive) {
                nextEndingDialogue();
            }
        }, 3000);
        autoBtn.textContent = '⏸ 정지';
        autoBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #FF8E8E)';
    }
}

// 엔딩 완료 표시
function showEndingComplete() {
    const dialogueText = document.getElementById('endingDialogueText');
    if (dialogueText) {
        dialogueText.innerHTML = `
            <div style="
                text-align: center;
                margin-top: 50px;
                animation: fadeInText 1s ease-in-out;
            ">
                <h2 style="
                    color: #FFD700;
                    font-size: 32px;
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                ">🎊 THE END 🎊</h2>
                <p style="
                    color: #E0E0E0;
                    font-size: 20px;
                ">축하합니다! 모든 스토리를 완료했어요!</p>
                <p style="
                    color: #B0B0B0;
                    font-size: 16px;
                    margin-top: 20px;
                ">새로운 모험이 기다리고 있어요!</p>
            </div>
        `;
    }
    
    // 대규모 축하 효과
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createCelebrationEffect(), i * 200);
    }
}

// 축하 효과
function createCelebrationEffect() {
    if (endingParticleSystem && endingCanvas) {
        const centerX = endingCanvas.width / 2;
        const centerY = endingCanvas.height / 2;
        
        // 다양한 위치에서 파티클 생성
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const distance = 50 + Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            endingParticleSystem.create(x, y, 'star', 2);
            endingParticleSystem.create(x, y, 'confetti', 3);
            endingParticleSystem.create(x, y, 'sparkle', 1);
        }
    }
}

// 캔버스 애니메이션 시작
function startEndingAnimation(character) {
    let frame = 0;
    
    function animate() {
        if (!endingCtx || !endingCanvas) return;
        
        // 배경 그리기
        const gradient = endingCtx.createLinearGradient(0, 0, 0, endingCanvas.height);
        
        if (character === 'jiyul') {
            // 우주 테마
            gradient.addColorStop(0, '#000428');
            gradient.addColorStop(0.5, '#004E92');
            gradient.addColorStop(1, '#000428');
        } else if (character === 'kiwi') {
            // 파티 테마
            const hue = (frame * 0.5) % 360;
            gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
            gradient.addColorStop(0.5, `hsl(${(hue + 60) % 360}, 50%, 30%)`);
            gradient.addColorStop(1, `hsl(${(hue + 120) % 360}, 50%, 20%)`);
        } else {
            // 왕국 테마
            gradient.addColorStop(0, '#1A237E');
            gradient.addColorStop(0.5, '#3949AB');
            gradient.addColorStop(1, '#1B5E20');
        }
        
        endingCtx.fillStyle = gradient;
        endingCtx.fillRect(0, 0, endingCanvas.width, endingCanvas.height);
        
        // 캐릭터별 특수 효과
        if (character === 'jiyul') {
            drawStarsAndPlanets(frame);
        } else if (character === 'kiwi') {
            drawDiscoLights(frame);
        } else {
            drawCastleAndFlags(frame);
        }
        
        // 파티클 시스템
        if (endingParticleSystem) {
            // 주기적으로 새 파티클 생성
            if (frame % 30 === 0) {
                const x = Math.random() * endingCanvas.width;
                const y = Math.random() * endingCanvas.height;
                endingParticleSystem.create(x, y, 'star', 1);
            }
            
            endingParticleSystem.update();
            endingParticleSystem.render();
        }
        
        frame++;
        endingAnimationFrame = requestAnimationFrame(animate);
    }
    
    animate();
}

// 별과 행성 그리기 (지율이)
function drawStarsAndPlanets(frame) {
    if (!endingCtx || !endingCanvas) return;
    
    // 별들
    for (let i = 0; i < 50; i++) {
        const x = (i * 73) % endingCanvas.width;
        const y = (i * 37) % endingCanvas.height;
        const brightness = (Math.sin(frame * 0.02 + i) + 1) / 2;
        
        endingCtx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        endingCtx.beginPath();
        endingCtx.arc(x, y, 1 + brightness, 0, Math.PI * 2);
        endingCtx.fill();
    }
    
    // 행성
    const planetX = endingCanvas.width / 2 + Math.cos(frame * 0.01) * 100;
    const planetY = endingCanvas.height / 2 + Math.sin(frame * 0.01) * 50;
    
    const planetGradient = endingCtx.createRadialGradient(
        planetX - 10, planetY - 10, 0,
        planetX, planetY, 30
    );
    planetGradient.addColorStop(0, '#FFB74D');
    planetGradient.addColorStop(0.5, '#FF9800');
    planetGradient.addColorStop(1, '#E65100');
    
    endingCtx.fillStyle = planetGradient;
    endingCtx.beginPath();
    endingCtx.arc(planetX, planetY, 30, 0, Math.PI * 2);
    endingCtx.fill();
}

// 디스코 조명 (키위)
function drawDiscoLights(frame) {
    if (!endingCtx || !endingCanvas) return;
    
    endingCtx.save();
    endingCtx.globalAlpha = 0.3;
    
    // 회전하는 빛줄기
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + frame * 0.02;
        const gradient = endingCtx.createLinearGradient(
            endingCanvas.width / 2, endingCanvas.height / 2,
            endingCanvas.width / 2 + Math.cos(angle) * endingCanvas.width,
            endingCanvas.height / 2 + Math.sin(angle) * endingCanvas.width
        );
        gradient.addColorStop(0, `hsl(${i * 45 + frame}, 100%, 50%)`);
        gradient.addColorStop(1, 'transparent');
        
        endingCtx.strokeStyle = gradient;
        endingCtx.lineWidth = 3;
        endingCtx.beginPath();
        endingCtx.moveTo(endingCanvas.width / 2, endingCanvas.height / 2);
        endingCtx.lineTo(
            endingCanvas.width / 2 + Math.cos(angle) * endingCanvas.width,
            endingCanvas.height / 2 + Math.sin(angle) * endingCanvas.width
        );
        endingCtx.stroke();
    }
    
    endingCtx.restore();
    
    // 디스코볼
    const ballX = endingCanvas.width / 2;
    const ballY = 80;
    
    endingCtx.fillStyle = '#C0C0C0';
    endingCtx.beginPath();
    endingCtx.arc(ballX, ballY, 30, 0, Math.PI * 2);
    endingCtx.fill();
    
    // 미러 타일
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + frame * 0.03;
        const tileX = ballX + Math.cos(angle) * 25;
        const tileY = ballY + Math.sin(angle) * 25;
        
        endingCtx.fillStyle = `hsl(${(frame * 2 + i * 30) % 360}, 100%, 70%)`;
        endingCtx.fillRect(tileX - 3, tileY - 3, 6, 6);
    }
}

// 성과 깃발 (화이트하우스)
function drawCastleAndFlags(frame) {
    if (!endingCtx || !endingCanvas) return;
    
    // 성 실루엣
    const castleX = endingCanvas.width / 2;
    const castleY = endingCanvas.height - 100;
    
    endingCtx.fillStyle = 'rgba(69, 39, 160, 0.8)';
    endingCtx.fillRect(castleX - 80, castleY - 60, 160, 100);
    
    // 성 탑들
    for (let i = 0; i < 3; i++) {
        const towerX = castleX + (i - 1) * 60;
        endingCtx.fillRect(towerX - 15, castleY - 100, 30, 120);
        
        // 깃발
        const flagWave = Math.sin(frame * 0.04 + i) * 10;
        endingCtx.strokeStyle = '#8B4513';
        endingCtx.lineWidth = 2;
        endingCtx.beginPath();
        endingCtx.moveTo(towerX, castleY - 100);
        endingCtx.lineTo(towerX, castleY - 130);
        endingCtx.stroke();
        
        endingCtx.fillStyle = ['#FF1493', '#FFD700', '#00CED1'][i];
        endingCtx.beginPath();
        endingCtx.moveTo(towerX, castleY - 130);
        endingCtx.quadraticCurveTo(
            towerX + 20 + flagWave, castleY - 125,
            towerX + 25 + flagWave, castleY - 120
        );
        endingCtx.lineTo(towerX + 25 + flagWave, castleY - 110);
        endingCtx.quadraticCurveTo(
            towerX + 20 + flagWave, castleY - 115,
            towerX, castleY - 110
        );
        endingCtx.closePath();
        endingCtx.fill();
    }
}

// CSS 스타일 추가
function addEndingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
        
        @keyframes fadeInText {
            from { 
                opacity: 0; 
                transform: translateY(10px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @keyframes blink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

// 키보드 이벤트 처리
document.addEventListener('keydown', function(e) {
    if (!isEndingDialogueActive) return;
    
    switch(e.code) {
        case 'Space':
        case 'Enter':
            e.preventDefault();
            nextEndingDialogue();
            break;
        case 'Escape':
            e.preventDefault();
            skipEndingDialogue();
            break;
    }
});

// 화면 회전 감지
window.addEventListener('orientationchange', function() {
    const isLandscape = window.innerWidth > window.innerHeight;
    if (!isLandscape) {
        showRotateDeviceMessage();
    }
});

// 전역 함수로 등록
window.showEnding = showEnding;