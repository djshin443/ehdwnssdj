// 보스 대화 시스템 - 스테이지 20 알파벳 대마왕과의 코믹한 대화
class BossDialogueSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = false;
        this.currentDialogue = 0;
        this.dialogues = [];
        this.typewriterIndex = 0;
        this.textDisplayed = false;
        this.canProceed = false;
        this.onComplete = null;
        
        // 보스와 플레이어 위치
        this.setupCharacterPositions();
        
        // 애니메이션 변수들
        this.frame = 0;
        this.shakeAmount = 0;
        this.bossRotation = 0;
        this.playerExpression = 'normal';
        this.bossExpression = 'evil';
        
        // 파티클 효과
        this.particles = [];
        this.lightningBolts = [];
        this.comicEffects = [];
        
        // 배경 별들
        this.stars = [];
        this.generateStars();
    }
    
    // 캐릭터 위치 설정
    setupCharacterPositions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLandscape = this.canvas.width > this.canvas.height;
        
        if (isLandscape) {
            // 가로모드: 보스는 오른쪽, 플레이어는 왼쪽
            this.playerPos = {
                x: this.canvas.width * 0.2,
                y: this.canvas.height * 0.6,
                scale: isMobile ? 4 : 5,
                rotation: 0
            };
            
            this.bossPos = {
                x: this.canvas.width * 0.7,
                y: this.canvas.height * 0.4,
                scale: isMobile ? 4 : 5,
                rotation: 0
            };
        } else {
            // 세로모드: 보스는 위쪽, 플레이어는 아래쪽
            this.playerPos = {
                x: this.canvas.width * 0.5,
                y: this.canvas.height * 0.7,
                scale: 4,
                rotation: 0
            };
            
            this.bossPos = {
                x: this.canvas.width * 0.5,
                y: this.canvas.height * 0.3,
                scale: 4,
                rotation: 0
            };
        }
    }
    
    // 별 생성
    generateStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 0.5,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }
    
    // 캐릭터별 대화 생성
    generateDialogues(playerCharacter, bossHp, maxBossHp) {
        const character = playerCharacter || 'jiyul';
        
        // 보스 등장 시 대화
        if (bossHp === maxBossHp) {
            this.dialogues = this.getIntroDialogues(character);
        }
        // 보스 체력 절반 이하
        else if (bossHp <= maxBossHp / 2 && bossHp > 0) {
            this.dialogues = this.getMidDialogues(character);
        }
        // 보스 처치 후
        else if (bossHp <= 0) {
            this.dialogues = this.getDefeatDialogues(character);
        }
    }
    
    // 보스 등장 대화
    getIntroDialogues(character) {
        const characterNames = {
            'jiyul': '지율이',
            'kiwi': '키위',
            'whitehouse': '화이트하우스'
        };
        
        const characterGreetings = {
            'jiyul': "💜 \"어? 저 UFO... 오프닝에서 봤던 그거 아냐?! 설마...\" 💜",
            'kiwi': "🥝 \"끼룩끼룩?! (번역: 저 UFO가 왜 여기에?!)\" 🥝",
            'whitehouse': "🏠 \"으음... 내 센서가 강력한 적을 감지했다!\" 🏠"
        };
        
        const characterReactions = {
            'jiyul': "💜 \"헉! 정말로 알파벳 대마왕이었어! 그런데... 생각보다 귀엽네?\" 😅",
            'kiwi': "🥝 \"끼룩끼룩끼룩!! (번역: 오프닝에서 내 간식 뺏어간 놈!)\" 😤",
            'whitehouse': "🏠 \"흥미롭군... 내 백과사전에 '우주 침입자 대처법' 항목이 있었던 것 같은데...\" 🤔"
        };
        
        const characterChallenges = {
            'jiyul': "💜 \"좋아! 내가 영어 실력으로 지구를 지켜줄게! 갑시다~ 💪\"",
            'kiwi': "🥝 \"끼룩! (번역: 내 영어 실력을 보여주겠어!)\" 🔥",
            'whitehouse': "🏠 \"데이터베이스 로딩 완료! 영어 배틀 모드 활성화!\" ⚡"
        };
        
        return [
            {
                speaker: 'player',
                text: characterGreetings[character],
                effect: 'surprised'
            },
            {
                speaker: 'boss',
                text: "👽 \"뽸하하하! 드디어 나타났구나, 지구의 꼬맹이! 나는 알파벳 대마왕이다!\" 👽",
                effect: 'villain_laugh'
            },
            {
                speaker: 'boss',
                text: "👽 \"이번엔 진짜 심각하다! A부터 Z까지 모든 영어를 내가 지배할 것이야! 뽸하하!\" 😈",
                effect: 'evil_plan'
            },
            {
                speaker: 'player',
                text: characterReactions[character],
                effect: 'determined'
            },
            {
                speaker: 'boss',
                text: "👽 \"귀엽다고?! 나는 무시무시한 우주 정복자라고! 이제 울면서 도망갈 준비 됐나?\" 💢",
                effect: 'angry'
            },
            {
                speaker: 'player',
                text: characterChallenges[character],
                effect: 'heroic'
            },
            {
                speaker: 'boss',
                text: "👽 \"흥! 그럼 내 궁극의 영어 시험을 받아보거라! 틀리면... 지구는 내 것이다!\" ⚡",
                effect: 'final_challenge'
            }
        ];
    }
    
    // 중간 대화 (보스 체력 절반 이하)
    getMidDialogues(character) {
        const characterMidReactions = {
            'jiyul': "💜 \"어? 생각보다 약하네! 영어 공부 열심히 한 보람이 있어! ✨\"",
            'kiwi': "🥝 \"끼룩끼룩! (번역: 하하! 내가 이기고 있어!)\" 😎",
            'whitehouse': "🏠 \"계산 결과... 승리 확률 87.3%! 거의 다 왔다!\" 📊"
        };
        
        return [
            {
                speaker: 'boss',
                text: "👽 \"어... 어떻게! 내 완벽한 영어 실력이! 이럴 수가!\" 😱",
                effect: 'shock'
            },
            {
                speaker: 'player',
                text: characterMidReactions[character],
                effect: 'confident'
            },
            {
                speaker: 'boss',
                text: "👽 \"아직 끝나지 않았다! 내가 숨겨둔 비밀 병기... 초고난도 영어 단어들!\" 💥",
                effect: 'desperate'
            },
            {
                speaker: 'boss',
                text: "👽 \"이제부터가 진짜야! 준비됐나, 지구 꼬맹아?\" 😤",
                effect: 'power_up'
            }
        ];
    }
    
    // 보스 처치 후 대화
    getDefeatDialogues(character) {
        const characterVictoryLines = {
            'jiyul': "💜 \"야호! 해냈어! 영어 공부 열심히 한 보람이 있었네! 🎉\"",
            'kiwi': "🥝 \"끼룩끼룩끼룩! (번역: 우리가 이겼다! 지구만세!)\" 🎊",
            'whitehouse': "🏠 \"미션 컴플리트! 지구 방어 성공! 데이터 저장 중...\" 💾"
        };
        
        const characterFinalLines = {
            'jiyul': "💜 \"앞으로도 영어 공부 열심히 해서 지구를 지킬게! 화이팅! 💪\"",
            'kiwi': "🥝 \"끼룩! (번역: 이제 안전하게 간식을 먹을 수 있겠어!)\" 🍪",
            'whitehouse': "🏠 \"평화가 돌아왔다. 이제 영어 학습 모드로 복귀하자!\" 📚"
        };
        
        return [
            {
                speaker: 'boss',
                text: "👽 \"아... 아니다! 이럴 수가! 내가... 내가 졌다고?!\" 😵",
                effect: 'defeat'
            },
            {
                speaker: 'player',
                text: characterVictoryLines[character],
                effect: 'victory'
            },
            {
                speaker: 'boss',
                text: "👽 \"흑흑... 너희들 영어 실력이 정말 대단하구나... 인정한다!\" 😭",
                effect: 'crying'
            },
            {
                speaker: 'boss',
                text: "👽 \"사실... 나도 영어 공부하고 싶었어. 같이 친구가 될 수 있을까?\" 🥺",
                effect: 'friendship'
            },
            {
                speaker: 'player',
                text: characterFinalLines[character],
                effect: 'happy_ending'
            },
            {
                speaker: 'boss',
                text: "👽 \"고마워! 이제부터 나도 영어 공부 열심히 할게! 지구 만세!\" 🌍",
                effect: 'reformed'
            }
        ];
    }
    
    // 대화 시작
    startDialogue(playerCharacter, bossHp, maxBossHp, onComplete) {
        this.isActive = true;
        this.currentDialogue = 0;
        this.typewriterIndex = 0;
        this.textDisplayed = false;
        this.canProceed = false;
        this.onComplete = onComplete;
        this.frame = 0;
        
        this.generateDialogues(playerCharacter, bossHp, maxBossHp);
        this.setupCharacterPositions();
        
        // 게임 루프 시작
        this.run();
    }
    
    // 업데이트
    update() {
        if (!this.isActive) return;
        
        this.frame++;
        
        // 타이핑 효과
        if (this.currentDialogue < this.dialogues.length && !this.textDisplayed) {
            const dialogue = this.dialogues[this.currentDialogue];
            if (this.typewriterIndex < dialogue.text.length) {
                this.typewriterIndex += 2;
                if (this.typewriterIndex >= dialogue.text.length) {
                    this.typewriterIndex = dialogue.text.length;
                    this.textDisplayed = true;
                    this.canProceed = true;
                }
            }
        }
        
        // 애니메이션 업데이트
        this.updateAnimations();
        this.updateEffects();
    }
    
    // 애니메이션 업데이트
    updateAnimations() {
        const dialogue = this.dialogues[this.currentDialogue];
        if (!dialogue) return;
        
        // 보스 애니메이션
        switch(dialogue.effect) {
            case 'villain_laugh':
            case 'evil_plan':
                this.bossPos.y = this.canvas.height * (this.canvas.width > this.canvas.height ? 0.4 : 0.3) + 
                                Math.sin(this.frame * 0.2) * 20;
                this.bossRotation = Math.sin(this.frame * 0.1) * 0.2;
                this.bossExpression = 'evil';
                break;
                
            case 'angry':
                this.shakeAmount = 15;
                this.bossExpression = 'angry';
                this.generateAngryParticles();
                break;
                
            case 'shock':
            case 'defeat':
                this.bossPos.y += Math.sin(this.frame * 0.3) * 5;
                this.bossExpression = 'shocked';
                break;
                
            case 'crying':
                this.generateTearDrops();
                this.bossExpression = 'sad';
                break;
                
            case 'friendship':
            case 'reformed':
                this.generateSparkles();
                this.bossExpression = 'happy';
                break;
        }
        
        // 플레이어 애니메이션
        switch(dialogue.effect) {
            case 'surprised':
                this.playerPos.rotation = Math.sin(this.frame * 0.3) * 0.1;
                this.playerExpression = 'surprised';
                break;
                
            case 'determined':
            case 'heroic':
                this.playerPos.y = this.canvas.height * (this.canvas.width > this.canvas.height ? 0.6 : 0.7) + 
                                  Math.abs(Math.sin(this.frame * 0.15)) * -20;
                this.playerExpression = 'heroic';
                this.generateHeroicEffects();
                break;
                
            case 'confident':
                this.playerExpression = 'confident';
                this.generateConfidenceStars();
                break;
                
            case 'victory':
            case 'happy_ending':
                this.playerPos.y += Math.abs(Math.sin(this.frame * 0.2)) * -30;
                this.playerExpression = 'victory';
                this.generateVictoryFireworks();
                break;
        }
        
        // 화면 흔들림 감소
        if (this.shakeAmount > 0) {
            this.shakeAmount *= 0.9;
        }
    }
    
    // 특수 효과 업데이트
    updateEffects() {
        // 파티클 업데이트
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity || 0;
            p.life--;
            p.alpha = p.life / p.maxLife;
            return p.life > 0;
        });
        
        // 번개 효과 업데이트
        this.lightningBolts = this.lightningBolts.filter(bolt => {
            bolt.life--;
            return bolt.life > 0;
        });
        
        // 별 애니메이션
        this.stars.forEach(star => {
            star.twinkle += 0.1;
            star.x += star.speed * 0.5;
            if (star.x > this.canvas.width) {
                star.x = -10;
                star.y = Math.random() * this.canvas.height;
            }
        });
    }
    
    // 화난 파티클 생성
    generateAngryParticles() {
        if (this.frame % 10 === 0) {
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: this.bossPos.x + (Math.random() - 0.5) * 60,
                    y: this.bossPos.y - 40,
                    vx: (Math.random() - 0.5) * 5,
                    vy: -Math.random() * 3,
                    life: 30,
                    maxLife: 30,
                    color: '#FF0000',
                    size: 5,
                    type: 'angry'
                });
            }
        }
    }
    
    // 눈물 생성
    generateTearDrops() {
        if (this.frame % 20 === 0) {
            this.particles.push({
                x: this.bossPos.x + 10,
                y: this.bossPos.y - 10,
                vx: 0,
                vy: 3,
                life: 40,
                maxLife: 40,
                color: '#87CEEB',
                size: 4,
                type: 'tear'
            });
        }
    }
    
    // 반짝임 효과
    generateSparkles() {
        if (this.frame % 15 === 0) {
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: this.bossPos.x + (Math.random() - 0.5) * 80,
                    y: this.bossPos.y + (Math.random() - 0.5) * 80,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 25,
                    maxLife: 25,
                    color: '#FFD700',
                    size: 3,
                    type: 'sparkle'
                });
            }
        }
    }
    
    // 영웅적 효과
    generateHeroicEffects() {
        if (this.frame % 20 === 0) {
            const colors = ['#FF69B4', '#FFD700', '#87CEEB'];
            for (let i = 0; i < 3; i++) {
                this.particles.push({
                    x: this.playerPos.x + (Math.random() - 0.5) * 60,
                    y: this.playerPos.y - 30,
                    vx: (Math.random() - 0.5) * 4,
                    vy: -Math.random() * 4,
                    life: 35,
                    maxLife: 35,
                    color: colors[i],
                    size: 4,
                    type: 'heroic'
                });
            }
        }
    }
    
    // 자신감 별
    generateConfidenceStars() {
        if (this.frame % 25 === 0) {
            this.particles.push({
                x: this.playerPos.x,
                y: this.playerPos.y - 50,
                vx: (Math.random() - 0.5) * 2,
                vy: -2,
                life: 30,
                maxLife: 30,
                color: '#FFD700',
                size: 6,
                type: 'star'
            });
        }
    }
    
    // 승리 폭죽
    generateVictoryFireworks() {
        if (this.frame % 12 === 0) {
            const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
            for (let i = 0; i < 8; i++) {
                this.particles.push({
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 3,
                    vx: Math.cos(i * Math.PI / 4) * 8,
                    vy: Math.sin(i * Math.PI / 4) * 8,
                    life: 40,
                    maxLife: 40,
                    color: colors[i % colors.length],
                    size: 5,
                    gravity: 0.3,
                    type: 'firework'
                });
            }
        }
    }
    
    // 렌더링
    render() {
        // 화면 흔들림
        this.ctx.save();
        if (this.shakeAmount > 0.1) {
            this.ctx.translate(
                (Math.random() - 0.5) * this.shakeAmount,
                (Math.random() - 0.5) * this.shakeAmount
            );
        }
        
        // 배경 그리기
        this.drawBackground();
        
        // 캐릭터들 그리기
        this.drawCharacters();
        
        // 특수 효과 그리기
        this.drawEffects();
        
        this.ctx.restore();
        
        // 대화 박스 그리기
        this.drawDialogue();
        
        // 클릭 힌트
        if (this.canProceed) {
            this.drawClickHint();
        }
    }
    
    // 배경 그리기
    drawBackground() {
        // 우주 배경
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#000011');
        gradient.addColorStop(0.5, '#001133');
        gradient.addColorStop(1, '#000022');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 별들
        this.stars.forEach(star => {
            const twinkle = Math.sin(star.twinkle) * 0.5 + 0.5;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 지구 (멀리서)
        this.ctx.fillStyle = '#4169E1';
        this.ctx.beginPath();
        this.ctx.arc(50, this.canvas.height - 50, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#32CD32';
        this.ctx.beginPath();
        this.ctx.arc(45, this.canvas.height - 55, 8, 0, Math.PI * 2);
        this.ctx.arc(55, this.canvas.height - 45, 6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // 캐릭터 그리기
    drawCharacters() {
        // 플레이어 캐릭터 그리기
        this.drawPlayer();
        
        // 보스 그리기
        this.drawBoss();
    }
    
    // 플레이어 그리기
    drawPlayer() {
        if (typeof pixelData === 'undefined') return;
        
        const characterType = window.gameState ? window.gameState.selectedCharacter : 'jiyul';
        const characterData = pixelData[characterType];
        
        if (characterData) {
            this.drawPixelSprite(
                characterData.idle,
                characterData.colorMap,
                this.playerPos.x - (this.playerPos.scale * 8),
                this.playerPos.y - (this.playerPos.scale * 16),
                this.playerPos.scale,
                this.playerPos.rotation
            );
        }
        
        // 표정 이모티콘
        this.drawPlayerExpression();
    }
    
    // 보스 그리기
    drawBoss() {
        if (typeof pixelData === 'undefined' || !pixelData.boss) return;
        
        this.drawPixelSprite(
            pixelData.boss.idle,
            pixelData.boss.colorMap,
            this.bossPos.x - (this.bossPos.scale * 8),
            this.bossPos.y - (this.bossPos.scale * 16),
            this.bossPos.scale,
            this.bossRotation
        );
        
        // 보스 표정
        this.drawBossExpression();
        
        // 보스 오라
        this.drawBossAura();
    }
    
    // 픽셀 스프라이트 그리기
    drawPixelSprite(sprite, colorMap, x, y, scale = 3, rotation = 0) {
        this.ctx.save();
        this.ctx.translate(x + 8 * scale, y + 8 * scale);
        this.ctx.rotate(rotation);
        this.ctx.translate(-8 * scale, -8 * scale);
        
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel !== 0 && colorMap[pixel]) {
                    this.ctx.fillStyle = colorMap[pixel];
                    this.ctx.fillRect(col * scale, row * scale, scale, scale);
                }
            }
        }
        
        this.ctx.restore();
    }
    
    // 플레이어 표정
    drawPlayerExpression() {
        const x = this.playerPos.x;
        const y = this.playerPos.y - 60;
        
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        
        switch(this.playerExpression) {
            case 'surprised':
                this.ctx.fillText('😮', x, y);
                break;
            case 'heroic':
                this.ctx.fillText('💪', x, y);
                break;
            case 'confident':
                this.ctx.fillText('😎', x, y);
                break;
            case 'victory':
                this.ctx.fillText('🎉', x, y);
                break;
        }
    }
    
    // 보스 표정
    drawBossExpression() {
        const x = this.bossPos.x;
        const y = this.bossPos.y - 70;
        
        this.ctx.font = '28px Arial';
        this.ctx.textAlign = 'center';
        
        switch(this.bossExpression) {
            case 'evil':
                this.ctx.fillText('😈', x, y);
                break;
            case 'angry':
                this.ctx.fillText('💢', x, y);
                break;
            case 'shocked':
                this.ctx.fillText('😱', x, y);
                break;
            case 'sad':
                this.ctx.fillText('😭', x, y);
                break;
            case 'happy':
                this.ctx.fillText('😊', x, y);
                break;
        }
    }
    
    // 보스 오라
    drawBossAura() {
        const dialogue = this.dialogues[this.currentDialogue];
        if (!dialogue) return;
        
        if (dialogue.effect === 'evil_plan' || dialogue.effect === 'final_challenge') {
            const gradient = this.ctx.createRadialGradient(
                this.bossPos.x, this.bossPos.y, 0,
                this.bossPos.x, this.bossPos.y, 100
            );
            gradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
            gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(this.bossPos.x, this.bossPos.y, 100, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // 특수 효과 그리기
    drawEffects() {
        // 파티클 그리기
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            
            if (p.type === 'star') {
                this.ctx.font = `${p.size * 3}px Arial`;
                this.ctx.fillText('⭐', p.x, p.y);
            } else if (p.type === 'tear') {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.ellipse(p.x, p.y, p.size, p.size * 1.5, 0, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    // 대화 그리기
    drawDialogue() {
        if (this.currentDialogue < this.dialogues.length) {
            const dialogue = this.dialogues[this.currentDialogue];
            
            // 대화 박스 위치 (화면 하단)
            const boxHeight = 120;
            const boxY = this.canvas.height - boxHeight - 20;
            const boxX = 20;
            const boxWidth = this.canvas.width - 40;
            
            // 대화 박스 배경
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            
            // 대화 박스 테두리 (화자별 색상)
            this.ctx.strokeStyle = this.getSpeakerColor(dialogue.speaker);
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
            
            // 말풍선 꼬리
            this.drawSpeechBubbleTail(dialogue.speaker, boxX, boxY, boxWidth, boxHeight);
            
            // 텍스트 렌더링
            this.ctx.save();
            this.ctx.imageSmoothingEnabled = true;
            
            const displayText = dialogue.text.substring(0, this.typewriterIndex);
            
            this.ctx.fillStyle = '#000000';
            this.ctx.font = 'bold 18px Jua, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // 텍스트 줄바꿈 처리
            const maxWidth = boxWidth - 40;
            const words = displayText.split(' ');
            let line = '';
            let lines = [];
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = this.ctx.measureText(testLine);
                const testWidth = metrics.width;
                
                if (testWidth > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
            
            // 여러 줄 텍스트 렌더링
            const lineHeight = 25;
            const startY = boxY + boxHeight / 2 - (lines.length - 1) * lineHeight / 2;
            
            lines.forEach((line, index) => {
                this.ctx.fillText(line.trim(), this.canvas.width / 2, startY + index * lineHeight);
            });
            
            this.ctx.restore();
        }
    }
    
    // 말풍선 꼬리 그리기
    drawSpeechBubbleTail(speaker, boxX, boxY, boxWidth, boxHeight) {
        let tailX;
        
        if (speaker === 'player') {
            tailX = this.playerPos.x;
        } else if (speaker === 'boss') {
            tailX = this.bossPos.x;
        } else {
            return;
        }
        
        const color = this.getSpeakerColor(speaker);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(tailX - 15, boxY);
        this.ctx.lineTo(tailX + 15, boxY);
        this.ctx.lineTo(tailX, boxY - 25);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    // 화자별 색상
    getSpeakerColor(speaker) {
        switch(speaker) {
            case 'player': return '#FF69B4';
            case 'boss': return '#8B008B';
            default: return '#9370DB';
        }
    }
    
    // 클릭 힌트
    drawClickHint() {
        const alpha = (Math.sin(this.frame * 0.1) + 1) * 0.5;
        
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('▼ 클릭하여 계속 ▼', this.canvas.width / 2, this.canvas.height - 150);
        this.ctx.restore();
    }
    
    // 클릭 처리
    handleClick(x, y) {
        if (!this.textDisplayed) {
            // 텍스트 빠르게 표시
            this.typewriterIndex = this.dialogues[this.currentDialogue].text.length;
            this.textDisplayed = true;
            this.canProceed = true;
        } else if (this.canProceed) {
            // 다음 대화로
            this.nextDialogue();
        }
    }
    
    // 다음 대화
    nextDialogue() {
        this.currentDialogue++;
        this.typewriterIndex = 0;
        this.textDisplayed = false;
        this.canProceed = false;
        
        if (this.currentDialogue >= this.dialogues.length) {
            this.complete();
        } else {
            // 표정 초기화
            this.playerExpression = 'normal';
            this.bossExpression = 'evil';
        }
    }
    
    // 완료
    complete() {
        this.isActive = false;
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    // 실행
    run() {
        if (!this.isActive) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.run());
    }
    
    // 화면 크기 변경 처리
    handleResize() {
        this.setupCharacterPositions();
        this.generateStars(); // 별 다시 생성
    }
}

// 전역 함수로 등록
window.BossDialogueSystem = BossDialogueSystem;

// 보스 대화 시작 함수
function startBossDialogue(canvas, ctx, playerCharacter, bossHp, maxBossHp, onComplete) {
    const bossDialogue = new BossDialogueSystem(canvas, ctx);
    bossDialogue.startDialogue(playerCharacter, bossHp, maxBossHp, onComplete);
    
    // 클릭 이벤트 리스너
    const clickHandler = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        bossDialogue.handleClick(x, y);
        
        if (!bossDialogue.isActive) {
            canvas.removeEventListener('click', clickHandler);
            canvas.removeEventListener('touchend', touchHandler);
            window.removeEventListener('resize', resizeHandler);
        }
    };
    
    // 터치 이벤트 리스너
    const touchHandler = (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        bossDialogue.handleClick(x, y);
        
        if (!bossDialogue.isActive) {
            canvas.removeEventListener('click', clickHandler);
            canvas.removeEventListener('touchend', touchHandler);
            window.removeEventListener('resize', resizeHandler);
        }
    };
    
    // 리사이즈 이벤트
    const resizeHandler = () => {
        bossDialogue.handleResize();
    };
    
    canvas.addEventListener('click', clickHandler);
    canvas.addEventListener('touchend', touchHandler);
    window.addEventListener('resize', resizeHandler);
    
    return bossDialogue;
}

// 전역 함수로 등록
window.startBossDialogue = startBossDialogue;