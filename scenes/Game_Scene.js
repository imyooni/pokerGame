import * as sprites from '../assets/scripts/sprites.js';
import * as audio from '../assets/scripts/audio.js';
import * as gameSystem from '../assets/scripts/gameSystem.js';
import * as scene_room from '../assets/scripts/scene_room.js';
import * as drinks from '../assets/scripts/drinks.js';
import * as player from '../assets/scripts/player.js';
import * as zul from '../assets/scripts/zul.js';
import * as tileMap from '../assets/scripts/tileMap.js';
import * as SaveGame from '../assets/scripts/SaveGame.js';
import * as lang from '../assets/scripts/lang.js';

export default class Game_Scene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    sprites.loadGameSprites(this)
  }

  create() {
    this.gameActive = false
    sprites.load_animations(this);


  
    this.bgImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');

      this.input.keyboard.on('keydown-U', () => {
        localStorage.removeItem('SaveFile');
      });

    this.input.keyboard.on('keydown-S', () => {
      const keys = this.children.list
        .filter(child => child instanceof Phaser.GameObjects.Sprite)
        .map(child => child.texture.key);
      console.log(keys);
    });

    this.input.keyboard.on('keydown-Q', () => {
      this.scene.manager.scenes.forEach(scene => {
        console.log(`Scene Key: ${scene.scene.key}, Active: ${scene.scene.isActive()}, Visible: ${scene.scene.isVisible()}, Sleeping: ${scene.scene.isSleeping()}`);
      });
    });





    this.time.delayedCall(200, () => {
      startBgm(this)
      this.time.delayedCall(700, () => {
        createSocialButtons(this)
        createTitleCommands(this)
      });
    });





  }

  update(time, delta) {

  }

}

function createSocialButtons(scene) {
  scene.socialButtons = [];
  scene.language = null;

  const Y = scene.scale.height - 80;
  const spacing = 27;
  const socials = [
    { key: 'https://www.youtube.com/@jooyeonkim1774', frame: 0, y: Y - spacing },
    { key: 'https://www.twitch.tv/Zuljanim', frame: 1, y: Y + spacing }
  ];

  let languages = ['eng', 'kor']
  let currentLang = languages.indexOf(SaveGame.loadGameValue('language'))
  scene.languageIcon = scene.add.sprite(0, 0, 'languageMini')
    .setFrame(currentLang)
    .setDepth(50000)
    .setOrigin(0.5)
    .setInteractive()
    .disableInteractive();
  scene.languageIcon.y = scene.scale.height - scene.languageIcon.height
  scene.tweens.add({
    targets: scene.languageIcon,
    x: scene.languageIcon.width - 20,
    duration: 800,
    ease: 'Back.Out',
    onComplete: () => scene.languageIcon.setInteractive()
  });
  scene.languageIcon.on('pointerdown', () => {
    if (scene.titleCommand !== null) return;
    audio.playSound('systemOk', scene);
    gameSystem.flashFill(scene.languageIcon, 0xffffff, 1, 200);
    currentLang = (currentLang + 1) % languages.length;
    SaveGame.saveGameValue('language', languages[currentLang]);
    scene.languageIcon.disableInteractive();
    scene.gameLogo.setFrame(currentLang)
    updateTitleTexts(scene);
    scene.tweens.add({
      targets: scene.languageIcon,
      x: -scene.languageIcon.width,
      duration: 300,
      ease: 'Back.In',
      onComplete: () => {
        scene.languageIcon.setFrame(currentLang);
        scene.languageIcon.x = -scene.languageIcon.width;
        scene.tweens.add({
          targets: scene.languageIcon,
          x: scene.languageIcon.width - 20,
          duration: 800,
          ease: 'Back.Out',
          onComplete: () => {
            scene.languageIcon.setInteractive();
          }
        });
      }
    });
  });


  scene.gameLogo = scene.add.sprite(200, 70, 'gameLogo')
    .setFrame(currentLang)
    .setDepth(50000)
    .setOrigin(0.5)
    .setInteractive()
    .disableInteractive();
  scene.gameLogo.y = -scene.gameLogo.height
  scene.tweens.add({
    targets: scene.gameLogo,
    y: scene.gameLogo.height - 35,
    duration: 800,
    ease: 'Back.Out',
    onComplete: () => {
      scene.gameLogo.setInteractive()
    }
  });

  socials.forEach((s, i) => {
    const sprite = scene.add.sprite(scene.scale.width + 48, s.y, 'socials')
      .setFrame(s.frame)
      .setDepth(50000)
      .setOrigin(0.5)
      .setInteractive()
      .disableInteractive();
    scene.socialButtons.push(sprite);
    scene.tweens.add({
      targets: sprite,
      x: scene.scale.width - (sprite.width - 20),
      duration: 800,
      ease: 'Back.Out',
      onComplete: () => sprite.setInteractive()
    });
    sprite.on('pointerdown', () => {
      if (scene.titleCommand !== null) return;
      audio.playSound('systemOk', scene)
      gameSystem.flashFill(sprite, 0xffffff, 1, 200);
      scene.time.delayedCall(300, () => {
        window.open(s.key, '_blank');
      })
    });
  })
}

