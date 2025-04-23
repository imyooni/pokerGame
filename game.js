import * as sprites from './assets/scripts/sprites.js';
import * as audio from './assets/scripts/audio.js';



document.fonts.load('16px DefaultFont').then(() => {
  const config = {
    type: Phaser.AUTO,
    width: 384,
    height: 736,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: 'transparent',
    transparent: true,
    scene: {
      preload,
      create,
      update
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
  const game = new Phaser.Game(config);
});





function update() {
}


function preload() {
  sprites.load_sprites(this);
  audio.load_audio(this)
}



function create() {
  let roomBack = this.add.sprite(this.cameras.main.centerX,this.cameras.main.centerY,'room_background');
  roomBack.setDepth(-1);
  let tableCenter = this.add.sprite(this.cameras.main.centerX,this.cameras.main.centerY,'tableCenter');
  let tablePlayer = this.add.sprite(this.cameras.main.centerX,0,'tablePlayer');
  tablePlayer.y = tableCenter.y+tableCenter.height-tablePlayer.height


  this.input.keyboard.on('keydown-Q', () => {
    const indices = [0, 5, 2];
    indices.forEach(index => {
      //chips[index] = generateChipSprite(this, index);
      flipChip(this, chips[index], true, true);
    });
  });

  const chipWidth = 62;
  const chipHeight = 70;
  const cols = 5;
  const rows = 4;
  const startX = this.cameras.main.centerX - ((cols - 1) * chipWidth) / 2;
  const startY = this.cameras.main.centerY - ((rows - 1) * chipHeight) / 2;
  //const chips = [];
  const chips = new Array(cols * rows).fill(null);

  for (let index = 0; index < chips.length; index++) {
    chips[index] = generateChipSprite(this, index);
  }
  

  function generateChipSprite(scene, index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
  
    const chipSprite = scene.add.sprite(0, 0, 'chips', 9);
    const chipText = scene.add.text(0, 0, '?', {
      fontSize: '20px',
      fontFamily: 'DefaultFont',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0.8).setDepth(10);
  
    const chipContainer = scene.add.container(
      startX + col * chipWidth,
      startY + row * chipHeight,
      [chipSprite, chipText]
    );
  
    chipContainer.setSize(chipWidth, chipHeight);
    chipContainer.setInteractive();
    chipContainer.enabled = false;
    chipContainer.isFlipping = false;
    chipContainer.notSet = true;
  
    const chipData = generateChip();
    chipContainer.type = chipData.type;
    chipContainer.value = chipData.baseValue;
    chipContainer.basePosition = [chipContainer.x, chipContainer.y];
    chipContainer.alpha = 0;
  
    if (col === 0 && row === 0) {
      chipContainer.type = 8;
      chipContainer.value = 5000;
    }
  
    chipContainer.chipSprite = chipSprite;
    chipContainer.chipText = chipText;
  
    chipContainer.on('pointerdown', () => {
      if (chipContainer.notSet) {
        audio.playSound('chipFlip', scene)
      } 
      
      flipChip(scene, chipContainer)
    }
  );
    chipContainer.on('pointerover', () => {
      if (!chipContainer.isFlipping) {
        chipContainer.hover = true;
        chipContainer.y -= 5;
      }
    });
  
    chipContainer.on('pointerout', () => {
      chipContainer.hover = false;
      chipContainer.y = chipContainer.basePosition[1];
    });
  
    const delay = index * 50;
    scene.time.delayedCall(delay, () => {
      chipContainer.enabled = true;
      flipChip(scene, chipContainer, true);
    });
  
    return chipContainer;
  }
  
  

  /*
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const chipSprite = this.add.sprite(0, 0, 'chips', 9);
      const chipText = this.add.text(0, 0, '?', {
        fontSize: '20px',
        fontFamily: 'DefaultFont',
        color: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5, 0.8).setDepth(10);

      const chipContainer = this.add.container(
        startX + col * chipWidth,
        startY + row * chipHeight,
        [chipSprite, chipText]
      );

      chipContainer.setSize(chipWidth, chipHeight);
      chipContainer.setInteractive();
      chipContainer.enabled = false;
      chipContainer.isFlipping = false;
      chipContainer.notSet = true;

      const chipData = generateChip();
      chipContainer.type = chipData.type;
      chipContainer.value = chipData.baseValue;
      chipContainer.basePosition = [chipContainer.x, chipContainer.y];
      chipContainer.alpha = 0;

      if (col === 0 && row === 0) {
        chipContainer.type = 8;
        chipContainer.value = 5000;
      }

      chipContainer.chipSprite = chipSprite;
      chipContainer.chipText = chipText;

      chipContainer.on('pointerdown', () => flipChip(this, chipContainer));
      chipContainer.on('pointerover', () => {
        if (!chipContainer.isFlipping) {
          chipContainer.hover = true;
          chipContainer.y -= 5;
        }
      });

      chipContainer.on('pointerout', () => {
        chipContainer.hover = false;
        chipContainer.y = chipContainer.basePosition[1];
      });

      chips.push(chipContainer);
     

      const delay = (row * cols + col) * 50;
      this.time.delayedCall(delay, () => {
        chipContainer.enabled = true;
        flipChip(this, chipContainer, true);
      });
    }
  }
*/

  function flipChip(scene, chipContainer, start = false, force = false) {
    if (chipContainer.isFlipping || (!chipContainer.enabled && !force)) return;
    if (!start && !force && !chipContainer.notSet) return;

    chipContainer.isFlipping = true;
    scene.tweens.add({
      targets: chipContainer,
      y: chipContainer.y - 30,
      angle: 180,
      alpha: 0,
      duration: 200,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (start) {
          chipContainer.chipSprite.setFrame(9);
          chipContainer.chipText.setText("?");
          chipContainer.chipText.setStyle({ color: '#FFFFFF' });
          chipContainer.notSet = true;
        } else {
          chipContainer.chipSprite.setFrame(chipContainer.type);
          chipContainer.chipText.setText(formatNumber(chipContainer.value));
          chipContainer.chipText.setStyle({ color: '#FFD700' });
          chipContainer.notSet = false;
        }

        scene.tweens.add({
          targets: chipContainer,
          y: chipContainer.y + 30,
          angle: 360,
          alpha: 1,
          duration: 200,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            const pointer = scene.input.activePointer;
            const bounds = chipContainer.getBounds();
            const isHovering = Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y);

            if (!isHovering) {
              chipContainer.y = chipContainer.basePosition[1];
            }

            chipContainer.angle = 0;
            chipContainer.isFlipping = false;
          }
        });
      }
    });
  }
}

