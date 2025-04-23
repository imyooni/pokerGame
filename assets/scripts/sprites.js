export function load_sprites(scene) {
 scene.load.image('room_background', 'assets/sprites/room_background.png');
 scene.load.image('tableCenter', 'assets/sprites/tableCenter.png');
 scene.load.image('tablePlayer', 'assets/sprites/tablePlayer.png');
 
  scene.load.spritesheet('chips', 'assets/sprites/chips.png', {
    frameWidth: 62,
    frameHeight: 70
  });

  
}