function createTitleCommands(scene) {
  let buttonsEnabled = 0;
  scene.titleCommand = null;
  scene.titleButtons = [];

  const centerX = scene.scale.width / 2;
  const centerY = scene.scale.height / 2;
  const spacing = 70;
  const buttonKeys = ['newGame', 'continue', 'options', 'exit'];

  buttonKeys.forEach((key, index) => {
    const label = lang.Text(key);
    const y = centerY + (index - 1) * spacing;
    const button = scene.add.sprite(centerX, y, 'commandBorder')
      .setFrame(0)
      .setDepth(50000)
      .setOrigin(0.5)
      .setInteractive()
      .setAlpha(0);

    const buttonText = scene.add.text(centerX, y, label, {
      fontFamily: 'DefaultFont',
      fontSize: '24px',
      stroke: '#3a3a50',
      strokeThickness: 4,
      color: '#ebe4f2',
      padding: { top: 8, bottom: 4 },
      align: 'center'
    }).setOrigin(0.5).setDepth(50001).setAlpha(0);

    scene.titleButtons.push({ key, button, buttonText });

    scene.tweens.add({
      targets: [button, buttonText],
      alpha: 1,
      duration: 800,
      ease: 'Power1',
      onComplete: () => {
        buttonsEnabled += 1;
      }
    });

    button.on('pointerdown', () => {
      if (buttonsEnabled != 4) return;
      if (scene.titleCommand !== null) return;
      scene.titleCommand = key;
      gameSystem.flashFill(button, 0xffffff, 1, 200);
      if (key === 'newGame') {
        audio.playSound('systemNewGame', scene);
        scene.bgm.stop()
        scene.time.delayedCall(200, () => {
          setupNewGame(scene)
        })
      } else if (key === 'options') {
        audio.playSound('systemOk', scene);
        scene.time.delayedCall(200, () => {
          createOptions(scene);
        })
      }
    });
  });
}


function setupNewGame(scene) {
  scene.tweens.add({
    targets: scene.languageIcon,
    x: -scene.languageIcon.width,
    duration: 300,
    ease: 'Back.In',
  });

  scene.tweens.add({
    targets: scene.gameLogo,
    y: -scene.gameLogo.height,
    duration: 300,
    ease: 'Back.In',
  });


  scene.titleButtons.forEach(({ button, buttonText }) => {
    scene.tweens.add({
      targets: [button, buttonText],
      alpha: 0,
      duration: 300,
      ease: 'Power1',
    });
  });


  scene.socialButtons.forEach((key, index) => {
    scene.tweens.add({
      targets: scene.socialButtons[index],
      x: scene.scale.width + scene.socialButtons[index].width,
      duration: 300,
      ease: 'Back.In',
    });
  });

  scene.time.delayedCall(100, () => {
    createLoadScreen(scene)
  })


}

