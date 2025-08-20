// 영어 게임 로직 - 메인 파일 (보스 생성 로직 수정 완료)
// 필요한 파일들: background.js, ending.js, particles.js를 먼저 로드해야 함

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// 픽셀 스케일과 물리 상수
let PIXEL_SCALE = 3;
const GRAVITY = 0.8;
const JUMP_POWER = -18;
const JUMP_FORWARD_SPEED = 6;
let GROUND_Y = 240;

// 모바일 감지 함수
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
}

// 디바이스별 점프 파워 계산
function getJumpPower() {
    let basePower;
    if (isMobileDevice()) {
        basePower = -14;
    } else {
        basePower = -18;
    }
    
    // 탈것을 탄 경우 점프력 증가
    if (gameState.selectedVehicle === 'kiwi') {
        basePower *= 1.2;  // 키위를 타면 20% 더 높이 점프
    } else if (gameState.selectedVehicle === 'whitehouse') {
        basePower *= 1.1;  // 화이트하우스를 타면 10% 더 높이 점프
    }
    
    return basePower;
}

// 게임 상태 초기화
let gameState = {
    running: false,
    score: 0,
    stage: 1,
    selectedUnits: [], 
    selectedCharacter: 'jiyul',
    selectedVehicle: 'none',
    distance: 0,
    speed: 4,
    questionActive: false,
    currentEnemy: null,
    backgroundOffset: 0,
    currentQuestion: null,
    isMoving: true,
    cameraX: 0,
    screenShake: 0,
    shakeTimer: 0,
    bossSpawned: false,
    bossEncountered: false  // 보스 만남 여부 추가
};

// 단어 관리자 초기화
let wordManager;

// 게임 통계
let gameStats = {
    startTime: null,
    correctAnswers: 0,
    totalQuestions: 0
};

// 플레이어 캐릭터 초기화
let player = {
    x: 100,
    y: 240,
    worldX: 100,
    width: 16 * PIXEL_SCALE,
    height: 16 * PIXEL_SCALE,
    hp: 100,
    animFrame: 0,
    animTimer: 0,
    sprite: 'jiyul',
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    onGround: true,
    runSpeed: 4
};

// 게임 오브젝트들
let obstacles = [];
let enemies = [];

// 캔버스 크기 조정
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const controls = document.getElementById('controls');
    const controlsHeight = controls ? controls.offsetHeight : 0;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - controlsHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    // 화면 비율에 따른 PIXEL_SCALE 조정
    const aspectRatio = screenWidth / screenHeight;
    
    if (aspectRatio > 1.5) {
        PIXEL_SCALE = Math.floor(screenHeight / 150);
    } else if (aspectRatio > 1) {
        PIXEL_SCALE = Math.floor(screenHeight / 120);
    } else {
        PIXEL_SCALE = Math.floor(screenWidth / 150);
    }
    
    PIXEL_SCALE = Math.max(2, Math.min(4, PIXEL_SCALE));
    
    // 플레이어 크기 업데이트
    if (player) {
        player.width = 16 * PIXEL_SCALE;
        player.height = 16 * PIXEL_SCALE;
    }
    
    // GROUND_Y 위치를 화면 비율에 맞게 조정
    const groundRatio = aspectRatio > 1 ? 0.7 : 0.75;
    GROUND_Y = screenHeight * groundRatio;
    
    // 기존 장애물들의 위치도 새로운 GROUND_Y에 맞게 조정
    if (obstacles && obstacles.length > 0) {
        obstacles.forEach(obstacle => {
            obstacle.y = GROUND_Y - (16 * PIXEL_SCALE);
            obstacle.width = 16 * PIXEL_SCALE;
            obstacle.height = 16 * PIXEL_SCALE;
        });
        console.log(`장애물 위치 조정: 총 ${obstacles.length}개`);
    }
    
    // 플레이어 위치 재조정
    if (player && gameState && !gameState.questionActive) {
        player.y = GROUND_Y;
        player.velocityY = 0;
        player.onGround = true;
        player.isJumping = false;
        
        console.log(`화면 크기 조정: GROUND_Y = ${GROUND_Y}, Player Y = ${player.y}`);
    }
}

// 전체화면 상태 추적 변수
let isFullscreenDesired = false;
let isUserExiting = false;

// 전체화면 기능
function toggleFullscreen() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        showIOSFullscreenGuide();
        return;
    }
    
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        // 전체화면 진입
        const elem = document.documentElement;
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        }
        
        isFullscreenDesired = true;
        isUserExiting = false;
        document.getElementById('fullscreenBtn').textContent = 'EXIT';
    } else {
        // 사용자가 명시적으로 전체화면 해제
        isUserExiting = true;
        isFullscreenDesired = false;
        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        document.getElementById('fullscreenBtn').textContent = 'FULL';
    }
}

// 전체화면 자동 복구 함수
function restoreFullscreen() {
    if (!isFullscreenDesired || isUserExiting) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) return;
    
    // 현재 전체화면이 아니고, 사용자가 원하는 상태라면 다시 전체화면 요청
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        const elem = document.documentElement;
        
        // 약간의 지연 후 전체화면 복구 시도
        setTimeout(() => {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {});
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }, 100);
    }
}

// iOS 풀스크린 가이드 표시
function showIOSFullscreenGuide() {
    const guideDiv = document.createElement('div');
    guideDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FF69B4, #FFB6C1);
        color: white;
        padding: 30px;
        border: 3px solid #FFF;
        border-radius: 20px;
        font-size: 16px;
        z-index: 10000;
        font-family: 'Jua', sans-serif;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        text-align: center;
        line-height: 1.8;
        max-width: 90vw;
    `;
    
    guideDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 20px;">아이폰 사용자님께</div>
        <div style="margin-bottom: 20px;">
            전체화면으로 플레이하시려면:<br><br>
            1. Safari 하단의 <span style="background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px;">공유 버튼</span>을 누르세요<br>
            2. <span style="background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px;">"홈 화면에 추가"</span>를 선택하세요<br>
            3. 홈 화면에서 앱처럼 실행하세요!
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(135deg, #32CD32, #90EE90);
            border: 3px solid #FFF;
            color: white;
            padding: 15px 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Jua', sans-serif;
            border-radius: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">확인</button>
    `;
    
    document.body.appendChild(guideDiv);
    
    setTimeout(() => {
        if (guideDiv.parentElement) {
            guideDiv.remove();
        }
    }, 5000);
}

// iOS 체크 함수
function checkIOSFullscreen() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true;
    
    if (isIOS && !isStandalone) {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = 'HOME 추가';
        }
    }
}

