// 배경 그리기 시스템 - background.js

// 메인 배경 그리기 함수 (화려한 버전)
function drawBackground() {
    // 시간에 따른 하늘 색상 변화 (낮/노을/밤 느낌)
    const timePhase = (gameState.distance / 1000) % 3;
    let skyColors;
    
    if (timePhase < 1) {
        // 아침/낮 - 파란 하늘
        skyColors = ['#87CEEB', '#98D8E8', '#B0E0E6'];
    } else if (timePhase < 2) {
        // 노을 - 오렌지/핑크 하늘
        skyColors = ['#FF6B6B', '#FF8E8E', '#FFB6C1'];
    } else {
        // 밤 - 보라/남색 하늘
        skyColors = ['#2F1B69', '#4B0082', '#6A0DAD'];
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, skyColors[0]);
    gradient.addColorStop(0.7, skyColors[1]);
    gradient.addColorStop(1, skyColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 별과 달 (밤 시간대)
    if (timePhase >= 2) {
        drawStars();
        drawMoon();
    } else {
        // 태양과 구름 (낮/노을 시간대)
        drawSun(timePhase);
        drawClouds();
    }
    
    // 무지개 (가끔 등장)
    if (Math.sin(gameState.distance / 500) > 0.7) {
        drawRainbow();
    }
    
    // 원거리 산들 (다층 패럴랙스)
    drawMountainLayers();
    
    // 나무들과 식물들
    drawVegetation();
    
    // 꽃밭과 나비들
    drawFlowerField();
    
    // 날아다니는 요소들
    drawFlyingElements();
    
    // 마법같은 파티클들
    drawMagicalParticles();
}

// 별들 그리기
function drawStars() {
    ctx.fillStyle = '#FFFF99';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137 + gameState.distance * 0.1) % canvas.width;
        const y = (i * 71) % (canvas.height * 0.6);
        const size = 1 + (i % 3);
        
        // 반짝이는 효과
        const twinkle = Math.sin(gameState.distance * 0.05 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// 달 그리기
function drawMoon() {
    const moonX = canvas.width - 120;
    const moonY = 60;
    
    // 달 뒤 후광
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
    moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    moonGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(moonX - 80, moonY - 80, 160, 160);
    
    // 달 본체
    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // 달 크레이터
    ctx.fillStyle = '#E6E6FA';
    ctx.beginPath();
    ctx.arc(moonX - 10, moonY - 5, 8, 0, Math.PI * 2);
    ctx.arc(moonX + 8, moonY + 10, 5, 0, Math.PI * 2);
    ctx.arc(moonX - 5, moonY + 15, 4, 0, Math.PI * 2);
    ctx.fill();
}

// 태양 그리기 (시간대별)
function drawSun(timePhase) {
    const sunX = canvas.width - 150;
    const sunY = 80 + Math.sin(timePhase) * 30;
    let sunColor = '#FFD700';
    
    if (timePhase >= 1) {
        // 노을 시간 - 붉은 태양
        sunColor = '#FF6347';
    }
    
    // 태양 후광
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 100);
    sunGlow.addColorStop(0, sunColor + '80');
    sunGlow.addColorStop(1, sunColor + '00');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(sunX - 100, sunY - 100, 200, 200);
    
    // 태양 본체
    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // 태양 광선
    ctx.strokeStyle = sunColor;
    ctx.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + gameState.distance * 0.01;
        const length = 50 + Math.sin(gameState.distance * 0.1 + i) * 10;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 50, sunY + Math.sin(angle) * 50);
        ctx.lineTo(sunX + Math.cos(angle) * length, sunY + Math.sin(angle) * length);
        ctx.stroke();
    }
}

// 구름들 그리기
function drawClouds() {
    const cloudOffset = (gameState.backgroundOffset * 0.3) % (canvas.width + 400);
    
    // 다양한 크기와 모양의 구름들
    const clouds = [
        {x: 100, y: 60, size: 1.2, opacity: 0.9},
        {x: 350, y: 40, size: 0.8, opacity: 0.7},
        {x: 600, y: 80, size: 1.5, opacity: 0.8},
        {x: 900, y: 50, size: 1.0, opacity: 0.9},
        {x: 1200, y: 70, size: 1.3, opacity: 0.6}
    ];
    
    clouds.forEach(cloud => {
        drawDetailedCloud(cloud.x - cloudOffset, cloud.y, cloud.size, cloud.opacity);
    });
}