function createLoadScreen(scene) {
  const bgGraphics = scene.add.graphics()
    .fillStyle(0x272c2a, 1)
    .fillRect(0, 0, scene.scale.width, scene.scale.height);
  bgGraphics.generateTexture('loadScreen', scene.scale.width, scene.scale.height);
  bgGraphics.destroy();
  const bgImage = scene.add.image(0, 0, 'loadScreen');
  const loadingText = scene.add.text(0, 0, 'Loading.', {
    fontFamily: 'DefaultFont',
    fontSize: '24px',
    stroke: '#3a3a50',
    strokeThickness: 4,
    color: '#ebe4f2',
    padding: { top: 8, bottom: 4 },
    align: 'center'
  }).setOrigin(0.5);
  const container = scene.add.container(scene.scale.width / 2, -scene.scale.height / 2, [bgImage, loadingText]);
  container.setDepth(900000);
  loadingText.y = 20;
  scene.tweens.add({
    targets: container,
    y: scene.scale.height / 2,
    duration: 300,
    ease: 'linear',
  });
  let dotCount = 1;
  scene.time.addEvent({
    delay: 500,
    callback: () => {
      dotCount = (dotCount % 3) + 1;
      loadingText.setText('Loading' + '.'.repeat(dotCount));
    },
    loop: true,
  });
  scene.time.delayedCall(100, () => {
    //
    scene.time.delayedCall(200, () => {

      // scene.isTimePaused = true
      audio.playSound('bgm001', scene, true)
      scene.time.delayedCall(10, () => {
        scene.tweens.add({
          targets: container,
          y: -scene.scale.height,
          duration: 300,
          ease: 'linear',
          onComplete: () => {
            scene.time.delayedCall(500, () => {
              scene.gameActive = true
              createCards(scene)
            })
          }
        });
      })
    })



  })
}


function drawSkewedRect(gfx, x, y, width, height, skewAmount, fillColor) {
  const points = [
    { x: x + skewAmount, y: y },
    { x: x + width + skewAmount, y: y },
    { x: x + width - skewAmount, y: y + height },
    { x: x - skewAmount, y: y + height },
  ];

  gfx.lineStyle(1, 0x000000); // 1-pixel black border
  gfx.fillStyle(fillColor, 1);

  gfx.beginPath();
  gfx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    gfx.lineTo(points[i].x, points[i].y);
  }
  gfx.closePath();
  gfx.fillPath();
  gfx.strokePath(); // Apply the black outline
}



function createCards(scene) {

  const gfx = scene.add.graphics();
  const cols = 3;
  const rows = 6;
  const tileWidth = 100;
  const tileHeight = 60;
  const skewAmount = 10;
  const startX = 50;
  const startY = 100;

  let tileIndex = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * tileWidth;
      const y = startY + row * tileHeight;
      
      const color = tileIndex < 9 ? 0x808080: 0x6b572e; // First 9 get one color
      drawSkewedRect(gfx, x, y, tileWidth, tileHeight, skewAmount, color);
      
      tileIndex++;
    }
  }
  

  
  


  const hand = [];
  const handSize = 5;
  const areaSize = 250;
  const centerX = scene.cameras.main.centerX;
  const handY = scene.cameras.main.height - 150;
  for (let i = 0; i < handSize; i++) {
    const card = createCard(scene, 0, 0, 0, i);
    hand.push(card);
  }
  scene.hand = hand;
  scene.selectedCard = null;
  recenterHand(scene, areaSize);
  hand.forEach(card => {
    card.on('pointerdown', () => {
      if (card.isMoving) return;
    
      const selected = scene.selectedCard;
    
      if (selected === card) {
        audio.playSound('systemClose', scene);
        insertCardAtOriginalIndex(scene.hand, card);
        scene.selectedCard = null;
        recenterHand(scene, areaSize);
        return;
      }
    
      audio.playSound('systemOk', scene);
    
      if (selected) {
        insertCardAtOriginalIndex(scene.hand, selected);
        scene.selectedCard = null;
      }
    
      scene.hand = scene.hand.filter(c => c !== card);
      //card.setDepth(card.originalDepth);
      card.setDepth(100);
    
      card.isMoving = true;
      scene.selectedCard = card;
    
      scene.tweens.add({
        targets: card,
        x: centerX,
        y: (scene.cameras.main.height / 2) + 150,
        duration: 200,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          card.isMoving = false;
        }
      });
      recenterHand(scene, areaSize); 
    });
    
  });
}

function insertCardAtOriginalIndex(hand, card) {
  const index = hand.findIndex(c => c.handIndex > card.handIndex);
  if (index === -1) {
    hand.push(card);
  } else {
    hand.splice(index, 0, card);
  }
  updateCardDepths(hand);
}

