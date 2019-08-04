import Background from './images/backgrounds/GrongTheJungleLord.jpg';
import Headshot from './images/headshots/GrongTheJungleLord.png';

export default {
  id: 2263,
  name: 'Grong, the Jungle Lord', // Horde
  background: Background,
  headshot: Headshot,
  icon: 'achievement_boss_zuldazar_grong',
  fight: {
    vantusRuneBuffId: 285536,
    softMitigationChecks: {
      physical: [
        283078, // Bestial Smash
      ],
      magical: [],
    },
  },
};