function formatNumber(num) {
  const suffixes = [
      { value: 1e15, symbol: 'q' },  // quadrillion
      { value: 1e12, symbol: 't' },  // trillion
      { value: 1e9,  symbol: 'b' },  // billion
      { value: 1e6,  symbol: 'm' },  // million
      { value: 1e3,  symbol: 'k' }   // thousand
  ];

  for (let i = 0; i < suffixes.length; i++) {
      if (num >= suffixes[i].value) {
          return (num / suffixes[i].value)
              .toFixed(1)                 // 1 decimal place
              .replace(/\.0$/, '')       // remove trailing ".0"
              + suffixes[i].symbol;
      }
  }
  return num.toString(); // for numbers < 1000
}


function generateChip(){
  let chipList = [
    { type: 0, probability: 0.9, baseValue: 1 },
    { type: 1, probability: 0.8, baseValue: 5 },
    { type: 2, probability: 0.75, baseValue: 10 },
    { type: 3, probability: 0.6, baseValue: 25 },
    { type: 4, probability: 0.5, baseValue: 50 },
    { type: 5, probability: 0.35, baseValue: 100 },
    { type: 6, probability: 0.2, baseValue: 500 },
    { type: 7, probability: 0.1, baseValue: 1000 },
    { type: 8, probability: 0.05, baseValue: 5000 }
 ];
  const randomValue = Math.random();
  let randomChips = []
  for (let i = 0; i < chipList.length; i++) {
    let prob = chipList[i].probability;
    if (randomValue < prob) {
      randomChips.push(chipList[i])
    }
  }
  if (randomChips.length < 1) {
    randomChips.push(chipList[0])
  }
  let selectedChip = randomChips[Math.floor(Math.random() * randomChips.length)]
  return selectedChip
} 