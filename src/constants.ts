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
      'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png/220px-Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820785/General%20assets/Levitating_ltrtpk.mp3',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia, 2020'
  },
  {
    title: 'Applause',
    cover: 'https://upload.wikimedia.org/wikipedia/en/3/39/Artpop_cover.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820782/General%20assets/Applause_k6d6ch.mp3',
    artist: 'Lady Gaga',
    album: 'ARTPOP, 2014'
  },
  {
    title: 'Gimme More',
    cover: 'https://upload.wikimedia.org/wikipedia/en/7/76/Britney_Spears_-_Blackout.png',
    src: 'https://res.cloudinary.com/henryzarza/video/upload/v1600820787/General%20assets/GimmeMore_sd5tar.mp3',
    artist: 'Britney Spears',
    album: 'Blackout, 2008'
  }
]

export const MAX_VOLUME = 2

export const VOLUME_STEPS = 0.1
