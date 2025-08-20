완전한 코드를 제공하겠습니다. 누락된 함수들과 오류 처리를 모두 포함했습니다:

```javascript
// 영어 게임 로직 - 메인 파일 (완전판)
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
    
    if (gameState.selectedVehicle === 'kiwi') {
        basePower *= 1.2;
    } else if (gameState.selectedVehicle === 'whitehouse') {
        basePower *= 1.1;
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
    bossDialogueActive: false,
    currentEnemy: null,
    backgroundOffset: 0,
    currentQuestion: null,
    isMoving: true,
    cameraX: 0,
    screenShake: 0,
    shakeTimer: 0,
    bossSpawned: false
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
    
    const aspectRatio = screenWidth / screenHeight;
    
    if (aspectRatio > 1.5) {
        PIXEL_SCALE = Math.floor(screenHeight / 150);
    } else if (aspectRatio > 1) {
        PIXEL_SCALE = Math.floor(screenHeight / 120);
    } else {
        PIXEL_SCALE = Math.floor(screenWidth / 150);
    }
    
    PIXEL_SCALE = Math.max(2, Math.min(4, PIXEL_SCALE));
    
    if (player) {
        player.width = 16 * PIXEL_SCALE;
        player.height = 16 * PIXEL_SCALE;
    }
    
    const groundRatio = aspectRatio > 1 ? 0.7 : 0.75;
    GROUND_Y = screenHeight * groundRatio;
    
    if (obstacles && obstacles.length > 0) {
        obstacles.forEach(obstacle => {
            obstacle.y = GROUND_Y - (16 * PIXEL_SCALE);
            obstacle.width = 16 * PIXEL_SCALE;
            obstacle.height = 16 * PIXEL_SCALE;
        });
    }
    
    if (player && gameState && !gameState.questionActive) {
        player.y = GROUND_Y;
        player.velocityY = 0;
        player.onGround = true;
        player.isJumping = false;
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
    
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        const elem = document.documentElement;
        
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
        <h3>🎀 아이폰 사용자님께 🎀</h3>
        <p>
            전체화면으로 플레이하시려면:<br>
            1. Safari 하단의 공유 버튼을 누르세요<br>
            2. "홈 화면에 추가"를 선택하세요<br>
            3. 홈 화면에서 앱처럼 실행하세요!
        </p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #FF69B4;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
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
            fullscreenBtn.textContent = '🏠 추가';
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
    gameState.bossDialogueActive = false;
    gameState.isMoving = true;
    gameState.cameraX = 0;
    gameState.bossSpawned = false;
    
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
    
    gameStats.startTime = Date.now();
    gameStats.correctAnswers = 0;
    gameStats.totalQuestions = 0;
    
    if (typeof initParticleSystem === 'function') {
        initParticleSystem();
    }
    
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
    
    generateMoreEnemies();
}

// 스테이지별 알파벳 가져오기
function getStageAlphabets(stage) {
    if (stage === 20) {
        const allAlphabets = [];
        for (let i = 0; i < 26; i++) {
            allAlphabets.push(String.fromCharCode(65 + i));
        }
        return allAlphabets;
    }
    
    const startIndex = ((stage - 1) * 2) % 26;
    const alphabet1 = String.fromCharCode(65 + startIndex);
    const alphabet2 = String.fromCharCode(65 + ((startIndex + 1) % 26));
    
    return [alphabet1, alphabet2];
}

// 몬스터 무한 생성
function generateMoreEnemies() {
    const currentMaxX = Math.max(...enemies.map(e => e.x), player.worldX);
    const startX = Math.max(currentMaxX + 300, player.worldX + 800);
    
    const stageAlphabets = getStageAlphabets(gameState.stage);
    
    for (let i = 0; i < 5; i++) {
        const baseSpeed = 1.5 + (gameState.stage - 1) * 0.5;
        const direction = Math.random() > 0.5 ? 1 : -1;
        
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

// 게임 업데이트
function update() {
    if (gameState.isMoving && !gameState.questionActive) {
        gameState.distance += gameState.speed;
        gameState.backgroundOffset += gameState.speed * 0.5;
        gameState.cameraX += gameState.speed;
        player.worldX += gameState.speed;
    }
    
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
    
    if (typeof updateParticleSystem === 'function') {
        updateParticleSystem();
    }
    
    enemies = enemies.filter(enemy => 
        enemy.alive && (enemy.x > gameState.cameraX - 500)
    );
    
    obstacles = obstacles.filter(obstacle =>
        obstacle.x > gameState.cameraX - 200
    );
    
    const aheadEnemies = enemies.filter(enemy => 
        enemy.x > player.worldX && enemy.x < player.worldX + 2000
    );
    
    if (aheadEnemies.length < 3) {
        generateMoreEnemies();
    }
    
    const aheadObstacles = obstacles.filter(obstacle =>
        obstacle.x > player.worldX && obstacle.x < player.worldX + 1500
    );
    
    if (aheadObstacles.length < 3) {
        generateMoreObstacles();
    }
    
    if (gameState.stage === 20 && !gameState.bossSpawned && 
        gameState.distance > (gameState.stage * 1500)) {
        
        console.log('🐉 20스테이지 보스 등장!');
        
        const bossX = player.worldX + 400;
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
            isBoss: true,
            dialogueShown: false
        });
        
        gameState.bossSpawned = true;
    }
    
    const stageDistance = gameState.stage * 2000;
    if (gameState.distance > stageDistance) {
        if (gameState.stage >= 20) {
            showEnding();
            return;
        }
        nextStage();
    }
}

// 플레이어 물리 업데이트
function updatePlayerPhysics() {
    if (!player.onGround) {
        player.velocityY += GRAVITY;
    }
    
    player.y += player.velocityY;
    
    if (player.velocityX !== 0) {
        player.worldX += player.velocityX;
        const friction = player.isJumping ? 0.98 : 0.92;
        player.velocityX *= friction;
        if (Math.abs(player.velocityX) < 0.1) {
            player.velocityX = 0;
        }
    }
    
    if (player.y >= GROUND_Y) {
        player.y = GROUND_Y;
        player.velocityY = 0;
        player.onGround = true;
        player.isJumping = false;
        
        if (player.velocityX > 2 && typeof createParticles === 'function') {
            createParticles(player.x, player.y, 'hint');
        }
    }
    
    const targetScreenX = canvas.width / 4;
    player.x = targetScreenX;
    gameState.cameraX = player.worldX - targetScreenX;
}

// 몬스터 물리 처리
function updateEnemyPhysics() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        const enemyScreenX = enemy.x - gameState.cameraX;
        
        if (enemyScreenX > -200 && enemyScreenX < canvas.width + 200) {
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
            
            if (enemy.isMoving && !gameState.questionActive) {
                enemy.x += enemy.walkSpeed * enemy.direction;
                
                if (enemy.patrolStart && enemy.patrolRange) {
                    if (enemy.x <= enemy.patrolStart - enemy.patrolRange || 
                        enemy.x >= enemy.patrolStart + enemy.patrolRange) {
                        enemy.direction *= -1;
                    }
                }
                
                if (Math.random() < 0.005 && enemy.onGround && enemy.jumpCooldown <= 0) {
                    enemy.velocityY = JUMP_POWER * 0.7;
                    enemy.isJumping = true;
                    enemy.onGround = false;
                    enemy.jumpCooldown = 90 + Math.random() * 60;
                }
            }
        }
        
        if (enemy.jumpCooldown > 0) {
            enemy.jumpCooldown--;
        }
        
        if (!enemy.onGround) {
            enemy.velocityY += GRAVITY;
            enemy.y += enemy.velocityY;
            
            const groundLevel = GROUND_Y - (16 * PIXEL_SCALE);
            if (enemy.y >= groundLevel) {
                enemy.y = groundLevel;
                enemy.velocityY = 0;
                enemy.onGround = true;
                enemy.isJumping = false;
            }
        } else {
            enemy.y = GROUND_Y - (16 * PIXEL_SCALE);
        }
    });
}

// 장애물 지속적 생성
function generateMoreObstacles() {
    const currentMaxObstacleX = obstacles.length > 0 ? 
        Math.max(...obstacles.map(o => o.x)) : 
        player.worldX;
    
    const startX = Math.max(currentMaxObstacleX + 300, player.worldX + 600);
    
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
    obstacles.forEach(obstacle => {
        const obstacleScreenX = obstacle.x - gameState.cameraX;
        
        if (obstacleScreenX > -100 && obstacleScreenX < canvas.width + 100) {
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
                    player.worldX = obstacle.x - player.width - 5;
                    player.velocityX = 0;
                    gameState.isMoving = false;
                    gameState.shakeTimer = 10;
                    
                    if (Math.random() < 0.01 && typeof createParticles === 'function') {
                        createParticles(player.x, player.y - 30, 'hint');
                    }
                }
            } else {
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
    
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        
        const enemyScreenX = enemy.x - gameState.cameraX;
        
        if (enemyScreenX > -100 && enemyScreenX < canvas.width + 100) {
            const collisionRange = enemy.isBoss ? 100 : 0;
            
            const enemyCollisionBox = {
                x: enemy.x - collisionRange,
                y: enemy.y - collisionRange,
                width: enemy.width + collisionRange * 2,
                height: enemy.height + collisionRange * 2
            };
            
            const playerCollisionBox = {
                x: player.worldX,
                y: player.y - player.height,
                width: player.width,
                height: player.height
            };
            
            if (checkBoxCollision(playerCollisionBox, enemyCollisionBox)) {
                if (!gameState.questionActive && !gameState.bossDialogueActive) {
                    if (enemy.isBoss && gameState.stage === 20 && !enemy.dialogueShown) {
                        console.log('🐉 보스 대화 시작!');
                        
                        enemy.dialogueShown = true;
                        gameState.bossDialogueActive = true;
                        gameState.isMoving = false;
                        player.velocityX = 0;
                        player.velocityY = 0;
                        
                        document.getElementById('ui').style.display = 'none';
                        document.getElementById('controls').style.display = 'none';
                        
                        if (typeof window.startBossDialogue === 'function') {
                            try {
                                window.startBossDialogue(canvas, ctx, gameState.selectedCharacter, enemy.hp, enemy.maxHp, function() {
                                    console.log('보스 대화 완료, 전투 시작');
                                    
                                    gameState.bossDialogueActive = false;
                                    gameState.questionActive = true;
                                    gameState.currentEnemy = enemy;
                                    
                                    document.getElementById('ui').style.display = 'block';
                                    document.getElementById('controls').style.display = 'flex';
                                    
                                    generateEnglishQuestion();
                                    updateQuestionPanel();
                                    document.getElementById('questionPanel').style.display = 'block';
                                });
                            } catch (error) {
                                console.error('보스 대화 시작 오류:', error);
                                startBossBattle(enemy);
                            }
                        } else {
                            console.error('startBossDialogue 함수를 찾을 수 없습니다!');
                            startBossBattle(enemy);
                        }
                        return;
                    }
                    
                    startBattle(enemy);
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
    
    if (typeof drawBackground === 'function') {
        drawBackground();
    }
    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, GROUND_Y + 16 * PIXEL_SCALE, canvas.width, canvas.height);
    
    obstacles.forEach(obstacle => {
        const screenX = obstacle.x - gameState.cameraX;
        if (screenX > -100 && screenX < canvas.width + 100) {
            if (typeof pixelData !== 'undefined' && pixelData[obstacle.type]) {
                const data = pixelData[obstacle.type];
                drawPixelSprite(data.sprite, data.colorMap, screenX, obstacle.y);
            } else {
                // 픽셀 데이터가 없을 경우 기본 도형으로 표시
                ctx.fillStyle = obstacle.type === 'spike' ? '#FF0000' : '#808080';
                ctx.fillRect(screenX, obstacle.y, obstacle.width, obstacle.height);
            }
            
            if (!gameState.isMoving && Math.abs(player.worldX - obstacle.x) < 100) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.fillRect(screenX, obstacle.y - 10, obstacle.width, 5);
            }
        }
    });
    
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const screenX = enemy.x - gameState.cameraX;
        if (screenX > -100 && screenX < canvas.width + 100) {
            if (enemy.type === 'boss') {
                if (typeof pixelData !== 'undefined' && pixelData.boss) {
                    const data = pixelData.boss;
                    drawPixelSprite(data.idle, data.colorMap, screenX, enemy.y);
                } else {
                    // 보스 기본 표시
                    ctx.fillStyle = '#FF00FF';
                    ctx.fillRect(screenX, enemy.y, enemy.width, enemy.height);
                }
            } else {
                if (typeof alphabetMonsters !== 'undefined' && alphabetMonsters[enemy.type]) {
                    const data = alphabetMonsters[enemy.type];
                    drawPixelSprite(data.idle, data.colorMap, screenX, enemy.y);
                } else {
                    // 몬스터 기본 표시
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(screenX, enemy.y, enemy.width, enemy.height);
                }
            }
            
            if (enemy.isBoss && enemy.isAggro) {
                ctx.fillStyle = 'red';
                ctx.fillRect(screenX, enemy.y - 15, enemy.width, 3);
                
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
        if (player.sprite === 'jiyul' && gameState.selectedVehicle !== 'none') {
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
                
                drawPixelSprite(kiwiSprite, kiwiData.colorMap, player.x, player.y - player.height);
                
                const jiyulData = pixelData.jiyul;
                const jiyulOffsetY = -24;
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
                
                drawPixelSprite(whSprite, whData.colorMap, player.x, player.y - player.height);
                
                const jiyulData = pixelData.jiyul;
                const jiyulOffsetY = -31;
                drawPixelSprite(jiyulData.idle, jiyulData.colorMap, player.x, player.y - player.height + jiyulOffsetY);
            }
        } else {
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
    } else {
        // 플레이어 기본 표시
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(player.x, player.y - player.height, player.width, player.height);
    }
    
    if (typeof renderAllParticles === 'function') {
        renderAllParticles(ctx);
    }
    
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
    
    document.getElementById('questionText').innerHTML = `✨ ${gameState.currentQuestion.question}`;
    
    if (gameState.currentEnemy) {
        let enemyName;
        if (gameState.currentEnemy.type === 'boss') {
            enemyName = '👑 보스';
        } else if (gameState.currentEnemy.type.startsWith('alphabet')) {
            const letter = gameState.currentEnemy.type.replace('alphabet', '');
            enemyName = `🔤 ${letter} 몬스터`;
        } else {
            enemyName = '👹 몬스터';
        }
        
        document.getElementById('enemyInfo').textContent = 
            `${enemyName} 체력: ${gameState.currentEnemy.hp}/${gameState.currentEnemy.maxHp}`;
    }
    
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
        gameState.score += 20;
        gameStats.correctAnswers++;
        
        if (gameState.currentEnemy) {
            gameState.currentEnemy.hp -= 1;
            const enemyScreenX = gameState.currentEnemy.x - gameState.cameraX;
            if (typeof createParticles === 'function') {
                createParticles(enemyScreenX, gameState.currentEnemy.y, 'hit');
            }
            
            if (gameState.currentEnemy.hp <= 0) {
                if (gameState.currentEnemy.type === 'boss') {
                    document.getElementById('ui').style.display = 'none';
                    document.getElementById('controls').style.display = 'none';
                    document.getElementById('questionPanel').style.display = 'none';
                    
                    if (typeof window.startBossDialogue === 'function') {
                        window.startBossDialogue(canvas, ctx, gameState.selectedCharacter, 0, gameState.currentEnemy.maxHp, function() {
                            gameState.currentEnemy.alive = false;
                            gameState.score += 100;
                            gameState.isMoving = true;
                            gameState.questionActive = false;
                            gameState.currentEnemy = null;
                            
                            document.getElementById('ui').style.display = 'block';
                            document.getElementById('controls').style.display = 'flex';
                            
                            if (typeof createParticles === 'function') {
                                createParticles(player.x, player.y, 'defeat');
                            }
                            if (typeof showFloatingText === 'function') {
                                showFloatingText(player.x, player.y - 50, '보스 처치!', '#00FF00');
                            }
                        });
                    } else {
                        gameState.currentEnemy.alive = false;
                        gameState.score += 100;
                        gameState.isMoving = true;
                        gameState.questionActive = false;
                        gameState.currentEnemy = null;
                        
                        document.getElementById('questionPanel').style.display = 'none';
                        document.getElementById('ui').style.display = 'block';
                        document.getElementById('controls').style.display = 'flex';
                    }
                } else {
                    gameState.currentEnemy.alive = false;
                    gameState.score += 50;
                    gameState.isMoving = true;
                    gameState.questionActive = false;
                    gameState.currentEnemy = null;
                    
                    document.getElementById('questionPanel').style.display = 'none';
                    
                    if (typeof createParticles === 'function') {
                        createParticles(player.x, player.y, 'defeat');
                    }
                    if (typeof showFloatingText === 'function') {
                        showFloatingText(player.x, player.y - 50, '완료!', '#00FF00');
                    }
                }
            } else {
                if (gameState.currentEnemy.type === 'boss' && gameState.currentEnemy.hp === 2) {
                    document.getElementById('ui').style.display = 'none';
                    document.getElementById('controls').style.display = 'none';
                    document.getElementById('questionPanel').style.display = 'none';
                    gameState.isMoving = false;
                    
                    if (typeof startBossDialogue === 'function') {
                        startBossDialogue(canvas, ctx, gameState.selectedCharacter, gameState.currentEnemy.hp, gameState.currentEnemy.maxHp, function() {
                            gameState.questionActive = true;
                            
                            document.getElementById('ui').style.display = 'block';
                            document.getElementById('controls').style.display = 'flex';
                            
                            generateEnglishQuestion();
                            updateQuestionPanel();
                            document.getElementById('questionPanel').style.display = 'block';
                        }, true);
                    } else {
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
        selectedUnitsElement.textContent = `💕 선택한 Unit: ${sortedUnits.join(', ')}`;
    } else {
        selectedUnitsElement.textContent = '💕 선택한 Unit: 없음';
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
    alert('🌸 지율이의 픽셀 영어 게임 도움말 🌸\n\n' +
          '1. Unit을 선택하고 시작하세요!\n' +
          '2. 점프 버튼으로 장애물을 뛰어넘으세요!\n' +
          '3. 움직이는 몬스터를 만나면 영어 문제를 풀어요!\n' +
          '4. 영어 단어의 뜻을 4지선다에서 고르세요!\n' +
          '5. 정답을 맞추면 몬스터를 물리칠 수 있어요!\n\n' +
          '💕 지율이 화이팅! 💕');
}

// 게임 오버
function gameOver() {
    gameState.running = false;
    alert(`게임 오버! 😢\n최종 점수: ${gameState.score}점\n다시 도전해보세요!`);
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
    alert(`🎉 스테이지 ${gameState.stage - 1} 클리어! 🎉\n스테이지 ${gameState.stage}로 이동합니다!`);
    
    generateMoreEnemies();
}

// 엔딩 표시 함수
function showEnding() {
    gameState.running = false;
    
    if (typeof startEndingSequence === 'function') {
        startEndingSequence(canvas, ctx, gameState, function() {
            showEndingWithRecord();
        });
    } else {
        showEndingWithRecord();
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

// 픽셀 스프라이트 그리기 함수
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

// 보스 전투 시작 함수
function startBossBattle(enemy) {
    console.log('보스 전투 시작');
    gameState.questionActive = true;
    gameState.currentEnemy = enemy;
    gameState.isMoving = false;
    player.velocityX = 0;
    player.velocityY = 0;
    
    generateEnglishQuestion();
    updateQuestionPanel();
    document.getElementById('questionPanel').style.display = 'block';
}

// 일반 전투 시작 함수
function startBattle(enemy) {
    gameState.questionActive = true;
    gameState.currentEnemy = enemy;
    gameState.isMoving = false;
    
    if (enemy.isBoss) {
        player.velocityX = 0;
        player.velocityY = 0;
    }
    
    generateEnglishQuestion();
    updateQuestionPanel();
    document.getElementById('questionPanel').style.display = 'block';
}

// 초기 캔버스 설정
resizeCanvas();

// 이벤트 리스너 설정
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// 전체화면 변경 이벤트 처리
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
        document.getElementById('fullscreenBtn').textContent = 'EXIT';
        isUserExiting = false;
    } else {
        document.getElementById('fullscreenBtn').textContent = 'FULL';
        
        if (isFullscreenDesired && !isUserExiting) {
            restoreFullscreen();
        }
    }
}

window.addEventListener('load', checkIOSFullscreen);

// 페이지 가시성 변경 시 전체화면 복구
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isFullscreenDesired && !isUserExiting) {
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

// 터치 이벤트 처리
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
    
    if ((deltaY > 50 && deltaTime < 500) || (deltaTime < 200 && Math.abs(deltaY) < 30)) {
        e.preventDefault();
        jump();
    }
}, { passive: false });

// 오프닝 실행 여부 체크
let hasSeenOpening = false;

// 게임 초기화 및 메뉴 표시
function initializeGame() {
    gameState.selectedCharacter = 'jiyul';
    gameState.selectedUnits = [];
    
    resizeCanvas();
    
    if (!hasSeenOpening) {
        startOpeningSequence();
    } else {
        showMenu();
    }
    
    console.log('🌸 지율이의 픽셀 영어 게임이 초기화되었습니다! 🌸');
}

// 오프닝 시퀀스 시작
function startOpeningSequence() {
    document.getElementById('gameContainer').classList.remove('menu-mode');
    document.getElementById('characterSelectMenu').style.display = 'none';
    document.getElementById('unitSelectMenu').style.display = 'none';
    document.getElementById('ui').style.display = 'none';
    document.getElementById('questionPanel').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
    document.getElementById('controls').style.display = 'none';
    
    if (typeof startOpening === 'function') {
        startOpening(canvas, ctx, function() {
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
    
    document.querySelectorAll('.character-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`[data-character="${characterName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
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

// 게임 기록 관리
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
    
    if (gameRecords.length > 10) {
        gameRecords = gameRecords.slice(-10);
    }
    
    return record;
}