// 게임 초기화
function initGame() {
    gameState.running = true;
    gameState.score = 0;
    gameState.stage = 1;
    gameState.distance = 0;
    gameState.speed = 4;
    gameState.questionActive = false;
    gameState.isMoving = true;
    gameState.cameraX = 0;
    gameState.bossSpawned = false;
    gameState.bossEncountered = false;  // 보스 만남 여부 초기화
   
    document.getElementById('questionPanel').style.display = 'none';
    document.getElementById('ui').style.display = 'block';
    document.getElementById('fullscreenBtn').style.display = 'block';
    document.getElementById('controls').style.display = 'flex';
    
    player.sprite = gameState.selectedCharacter;
    player.x = 100;
    player.worldX = 100;
    player.y = GROUND_Y;
    player.hp = 100;
    player.velocityY = 0;
    player.velocityX = 0;
    player.onGround = true;
    player.isJumping = false;
    
    // 게임 통계 초기화
    gameStats.startTime = Date.now();
    gameStats.correctAnswers = 0;
    gameStats.totalQuestions = 0;
    
    // 파티클 시스템 초기화
    if (typeof initParticleSystem === 'function') {
        initParticleSystem();
    }
    
    // WordManager 초기화 체크
    if (typeof WordManager !== 'undefined') {
        wordManager = new WordManager();
        console.log('WordManager 초기화 완료!');
    } else {
        console.error('WordManager 클래스를 찾을 수 없습니다!');
    }
    
    generateLevel();
    gameLoop();
    updateUI();
}

// 레벨 생성
function generateLevel() {
    obstacles = [];
    enemies = [];

    // 장애물 생성 - 바닥에 정확히 배치
    const obstacleSpacing = 200 + Math.random() * 150;
    for (let i = 0; i < 12; i++) {
        const types = ['rock', 'spike', 'pipe'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: 600 + i * obstacleSpacing,
            y: GROUND_Y - (16 * PIXEL_SCALE),
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            type: type,
            passed: false
        });
    }

    // 초기 몬스터들 생성
    generateMoreEnemies();
}

// 스테이지별 알파벳 가져오기
function getStageAlphabets(stage) {
    if (stage === 20) {
        // 20스테이지는 모든 알파벳 랜덤
        const allAlphabets = [];
        for (let i = 0; i < 26; i++) {
            allAlphabets.push(String.fromCharCode(65 + i)); // A-Z
        }
        return allAlphabets;
    }
    
    // 1-19스테이지는 순서대로 2개씩
    const startIndex = ((stage - 1) * 2) % 26;
    const alphabet1 = String.fromCharCode(65 + startIndex);
    const alphabet2 = String.fromCharCode(65 + ((startIndex + 1) % 26));
    
    return [alphabet1, alphabet2];
}

// 몬스터 무한 생성
function generateMoreEnemies() {
    const currentMaxX = Math.max(...enemies.map(e => e.x), player.worldX);
    const startX = Math.max(currentMaxX + 300, player.worldX + 800);
    
    // 현재 스테이지의 알파벳 가져오기
    const stageAlphabets = getStageAlphabets(gameState.stage);
    
    for (let i = 0; i < 5; i++) {
        const baseSpeed = 1.5 + (gameState.stage - 1) * 0.5;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        // 스테이지별 알파벳 몬스터 선택
        let monsterType;
        if (gameState.stage === 20) {
            const randomAlphabet = stageAlphabets[Math.floor(Math.random() * stageAlphabets.length)];
            monsterType = `alphabet${randomAlphabet}`;
        } else {
            const randomAlphabet = stageAlphabets[Math.floor(Math.random() * stageAlphabets.length)];
            monsterType = `alphabet${randomAlphabet}`;
        }
        
        const enemyX = startX + i * 400 + Math.random() * 200;
        
        enemies.push({
            x: enemyX,
            y: GROUND_Y - (16 * PIXEL_SCALE),
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            hp: 1,
            maxHp: 1,
            type: monsterType,
            alive: true,
            animFrame: 0,
            velocityY: 0,
            velocityX: 0,
            isMoving: true,
            walkSpeed: baseSpeed,
            direction: direction,
            isJumping: false,
            onGround: true,
            jumpCooldown: 0,
            patrolStart: enemyX,
            patrolRange: 150
        });
    }
}

// 메인 게임 루프
function gameLoop() {
    if (!gameState.running) return;

    update();
    render();
    requestAnimationFrame(gameLoop);
}

// 게임 업데이트 - 보스 생성 로직 수정
function update() {
    // 게임이 진행 중일 때만 이동
    if (gameState.isMoving && !gameState.questionActive) {
        gameState.distance += gameState.speed;
        gameState.backgroundOffset += gameState.speed * 0.5;
        gameState.cameraX += gameState.speed;
        player.worldX += gameState.speed;
    }

    // 화면 흔들기 효과
    if (gameState.shakeTimer > 0) {
        gameState.shakeTimer--;
        gameState.screenShake = Math.sin(gameState.shakeTimer * 0.5) * (gameState.shakeTimer / 10);
    } else {
        gameState.screenShake = 0;
    }

    updatePlayerPhysics();
    updateEnemyPhysics();
    checkCollisions();
    updateAnimations();
    
    // 파티클 시스템 업데이트
    if (typeof updateParticleSystem === 'function') {
        updateParticleSystem();
    }

    // 화면 밖 적들 제거
    enemies = enemies.filter(enemy => 
        enemy.alive && (enemy.x > gameState.cameraX - 500)
    );
    
    // 화면 밖 장애물들 제거
    obstacles = obstacles.filter(obstacle =>
        obstacle.x > gameState.cameraX - 200
    );

    // 앞쪽 적들이 부족하면 더 생성
    const aheadEnemies = enemies.filter(enemy => 
        enemy.x > player.worldX && enemy.x < player.worldX + 2000
    );
    
    if (aheadEnemies.length < 3) {
        generateMoreEnemies();
    }
    
    // 앞쪽 장애물들이 부족하면 추가 생성
    const aheadObstacles = obstacles.filter(obstacle =>
        obstacle.x > player.worldX && obstacle.x < player.worldX + 1500
    );
    
    if (aheadObstacles.length < 3) {
        generateMoreObstacles();
    }
    
    // 20스테이지 보스 생성 - 수정된 로직
    if (gameState.stage === 20 && !gameState.bossSpawned) {
        // 스테이지 20에서 거리 1500 진행 시 보스 생성
        const stage20StartDistance = 19 * 2000; // 19스테이지까지의 거리
        const bossSpawnDistance = stage20StartDistance + 1500; // 20스테이지에서 1500 진행 후
        
        if (gameState.distance >= bossSpawnDistance) {
            const bossX = player.worldX + 600;
            enemies.push({
                x: bossX,
                y: GROUND_Y - (16 * PIXEL_SCALE),
                width: 16 * PIXEL_SCALE,
                height: 16 * PIXEL_SCALE,
                hp: 3,
                maxHp: 3,
                type: 'boss',
                alive: true,
                animFrame: 0,
                velocityY: 0,
                velocityX: 0,
                isJumping: false,
                onGround: true,
                jumpCooldown: 0,
                isMoving: true,
                walkSpeed: 1 + gameState.stage * 0.3,
                direction: -1,
                patrolStart: bossX,
                patrolRange: 200,
                aggroRange: 500,
                isAggro: false,
                isBoss: true
            });
            
            gameState.bossSpawned = true;
            console.log('보스 등장! 20스테이지 최종 보스전!');
        }
    }

    // 스테이지 진행 체크
    const stageDistance = gameState.stage * 2000;
    if (gameState.distance > stageDistance) {
        if (gameState.stage >= 20) {
            // 20스테이지에서 보스를 처치했는지 확인
            const bossAlive = enemies.some(enemy => enemy.type === 'boss' && enemy.alive);
            if (!bossAlive && gameState.bossEncountered) {
                showEnding();
                return;
            } else if (!gameState.bossSpawned) {
                // 보스가 아직 생성되지 않았다면 계속 진행
                return;
            }
        } else {
            nextStage();
        }
    }
}

