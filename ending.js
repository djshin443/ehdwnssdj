// 엔딩 시스템 - ending.js (가로모드 최적화 & 스토리 개선 버전)

// 엔딩 표시 (완전히 새로운 버전)
function showEnding() {
    gameState.running = false;
    gameState.isMoving = false;
    
    // 화면 방향 체크
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 엔딩 화면 생성
    const endingDiv = document.createElement('div');
    endingDiv.id = 'endingScreen';
    endingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #FFB6C1 0%, #E6E6FA 50%, #87CEEB 100%);
        z-index: 10000;
        display: flex;
        flex-direction: ${isLandscape ? 'row' : 'column'};
        justify-content: center;
        align-items: center;
        font-family: 'Jua', sans-serif;
        text-align: center;
        padding: ${isLandscape ? '20px 40px' : '20px'};
        gap: ${isLandscape ? '40px' : '20px'};
        overflow-y: auto;
    `;
    
    // 캔버스 컨테이너
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        ${isLandscape ? 'flex: 1.2; max-width: 55%;' : 'width: 100%;'}
    `;
    
    // 엔딩 캔버스 크기 조정
    const endingCanvas = document.createElement('canvas');
    let canvasSize;
    
    if (isLandscape) {
        // 가로모드: 화면 크기에 맞춰 최적화
        canvasSize = {
            width: Math.min(window.innerWidth * 0.5, 640),
            height: Math.min(window.innerHeight * 0.7, 400)
        };
    } else {
        // 세로모드
        canvasSize = {
            width: Math.min(window.innerWidth * 0.9, 480),
            height: Math.min(window.innerHeight * 0.35, 280)
        };
    }
    
    endingCanvas.width = canvasSize.width;
    endingCanvas.height = canvasSize.height;
    endingCanvas.style.cssText = `
        background: linear-gradient(to bottom, #87CEEB, #F0E68C);
        border: 5px solid #FF69B4;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
        width: 100%;
        height: auto;
        max-height: ${isLandscape ? '70vh' : '40vh'};
    `;
    
    // 텍스트 컨테이너
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: ${isLandscape ? '20px' : '15px'};
        ${isLandscape ? 'flex: 1; max-width: 45%;' : 'width: 100%;'}
        ${isLandscape ? 'justify-content: center;' : ''}
    `;
    
    // 엔딩 스토리 텍스트
    const storyText = document.createElement('div');
    storyText.style.cssText = `
        font-size: ${isLandscape ? (isMobile ? '16px' : '20px') : '16px'};
        color: #FF1493;
        text-shadow: 2px 2px 0 #FFF;
        background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,182,193,0.3));
        padding: ${isLandscape ? '25px' : '20px'};
        border-radius: 20px;
        border: 3px solid #FF69B4;
        animation: glow 2s ease-in-out infinite alternate;
    `;
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glow {
            from { box-shadow: 0 0 10px #FF69B4; }
            to { box-shadow: 0 0 20px #FF69B4, 0 0 30px #FFB6C1; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes sparkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // 캐릭터별 재미있는 엔딩 스토리
    const endingStories = {
        jiyul: {
            title: "✨ 지율이의 세계일주 영어 대모험 ✨",
            story: [
                "영어 마스터가 된 지율이는 마법의 여권을 받았어요! 🎫",
                "이제 전 세계 친구들과 영어로 수다를 떨 수 있답니다!",
                "첫 번째 목적지는 런던의 빅벤! 🇬🇧",
                "\"Hello Big Ben! I'm Jiyul from Korea!\" 라고 외쳤더니",
                "빅벤이 반짝이며 대답했어요: \"Welcome, English Master!\" ⭐"
            ],
            achievement: "🏆 달성: 글로벌 영어 마스터 인증!",
            special: "🎁 보너스: 키위와 화이트하우스도 함께 세계여행을 가기로 했어요!"
        },
        kiwi: {
            title: "🌟 키위의 영어 천재 변신기 🌟",
            story: [
                "영어를 완벽히 익힌 키위가 놀라운 변신을 했어요! 🦎✨",
                "이제 키위는 100개 언어를 할 수 있는 슈퍼 도마뱀이 되었답니다!",
                "UN 동시통역사로 초대받은 키위! 🌍",
                "\"I speak English, Korean, and Gecko!\" 라고 자랑했더니",
                "세계 정상들이 모두 박수를 쳤어요! 👏"
            ],
            achievement: "🏆 달성: 최연소(?) UN 명예 통역관!",
            special: "🎁 보너스: 키위 영어학원을 열어 지율이가 첫 선생님이 되었어요!"
        },
        whitehouse: {
            title: "🏰 화이트하우스의 영어 왕국 건설기 🏰",
            story: [
                "화이트하우스가 드디어 꿈의 영어 왕국을 완성했어요! 🏰",
                "텐트 안이 마법의 영어 도서관으로 변신했답니다! 📚✨",
                "매일 밤 영어 단어들이 살아나서 파티를 열어요! 🎉",
                "\"Welcome to English Kingdom!\" 외치자",
                "알파벳 A부터 Z까지 모두 춤을 추며 축하했어요! 💃"
            ],
            achievement: "🏆 달성: 영어 왕국의 초대 왕!",
            special: "🎁 보너스: 지율이와 키위가 왕국의 명예 기사가 되었어요!"
        }
    };
    
    const story = endingStories[gameState.selectedCharacter] || endingStories.jiyul;
    
    // 스토리 HTML 생성
    storyText.innerHTML = `
        <h2 style="
            margin-bottom: 20px; 
            font-size: ${isLandscape ? (isMobile ? '20px' : '24px') : '20px'};
            color: #9932CC;
            animation: bounce 1s ease-in-out infinite;
        ">${story.title}</h2>
        <div style="text-align: left; line-height: 1.6;">
            ${story.story.map((line, i) => `
                <p style="
                    margin: 8px 0; 
                    opacity: 0; 
                    animation: fadeIn 0.5s ease-in forwards;
                    animation-delay: ${i * 0.3}s;
                    color: #6B3AA0;
                    font-size: ${isLandscape ? (isMobile ? '14px' : '16px') : '14px'};
                ">${line}</p>
            `).join('')}
        </div>
        <div style="
            margin-top: 15px; 
            padding-top: 15px; 
            border-top: 2px solid #FFB6C1;
            animation: sparkle 2s ease-in-out infinite;
        ">
            <p style="color: #FF1493; font-weight: bold;">${story.achievement}</p>
            <p style="color: #9370DB; margin-top: 8px;">${story.special}</p>
        </div>
    `;
    
    // fadeIn 애니메이션 추가
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(fadeInStyle);
    
    // 게임 통계 (더 재미있게)
    const statsText = document.createElement('div');
    const accuracy = gameStats.totalQuestions > 0 ? 
        Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 100;
    const playTime = Math.round((Date.now() - gameStats.startTime) / 1000);
    
    // 정답률에 따른 등급
    let grade, gradeEmoji;
    if (accuracy >= 95) {
        grade = "영어 천재";
        gradeEmoji = "🌟";
    } else if (accuracy >= 85) {
        grade = "영어 마스터";
        gradeEmoji = "⭐";
    } else if (accuracy >= 70) {
        grade = "영어 고수";
        gradeEmoji = "✨";
    } else {
        grade = "영어 탐험가";
        gradeEmoji = "🌱";
    }
    
    statsText.style.cssText = `
        font-size: ${isLandscape ? '14px' : '12px'};
        color: #6B3AA0;
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(230,230,250,0.9));
        padding: ${isLandscape ? '20px' : '15px'};
        border-radius: 15px;
        border: 2px solid #DDA0DD;
        box-shadow: 0 5px 15px rgba(147, 112, 219, 0.2);
    `;
    
    statsText.innerHTML = `
        <h3 style="color: #9932CC; margin-bottom: 10px;">📊 ${gameState.selectedCharacter === 'jiyul' ? '지율이' : 
                                                              gameState.selectedCharacter === 'kiwi' ? '키위' : 
                                                              '화이트하우스'}의 성적표</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
            <p>🎯 최종 점수</p><p style="text-align: right; font-weight: bold;">${gameState.score}점</p>
            <p>📝 정답률</p><p style="text-align: right; font-weight: bold;">${accuracy}%</p>
            <p>⏱️ 플레이 시간</p><p style="text-align: right; font-weight: bold;">${Math.floor(playTime / 60)}분 ${playTime % 60}초</p>
            <p>${gradeEmoji} 등급</p><p style="text-align: right; font-weight: bold; color: #FF1493;">${grade}</p>
        </div>
    `;
    
    // 버튼 컨테이너
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
    `;
    
    // 메인으로 버튼
    const mainBtn = document.createElement('button');
    mainBtn.textContent = '🏠 메인으로';
    mainBtn.style.cssText = `
        background: linear-gradient(135deg, #9370DB, #DDA0DD);
        border: 3px solid #FFF;
        color: white;
        padding: ${isLandscape ? '12px 24px' : '10px 20px'};
        font-size: ${isLandscape ? '16px' : '14px'};
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        flex: 1;
        min-width: 120px;
    `;
    
    // 다시하기 버튼
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 다시하기';
    retryBtn.style.cssText = `
        background: linear-gradient(135deg, #32CD32, #90EE90);
        border: 3px solid #FFF;
        color: white;
        padding: ${isLandscape ? '12px 24px' : '10px 20px'};
        font-size: ${isLandscape ? '16px' : '14px'};
        font-weight: bold;
        cursor: pointer;
        font-family: 'Jua', sans-serif;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        flex: 1;
        min-width: 120px;
    `;
    
    // 버튼 호버 효과
    [mainBtn, retryBtn].forEach(btn => {
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
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
    endingCtx.imageSmoothingEnabled = false;
    
    // 캐릭터별 다른 애니메이션 실행
    switch(gameState.selectedCharacter) {
        case 'jiyul':
            animateJiyulEndingScene(endingCtx, endingCanvas);
            break;
        case 'kiwi':
            animateKiwiEndingScene(endingCtx, endingCanvas);
            break;
        case 'whitehouse':
            animateWhitehouseEndingScene(endingCtx, endingCanvas);
            break;
        default:
            animateJiyulEndingScene(endingCtx, endingCanvas);
    }
    
    // 축하 파티클
    createEndingParticles();
    
    // 축하 사운드 효과 (시각적 효과로 대체)
    createCelebrationEffects();
}

// 지율이 엔딩 애니메이션 (세계여행 테마)
function animateJiyulEndingScene(ctx, canvas) {
    let frame = 0;
    const landmarks = ['🗼', '🗽', '🏰', '🗿', '🎆'];
    let currentLandmark = 0;
    
    function draw() {
        // 그라데이션 배경
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF69B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 움직이는 구름들
        drawAnimatedClouds(ctx, canvas, frame);
        
        // 비행기와 지율이
        drawFlyingAirplaneWithJiyul(ctx, canvas, frame);
        
        // 세계 랜드마크들
        if (frame % 60 === 0) {
            currentLandmark = (currentLandmark + 1) % landmarks.length;
        }
        
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText(landmarks[currentLandmark], canvas.width / 2, canvas.height - 50);
        
        // 영어 단어들이 날아다니는 효과
        drawFloatingEnglishWords(ctx, canvas, frame);
        
        // 땅
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// 키위 엔딩 애니메이션 (영어 파티 테마)
function animateKiwiEndingScene(ctx, canvas) {
    let frame = 0;
    const friends = [];
    
    // 친구들 초기화
    for (let i = 0; i < 5; i++) {
        friends.push({
            x: Math.random() * canvas.width,
            y: canvas.height - 60 - Math.random() * 30,
            color: ['#FF69B4', '#32CD32', '#FFD700', '#87CEEB', '#FF6347'][i],
            jumpPhase: Math.random() * Math.PI * 2
        });
    }
    
    function draw() {
        // 파티 배경
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FF1493');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#32CD32');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 디스코 볼 효과
        drawDiscoBall(ctx, canvas, frame);
        
        // 키위와 친구들의 댄스 파티
        drawDancingKiwi(ctx, canvas, frame);
        drawDancingFriends(ctx, canvas, friends, frame);
        
        // 음표와 영어 단어들
        drawMusicNotesAndWords(ctx, canvas, frame);
        
        // 무대
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        
        // 스포트라이트
        drawSpotlights(ctx, canvas, frame);
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// 화이트하우스 엔딩 애니메이션 (영어 왕국 테마)
function animateWhitehouseEndingScene(ctx, canvas) {
    let frame = 0;
    const alphabetKnights = [];
    
    // 알파벳 기사단 초기화
    for (let i = 0; i < 26; i++) {
        alphabetKnights.push({
            letter: String.fromCharCode(65 + i),
            x: (i % 13) * (canvas.width / 13),
            y: Math.floor(i / 13) * 50 + 100,
            color: `hsl(${i * 14}, 70%, 60%)`
        });
    }
    
    function draw() {
        // 왕국 배경
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#4B0082');
        gradient.addColorStop(0.3, '#9370DB');
        gradient.addColorStop(0.7, '#DDA0DD');
        gradient.addColorStop(1, '#228B22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 별이 빛나는 밤하늘
        drawStarryNight(ctx, canvas, frame);
        
        // 영어 왕국 성
        drawEnglishCastle(ctx, canvas, frame);
        
        // 화이트하우스 왕
        drawKingWhitehouse(ctx, canvas, frame);
        
        // 알파벳 기사단 행진
        drawAlphabetKnights(ctx, canvas, alphabetKnights, frame);
        
        // 왕국의 깃발들
        drawKingdomFlags(ctx, canvas, frame);
        
        // 불꽃놀이
        if (frame % 30 === 0) {
            createFirework(ctx, canvas, frame);
        }
        
        frame++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

// === 보조 애니메이션 함수들 ===

// 움직이는 구름
function drawAnimatedClouds(ctx, canvas, frame) {
    const clouds = [
        { x: (frame * 0.5) % (canvas.width + 100), y: 50, size: 1.2 },
        { x: (frame * 0.3 + 200) % (canvas.width + 100), y: 80, size: 0.8 },
        { x: (frame * 0.4 + 400) % (canvas.width + 100), y: 40, size: 1.0 }
    ];
    
    clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // 구름 그리기
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cloud.x + i * 20 * cloud.size, cloud.y, 15 * cloud.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// 비행기와 지율이
function drawFlyingAirplaneWithJiyul(ctx, canvas, frame) {
    const planeX = canvas.width / 2 + Math.sin(frame * 0.02) * 100;
    const planeY = 100 + Math.sin(frame * 0.05) * 20;
    
    // 비행기 몸체
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(planeX - 60, planeY, 120, 30);
    
    // 비행기 날개
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(planeX - 20, planeY - 20, 40, 70);
    
    // 비행기 꼬리
    ctx.beginPath();
    ctx.moveTo(planeX + 60, planeY);
    ctx.lineTo(planeX + 80, planeY - 10);
    ctx.lineTo(planeX + 80, planeY + 40);
    ctx.closePath();
    ctx.fill();
    
    // 창문들
    ctx.fillStyle = '#87CEEB';
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(planeX - 50 + i * 15, planeY + 15, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 지율이 (조종석에)
    if (typeof pixelData !== 'undefined' && pixelData.jiyul) {
        const scale = 2;
        const jiyulX = planeX - 55;
        const jiyulY = planeY - 10;
        
        // 간단한 픽셀 지율이 그리기
        ctx.fillStyle = '#FFE0BD';
        ctx.fillRect(jiyulX, jiyulY, 10, 10);
        ctx.fillStyle = '#2C1810';
        ctx.fillRect(jiyulX - 2, jiyulY - 5, 14, 8);
    }
    
    // 비행운
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(planeX - 80 - i * 30, planeY + 15 + Math.sin(frame * 0.1 + i) * 5, 10 + i * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 떠다니는 영어 단어들
function drawFloatingEnglishWords(ctx, canvas, frame) {
    const words = ['HELLO', 'WORLD', 'FRIEND', 'LOVE', 'HAPPY', 'DREAM', 'STAR', 'FUN'];
    
    words.forEach((word, i) => {
        const x = (canvas.width / words.length * i + frame * 2) % (canvas.width + 100);
        const y = 150 + Math.sin(frame * 0.05 + i) * 30;
        const opacity = (Math.sin(frame * 0.03 + i) + 1) * 0.5;
        
        ctx.font = `bold ${16 + Math.sin(frame * 0.05 + i) * 4}px Arial`;
        ctx.fillStyle = `rgba(255, 105, 180, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.fillText(word, x, y);
    });
}

// 디스코 볼
function drawDiscoBall(ctx, canvas, frame) {
    const centerX = canvas.width / 2;
    const centerY = 60;
    
    // 디스코 볼
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // 반짝이는 타일들
    for (let i = 0; i < 12; i++) {
        const angle = (frame * 0.05 + i * Math.PI / 6);
        const x = centerX + Math.cos(angle) * 25;
        const y = centerY + Math.sin(angle) * 25;
        
        ctx.fillStyle = ['#FF69B4', '#FFD700', '#87CEEB', '#32CD32'][i % 4];
        ctx.fillRect(x - 3, y - 3, 6, 6);
    }
    
    // 빛줄기
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (frame * 0.03 + i * Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * 200,
            centerY + Math.sin(angle) * 200
        );
        ctx.stroke();
    }
}

// 춤추는 키위
function drawDancingKiwi(ctx, canvas, frame) {
    const kiwiX = canvas.width / 2;
    const kiwiY = canvas.height - 80 + Math.abs(Math.sin(frame * 0.1)) * -20;
    
    if (typeof pixelData !== 'undefined' && pixelData.kiwi) {
        // 키위 픽셀 데이터 사용
        const scale = 4;
        const sprite = pixelData.kiwi.idle;
        const colorMap = pixelData.kiwi.colorMap;
        
        // 회전 효과
        ctx.save();
        ctx.translate(kiwiX, kiwiY);
        ctx.rotate(Math.sin(frame * 0.1) * 0.2);
        
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel !== 0 && colorMap[pixel]) {
                    ctx.fillStyle = colorMap[pixel];
                    ctx.fillRect(
                        (col - 8) * scale,
                        (row - 8) * scale,
                        scale,
                        scale
                    );
                }
            }
        }
        
        ctx.restore();
    } else {
        // 대체 키위 그리기
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.arc(kiwiX, kiwiY, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 음표 효과
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('♪', kiwiX - 30, kiwiY - 30 + Math.sin(frame * 0.2) * 10);
    ctx.fillText('♫', kiwiX + 30, kiwiY - 25 + Math.cos(frame * 0.2) * 10);
}

// 춤추는 친구들
function drawDancingFriends(ctx, canvas, friends, frame) {
    friends.forEach((friend, i) => {
        const jumpHeight = Math.abs(Math.sin(frame * 0.1 + friend.jumpPhase)) * 30;
        
        // 친구 몸통
        ctx.fillStyle = friend.color;
        ctx.fillRect(friend.x - 10, friend.y - jumpHeight, 20, 30);
        
        // 머리
        ctx.beginPath();
        ctx.arc(friend.x, friend.y - jumpHeight - 15, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 팔 움직임
        ctx.strokeStyle = friend.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(friend.x - 10, friend.y - jumpHeight + 5);
        ctx.lineTo(friend.x - 20 + Math.sin(frame * 0.2 + i) * 10, friend.y - jumpHeight - 10);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(friend.x + 10, friend.y - jumpHeight + 5);
        ctx.lineTo(friend.x + 20 + Math.sin(frame * 0.2 + i + Math.PI) * 10, friend.y - jumpHeight - 10);
        ctx.stroke();
    });
}

// 음표와 영어 단어
function drawMusicNotesAndWords(ctx, canvas, frame) {
    const musicWords = ['DANCE', 'SING', 'PARTY', 'JOY', 'MUSIC'];
    
    musicWords.forEach((word, i) => {
        const x = (canvas.width / musicWords.length * i + frame) % canvas.width;
        const y = 50 + Math.sin(frame * 0.05 + i) * 20;
        
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = `hsl(${frame * 2 + i * 60}, 70%, 60%)`;
        ctx.textAlign = 'center';
        ctx.fillText(word, x, y);
        
        // 음표
        ctx.font = '24px Arial';
        ctx.fillText('♪', x + 20, y + 10);
    });
}

// 스포트라이트
function drawSpotlights(ctx, canvas, frame) {
    const lights = [
        { x: canvas.width * 0.2, color: 'rgba(255, 105, 180, 0.3)' },
        { x: canvas.width * 0.5, color: 'rgba(255, 215, 0, 0.3)' },
        { x: canvas.width * 0.8, color: 'rgba(135, 206, 235, 0.3)' }
    ];
    
    lights.forEach((light, i) => {
        const angle = Math.sin(frame * 0.05 + i) * 0.3;
        
        ctx.fillStyle = light.color;
        ctx.beginPath();
        ctx.moveTo(light.x, 0);
        ctx.lineTo(light.x - 50 + angle * 100, canvas.height);
        ctx.lineTo(light.x + 50 + angle * 100, canvas.height);
        ctx.closePath();
        ctx.fill();
    });
}

// 별이 빛나는 밤
function drawStarryNight(ctx, canvas, frame) {
    // 별들
    for (let i = 0; i < 30; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 37) % (canvas.height / 2);
        const brightness = (Math.sin(frame * 0.05 + i) + 1) * 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, 1 + brightness, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 달
    ctx.fillStyle = '#FFFACD';
    ctx.beginPath();
    ctx.arc(canvas.width - 80, 60, 25, 0, Math.PI * 2);
    ctx.fill();
}

// 영어 왕국 성
function drawEnglishCastle(ctx, canvas, frame) {
    const castleX = canvas.width / 2;
    const castleY = canvas.height - 150;
    
    // 성 본체
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(castleX - 100, castleY, 200, 100);
    
    // 성 탑들
    const towers = [-80, -40, 0, 40, 80];
    towers.forEach(offset => {
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(castleX + offset - 15, castleY - 40, 30, 140);
        
        // 탑 지붕
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(castleX + offset - 20, castleY - 40);
        ctx.lineTo(castleX + offset, castleY - 70);
        ctx.lineTo(castleX + offset + 20, castleY - 40);
        ctx.closePath();
        ctx.fill();
        
        // 깃발
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(castleX + offset - 2, castleY - 90, 2, 20);
        ctx.fillRect(castleX + offset, castleY - 90, 20, 12);
    });
    
    // 성문
    ctx.fillStyle = '#654321';
    ctx.fillRect(castleX - 25, castleY + 40, 50, 60);
    ctx.beginPath();
    ctx.arc(castleX, castleY + 40, 25, Math.PI, 0);
    ctx.fill();
}

// 왕 화이트하우스
function drawKingWhitehouse(ctx, canvas, frame) {
    const whX = canvas.width / 2;
    const whY = canvas.height - 180;
    
    if (typeof pixelData !== 'undefined' && pixelData.whitehouse) {
        const scale = 4;
        const sprite = pixelData.whitehouse.idle;
        const colorMap = pixelData.whitehouse.colorMap;
        
        // 화이트하우스 그리기
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel !== 0 && colorMap[pixel]) {
                    ctx.fillStyle = colorMap[pixel];
                    ctx.fillRect(
                        whX + (col - 8) * scale,
                        whY + (row - 8) * scale,
                        scale,
                        scale
                    );
                }
            }
        }
    }
    
    // 왕관
    const crownY = whY - 30 + Math.sin(frame * 0.05) * 3;
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(whX - 20, crownY, 40, 15);
    
    // 왕관 장식
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(whX - 18 + i * 10, crownY);
        ctx.lineTo(whX - 15 + i * 10, crownY - 10);
        ctx.lineTo(whX - 12 + i * 10, crownY);
        ctx.closePath();
        ctx.fill();
    }
    
    // 보석
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.arc(whX, crownY + 7, 3, 0, Math.PI * 2);
    ctx.fill();
}

// 알파벳 기사단
function drawAlphabetKnights(ctx, canvas, knights, frame) {
    knights.forEach((knight, i) => {
        const marchOffset = Math.sin(frame * 0.1 + i * 0.2) * 5;
        const x = knight.x + marchOffset;
        const y = knight.y + Math.abs(Math.sin(frame * 0.15 + i * 0.3)) * -10;
        
        // 기사 갑옷
        ctx.fillStyle = knight.color;
        ctx.fillRect(x - 10, y, 20, 25);
        
        // 투구
        ctx.beginPath();
        ctx.arc(x, y - 8, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // 알파벳
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(knight.letter, x, y + 12);
        
        // 검
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 12, y - 5);
        ctx.lineTo(x + 20, y - 20);
        ctx.stroke();
    });
}

// 왕국 깃발
function drawKingdomFlags(ctx, canvas, frame) {
    const flags = [
        { x: 50, text: 'ABC' },
        { x: canvas.width - 50, text: 'XYZ' }
    ];
    
    flags.forEach(flag => {
        const wave = Math.sin(frame * 0.05) * 5;
        
        // 깃대
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(flag.x - 2, 100, 4, 150);
        
        // 깃발
        ctx.fillStyle = '#9370DB';
        ctx.beginPath();
        ctx.moveTo(flag.x, 100);
        ctx.quadraticCurveTo(
            flag.x + 40 + wave, 115,
            flag.x, 130
        );
        ctx.lineTo(flag.x, 100);
        ctx.fill();
        
        // 텍스트
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(flag.text, flag.x + 10, 115);
    });
}

// 불꽃놀이
function createFirework(ctx, canvas, frame) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 3);
    const colors = ['#FF69B4', '#FFD700', '#32CD32', '#87CEEB', '#FF6347'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 폭발 효과
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const distance = 30 + Math.random() * 20;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance
        );
        ctx.stroke();
        
        // 반짝임
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance,
            2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

// 축하 파티클 효과
function createEndingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10001;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        const type = Math.random() > 0.5 ? '⭐' : '💖';
        const size = Math.random() * 20 + 10;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 3 + 2;
        
        particle.textContent = type;
        particle.style.cssText = `
            position: absolute;
            font-size: ${size}px;
            left: ${startX}px;
            top: -50px;
            animation: fall ${duration}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
    
    // 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 10초 후 제거
    setTimeout(() => {
        if (particleContainer.parentElement) {
            particleContainer.remove();
        }
    }, 10000);
}

// 축하 효과
function createCelebrationEffects() {
    // 화면 번쩍임 효과
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
            rgba(255, 105, 180, 0.3),
            rgba(255, 215, 0, 0.3),
            rgba(135, 206, 235, 0.3)
        );
        pointer-events: none;
        z-index: 10002;
        animation: flash 0.5s ease-in-out;
    `;
    
    const flashStyle = document.createElement('style');
    flashStyle.textContent = `
        @keyframes flash {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(flashStyle);
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 500);
    
    // 축하 메시지 팝업들
    const messages = ['🎉', '🎊', '🏆', '⭐', '💯'];
    messages.forEach((msg, i) => {
        setTimeout(() => {
            const popup = document.createElement('div');
            popup.textContent = msg;
            popup.style.cssText = `
                position: fixed;
                font-size: 48px;
                left: ${Math.random() * (window.innerWidth - 50)}px;
                top: ${Math.random() * (window.innerHeight - 50)}px;
                z-index: 10003;
                animation: popup 1s ease-out forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 1000);
        }, i * 200);
    });
    
    const popupStyle = document.createElement('style');
    popupStyle.textContent = `
        @keyframes popup {
            0% { 
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1.5) rotate(180deg);
            }
            100% { 
                transform: scale(1) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(popupStyle);
}