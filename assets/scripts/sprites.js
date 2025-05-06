export function loadIntroSprites(scene){
  scene.load.image('logo', 'assets/sprites/logo.png');
}

export function loadLangSprites(scene){
  scene.load.spritesheet('languages', 'assets/sprites/languages.png', {frameWidth: 250,frameHeight: 50 });
}

export function loadGameSprites(scene){
  // single

  scene.load.image('commandBorder', 'assets/sprites/commandBorder.png');
  scene.load.image('optionsBorder', 'assets/sprites/optionsBorder.png');
  scene.load.image('sliderDot', 'assets/sprites/sliderDot.png');
  scene.load.image('sliderBar', 'assets/sprites/sliderBar.png');
  scene.load.image('sliderBarFill', 'assets/sprites/sliderBarFill.png');
 
  scene.load.image('closeIcon', 'assets/sprites/closeIcon.png');
  // sheets

  scene.load.spritesheet('socials', 'assets/sprites/socials.png', {frameWidth: 48,frameHeight: 47 });
  scene.load.spritesheet('languageMini', 'assets/sprites/languageMini.png', {frameWidth: 48,frameHeight: 47 });
  scene.load.spritesheet('gameLogo', 'assets/sprites/gameLogo.png', {frameWidth: 240,frameHeight: 93 });

  scene.load.spritesheet('gameLogo', 'assets/sprites/gameLogo.png', {frameWidth: 240,frameHeight: 93 });

  // base
  scene.load.image('background', 'assets/sprites/background.png');
  scene.load.spritesheet('baseCards', 'assets/sprites/baseCards.png', {frameWidth: 109,frameHeight: 126 });
  scene.load.spritesheet('cardEffects', 'assets/sprites/cardEffects.png', {frameWidth: 16,frameHeight: 16 });
  scene.load.image('atkDef', 'assets/sprites/atkDef.png');
  // zul
  
  scene.load.spritesheet('zuljaCards', 'assets/sprites/zuljaCards.png', {frameWidth: 36,frameHeight: 38 });
  scene.load.spritesheet('zuljaMana', 'assets/sprites/zuljaMana.png', {frameWidth: 18,frameHeight: 28 });

}

export function load_sprites(scene) {

  
}

export function load_animations(scene){

  scene.anims.create({
    key: 'zuljaManaAnim',     // Name of the animation
    frames: scene.anims.generateFrameNumbers('zuljaMana', {
      start: 0,
      end: 3                 // 4 frames: 0, 1, 2, 3
    }),
    frameRate: 6,            // Adjust speed as needed
    repeat: -1               // -1 to loop forever
  });

}