// 플레이어 물리 업데이트
function updatePlayerPhysics() {
    // 중력 적용 (공중에 있을 때만)
    if (!player.onGround) {
        player.velocityY += GRAVITY;
    }
    
    // Y축 위치 업데이트
    player.y += player.velocityY;
    
    // X축 이동 처리
    if (player.velocityX !== 0) {
        player.worldX += player.velocityX;
        const friction = player.isJumping ? 0.98 : 0.92;
        player.velocityX *= friction;
        if (Math.abs(player.velocityX) < 0.1) {
            player.velocityX = 0;
        }
    }
    
    // 바닥 충돌 검사 및 위치 고정
    if (player.y >= GROUND_Y) {
        player.y = GROUND_Y;
        player.velocityY = 0;
        player.onGround = true;
        player.isJumping = false;
        
        if (player.velocityX > 2 && typeof createParticles === 'function') {
            createParticles(player.x, player.y, 'hint');
        }
    }
    
    // 화면상 플레이어 위치는 고정, 월드 좌표만 변경
    const targetScreenX = canvas.width / 4;
    player.x = targetScreenX;
    gameState.cameraX = player.worldX - targetScreenX;
}

// 몬스터 물리 처리
function updateEnemyPhysics() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        const enemyScreenX = enemy.x - gameState.cameraX;
        
        // 화면 범위에 있는 적들만 물리 처리
        if (enemyScreenX > -200 && enemyScreenX < canvas.width + 200) {
            // 보스 AI 처리
            if (enemy.type === 'boss') {
                const distanceToPlayer = Math.abs(enemy.x - player.worldX);
                
                if (distanceToPlayer < enemy.aggroRange) {
                    enemy.isAggro = true;
                    if (enemy.x > player.worldX) {
                        enemy.direction = -1;
                    } else {
                        enemy.direction = 1;
                    }
                    enemy.walkSpeed = 2 + gameState.stage * 0.3;
                } else {
                    enemy.isAggro = false;
                    enemy.walkSpeed = 1 + gameState.stage * 0.2;
                }
            }
            
            // 이동 처리
            if (enemy.isMoving && !gameState.questionActive) {
                enemy.x += enemy.walkSpeed * enemy.direction;
                
                // 순찰 범위 체크
                if (enemy.patrolStart && enemy.patrolRange) {
                    if (enemy.x <= enemy.patrolStart - enemy.patrolRange || 
                        enemy.x >= enemy.patrolStart + enemy.patrolRange) {
                        enemy.direction *= -1;
                    }
                }
                
                // 랜덤 점프
                if (Math.random() < 0.005 && enemy.onGround && enemy.jumpCooldown <= 0) {
                    enemy.velocityY = JUMP_POWER * 0.7;
                    enemy.isJumping = true;
                    enemy.onGround = false;
                    enemy.jumpCooldown = 90 + Math.random() * 60;
                }
            }
        }
        
        // 점프 쿨다운 감소
        if (enemy.jumpCooldown > 0) {
            enemy.jumpCooldown--;
        }
        
        // 중력 및 점프 물리 처리
        if (!enemy.onGround) {
            enemy.velocityY += GRAVITY;
            enemy.y += enemy.velocityY;
            
            // 바닥 충돌 검사 및 위치 고정
            const groundLevel = GROUND_Y - (16 * PIXEL_SCALE);
            if (enemy.y >= groundLevel) {
                enemy.y = groundLevel;
                enemy.velocityY = 0;
                enemy.onGround = true;
                enemy.isJumping = false;
            }
        } else {
            // 이미 바닥에 있는 경우에도 위치 재확인
            enemy.y = GROUND_Y - (16 * PIXEL_SCALE);
        }
    });
}

// 장애물 지속적 생성 함수 추가
function generateMoreObstacles() {
    // 가장 마지막 장애물의 위치 찾기
    const currentMaxObstacleX = obstacles.length > 0 ? 
        Math.max(...obstacles.map(o => o.x)) : 
        player.worldX;
    
    const startX = Math.max(currentMaxObstacleX + 300, player.worldX + 600);
    
    // 새로운 장애물들 생성
    const obstacleSpacing = 200 + Math.random() * 150;
    for (let i = 0; i < 5; i++) {
        const types = ['rock', 'spike', 'pipe'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: startX + i * obstacleSpacing,
            y: GROUND_Y - (16 * PIXEL_SCALE),
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            type: type,
            passed: false
        });
    }
}