// 게임 기록 표시
function showGameRecords() {
    if (gameRecords.length === 0) {
        alert('아직 게임 기록이 없어요! 게임을 플레이해보세요! 💕');
        return;
    }
    
    let recordText = '🏆 게임 기록 🏆\n\n';
    gameRecords.slice(-5).reverse().forEach((record, index) => {
        recordText += `${index + 1}. ${record.date}\n`;
        recordText += `   캐릭터: ${record.character === 'jiyul' ? '지율이' :

```javascript
// 게임 기록 표시 (계속)
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
    
    let message = `게임 오버! 😢\n\n`;
    message += `🏆 게임 결과 🏆\n`;
    message += `최종 점수: ${record.score}점\n`;
    message += `스테이지: ${record.stage}\n`;
    message += `정답률: ${record.accuracy}% (${record.correctAnswers}/${record.totalQuestions})\n`;
    message += `플레이 시간: ${Math.floor(record.playTime / 60)}분 ${record.playTime % 60}초\n\n`;
    message += `다시 도전해보세요! 💕`;
    
    gameState.running = false;
    alert(message);
    showMenu();
}

// 엔딩 시 기록 저장
function showEndingWithRecord() {
    const record = saveGameRecord();
    
    let message = `🎊 축하해요! 🎊\n`;
    message += `모든 스테이지를 클리어했어요!\n\n`;
    message += `🏆 최종 결과 🏆\n`;
    message += `최종 점수: ${record.score}점\n`;
    message += `정답률: ${record.accuracy}% (${record.correctAnswers}/${record.totalQuestions})\n`;
    message += `플레이 시간: ${Math.floor(record.playTime / 60)}분 ${record.playTime % 60}초\n\n`;
    message += `정말 대단해요! 💖`;
    
    gameState.running = false;
    alert(message);
    showMenu();
}

// 기존 gameOver 함수 교체
window.gameOver = gameOverWithRecord;

// 고급 도움말 함수
function showAdvancedHelp() {
    const helpText = `
🌸 지율이의 픽셀 영어 게임 - 상세 도움말 🌸

🎮 조작법:
• 스페이스바 또는 점프 버튼: 점프
• 위로 스와이프: 점프 (모바일)
• 1,2,3,4 키: 문제 선택지 선택
• ESC 키: 메뉴로 돌아가기
• H 키: 도움말

🎯 게임 목표:
• 장애물을 뛰어넘으며 전진하세요!
• 몬스터를 만나면 영어 문제를 풀어요!
• 20스테이지까지 클리어하는 것이 목표!

💡 팁:
• 점프하면 앞으로 더 멀리 갈 수 있어요!
• 보스전에서는 더 어려운 문제가 나와요!
• Unit을 많이 선택할수록 다양한 문제가 나와요!

🏆 점수 시스템:
• 장애물 통과: 5-10점
• 문제 정답: 20점
• 몬스터 처치: 50점 (보스 100점)
• 점프: 1점

❤️ 체력 시스템:
• 틀린 답: -15 체력
• 체력이 0이 되면 게임 오버!
    `;
    
    alert(helpText);
}

// 오프닝 다시보기 함수
function replayOpening() {
    startOpeningSequence();
}

// 필수 파일 체크 함수
function checkRequiredFiles() {
    const required = {
        'WordManager': typeof WordManager !== 'undefined',
        'pixelData': typeof pixelData !== 'undefined',
        'alphabetMonsters': typeof alphabetMonsters !== 'undefined',
        'drawBackground': typeof drawBackground === 'function',
        'startBossDialogue': typeof startBossDialogue === 'function',
        'startOpening': typeof startOpening === 'function',
        'createParticles': typeof createParticles === 'function'
    };
    
    let allLoaded = true;
    for (let [name, loaded] of Object.entries(required)) {
        if (!loaded) {
            console.warn(`⚠️ ${name}이(가) 로드되지 않았습니다.`);
            allLoaded = false;
        }
    }
    
    return allLoaded;
}

// 전역 함수로 등록
window.showAdvancedHelp = showAdvancedHelp;
window.showGameRecords = showGameRecords;
window.restartGame = restartGame;
window.selectCharacterByName = selectCharacterByName;
window.replayOpening = replayOpening;
window.toggleUnit = toggleUnit;
window.startSelectedGame = startSelectedGame;
window.showUnitSelectMenu = showUnitSelectMenu;
window.showCharacterSelectMenu = showCharacterSelectMenu;
window.showHelp = showHelp;
window.toggleFullscreen = toggleFullscreen;
window.jump = jump;

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

// 성능 최적화를 위한 requestAnimationFrame 폴백
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 16);
    };
}

// iOS에서 오디오 활성화
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

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('게임 오류:', e.error);
    
    if (e.error && e.error.message && 
        !e.error.message.includes('Script error') &&
        !e.error.message.includes('Non-Error promise rejection')) {
        
        if (typeof debugMode !== 'undefined' && debugMode) {
            alert(`오류가 발생했습니다: ${e.error.message}`);
        }
    }
});

// DOM이 완전히 로드된 후 게임 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎮 DOM 로드 완료, 게임 초기화 시작...');
        
        // 필수 파일 체크
        if (checkRequiredFiles()) {
            console.log('✅ 모든 필수 파일이 로드되었습니다.');
        } else {
            console.warn('⚠️ 일부 파일이 누락되었습니다. 기본 모드로 실행됩니다.');
        }
        
        initializeGame();
    });
} else {
    console.log('🎮 즉시 게임 초기화...');
    
    if (checkRequiredFiles()) {
        console.log('✅ 모든 필수 파일이 로드되었습니다.');
    } else {
        console.warn('⚠️ 일부 파일이 누락되었습니다. 기본 모드로 실행됩니다.');
    }
    
    initializeGame();
}

console.log('✨ 지율이의 픽셀 영어 게임 준비 완료! ✨');
