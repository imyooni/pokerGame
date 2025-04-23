//import * as SaveGame from './SaveGame.js';

export function load_audio(scene) {
    // BGM


    // SFX
    scene.load.audio('chipFlip', 'assets/audio/SFX/chipFlip.ogg');
}


const sfxVolumes = {
    chipFlip: 0.5,
};


export function bgmVolumes(key)
{
  let list = {
    bgm000: 0.45,
    bgm001: 0.45,
   } 
   return list[key]
};


export function playSound(key, scene, isMusic = false) {
    const bgmValue = 1;
    const sfxValue = 1;
    const settingVolume = isMusic ? bgmValue : sfxValue;

    if (isMusic) {
        const baseVolume = bgmVolumes(key) ?? 1;
        const finalVolume = Phaser.Math.Clamp(baseVolume * settingVolume, 0, 1);

        if (scene.bgm) {
            scene.bgm.stop();
            scene.bgm.destroy();
        }

        scene.bgm = scene.sound.add(key, { loop: true, volume: finalVolume });
        scene.bgm.play();
        return scene.bgm;

    } else {
        const baseVolume = sfxVolumes[key] ?? 1;
        const finalVolume = Phaser.Math.Clamp(baseVolume * settingVolume, 0, 1);
        scene.sound.play(key, { volume: finalVolume });
        return null;
    }
}