// 충돌 체크
function checkCollisions() {
    // 장애물 충돌 체크
    obstacles.forEach(obstacle => {
        const obstacleScreenX = obstacle.x - gameState.cameraX;
        
        if (obstacleScreenX > -100 && obstacleScreenX < canvas.width + 100) {
            // 플레이어의 실제 충돌 영역 계산
            const playerCollisionBox = {
                x: player.worldX,
                y: player.y - player.height,
                width: player.width,
                height: player.height
            };
            
            if (checkBoxCollision(playerCollisionBox, obstacle)) {
                if (obstacle.type === 'spike' && !obstacle.passed) {
                    obstacle.passed = true;
                    if (typeof createParticles === 'function') {
                        createParticles(player.x, player.y, 'hint');
                    }
                    gameState.score += 5;
                    updateUI();
                }
                else if (obstacle.type !== 'spike' && player.onGround) {
                    // 충돌 시 플레이어를 장애물 앞에 정지
                    player.worldX = obstacle.x - player.width - 5;
                    player.velocityX = 0;
                    gameState.isMoving = false;
                    gameState.shakeTimer = 10;
                    
                    if (Math.random() < 0.01 && typeof createParticles === 'function') {
                        createParticles(player.x, player.y - 30, 'hint');
                    }
                }
            } else {
                // 장애물을 통과했을 때
                if (player.worldX > obstacle.x + obstacle.width && !obstacle.passed) {
                    obstacle.passed = true;
                    gameState.isMoving = true;
                    gameState.score += 10;
                    if (typeof createParticles === 'function') {
                        createParticles(player.x, player.y - 20, 'hint');
                    }
                    updateUI();
                }
            }
        }
    });
    
    // 적 충돌 체크
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        const enemyScreenX = enemy.x - gameState.cameraX;
        
        if (enemyScreenX > -100 && enemyScreenX < canvas.width + 100) {
            const collisionRange = enemy.isBoss ? 100 : 0;
            
            // 몬스터 충돌 박스
            const enemyCollisionBox = {
                x: enemy.x - collisionRange,
                y: enemy.y - collisionRange,
                width: enemy.width + collisionRange * 2,
                height: enemy.height + collisionRange * 2
            };
            
            // 플레이어 충돌 박스
            const playerCollisionBox = {
                x: player.worldX,
                y: player.y - player.height,
                width: player.width,
                height: player.height
            };
            
            if (checkBoxCollision(playerCollisionBox, enemyCollisionBox)) {
                if (!gameState.questionActive && !gameState.bossDialogueActive) {
                    // 보스와 처음 만나는 경우
                    if (enemy.isBoss && gameState.stage === 20 && !enemy.dialogueShown) {
                        enemy.dialogueShown = true;
                        gameState.bossEncountered = true;  // 보스 만남 기록
                        gameState.bossDialogueActive = true;
                        gameState.isMoving = false;
                        player.velocityX = 0;
                        player.velocityY = 0;
                        
                        // UI 숨기기
                        document.getElementById('ui').style.display = 'none';
                        document.getElementById('controls').style.display = 'none';
                        
                        // 보스 대화 시작 (등장 대화)
                        if (typeof startBossDialogue === 'function') {
                            startBossDialogue(canvas, ctx, gameState.selectedCharacter, enemy.hp, enemy.maxHp, function() {
                                // 대화 완료 후 전투 시작
                                gameState.bossDialogueActive = false;
                                gameState.questionActive = true;
                                gameState.currentEnemy = enemy;
                                
                                // UI 다시 표시
                                document.getElementById('ui').style.display = 'block';
                                document.getElementById('controls').style.display = 'flex';
                                
                                generateEnglishQuestion();
                                updateQuestionPanel();
                                document.getElementById('questionPanel').style.display = 'block';
                            });
                        }
                        return;
                    }
                    
                    // 일반 전투 시작
                    gameState.questionActive = true;
                    gameState.currentEnemy = enemy;
                    gameState.isMoving = false;
                    
                    // 보스전에서는 플레이어 움직임 완전 정지
                    if (enemy.isBoss) {
                        player.velocityX = 0;
                        player.velocityY = 0;
                        gameState.bossEncountered = true;  // 보스 만남 기록
                    }
                    
                    generateEnglishQuestion();
                    updateQuestionPanel();
                    document.getElementById('questionPanel').style.display = 'block';
                }
            }
        }
    });
}

// 박스 충돌 체크
function checkBoxCollision(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
}

// 애니메이션 업데이트
function updateAnimations() {
    player.animTimer++;
    if (player.animTimer >= 15) {
        player.animFrame = (player.animFrame + 1) % 3;
        player.animTimer = 0;
    }
    
    enemies.forEach(enemy => {
        if (enemy.alive) {
            enemy.animFrame = (enemy.animFrame + 1) % 2;
        }
    });
}

// UI 업데이트
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('stageText').textContent = gameState.stage;
    document.getElementById('hp').textContent = Math.max(0, player.hp);
}