function updateCardDepths(hand) {
  hand.forEach((card, i) => {
    card.setDepth(i); 
  });
}

function createCard(scene, x, y, frame = 0, id = 0) {
  let names = ["Zulja", "Books", "Books", "Banana", "Queen Zulja"]
  let numberSize = 17
  const cardBase = scene.add.sprite(0, 0, 'baseCards', frame);
  const cardImage = scene.add.sprite(0, -5, 'zuljaCards', 0);
  const cardEffect = scene.add.sprite(0, 50, 'cardEffects', Math.floor(Math.random() * 4));
  const atkDef = scene.add.image(0, 50, 'atkDef');
  const cardName = scene.add.text(0, 23, `${names[id]}`, {
    fontFamily: 'DefaultFont',
    fontSize: '12px',
    stroke: '#000000',
    strokeThickness: 2,
    color: '#ebe4f2',
    padding: { top: 8, bottom: 4 },
    align: 'center'
  }).setOrigin(0.5);
  const mana = scene.add.sprite(0, -52, 'zuljaMana', 0);
  mana.play('zuljaManaAnim');

  const manaCost = scene.add.text(0, -52, `${Math.floor(Math.random() * 3)}`, {
    fontFamily: 'Numbers',
    fontSize: `${numberSize}px`,
    stroke: '#000000',
    strokeThickness: 2,
    color: '#ebe4f2',
    padding: { top: 8, bottom: 4 },
    align: 'center'
  }).setOrigin(0.5);

  const atkValue = scene.add.text(-35, 47, `${Math.floor(Math.random() * 11)}`, {
    fontFamily: 'Numbers',
    fontSize: `${numberSize}px`,
    stroke: '#000000',
    strokeThickness: 2,
    color: '#ebe4f2',
    padding: { top: 8, bottom: 4 },
    align: 'center'
  }).setOrigin(0.5);

  const defValue = scene.add.text(36, 47, `${Math.floor(Math.random() * 11)}`, {
    fontFamily: 'Numbers',
    fontSize: `${numberSize}px`,
    stroke: '#000000',
    strokeThickness: 2,
    color: '#ebe4f2',
    padding: { top: 8, bottom: 4 },
    align: 'center'
  }).setOrigin(0.5);

  let sprites = [
    cardBase,
    cardImage,
    cardName,
    atkDef,
    atkValue,
    defValue,
    cardEffect,
    mana,
    manaCost,
  ]

  const container = scene.add.container(x, y, sprites);
  container.setSize(cardBase.width, cardBase.height);
  container.setInteractive(new Phaser.Geom.Rectangle(0, 0, cardBase.width, cardBase.height), Phaser.Geom.Rectangle.Contains);
  container.cardId = id;
  container.originalY = y;
  container.originalDepth = id; 
  container.handIndex = id; 
  container.isMoving = false
  return container;
}

function recenterHand(scene, areaSize = 250, y = scene.cameras.main.height - 150) {
  const hand = scene.hand;
  if (!hand || hand.length === 0) return;
  const centerX = scene.cameras.main.centerX;
  const spacing = hand.length > 1 ? areaSize / (hand.length - 1) : 0;
  const startX = centerX - areaSize / 2;
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    if (card === scene.selectedCard) continue; 
    const targetX = startX + i * spacing;
    const targetY = y;
    card.isMoving = true;
    scene.tweens.add({
      targets: card,
      x: targetX,
      y: targetY,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        card.isMoving = false;
      }
    });
    card.originalY = targetY;
    card.setDepth(i);
  }
}











function updateTitleTexts(scene) {
  scene.titleButtons.forEach(({ key, buttonText }) => {
    buttonText.setText(lang.Text(key));
  });
}


function startBgm(scene) {
  scene.bgm = audio.playSound('bgm000', scene, true)
}


