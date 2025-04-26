export function load_sprites(scene) {
 scene.load.image('room_background', 'assets/sprites/room_background.png');
 scene.load.image('tableCenter', 'assets/sprites/tableCenter.png');
 scene.load.image('tablePlayer', 'assets/sprites/tablePlayer.png');
 scene.load.image('chipsValue', 'assets/sprites/chipsValue.png');
 
 scene.load.spritesheet('switch', 'assets/sprites/switch.png', {
  frameWidth: 64,
  frameHeight: 114
});


  scene.load.spritesheet('chips', 'assets/sprites/chips.png', {
    frameWidth: 62,
    frameHeight: 70
  });

  
}