// 상세한 구름 그리기
function drawDetailedCloud(x, y, size, opacity) {
    if (x < -200 || x > canvas.width + 200) return;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    
    // 구름의 여러 원들로 자연스러운 모양 만들기
    const circles = [
        {offsetX: 0, offsetY: 0, radius: 25 * size},
        {offsetX: 20 * size, offsetY: -5 * size, radius: 35 * size},
        {offsetX: 45 * size, offsetY: 0, radius: 25 * size},
        {offsetX: 25 * size, offsetY: -20 * size, radius: 20 * size},
        {offsetX: 60 * size, offsetY: -10 * size, radius: 18 * size}
    ];
    
    ctx.beginPath();
    circles.forEach(circle => {
        ctx.arc(x + circle.offsetX, y + circle.offsetY, circle.radius, 0, Math.PI * 2);
    });
    ctx.fill();
    
    // 구름 그림자
    ctx.fillStyle = `rgba(200, 200, 200, ${opacity * 0.3})`;
    ctx.beginPath();
    circles.forEach(circle => {
        ctx.arc(x + circle.offsetX + 5, y + circle.offsetY + 5, circle.radius * 0.9, 0, Math.PI * 2);
    });
    ctx.fill();
}

// 무지개 그리기
function drawRainbow() {
    const centerX = canvas.width * 0.7;
    const centerY = canvas.height;
    const rainbowColors = [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
        '#0000FF', '#4B0082', '#9400D3'
    ];
    
    ctx.globalAlpha = 0.6;
    rainbowColors.forEach((color, index) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 200 - index * 12, Math.PI, 0);
        ctx.stroke();
    });
    ctx.globalAlpha = 1;
}

// 산맥 레이어들 그리기
function drawMountainLayers() {
    // 가장 먼 산맥들 (보라색 계열)
    const farOffset = (gameState.backgroundOffset * 0.1) % (canvas.width + 600);
    ctx.fillStyle = '#9370DB';
    for (let i = 0; i < 3; i++) {
        const xPos = i * (canvas.width + 600) - farOffset;
        drawMountainRange(xPos, GROUND_Y - 180, 8, 150);
    }
    
    // 중간 산맥들 (파란색 계열)
    const midOffset = (gameState.backgroundOffset * 0.2) % (canvas.width + 500);
    ctx.fillStyle = '#4682B4';
    for (let i = 0; i < 3; i++) {
        const xPos = i * (canvas.width + 500) - midOffset;
        drawMountainRange(xPos, GROUND_Y - 130, 6, 120);
    }
    
    // 가까운 산맥들 (초록색 계열)
    const nearOffset = (gameState.backgroundOffset * 0.3) % (canvas.width + 400);
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 3; i++) {
        const xPos = i * (canvas.width + 400) - nearOffset;
        drawMountainRange(xPos, GROUND_Y - 80, 5, 100);
    }
}

// 산맥 그리기
function drawMountainRange(startX, baseY, count, maxHeight) {
    ctx.beginPath();
    ctx.moveTo(startX, baseY);
    
    for (let i = 0; i <= count; i++) {
        const x = startX + (i * (canvas.width + 200)) / count;
        const height = maxHeight * (0.5 + Math.sin(i * 0.7) * 0.5);
        ctx.lineTo(x, baseY - height);
    }
    
    ctx.lineTo(startX + canvas.width + 200, baseY);
    ctx.closePath();
    ctx.fill();
}

// 식물들 그리기
function drawVegetation() {
    const treeOffset = (gameState.backgroundOffset * 0.5) % (canvas.width + 400);
    
    const trees = [
        {x: 120, type: 'pine', size: 1.0},
        {x: 280, type: 'oak', size: 1.2},
        {x: 450, type: 'pine', size: 0.8},
        {x: 620, type: 'birch', size: 1.1},
        {x: 800, type: 'oak', size: 1.3}
    ];
    
    trees.forEach(tree => {
        drawTree(tree.x - treeOffset, GROUND_Y, tree.type, tree.size);
    });
}