// 렌더링
function render() {
    ctx.save();
    if (gameState.screenShake !== 0) {
        ctx.translate(
            Math.random() * gameState.screenShake - gameState.screenShake / 2,
            Math.random() * gameState.screenShake - gameState.screenShake / 2
        );
    }
    
    ctx.fillStyle = '#5C94FC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 배경 그리기 (background.js에서)
    if (typeof drawBackground === 'function') {
        drawBackground();
    }
    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, GROUND_Y + 16 * PIXEL_SCALE, canvas.width, canvas.height);
    
    // 장애물 렌더링
    obstacles.forEach(obstacle => {
        const screenX = obstacle.x - gameState.cameraX;
        if (screenX > -100 && screenX < canvas.width + 100) {
            if (typeof pixelData !== 'undefined' && pixelData[obstacle.type]) {
                const data = pixelData[obstacle.type];
                drawPixelSprite(data.sprite, data.colorMap, screenX, obstacle.y);
            }
            
            // 충돌 힌트 표시
            if (!gameState.isMoving && Math.abs(player.worldX - obstacle.x) < 100) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.fillRect(screenX, obstacle.y - 10, obstacle.width, 5);
            }
        }
    });
    
    // 적 렌더링
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const screenX = enemy.x - gameState.cameraX;
        if (screenX > -100 && screenX < canvas.width + 100) {
            // 알파벳 몬스터 또는 보스 렌더링
            if (enemy.type === 'boss') {
                // 보스 렌더링
                if (typeof pixelData !== 'undefined' && pixelData.boss) {
                    const data = pixelData.boss;
                    drawPixelSprite(data.idle, data.colorMap, screenX, enemy.y);
                }
            } else {
                // 알파벳 몬스터 렌더링
                if (typeof alphabetMonsters !== 'undefined' && alphabetMonsters[enemy.type]) {
                    const data = alphabetMonsters[enemy.type];
                    drawPixelSprite(data.idle, data.colorMap, screenX, enemy.y);
                }
            }
            
            // 보스 어그로 표시
            if (enemy.isBoss && enemy.isAggro) {
                ctx.fillStyle = 'red';
                ctx.fillRect(screenX, enemy.y - 15, enemy.width, 3);
                
                // 보스 체력바
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(screenX - 10, enemy.y - 24, enemy.width + 20, 8);
                ctx.fillStyle = '#FF0000';
                const healthPercent = enemy.hp / enemy.maxHp;
                ctx.fillRect(screenX - 8, enemy.y - 23, (enemy.width + 16) * healthPercent, 4);
            }
        }
    });
    
    // 플레이어 렌더링
    if (typeof pixelData !== 'undefined' && pixelData[player.sprite]) {
        // 지율이가 탈것을 타고 있는 경우
        if (player.sprite === 'jiyul' && gameState.selectedVehicle !== 'none') {
            // 먼저 탈것 그리기
            if (gameState.selectedVehicle === 'kiwi' && pixelData.kiwi) {
                const kiwiData = pixelData.kiwi;
                let kiwiSprite;
                
                if (player.isJumping) {
                    kiwiSprite = kiwiData.jump || kiwiData.idle;
                } else if (gameState.isMoving && !gameState.questionActive) {
                    if (kiwiData.walking1 && kiwiData.walking2) {
                        kiwiSprite = player.animFrame === 1 ? kiwiData.walking1 : 
                                    player.animFrame === 2 ? kiwiData.walking2 : kiwiData.idle;
                    } else {
                        kiwiSprite = kiwiData.idle;
                    }
                } else {
                    kiwiSprite = kiwiData.idle;
                }
                
                // 키위를 바닥에 정확히 배치
                drawPixelSprite(kiwiSprite, kiwiData.colorMap, player.x, player.y - player.height);
                
                // 지율이를 키위 위에 8픽셀 위에 딱 붙게 배치
                const jiyulData = pixelData.jiyul;
                const jiyulOffsetY = -24; // 8픽셀 위에 딱 붙게
                drawPixelSprite(jiyulData.idle, jiyulData.colorMap, player.x, player.y - player.height + jiyulOffsetY);
                
            } else if (gameState.selectedVehicle === 'whitehouse' && pixelData.whitehouse) {
                const whData = pixelData.whitehouse;
                let whSprite;
                
                if (player.isJumping) {
                    whSprite = whData.jump || whData.idle;
                } else if (gameState.isMoving && !gameState.questionActive) {
                    if (whData.walking1 && whData.walking2) {
                        whSprite = player.animFrame === 1 ? whData.walking1 : 
                                   player.animFrame === 2 ? whData.walking2 : whData.idle;
                    } else {
                        whSprite = whData.idle;
                    }
                } else {
                    whSprite = whData.idle;
                }
                
                // 화이트하우스를 바닥에 정확히 배치
                drawPixelSprite(whSprite, whData.colorMap, player.x, player.y - player.height);
                
                // 지율이를 화이트하우스 위에 12픽셀 위에 딱 붙게 배치
                const jiyulData = pixelData.jiyul;
                const jiyulOffsetY = -31; // 12픽셀 위에 딱 붙게
                drawPixelSprite(jiyulData.idle, jiyulData.colorMap, player.x, player.y - player.height + jiyulOffsetY);
            }
        } else {
            // 일반적인 캐릭터 그리기
            const playerData = pixelData[player.sprite];
            let sprite;
            
            if (player.isJumping) {
                sprite = playerData.jump || playerData.idle;
            } else if (gameState.isMoving && !gameState.questionActive) {
                if (playerData.walking1 && playerData.walking2) {
                    if (player.animFrame === 1) {
                        sprite = playerData.walking1;
                    } else if (player.animFrame === 2) {
                        sprite = playerData.walking2;
                    } else {
                        sprite = playerData.idle;
                    }
                } else {
                    sprite = playerData.idle;
                }
            } else {
                sprite = playerData.idle;
            }
            
            drawPixelSprite(sprite, playerData.colorMap, player.x, player.y - player.height);
        }
    }
    
    // 파티클 렌더링 (particles.js에서)
    if (typeof renderAllParticles === 'function') {
        renderAllParticles(ctx);
    }
    
    // 게임 상태 메시지
    if (!gameState.isMoving && !gameState.questionActive) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.font = 'bold 18px Jua';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText('점프로 장애물을 뛰어넘으세요!', canvas.width / 2, 50);
        ctx.fillText('점프로 장애물을 뛰어넘으세요!', canvas.width / 2, 50);
    }
    
    ctx.restore();
}

// 영어 문제 생성
function generateEnglishQuestion() {
    if (!wordManager || gameState.selectedUnits.length === 0) {
        console.error('WordManager가 초기화되지 않았거나 선택된 Unit이 없습니다.');
        return;
    }
    
    gameState.currentQuestion = wordManager.generateMultipleChoice(gameState.selectedUnits);
    
    // 보스전의 경우 더 어려운 문제 (Unit 7-8에서만)
    if (gameState.currentEnemy && gameState.currentEnemy.type === 'boss') {
        const hardUnits = gameState.selectedUnits.filter(unit => 
            unit === 'Unit7' || unit === 'Unit8'
        );
        if (hardUnits.length > 0) {
            gameState.currentQuestion = wordManager.generateMultipleChoice(hardUnits);
        }
    }
}

// 문제 패널 업데이트
function updateQuestionPanel() {
    if (!gameState.questionActive || !gameState.currentQuestion) return;
    
    // 영어 단어 표시
    document.getElementById('questionText').innerHTML = `${gameState.currentQuestion.question}`;
    
    // 적 정보 표시
    if (gameState.currentEnemy) {
        let enemyName;
        if (gameState.currentEnemy.type === 'boss') {
            enemyName = '보스';
        } else if (gameState.currentEnemy.type.startsWith('alphabet')) {
            const letter = gameState.currentEnemy.type.replace('alphabet', '');
            enemyName = `${letter} 몬스터`;
        } else {
            enemyName = '몬스터';
        }
        
        document.getElementById('enemyInfo').textContent = 
            `${enemyName} 체력: ${gameState.currentEnemy.hp}/${gameState.currentEnemy.maxHp}`;
    }
    
    // 4지선다 버튼 생성
    updateChoiceButtons();
}

// 4지선다 버튼 업데이트
function updateChoiceButtons() {
    const choicesContainer = document.getElementById('choicesContainer');
    if (!choicesContainer || !gameState.currentQuestion) return;
    
    choicesContainer.innerHTML = '';
    
    gameState.currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = `(${index + 1}) ${choice}`;
        button.setAttribute('data-choice', index);
        button.onclick = () => selectChoice(index);
        choicesContainer.appendChild(button);
    });
}