function createOptions(scene) {
  const container = scene.add.container(0, 0).setDepth(89999);
  const sliderWidth = 250;
  const knobRadius = 10;
  const centerX = scene.scale.width / 2;
  const centerY = scene.scale.height / 2;
  const sliders = [];
  let knobGap = 2
  const volumeValues = [
    SaveGame.loadGameValue('bgmVolume'),
    SaveGame.loadGameValue('sfxVolume')
  ];
  const optionsBorder = scene.add.sprite(centerX, centerY, 'optionsBorder').setOrigin(0.5);
  container.add(optionsBorder);
  const topRightX = optionsBorder.x + optionsBorder.displayWidth / 2 + 10;
  const topRightY = optionsBorder.y - optionsBorder.displayHeight / 2 - 20;
  const closeBtn = scene.add.image(topRightX, topRightY, 'closeIcon').setInteractive();
  closeBtn.setOrigin(1, 0);
  closeBtn.on('pointerdown', () => {
    audio.playSound('systemClose', scene);
    scene.titleCommand = null;
    sliders.forEach(slider => {
      slider.maskShape.destroy();
      slider.barMask.destroy();
    });
    container.destroy();
  });
  container.add(closeBtn);
  let index = 0;
  const createSlider = (label, yOffset, setVolumeCallback) => {
    const sliderX = centerX - sliderWidth / 2;
    const sliderY = centerY + yOffset;
    const currentValue = volumeValues[index];
    const gauge = scene.add.sprite(centerX, sliderY, 'sliderBar').setOrigin(0.5, 0.5);
    gauge.displayWidth = sliderWidth;
    container.add(gauge);
    const fillX = sliderX + knobGap;
    const fillSprite = scene.add.sprite(fillX, sliderY, 'sliderBarFill').setOrigin(0, 0.5);
    container.add(fillSprite);
    const maskShape = scene.add.graphics();
    maskShape.fillRect(fillX, sliderY - gauge.height / 2, (sliderWidth - knobGap * 2) * currentValue, gauge.height);
    const barMask = maskShape.createGeometryMask();
    fillSprite.setMask(barMask);
    const knobX = Phaser.Math.Clamp(
      sliderX + sliderWidth * currentValue,
      sliderX + knobRadius,
      sliderX + sliderWidth - knobRadius
    );
    const knob = scene.add.sprite(knobX, sliderY, 'sliderDot');
    knob.setDepth(1);
    container.add(knob);
    const knobHit = scene.add.circle(knobX, sliderY, knobRadius, 0x000000, 0);
    knobHit.setInteractive({ draggable: true });
    container.add(knobHit);
    const labelText = scene.add.text(centerX, sliderY - 40, label, {
      fontFamily: 'DefaultFont',
      fontSize: '24px',
      stroke: '#3a3a50',
      strokeThickness: 4,
      padding: { top: 8, bottom: 4 },
      color: '#ebe4f2'
    }).setOrigin(0.5);
    container.add(labelText);
    sliders.push({
      knobSprite: knob,
      knobHit: knobHit,
      maskShape: maskShape,
      barMask: barMask,
      fillSprite: fillSprite,
      x: sliderX,
      y: sliderY,
      width: sliderWidth,
      radius: knobRadius,
      height: gauge.height,
      onVolumeChange: setVolumeCallback
    });
    index++;
  };
  createSlider(lang.Text('bgm'), -40, volume => {
    SaveGame.saveGameValue('bgmVolume', volume);
    if (scene.bgm) {
      const baseVolume = audio.bgmVolumes(scene.bgm.key) ?? 1;
      const finalVolume = Phaser.Math.Clamp(baseVolume * volume, 0, 1);
      scene.bgm.setVolume(finalVolume);
    }
  });
  createSlider(lang.Text('sfx'), 40, volume => {
    SaveGame.saveGameValue('sfxVolume', volume);
  });
  scene.input.on('drag', (pointer, gameObject, dragX) => {
    sliders.forEach(slider => {
      if (gameObject === slider.knobHit) {
        dragX = Phaser.Math.Clamp(dragX, slider.x + knobGap, slider.x + slider.width - knobGap);
        const volume = (dragX - slider.x - knobGap) / (slider.width - knobGap * 2);
        const visualX = Phaser.Math.Clamp(dragX, slider.x + slider.radius, slider.x + slider.width - slider.radius);
        gameObject.x = visualX;
        slider.knobSprite.setX(visualX);
        slider.maskShape.clear();
        slider.maskShape.fillRect(
          slider.x + knobGap,
          slider.y - slider.height / 2,
          (slider.width - knobGap * 2) * volume,
          slider.height
        );
        slider.onVolumeChange(volume);
      }
    });
  });
  return container;
}