// 나무 그리기
function drawTree(x, y, type, size) {
    if (x < -100 || x > canvas.width + 100) return;
    
    const trunkHeight = 60 * size;
    const trunkWidth = 12 * size;
    
    // 나무 기둥
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - trunkWidth/2, y - trunkHeight, trunkWidth, trunkHeight);
    
    // 나무 잎사귀
    ctx.fillStyle = '#228B22';
    if (type === 'pine') {
        // 소나무 모양
        for (let i = 0; i < 3; i++) {
            const leafY = y - trunkHeight + i * 15 * size;
            const leafSize = (35 - i * 5) * size;
            ctx.beginPath();
            ctx.moveTo(x, leafY - leafSize);
            ctx.lineTo(x - leafSize/2, leafY);
            ctx.lineTo(x + leafSize/2, leafY);
            ctx.closePath();
            ctx.fill();
        }
    } else {
        // 둥근 나무
        ctx.beginPath();
        ctx.arc(x, y - trunkHeight, 35 * size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 꽃밭 그리기
function drawFlowerField() {
    const flowerOffset = (gameState.backgroundOffset * 0.7) % (canvas.width + 300);
    
    // 잔디
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 50; i++) {
        const x = (i * 30 - flowerOffset) % (canvas.width + 100);
        if (x > -50 && x < canvas.width + 50) {
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 2;
            for (let j = 0; j < 3; j++) {
                ctx.beginPath();
                ctx.moveTo(x + j * 3, GROUND_Y + 5);
                ctx.lineTo(x + j * 3 + Math.random() * 4 - 2, GROUND_Y - 3 - Math.random() * 5);
                ctx.stroke();
            }
        }
    }
    
    // 꽃들
    const flowers = [
        {x: 80, color: '#FF69B4'},
        {x: 180, color: '#FFB6C1'},
        {x: 280, color: '#FF1493'},
        {x: 380, color: '#FFC0CB'},
        {x: 480, color: '#FFD700'}
    ];
    
    flowers.forEach(flower => {
        const x = flower.x - flowerOffset;
        if (x > -50 && x < canvas.width + 50) {
            // 꽃 줄기
            ctx.strokeStyle = '#228B22';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, GROUND_Y + 10);
            ctx.lineTo(x, GROUND_Y - 15);
            ctx.stroke();
            
            // 꽃잎
            ctx.fillStyle = flower.color;
            ctx.beginPath();
            ctx.arc(x, GROUND_Y - 15, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// 날아다니는 요소들
function drawFlyingElements() {
    // 새들
    const birdOffset = (gameState.backgroundOffset * 0.6) % (canvas.width + 500);
    const birds = [
        {x: 150, y: 80},
        {x: 400, y: 120},
        {x: 650, y: 60}
    ];
    
    birds.forEach(bird => {
        const x = bird.x - birdOffset;
        if (x > -50 && x < canvas.width + 50) {
            const wingFlap = Math.sin(gameState.distance * 0.2) * 5;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 15, bird.y + wingFlap);
            ctx.lineTo(x, bird.y - 8);
            ctx.lineTo(x + 15, bird.y + wingFlap);
            ctx.stroke();
        }
    });
}

// 마법같은 파티클들
function drawMagicalParticles() {
    for (let i = 0; i < 25; i++) {
        const x = (i * 200 + gameState.distance * 0.4) % (canvas.width + 150);
        const y = GROUND_Y - 100 + Math.sin(gameState.distance * 0.03 + i) * 50;
        
        if (x > -30 && x < canvas.width + 30) {
            const alpha = (Math.sin(gameState.distance * 0.05 + i) + 1) * 0.3;
            const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'];
            const color = colors[i % colors.length];
            
            ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(x, y, 3 + Math.sin(gameState.distance * 0.08 + i) * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // 반짝이는 효과
            if (Math.random() < 0.1) {
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// 간단한 구름 그리기 (백업용)
function drawSimpleClouds() {
    const cloudOffset = (gameState.backgroundOffset * 0.3) % (canvas.width + 200);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
        const x = (i * 200) - cloudOffset;
        const y = 50 + Math.sin(i) * 20;
        
        if (x > -100 && x < canvas.width + 100) {
            // 구름 모양
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
            ctx.arc(x + 50, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}