// 선택지 선택
function selectChoice(choiceIndex) {
    if (!gameState.currentQuestion) return;
    
    gameStats.totalQuestions++;
    
    if (choiceIndex === gameState.currentQuestion.correctIndex) {
        // 정답!
        gameState.score += 20;
        gameStats.correctAnswers++;
        
        if (gameState.currentEnemy) {
            gameState.currentEnemy.hp -= 1;
            const enemyScreenX = gameState.currentEnemy.x - gameState.cameraX;
            if (typeof createParticles === 'function') {
                createParticles(enemyScreenX, gameState.currentEnemy.y, 'hit');
            }
            
            if (gameState.currentEnemy.hp <= 0) {
                gameState.currentEnemy.alive = false;
                gameState.score += gameState.currentEnemy.type === 'boss' ? 100 : 50;
                if (typeof createParticles === 'function') {
                    createParticles(enemyScreenX, gameState.currentEnemy.y, 'defeat');
                }
                
                gameState.isMoving = true;
                
                document.getElementById('questionPanel').style.display = 'none';
                gameState.questionActive = false;
                gameState.currentEnemy = null;
                
                if (typeof showFloatingText === 'function') {
                    showFloatingText(player.x, player.y - 50, '완료!', '#00FF00');
                }
            } else {
                // 보스전 중간대사 (3문제 맞췄을 때, 체력이 2가 될 때)
                if (gameState.currentEnemy.type === 'boss' && gameState.currentEnemy.hp === 2) {
                    // UI 숨기기
                    document.getElementById('ui').style.display = 'none';
                    document.getElementById('controls').style.display = 'none';
                    document.getElementById('questionPanel').style.display = 'none';
                    gameState.isMoving = false;
                    
                    // 보스 중간대사 실행
                    if (typeof startBossDialogue === 'function') {
                        startBossDialogue(canvas, ctx, gameState.selectedCharacter, gameState.currentEnemy.hp, gameState.currentEnemy.maxHp, function() {
                            // 중간대사 완료 후 전투 재개
                            gameState.questionActive = true;
                            
                            // UI 다시 표시
                            document.getElementById('ui').style.display = 'block';
                            document.getElementById('controls').style.display = 'flex';
                            
                            generateEnglishQuestion();
                            updateQuestionPanel();
                            document.getElementById('questionPanel').style.display = 'block';
                        }, true); // 중간대사 플래그
                    } else {
                        // startBossDialogue가 없으면 간단한 메시지만
                        setTimeout(() => {
                            generateEnglishQuestion();
                            updateQuestionPanel();
                        }, 1000);
                    }
                } else {
                    generateEnglishQuestion();
                    updateQuestionPanel();
                    if (typeof showFloatingText === 'function') {
                        showFloatingText(player.x, player.y - 30, '맞았어요!', '#FFD700');
                    }
                }
            }
        }
    } else {
        // 오답
        player.hp -= 15;
        if (typeof createParticles === 'function') {
            createParticles(player.x, player.y, 'hurt');
        }
        const correctAnswer = gameState.currentQuestion.choices[gameState.currentQuestion.correctIndex];
        if (typeof showFloatingText === 'function') {
            showFloatingText(player.x, player.y - 30, `틀렸어요! 정답: ${correctAnswer}`, '#FF0000');
        }
        
        if (player.hp <= 0) {
            gameOver();
            return;
        }
        
        setTimeout(() => {
            generateEnglishQuestion();
            updateQuestionPanel();
        }, 1500);
    }
    
    updateUI();
}

// Unit 선택 함수
function toggleUnit(unit) {
    const index = gameState.selectedUnits.indexOf(unit);
    const button = document.querySelector(`[data-unit="${unit}"]`);
    
    if (!button) return;
    
    if (index === -1) {
        gameState.selectedUnits.push(unit);
        button.classList.add('selected');
    } else {
        gameState.selectedUnits.splice(index, 1);
        button.classList.remove('selected');
    }
    
    updateSelectedDisplay();
}

// 선택한 내용 표시 업데이트
function updateSelectedDisplay() {
    const selectedUnitsElement = document.getElementById('selectedUnits');
    const startButton = document.getElementById('startGameBtn');
    
    if (gameState.selectedUnits.length > 0) {
        const sortedUnits = gameState.selectedUnits.sort();
        selectedUnitsElement.textContent = `선택한 Unit: ${sortedUnits.join(', ')}`;
    } else {
        selectedUnitsElement.textContent = '선택한 Unit: 없음';
    }
    
    if (wordManager && gameState.selectedUnits.length > 0) {
        const wordCount = wordManager.getWordCountFromSelection(gameState.selectedUnits);
        if (wordCount > 0) {
            selectedUnitsElement.textContent += ` (총 ${wordCount}개 단어)`;
        }
    }
    
    startButton.disabled = gameState.selectedUnits.length === 0;
}

// 게임 시작
function startSelectedGame() {
    if (gameState.selectedUnits.length === 0) {
        alert('Unit을 하나 이상 선택해주세요!');
        return;
    }
    document.getElementById('gameContainer').classList.remove('menu-mode');
    document.getElementById('characterSelectMenu').style.display = 'none';
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('ui').style.display = 'block';
    
    const displayText = gameState.selectedUnits.join(', ');
    document.getElementById('unitText').textContent = displayText;
    
    // 게임 시작 시 전체화면 모드 자동 활성화 (사용자가 이미 해제하지 않은 경우)
    if (!isUserExiting && !document.fullscreenElement && 
        !document.webkitFullscreenElement && !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (!isIOS) {
            isFullscreenDesired = true;
            toggleFullscreen();
        }
    }
    
    initGame();
}

// 메뉴 표시
function showMenu() {
    gameState.running = false;
    document.getElementById('gameContainer').classList.add('menu-mode');
    document.getElementById('characterSelectMenu').style.display = 'flex';
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('questionPanel').style.display = 'none';
}

// 화면 전환 함수들
function showUnitSelectMenu() {
    document.getElementById('gameContainer').classList.add('menu-mode');
    document.getElementById('characterSelectMenu').style.display = 'none';
    document.getElementById('unitSelectMenu').style.display = 'flex';
    updateSelectedCharacterDisplay();
}

function showCharacterSelectMenu() {
    document.getElementById('gameContainer').classList.add('menu-mode');
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('characterSelectMenu').style.display = 'flex';
}

function updateSelectedCharacterDisplay() {
    const selectedCharacterPixel = document.getElementById('selectedCharacterPixel');
    const selectedCharacterName = document.getElementById('selectedCharacterName');
    
    if (selectedCharacterPixel && typeof characterPixelData !== 'undefined' && characterPixelData[gameState.selectedCharacter]) {
        const ctx = selectedCharacterPixel.getContext('2d');
        drawCharacterPixelSprite(
            ctx, 
            characterPixelData[gameState.selectedCharacter].idle, 
            characterPixelData[gameState.selectedCharacter].colorMap, 
            4
        );
    }
    
    if (selectedCharacterName) {
        const characterNames = {
            'jiyul': '지율이',
            'kiwi': '키위',
            'whitehouse': '화이트하우스'
        };
        selectedCharacterName.textContent = characterNames[gameState.selectedCharacter] || '지율이';
    }
}

// 도움말 표시
function showHelp() {
    alert('지율이의 픽셀 영어 게임 도움말\n\n' +
          '1. Unit을 선택하고 시작하세요!\n' +
          '2. 점프 버튼으로 장애물을 뛰어넘으세요!\n' +
          '3. 움직이는 몬스터를 만나면 영어 문제를 풀어요!\n' +
          '4. 영어 단어의 뜻을 4지선다에서 고르세요!\n' +
          '5. 정답을 맞추면 몬스터를 물리칠 수 있어요!\n\n' +
          '지율이 화이팅!');
}

