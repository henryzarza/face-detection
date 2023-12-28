import mask1 from '/images/masks/mask-1.png'
import mask2 from '/images/masks/mask-7.png'
import mask3 from '/images/masks/mask-3.png'
import mask4 from '/images/masks/mask-4.png'
import mask5 from '/images/masks/mask-5.png'
import mask6 from '/images/masks/mask-6.png'
import mask7 from '/images/masks/mask-2.png'
import mask8 from '/images/masks/mask-13.png'
import mask9 from '/images/masks/mask-10.png'
import mask10 from '/images/masks/mask-8.png'
import mask11 from '/images/masks/mask-9.png'
import mask12 from '/images/masks/mask-14.png'
import angry from '/images/emoji/angry.png'
import laughing from '/images/emoji/laughing.png'
import sad from '/images/emoji/sad.png'
import surprised from '/images/emoji/surprised.png'

export const VIDEO_FACE_DIMENSIONS = {
  width: 250,
  height: 250
}

export const VIDEO_FACE_MASK_SIZE = 320

export const MASKS = [
  {
    src: mask1,
    alt: 'Purple, blue, and golden stripes mask'
  },
  {
    src: mask2,
    alt: 'Cosmic red and golden stripes mask'
  },
  {
    src: mask3,
    alt: 'Dark blue and golden mask'
  },
  {
    src: mask4,
    alt: 'Golden and black skull mask'
  },
  {
    src: mask5,
    alt: 'Pure golden mask'
  },
  {
    src: mask6,
    alt: 'Golden mask with engines'
  },
  {
    src: mask7,
    alt: 'Black and golden mask with flowers'
  },
  {
    src: mask8,
    alt: 'Red, pink and black mask'
  },
  {
    src: mask9,
    alt: 'Black and silver cat mask'
  },
  {
    src: mask10,
    alt: 'Orange, yellow and black mask with fears'
  },
  {
    src: mask11,
    alt: 'White mask with pink roses and flowers'
  },
  {
    src: mask12,
    alt: 'Carnival red and white mask'
  }
]

export const ROUTES = [
  {
    path: '/',
    name: 'home',
    text: 'Try On'
  },
  {
    path: '/music-player',
    name: 'music-player',
    text: 'Music Player'
  },
  {
    path: '/do-laugh',
    name: 'do-laugh',
    text: "Don't Laugh"
  }
]

export const PLAY_LIST = [
  {
    title: 'Levitating',
    cover:
      'https://res.cloudinary.com/dcqu0udnd/image/upload/v1703709418/Future_Nostalgia_psdspl.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820785/General%20assets/Levitating_ltrtpk.mp3',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia, 2020'
  },
  {
    title: 'Applause',
    cover: 'https://res.cloudinary.com/dcqu0udnd/image/upload/v1703709418/Artpop_cover_ehdnrq.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820782/General%20assets/Applause_k6d6ch.mp3',
    artist: 'Lady Gaga',
    album: 'ARTPOP, 2014'
  },
  {
    title: 'Gimme More',
    cover: 'https://res.cloudinary.com/dcqu0udnd/image/upload/v1703709418/Blackout_fcq61v.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820787/General%20assets/GimmeMore_sd5tar.mp3',
    artist: 'Britney Spears',
    album: 'Blackout, 2008'
  }
]

export const MAX_VOLUME = 2

export const VOLUME_STEPS = 0.1

export const VIDEO_FACE_MUSIC_DIMENSIONS = 300

export const EXPRESSIONS_COMMANDS = [
  {
    src: laughing,
    alt: 'Laughing emoji',
    expression: 'Laugh',
    command: 'Play song'
  },
  {
    src: angry,
    alt: 'Angry emoji',
    expression: 'Angry',
    command: 'Next song'
  },
  {
    src: sad,
    alt: 'Sad emoji',
    expression: 'Sad',
    command: 'Pause song'
  },
  {
    src: surprised,
    alt: 'Surprised emoji',
    expression: 'Surprised',
    command: 'Turn up volume'
  }
]