// 게임 오버
function gameOver() {
    gameState.running = false;
    alert(`게임 오버!\n최종 점수: ${gameState.score}점\n다시 도전해보세요!`);
    showMenu();
}

// 다음 스테이지
function nextStage() {
    if (gameState.stage >= 20) {
        showEnding();
        return;
    }
    
    gameState.stage++;
    gameState.speed += 0.5;
    gameState.bossSpawned = false;
    gameState.bossEncountered = false;  // 새 스테이지에서 보스 만남 초기화
    alert(`스테이지 ${gameState.stage - 1} 클리어!\n스테이지 ${gameState.stage}로 이동합니다!`);
    
    generateMoreEnemies();
}

// 엔딩 표시
function showEnding() {
    // ending.js가 있으면 사용, 없으면 기본 엔딩
    if (typeof startEnding === 'function') {
        startEnding(canvas, ctx, gameState, gameStats, function() {
            showMenu();
        });
    } else {
        alert(`축하합니다!\n모든 스테이지를 클리어했어요!\n최종 점수: ${gameState.score}점`);
        showMenu();
    }
}

// 점프 함수
function jump() {
    if (player.onGround && !gameState.questionActive) {
        const jumpPower = getJumpPower();
        player.velocityY = jumpPower;
        
        const forwardSpeed = isMobileDevice() ? JUMP_FORWARD_SPEED * 1.2 : JUMP_FORWARD_SPEED * 1.5;
        player.velocityX = forwardSpeed;
        
        player.isJumping = true;
        player.onGround = false;
        gameState.isMoving = true;
        
        if (typeof createParticles === 'function') {
            createParticles(player.x, player.y, 'hint');
        }
        gameState.score += 1;
        updateUI();
    }
}

// 픽셀 스프라이트 그리기 함수 (characters.js가 없을 경우를 대비)
function drawPixelSprite(sprite, colorMap, x, y, scale = PIXEL_SCALE) {
    if (!sprite || !colorMap) return;
    
    for (let row = 0; row < sprite.length; row++) {
        for (let col = 0; col < sprite[row].length; col++) {
            const pixel = sprite[row][col];
            if (pixel !== 0 && colorMap[pixel]) {
                ctx.fillStyle = colorMap[pixel];
                ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
            }
        }
    }
}

// 초기 캔버스 설정
resizeCanvas();

// 이벤트 리스너 설정
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// 전체화면 변경 이벤트 처리 (모든 브라우저 지원)
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

// 전체화면 변경 처리 함수
function handleFullscreenChange() {
    setTimeout(resizeCanvas, 100);
    
    const isCurrentlyFullscreen = !!(document.fullscreenElement || 
                                    document.webkitFullscreenElement || 
                                    document.mozFullScreenElement || 
                                    document.msFullscreenElement);
    
    if (isCurrentlyFullscreen) {
        // 전체화면 진입 성공
        document.getElementById('fullscreenBtn').textContent = 'EXIT';
        isUserExiting = false;
    } else {
        // 전체화면 해제됨
        document.getElementById('fullscreenBtn').textContent = 'FULL';
        
        // 사용자가 원하는 상태이고, 명시적으로 해제한 것이 아니라면 복구 시도
        if (isFullscreenDesired && !isUserExiting) {
            restoreFullscreen();
        }
    }
}

window.addEventListener('load', checkIOSFullscreen);

// 페이지 가시성 변경 시 전체화면 복구
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isFullscreenDesired && !isUserExiting) {
        // 페이지가 다시 보이게 되었을 때 전체화면 복구 시도
        setTimeout(() => {
            restoreFullscreen();
        }, 500);
    }
});

// 창 포커스 시 전체화면 복구
window.addEventListener('focus', function() {
    if (isFullscreenDesired && !isUserExiting) {
        setTimeout(() => {
            restoreFullscreen();
        }, 200);
    }
});

// 터치 이벤트 처리 (모바일 지원)
let touchStartY = 0;
let touchStartTime = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', function(e) {
    if (!gameState.running || gameState.questionActive) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    const deltaY = touchStartY - touchEndY;
    const deltaTime = touchEndTime - touchStartTime;
    
    // 위로 스와이프 또는 빠른 터치 감지
    if ((deltaY > 50 && deltaTime < 500) || (deltaTime < 200 && Math.abs(deltaY) < 30)) {
        e.preventDefault();
        jump();
    }
}, { passive: false });

// 오프닝 실행 여부 체크
let hasSeenOpening = false;

// 게임 초기화 및 메뉴 표시
function initializeGame() {
    // 초기 상태 설정
    gameState.selectedCharacter = 'jiyul';
    gameState.selectedUnits = [];
    
    // 캔버스 초기화
    resizeCanvas();
    
    // 첫 실행시 오프닝 재생, 이후엔 메뉴 바로 표시
    if (!hasSeenOpening) {
        startOpeningSequence();
    } else {
        showMenu();
    }
    
    console.log('지율이의 픽셀 영어 게임이 초기화되었습니다!');
}

// 오프닝 시퀀스 시작
function startOpeningSequence() {
    document.getElementById('gameContainer').classList.remove('menu-mode');
    // 모든 UI 요소 숨기기
    document.getElementById('characterSelectMenu').style.display = 'none';
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('questionPanel').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    
    // 오프닝 실행 (opening.js에서)
    if (typeof startOpening === 'function') {
        startOpening(canvas, ctx, function() {
            // 오프닝 완료 후 메뉴 표시
            hasSeenOpening = true;
            showMenu();
        });
    } else {
        console.error('opening.js가 로드되지 않았습니다!');
        showMenu();
    }
}

// 캐릭터 선택 함수
function selectCharacterByName(characterName) {
    gameState.selectedCharacter = characterName;
    
    // 모든 캐릭터 버튼에서 선택 해제
    document.querySelectorAll('.character-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 선택된 캐릭터 버튼에 선택 표시
    const selectedBtn = document.querySelector(`[data-character="${characterName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // HTML에 정의된 selectCharacter 함수 호출
    if (typeof selectCharacter === 'function') {
        selectCharacter(characterName);
    }
}

// Unit 선택 상태 업데이트
function updateUnitSelection() {
    const unitButtons = document.querySelectorAll('.unit-btn');
    unitButtons.forEach(btn => {
        const unit = btn.getAttribute('data-unit');
        if (gameState.selectedUnits.includes(unit)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    updateSelectedDisplay();
}

// 게임 재시작
function restartGame() {
    if (gameState.selectedUnits.length === 0) {
        alert('Unit을 하나 이상 선택해주세요!');
        return;
    }
    
    gameState.running = false;
    setTimeout(() => {
        initGame();
    }, 100);
}

// 점수 저장 (메모리에만 저장)
let gameRecords = [];

function saveGameRecord() {
    const record = {
        score: gameState.score,
        stage: gameState.stage,
        character: gameState.selectedCharacter,
        units: [...gameState.selectedUnits],
        correctAnswers: gameStats.correctAnswers,
        totalQuestions: gameStats.totalQuestions,
        accuracy: gameStats.totalQuestions > 0 ? 
                  Math.round((gameStats.correctAnswers / gameStats.totalQuestions) * 100) : 0,
        playTime: gameStats.startTime ? 
                  Math.round((Date.now() - gameStats.startTime) / 1000) : 0,
        date: new Date().toLocaleString('ko-KR')
    };
    
    gameRecords.push(record);
    
    // 최근 10개 기록만 유지
    if (gameRecords.length > 10) {
        gameRecords = gameRecords.slice(-10);
    }
    
    return record;
}

// 게임 기록 표시
function showGameRecords() {
    if (gameRecords.length === 0) {
        alert('아직 게임 기록이 없어요! 게임을 플레이해보세요!');
        return;
    }
    
    let recordText = '게임 기록\n\n';
    gameRecords.slice(-5).reverse().forEach((record, index) => {
        recordText += `${index + 1}. ${record.date}\n`;
        recordText += `   캐릭터: ${record.character === 'jiyul' ? '지율이' : 
                                   record.character === 'kiwi' ? '키위' : '화이트하우스'}\n`;
        recordText += `   점수: ${record.score}점 (스테이지 ${record.stage})\n`;
        recordText += `   정답률: ${record.accuracy}% (${record.correctAnswers}/${record.totalQuestions})\n`;
        recordText += `   플레이 시간: ${Math.floor(record.playTime / 60)}분 ${record.playTime % 60}초\n\n`;
    });
    
    alert(recordText);
}

// 게임 오버 시 기록 저장
function gameOverWithRecord() {
    const record = saveGameRecord();
    
    let message = `게임 오버!\n\n`;
    message += `게임 결과\n`;
    message += `최종 점수: ${record.score}점\n`;
    message += `스테이지: ${record.stage}\n`;
    message += `정답률: ${record.accuracy}% (${record.correctAnswers}/${record.totalQuestions})\n`;
    message += `플레이 시간: ${Math.floor(record.playTime / 60)}분 ${record.playTime % 60}초\n\n`;
    message += `다시 도전해보세요!`;
    
    gameState.running = false;
    alert(message);
    showMenu();
}

// 엔딩 시 기록 저장
function showEndingWithRecord() {
    const record = saveGameRecord();
    
    let message = `축하해요!\n`;
    message += `모든 스테이지를 클리어했어요!\n\n`;
    message += `최종 결과\n`;
    message += `최종 점수: ${record.score}점\n`;
    message += `정답률: ${record.accuracy}% (${record.correctAnswers}/${record.totalQuestions})\n`;
    message += `플레이 시간: ${Math.floor(record.playTime / 60)}분 ${record.playTime % 60}초\n\n`;
    message += `정말 대단해요!`;
    
    gameState.running = false;
    alert(message);
    showMenu();
}

// 고급 도움말 함수
function showAdvancedHelp() {
    const helpText = `
지율이의 픽셀 영어 게임 - 상세 도움말

조작법:
• 스페이스바 또는 점프 버튼: 점프
• 위로 스와이프: 점프 (모바일)
• 1,2,3,4 키: 문제 선택지 선택
• ESC 키: 메뉴로 돌아가기
• H 키: 도움말

게임 목표:
• 장애물을 뛰어넘으며 전진하세요!
• 몬스터를 만나면 영어 문제를 풀어요!
• 20스테이지까지 클리어하는 것이 목표!

팁:
• 점프하면 앞으로 더 멀리 갈 수 있어요!
• 보스전에서는 더 어려운 문제가 나와요!
• Unit을 많이 선택할수록 다양한 문제가 나와요!

점수 시스템:
• 장애물 통과: 5-10점
• 문제 정답: 20점
• 몬스터 처치: 50점 (보스 100점)
• 점프: 1점

체력 시스템:
• 틀린 답: -15 체력
• 체력이 0이 되면 게임 오버!
    `;
    
    alert(helpText);
}

// 오프닝 다시보기 함수
function replayOpening() {
    startOpeningSequence();
}

// 전역 함수로 등록하여 HTML에서 접근 가능하게 함
window.showAdvancedHelp = showAdvancedHelp;
window.showGameRecords = showGameRecords;
window.restartGame = restartGame;
window.selectCharacterByName = selectCharacterByName;
window.replayOpening = replayOpening;
window.toggleUnit = toggleUnit;
window.startSelectedGame = startSelectedGame;
window.showMenu = showMenu;
window.showUnitSelectMenu = showUnitSelectMenu;
window.showCharacterSelectMenu = showCharacterSelectMenu;
window.showHelp = showHelp;
window.jump = jump;
window.toggleFullscreen = toggleFullscreen;

// 게임 시작 시 초기화
console.log('게임 스크립트 로딩 완료!');

// DOM이 완전히 로드된 후 게임 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('게임 오류:', e.error);
    
    // 치명적이지 않은 오류는 무시하고 계속 진행
    if (e.error && e.error.message && 
        !e.error.message.includes('Script error') &&
        !e.error.message.includes('Non-Error promise rejection')) {
        
        // 사용자에게 오류 알림 (선택적)
        if (typeof debugMode !== 'undefined' && debugMode) {
            alert(`오류가 발생했습니다: ${e.error.message}`);
        }
    }
});

// 성능 최적화를 위한 requestAnimationFrame 폴백
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 16); // 약 60fps
    };
}

// iOS에서 오디오 활성화 (사운드 추가 시 필요)
function enableAudio() {
    const audioContext = window.AudioContext || window.webkitAudioContext;
    if (audioContext) {
        const ctx = new audioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
    }
}

// 첫 번째 사용자 상호작용에서 오디오 활성화
document.addEventListener('touchstart', enableAudio, { once: true });
document.addEventListener('click', enableAudio, { once: true });

// 키보드 이벤트 처리
document.addEventListener('keydown', function(e) {
    if (!gameState.running) return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            jump();
            break;
        case 'Escape':
            e.preventDefault();
            // ESC 키로 전체화면 해제 시 사용자 의도로 간주
            if (document.fullscreenElement || document.webkitFullscreenElement || 
                document.mozFullScreenElement || document.msFullscreenElement) {
                isUserExiting = true;
                isFullscreenDesired = false;
            }
            showMenu();
            break;
        case 'KeyH':
            e.preventDefault();
            showHelp();
            break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
            if (gameState.questionActive) {
                e.preventDefault();
                const choiceIndex = parseInt(e.code.slice(-1)) - 1;
                selectChoice(choiceIndex);
            }
            break;
    }
});

console.log('지율이의 픽셀 영어 게임 준비 완료!');
